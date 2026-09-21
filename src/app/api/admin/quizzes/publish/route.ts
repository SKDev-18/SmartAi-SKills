import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const {
      title,
      description,
      materialId,
      competencyId,
      topic,
      passPercentage = 70.0,
      questionIds,
    } = body;

    if (!title || !questionIds || questionIds.length === 0) {
      return NextResponse.json(
        { error: "Title and at least one question are required." },
        { status: 400 }
      );
    }

    // Create published quiz
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description: description || `Competency-based quiz covering ${topic || "official statistics"}`,
        materialId: materialId || null,
        competencyId: competencyId || null,
        topic: topic || "General",
        passPercentage: Number(passPercentage) || 70.0,
        isPublished: true,
      },
    });

    // Associate questions and mark them as APPROVED
    await prisma.quizQuestion.updateMany({
      where: { id: { in: questionIds } },
      data: {
        quizId: quiz.id,
        status: "APPROVED",
      },
    });

    return NextResponse.json({ success: true, quiz });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to publish quiz" },
      { status: 500 }
    );
  }
}
