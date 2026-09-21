import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { aiService } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, currentTopic, currentCourse, pathname } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const searchQuery = [query, currentTopic, currentCourse].filter(Boolean).join(" ");
    const keywords = searchQuery
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2);

    // Retrieve engineering topics relevant to student's query for RAG
    let topics: { title: string; description: string; notesContent: string | null }[] = [];

    if (keywords.length > 0) {
      topics = await prisma.topic.findMany({
        where: {
          OR: keywords.slice(0, 5).map((kw) => ({
            OR: [
              { title: { contains: kw } },
              { description: { contains: kw } },
            ],
          })),
        },
        select: {
          title: true,
          description: true,
          notesContent: true,
        },
        take: 8,
      });
    }

    if (topics.length === 0) {
      topics = await prisma.topic.findMany({
        select: {
          title: true,
          description: true,
          notesContent: true,
        },
        take: 8,
      });
    }

    const materials = await prisma.learningMaterial.findMany({
      select: {
        title: true,
        contentSnippet: true,
        summary: true,
      },
      take: 3,
    });

    const contexts = [
      ...topics.map((t) => ({
        title: t.title,
        text: `${t.description}\n\n${t.notesContent || ""}`,
      })),
      ...materials.map((m) => ({
        title: m.title,
        text: m.contentSnippet || m.summary || "",
      })),
    ];

    const result = await aiService.answerLearningQuestion(query, contexts);

    return NextResponse.json({
      answer: result.answer,
      source: result.source,
      suggestedResources: result.suggestedResources,
    });
  } catch (error: any) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to answer learning question" },
      { status: 500 }
    );
  }
}
