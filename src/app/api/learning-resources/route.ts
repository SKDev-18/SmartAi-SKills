import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    const searchParams = req.nextUrl.searchParams;
    const competencyId = searchParams.get("competencyId");
    const source = searchParams.get("source");

    const where: any = {};
    if (competencyId) where.competencyId = competencyId;
    if (source) where.source = source;

    const resources = await prisma.learningResource.findMany({
      where,
      include: {
        competency: true,
        material: {
          select: { id: true, title: true, fileName: true, summary: true, contentSnippet: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // If user logged in, attach their progress
    let userProgressMap: Record<string, { progress: number; status: string }> = {};
    if (user) {
      const progress = await prisma.learningProgress.findMany({
        where: { userId: user.id },
      });
      userProgressMap = progress.reduce((acc, p) => {
        acc[p.resourceId] = { progress: p.progressPercentage, status: p.status };
        return acc;
      }, {} as Record<string, { progress: number; status: string }>);
    }

    const formatted = resources.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      topic: r.topic,
      competency: r.competency.name,
      competencyDomain: r.competency.domain,
      difficulty: r.difficulty,
      durationMinutes: r.durationMinutes,
      source: r.source,
      externalUrl: r.externalUrl,
      materialId: r.materialId,
      userProgress: userProgressMap[r.id]?.progress || 0,
      userStatus: userProgressMap[r.id]?.status || "NOT_STARTED",
    }));

    return NextResponse.json({ resources: formatted });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch learning resources" },
      { status: 500 }
    );
  }
}
