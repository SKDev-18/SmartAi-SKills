import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { buildTopicNotesPdfDocument } from "@/lib/pdf/generateNotesPdf";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    const doc = buildTopicNotesPdfDocument({
      title: topic.title,
      courseName: topic.module?.course?.title || "Computer Science & Engineering",
      moduleName: topic.module?.title || "Core Curriculum",
      category: topic.module?.course?.category || "Engineering",
      estimatedTime: topic.estimatedTime || "25-30 mins",
      content: topic.notesContent || topic.description || "",
    });

    const arrayBuffer = doc.output("arraybuffer");
    const buffer = Buffer.from(arrayBuffer);

    const cleanSlug = (topic.slug || topic.title)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="NexStep_${cleanSlug}_Notes.pdf"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err: any) {
    console.error("PDF generation endpoint error:", err);
    return NextResponse.json(
      { error: "Failed to render PDF document" },
      { status: 500 }
    );
  }
}
