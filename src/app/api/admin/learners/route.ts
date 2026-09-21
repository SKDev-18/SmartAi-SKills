import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const department = searchParams.get("department") || "";

    const where: any = { role: "LEARNER" };
    if (department) where.department = department;
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { email: { contains: query } },
        { employeeId: { contains: query } },
        { designation: { contains: query } },
      ];
    }

    const learners = await prisma.user.findMany({
      where,
      include: {
        competencies: {
          include: { competency: true },
        },
        assessmentAttempts: {
          orderBy: { completedAt: "desc" },
          take: 1,
        },
        quizAttempts: {
          orderBy: { completedAt: "desc" },
          take: 3,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = learners.map((l) => {
      const compScores = l.competencies.map((c) => c.currentScore);
      const avgComp =
        compScores.length > 0
          ? Math.round(compScores.reduce((a, b) => a + b, 0) / compScores.length)
          : 0;

      const priorityGaps = l.competencies
        .filter((c) => c.gap > 0)
        .sort((a, b) => b.gap - a.gap)
        .slice(0, 2)
        .map((c) => `${c.competency.name} (${Math.round(c.gap)}% gap)`);

      return {
        id: l.id,
        name: l.name,
        email: l.email,
        employeeId: l.employeeId,
        department: l.department,
        designation: l.designation,
        experienceLevel: l.experienceLevel,
        averageCompetency: avgComp,
        priorityGaps,
        lastAssessment: l.assessmentAttempts[0]
          ? {
              score: l.assessmentAttempts[0].score,
              maxScore: l.assessmentAttempts[0].maxScore,
              percentage: l.assessmentAttempts[0].percentage,
              completedAt: l.assessmentAttempts[0].completedAt.toISOString(),
            }
          : null,
        totalQuizzesTaken: l.quizAttempts.length,
      };
    });

    return NextResponse.json({ learners: formatted });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch learners" },
      { status: 500 }
    );
  }
}
