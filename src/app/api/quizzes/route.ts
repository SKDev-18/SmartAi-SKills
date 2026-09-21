import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    const quizzes = await prisma.quiz.findMany({
      where: { isPublished: true },
      include: {
        material: {
          select: { title: true, fileName: true },
        },
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Attach user attempts if authenticated
    let userAttemptsMap: Record<string, { percentage: number; completedAt: string }> = {};
    if (user) {
      const attempts = await prisma.quizAttempt.findMany({
        where: { userId: user.id },
        orderBy: { completedAt: "desc" },
      });

      for (const att of attempts) {
        if (!userAttemptsMap[att.quizId] || userAttemptsMap[att.quizId].percentage < att.percentage) {
          userAttemptsMap[att.quizId] = {
            percentage: Math.round(att.percentage),
            completedAt: att.completedAt.toISOString(),
          };
        }
      }
    }

    const formatted = quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      topic: q.topic,
      passPercentage: q.passPercentage,
      questionCount: q._count.questions,
      materialTitle: q.material?.title,
      bestAttempt: userAttemptsMap[q.id] || null,
    }));

    return NextResponse.json({ quizzes: formatted });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}
