import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const integration = await prisma.iGOTIntegration.findFirst();
    const courseCount = await prisma.iGOTCourse.count();

    return NextResponse.json({
      integration: integration || {
        providerName: "iGOT Karmayogi Central Capacity Registry",
        endpointUrl: "https://karmayogi.gov.in/api/v1/courses",
        clientId: "MOSPI_CAPACITY_NODE_01",
        isActive: true,
        isMockMode: true,
        syncStatus: "HEALTHY",
        lastSyncAt: new Date().toISOString(),
      },
      syncedCoursesCount: courseCount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch iGOT integration status" },
      { status: 500 }
    );
  }
}
