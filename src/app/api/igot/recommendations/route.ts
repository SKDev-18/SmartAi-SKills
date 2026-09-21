import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { igotService } from "@/lib/igot/mock-adapter";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();
    let gapDomains: string[] = [];

    if (user) {
      const gaps = await prisma.userCompetency.findMany({
        where: { userId: user.id, gap: { gt: 0 } },
        include: { competency: true },
        orderBy: { gap: "desc" },
        take: 3,
      });
      gapDomains = gaps.map((g) => g.competency.name);
    }

    const courses = await igotService.getRecommendedCourses(gapDomains);
    return NextResponse.json({ courses });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch iGOT recommendations" },
      { status: 500 }
    );
  }
}
