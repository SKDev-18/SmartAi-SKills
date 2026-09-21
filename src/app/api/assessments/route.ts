import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const assessments = await prisma.assessment.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    return NextResponse.json({ assessments });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load assessments" },
      { status: 500 }
    );
  }
}
