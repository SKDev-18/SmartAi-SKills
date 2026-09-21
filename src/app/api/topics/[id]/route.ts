import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
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
      include: {
        module: {
          include: { course: true },
        },
        videos: {
          orderBy: { order: "asc" },
        },
        quizzes: {
          where: { isPublished: true },
          take: 1,
          select: {
            id: true,
            title: true,
            description: true,
            passPercentage: true,
            masteryThreshold: true,
            relearnThreshold: true,
            questions: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Fetch user progress for this topic
    let userProgress = await prisma.userTopicProgress.findUnique({
      where: {
        userId_topicId: {
          userId: user.id,
          topicId: topic.id,
        },
      },
    });

    if (!userProgress) {
      userProgress = await prisma.userTopicProgress.create({
        data: {
          userId: user.id,
          topicId: topic.id,
          status: "AVAILABLE",
        },
      });
    }

    return NextResponse.json({
      success: true,
      topic: {
        ...topic,
        quiz: topic.quizzes[0]
          ? {
              id: topic.quizzes[0].id,
              title: topic.quizzes[0].title,
              description: topic.quizzes[0].description,
              passPercentage: topic.quizzes[0].passPercentage,
              questionCount: topic.quizzes[0].questions.length,
            }
          : null,
      },
      progress: userProgress,
    });
  } catch (err: any) {
    console.error("Topic detail API error:", err);
    return NextResponse.json({ error: "Failed to load topic details" }, { status: 500 });
  }
}
