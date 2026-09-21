import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { progressPercentage, currentStep } = body;

    const percentage = Math.min(100, Math.max(0, Number(progressPercentage) || 0));
    const status = percentage >= 100 ? "COMPLETED" : percentage > 0 ? "IN_PROGRESS" : "NOT_STARTED";

    const updated = await prisma.learningProgress.upsert({
      where: {
        userId_resourceId: {
          userId: user.id,
          resourceId: params.id,
        },
      },
      update: {
        progressPercentage: percentage,
        status,
        currentStep: currentStep || "Continuing Module",
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        resourceId: params.id,
        progressPercentage: percentage,
        status,
        currentStep: currentStep || "Starting Module",
      },
    });

    return NextResponse.json({ success: true, progress: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update learning progress" },
      { status: 500 }
    );
  }
}
