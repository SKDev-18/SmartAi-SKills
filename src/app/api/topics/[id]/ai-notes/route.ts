import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { aiService } from "@/lib/ai/gemini";

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
      include: {
        module: {
          include: { course: true },
        },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const generatedNotes = await aiService.generateDeepDiveNotes(
      topic.title,
      topic.module?.course?.title || "Engineering Curriculum",
      topic.notesContent || ""
    );

    return NextResponse.json({
      success: true,
      topicId: topic.id,
      topicTitle: topic.title,
      courseTitle: topic.module?.course?.title,
      moduleTitle: topic.module?.title,
      notes: generatedNotes,
    });
  } catch (err: any) {
    console.error("AI Notes Generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate AI deep-dive notes" },
      { status: 500 }
    );
  }
}
