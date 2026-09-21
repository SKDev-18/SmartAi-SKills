import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

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

    const assessment = await prisma.assessment.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          include: { competency: true },
        },
      },
    });

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    let correctCount = 0;
    const competencyScores: Record<string, { correct: number; total: number; competencyId: string }> = {};

    const evaluatedAnswers: { questionId: string; selectedOption: string; isCorrect: boolean }[] = [];

    for (const q of assessment.questions) {
      const selected = answers[q.id] || "";
      const isCorrect = selected.trim().toUpperCase() === q.correctAnswer.trim().toUpperCase();
      if (isCorrect) correctCount++;

      evaluatedAnswers.push({
        questionId: q.id,
        selectedOption: selected,
        isCorrect,
      });

      if (!competencyScores[q.competencyId]) {
        competencyScores[q.competencyId] = { correct: 0, total: 0, competencyId: q.competencyId };
      }
      competencyScores[q.competencyId].total++;
      if (isCorrect) competencyScores[q.competencyId].correct++;
    }

    const totalQuestions = assessment.questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    // Record assessment attempt
    const attempt = await prisma.assessmentAttempt.create({
      data: {
        userId: user.id,
        assessmentId: assessment.id,
        score: correctCount,
        maxScore: totalQuestions,
        percentage,
        answers: {
          create: evaluatedAnswers,
        },
      },
    });

    // Update user competency scores in DB
    const updatedCompetencies = [];
    for (const [compId, stat] of Object.entries(competencyScores)) {
      const compPercentage = Math.round((stat.correct / stat.total) * 100);
      const competency = assessment.questions.find((q) => q.competencyId === compId)?.competency;
      const targetLevel = competency?.targetLevel || 75.0;
      const gap = Math.max(0, targetLevel - compPercentage);

      let status = "DEVELOPING";
      if (compPercentage >= targetLevel) status = "STRONG";
      else if (compPercentage >= targetLevel - 15) status = "DEVELOPING";
      else if (compPercentage >= 40) status = "NEEDS_IMPROVEMENT";
      else status = "CRITICAL_GAP";

      const updated = await prisma.userCompetency.upsert({
        where: {
          userId_competencyId: {
            userId: user.id,
            competencyId: compId,
          },
        },
        update: {
          currentScore: compPercentage,
          gap,
          status,
          lastEvaluatedAt: new Date(),
        },
        create: {
          userId: user.id,
          competencyId: compId,
          currentScore: compPercentage,
          requiredLevel: targetLevel,
          gap,
          status,
          lastEvaluatedAt: new Date(),
        },
      });
      updatedCompetencies.push(updated);
    }

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      score: correctCount,
      totalQuestions,
      percentage,
      updatedCompetenciesCount: updatedCompetencies.length,
    });
  } catch (error) {
    console.error("Assessment submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit assessment results" },
      { status: 500 }
    );
  }
}
