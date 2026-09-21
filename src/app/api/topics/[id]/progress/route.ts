import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const topic = await prisma.topic.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const body = await req.json();
    const { notesCompleted, videoCompleted } = body;

    const existing = await prisma.userTopicProgress.findUnique({
      where: {
        userId_topicId: {
          userId: user.id,
          topicId: topic.id,
        },
      },
    });

    const isNotesDone = notesCompleted !== undefined ? notesCompleted : existing?.notesCompleted || false;
    const isVideoDone = videoCompleted !== undefined ? videoCompleted : existing?.videoCompleted || false;

    // If both notes and video are completed and quiz is not completed yet, set status to QUIZ_PENDING
    let newStatus = existing?.status || "IN_PROGRESS";
    if (existing?.status !== "COMPLETED" && existing?.status !== "MASTERED") {
      if (isNotesDone && isVideoDone) {
        newStatus = "QUIZ_PENDING";
      } else {
        newStatus = "IN_PROGRESS";
      }
    }

    const updated = await prisma.userTopicProgress.upsert({
      where: {
        userId_topicId: {
          userId: user.id,
          topicId: topic.id,
        },
      },
      update: {
        notesCompleted: isNotesDone,
        videoCompleted: isVideoDone,
        status: newStatus,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        topicId: topic.id,
        notesCompleted: isNotesDone,
        videoCompleted: isVideoDone,
        status: newStatus,
      },
    });

    return NextResponse.json({
      success: true,
      progress: updated,
    });
  } catch (err: any) {
    console.error("Topic progress update error:", err);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
