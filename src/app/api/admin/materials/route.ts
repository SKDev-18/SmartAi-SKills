import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { parseDocumentContent, analyzeStatisticalDocument } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    const {
      title,
      description,
      fileName,
      fileType,
      fileSize,
      rawContent,
      competencyId,
      topic,
      difficulty,
    } = body;

    if (!title || !rawContent) {
      return NextResponse.json(
        { error: "Title and document content are required." },
        { status: 400 }
      );
    }

    // Step 1: Text extraction and parsing
    const parsed = parseDocumentContent(rawContent, fileName || `${title}.txt`);

    // Step 2: AI Document Analysis (PRD §21)
    const analysis = analyzeStatisticalDocument(parsed.text, fileName || title);

    // Find best matching competency if not explicitly supplied
    let targetCompetencyId = competencyId;
    if (!targetCompetencyId) {
      const bestDomain = analysis.competencyMapping[0]?.domain;
      if (bestDomain) {
        const comp = await prisma.competency.findFirst({
          where: { domain: { contains: bestDomain } },
        });
        if (comp) targetCompetencyId = comp.id;
      }
    }

    // Step 3: Store in database
    const material = await prisma.learningMaterial.create({
      data: {
        title,
        description: description || analysis.summary,
        fileName: fileName || `${title.replace(/\s+/g, "_")}.pdf`,
        fileType: fileType || "PDF",
        fileSize: fileSize || parsed.charCount * 2,
        contentSnippet: parsed.text,
        extractedTopics: JSON.stringify(analysis.topics),
        keyConcepts: JSON.stringify(analysis.keyConcepts),
        summary: analysis.summary,
        competencyId: targetCompetencyId,
        topic: topic || analysis.topics[0] || "General Statistics",
        difficulty: difficulty || "INTERMEDIATE",
        uploadedById: admin.id,
      },
    });

    // Automatically create a linked Learning Resource
    if (targetCompetencyId) {
      await prisma.learningResource.create({
        data: {
          title,
          description: description || analysis.summary,
          topic: topic || analysis.topics[0] || "General Statistics",
          competencyId: targetCompetencyId,
          difficulty: difficulty || "INTERMEDIATE",
          durationMinutes: Math.max(30, Math.round(parsed.wordCount / 100) * 10),
          source: "MATERIAL",
          materialId: material.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      materialId: material.id,
      analysis,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process document" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const materials = await prisma.learningMaterial.findMany({
      include: {
        competency: true,
        _count: {
          select: { quizQuestions: true, quizzes: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ materials });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch materials" },
      { status: 500 }
    );
  }
}
