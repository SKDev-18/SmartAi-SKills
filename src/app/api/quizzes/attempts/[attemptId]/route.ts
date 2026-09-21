import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { attemptId } = params;
    if (!attemptId) {
      return NextResponse.json({ error: "Attempt ID is required" }, { status: 400 });
    }

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            description: true,
            passPercentage: true,
            topicId: true,
          },
        },
        answers: true,
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: "Quiz attempt not found" }, { status: 404 });
    }

    // Verify ownership
    if (attempt.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden: Attempt belongs to another student" }, { status: 403 });
    }

    let parsedAnalysis: any = {};
    if (attempt.performanceAnalysis) {
      try {
        parsedAnalysis = JSON.parse(attempt.performanceAnalysis);
      } catch {}
    }

    const evaluatedAnswers = (attempt.answers || []).map((a: any) => ({
      questionId: a.questionId,
      selectedOption: a.selectedOption,
      isCorrect: a.isCorrect,
    }));

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      score: attempt.score,
      totalQuestions: attempt.maxScore,
      percentage: Math.round(attempt.percentage),
      correctAnswers: attempt.score,
      incorrectAnswers: Math.max(0, attempt.maxScore - attempt.score),
      passed: attempt.percentage >= (attempt.quiz?.passPercentage || 80),
      progression: parsedAnalysis.progression || null,
      weakAreas: parsedAnalysis.weakAreas || [],
      evaluatedAnswers: evaluatedAnswers || [],
      analysis: parsedAnalysis,
      quiz: attempt.quiz,
    });
  } catch (error: any) {
    console.error("Failed to fetch quiz attempt:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load quiz attempt" },
      { status: 500 }
    );
  }
}
