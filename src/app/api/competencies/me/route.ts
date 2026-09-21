import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userCompetencies = await prisma.userCompetency.findMany({
      where: { userId: user.id },
      include: {
        competency: {
          include: { topics: true },
        },
      },
      orderBy: { gap: "desc" },
    });

    if (userCompetencies.length === 0) {
      return NextResponse.json({
        hasCompletedAssessment: false,
        overallCompetency: 0,
        competencies: [],
        priorityGaps: [],
      });
    }

    const formatted = userCompetencies.map((uc) => ({
      id: uc.id,
      competencyId: uc.competencyId,
      domain: uc.competency.domain,
      name: uc.competency.name,
      code: uc.competency.code,
      description: uc.competency.description,
      currentScore: Math.round(uc.currentScore),
      requiredLevel: Math.round(uc.requiredLevel),
      gap: Math.round(uc.gap),
      status: uc.status,
      lastEvaluatedAt: uc.lastEvaluatedAt.toISOString(),
      topics: uc.competency.topics.map((t) => t.name),
    }));

    const totalScore = formatted.reduce((acc, curr) => acc + curr.currentScore, 0);
    const overallCompetency = Math.round(totalScore / formatted.length);

    // Top 3 priority gaps (PRD §10)
    const priorityGaps = formatted
      .filter((c) => c.gap > 0)
      .slice(0, 3);

    return NextResponse.json({
      hasCompletedAssessment: true,
      overallCompetency,
      competencies: formatted,
      priorityGaps,
    });
  } catch (error) {
    console.error("Error loading user competencies:", error);
    return NextResponse.json(
      { error: "Failed to load user competency profile" },
      { status: 500 }
    );
  }
}
