import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    const resource = await prisma.learningResource.findUnique({
      where: { id: params.id },
      include: {
        competency: true,
        material: true,
      },
    });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    let progress = null;
    if (user) {
      progress = await prisma.learningProgress.findUnique({
        where: {
          userId_resourceId: {
            userId: user.id,
            resourceId: resource.id,
          },
        },
      });
    }

    return NextResponse.json({ resource, progress });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch resource" },
      { status: 500 }
    );
  }
}
