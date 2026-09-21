import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await req.json();

    const {
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      explanation,
      difficulty,
      topic,
      status,
    } = body;

    const updated = await prisma.quizQuestion.update({
      where: { id: params.id },
      data: {
        ...(questionText && { questionText }),
        ...(optionA && { optionA }),
        ...(optionB && { optionB }),
        ...(optionC && { optionC }),
        ...(optionD && { optionD }),
        ...(correctAnswer && { correctAnswer }),
        ...(explanation && { explanation }),
        ...(difficulty && { difficulty }),
        ...(topic && { topic }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({ success: true, question: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update question" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    await prisma.quizQuestion.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete question" },
      { status: 500 }
    );
  }
}
