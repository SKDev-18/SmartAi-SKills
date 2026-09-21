import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { aiService } from "@/lib/ai";
import { evaluateAdaptiveProgression } from "@/lib/roadmap";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { answers } = body as { answers: Record<string, string> };

    const cleanId = decodeURIComponent(params.id || "").trim();
    const targetTopicId = req.nextUrl.searchParams.get("topicId")?.trim();
    const targetCourseId = req.nextUrl.searchParams.get("courseId")?.trim();

    const includeConfig = {
      topicRel: {
        include: {
          module: {
            include: {
              course: true,
            },
          },
        },
      },
      questions: {
        include: { competency: true },
      },
    };

    let quiz: any = null;

    if (targetTopicId) {
      quiz = await prisma.quiz.findFirst({
        where: {
          OR: [
            { topicId: targetTopicId },
            { topicRel: { slug: targetTopicId } },
          ],
          isPublished: true,
        },
        include: includeConfig,
      });
    }

    if (!quiz) {
      quiz = await prisma.quiz.findUnique({
        where: { id: cleanId },
        include: includeConfig,
      });
    }

    const normalizedSlug = cleanId.replace(/[-_]quiz$/i, "");

    if (!quiz) {
      quiz = await prisma.quiz.findFirst({
        where: {
          OR: [
            { topicRel: { slug: cleanId } },
            { topicRel: { slug: normalizedSlug } },
            { topicId: cleanId },
            { topicId: normalizedSlug },
            { id: `quiz_${cleanId.replace(/[^a-zA-Z0-9_-]/g, "_")}` },
            { id: `quiz_${normalizedSlug.replace(/[^a-zA-Z0-9_-]/g, "_")}` },
            { title: { contains: cleanId.replace(/-/g, " ") } },
            { title: { contains: normalizedSlug.replace(/-/g, " ") } },
          ],
          isPublished: true,
        },
        include: includeConfig,
      });
    }

    if (!quiz) {
      const topic = await prisma.topic.findFirst({
        where: {
          OR: [
            { id: cleanId },
            { slug: cleanId },
            { id: normalizedSlug },
            { slug: normalizedSlug },
          ],
        },
        include: { quizzes: { where: { isPublished: true }, take: 1, include: includeConfig } },
      });
      if (topic?.quizzes?.length) {
        quiz = topic.quizzes[0];
      }
    }

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // STRICT VALIDATION: courseId + topicId check
    if (targetTopicId) {
      const topicMatches =
        quiz.topicId === targetTopicId ||
        quiz.topicRel?.id === targetTopicId ||
        quiz.topicRel?.slug === targetTopicId;

      if (!topicMatches) {
        return NextResponse.json(
          {
            error: `Validation Error: Submitted quiz does not match topic "${targetTopicId}".`,
          },
          { status: 400 }
        );
      }
    }

    if (targetCourseId) {
      const actualCourseId = quiz.topicRel?.module?.course?.id;
      const actualCourseSlug = quiz.topicRel?.module?.course?.slug;

      const courseMatches =
        actualCourseId === targetCourseId || actualCourseSlug === targetCourseId;

      if (!courseMatches) {
        return NextResponse.json(
          {
            error: `Validation Error: Submitted quiz does not belong to course "${targetCourseId}".`,
          },
          { status: 400 }
        );
      }
    }

    let correctCount = 0;
    const evaluatedAnswers: {
      questionId: string;
      selectedOption: string;
      isCorrect: boolean;
      questionText: string;
      correctAnswer: string;
      explanation: string;
      competency: string;
      topic: string;
    }[] = [];

    const weakConceptMap: Record<string, { total: number; incorrect: number }> = {};

    for (const q of quiz.questions) {
      const selected = (answers[q.id] || "").trim().toUpperCase();
      const isCorrect = selected === q.correctAnswer.trim().toUpperCase();
      if (isCorrect) correctCount++;

      const conceptTag = q.sourceReference || q.topic || "Core Concept";
      if (!weakConceptMap[conceptTag]) {
        weakConceptMap[conceptTag] = { total: 0, incorrect: 0 };
      }
      weakConceptMap[conceptTag].total += 1;
      if (!isCorrect) {
        weakConceptMap[conceptTag].incorrect += 1;
      }

      evaluatedAnswers.push({
        questionId: q.id,
        selectedOption: selected,
        isCorrect,
        questionText: q.questionText,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        competency: q.competency?.name || q.topic || "Engineering Skill",
        topic: q.topic || "General",
      });
    }

    const totalQuestions = quiz.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // Identify weak areas (concepts with > 30% incorrect answers)
    const weakAreas = Object.entries(weakConceptMap)
      .filter(([_, stats]) => stats.incorrect > 0)
      .sort((a, b) => b[1].incorrect / b[1].total - a[1].incorrect / a[1].total)
      .map(([concept]) => concept);

    // Adaptive Roadmap Progression Evaluation (PRD §26 - §30)
    let progression = null;
    if (quiz.topicId) {
      progression = await evaluateAdaptiveProgression(
        user.id,
        quiz.topicId,
        percentage,
        weakAreas
      );
    }

    // Fetch user's current competency records for adaptive update
    const userCompetencies = await prisma.userCompetency.findMany({
      where: { userId: user.id },
      include: { competency: true },
    });

    const compProfiles = userCompetencies.map((uc) => ({
      code: uc.competency.code,
      name: uc.competency.name,
      currentScore: uc.currentScore,
      requiredLevel: uc.requiredLevel,
    }));

    // Run AI Performance Analysis (PRD §28)
    const analysis = aiService.analyzeQuizPerformance(evaluatedAnswers, compProfiles);

    // Record Quiz Attempt in DB
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        quizId: quiz.id,
        score: correctCount,
        maxScore: totalQuestions,
        percentage,
        performanceAnalysis: JSON.stringify({
          ...analysis,
          progression,
          weakAreas,
        }),
        answers: {
          create: evaluatedAnswers.map((a) => ({
            questionId: a.questionId,
            selectedOption: a.selectedOption,
            isCorrect: a.isCorrect,
          })),
        },
      },
    });

    // Update user competency scores in database dynamically (PRD §29)
    for (const delta of analysis.competencyDelta) {
      const existingComp = userCompetencies.find((uc) => uc.competency.code === delta.competencyCode);
      if (existingComp) {
        const targetLevel = existingComp.requiredLevel;
        const newScore = delta.newScore;
        const gap = Math.max(0, targetLevel - newScore);

        let status = "DEVELOPING";
        if (newScore >= targetLevel) status = "STRONG";
        else if (newScore >= targetLevel - 15) status = "DEVELOPING";
        else if (newScore >= 40) status = "NEEDS_IMPROVEMENT";
        else status = "CRITICAL_GAP";

        await prisma.userCompetency.update({
          where: { id: existingComp.id },
          data: {
            currentScore: newScore,
            gap,
            status,
            lastEvaluatedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      score: correctCount,
      totalQuestions,
      percentage,
      correctAnswers: correctCount,
      incorrectAnswers: totalQuestions - correctCount,
      passed: percentage >= (quiz.passPercentage || 80),
      progression,
      weakAreas,
      evaluatedAnswers,
      analysis,
    });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}
