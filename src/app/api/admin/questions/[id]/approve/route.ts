import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const updated = await prisma.quizQuestion.update({
      where: { id: params.id },
      data: {
        status: "APPROVED",
      },
    });

    return NextResponse.json({ success: true, question: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to approve question" },
      { status: 500 }
    );
  }
}
