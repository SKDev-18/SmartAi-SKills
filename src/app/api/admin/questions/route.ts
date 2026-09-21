import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const searchParams = req.nextUrl.searchParams;
    const materialId = searchParams.get("materialId");
    const status = searchParams.get("status");

    const where: any = {};
    if (materialId) where.materialId = materialId;
    if (status) where.status = status;

    const questions = await prisma.quizQuestion.findMany({
      where,
      include: {
        competency: true,
        material: {
          select: { title: true, fileName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ questions });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
