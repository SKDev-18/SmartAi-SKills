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

    const videoId = params.id;
    const video = await prisma.topicVideo.findUnique({
      where: { id: videoId },
      include: { topic: true },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // 1. Record Video Progress
    const videoProg = await prisma.videoProgress.upsert({
      where: {
        userId_videoId: {
          userId: user.id,
          videoId: video.id,
        },
      },
      update: {
        watchStatus: "WATCHED",
        completedAt: new Date(),
      },
      create: {
        userId: user.id,
        videoId: video.id,
        topicId: video.topicId,
        watchStatus: "WATCHED",
        completedAt: new Date(),
      },
    });

    // 2. Mark User Topic Video Progress
    const topicProg = await prisma.userTopicProgress.upsert({
      where: {
        userId_topicId: {
          userId: user.id,
          topicId: video.topicId,
        },
      },
      update: {
        videoCompleted: true,
      },
      create: {
        userId: user.id,
        topicId: video.topicId,
        videoCompleted: true,
        status: "IN_PROGRESS",
      },
    });

    return NextResponse.json({
      success: true,
      videoProgress: videoProg,
      topicProgress: topicProg,
    });
  } catch (error: any) {
    console.error("Failed to update video progress", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update video progress" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ isCompleted: false });
    }

    const prog = await prisma.videoProgress.findUnique({
      where: {
        userId_videoId: {
          userId: user.id,
          videoId: params.id,
        },
      },
    });

    return NextResponse.json({
      isCompleted: prog?.watchStatus === "WATCHED",
      progress: prog,
    });
  } catch (error) {
    return NextResponse.json({ isCompleted: false });
  }
}
