import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { aiService } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const {
      materialId,
      topic,
      numberOfQuestions = 5,
      difficulty = "MEDIUM",
    } = body;

    let materialContent = "";
    let materialTitle = "Official Statistical Compendium";
    let competencyId = "";
    let domain = "Survey Methodology";

    if (materialId) {
      const material = await prisma.learningMaterial.findUnique({
        where: { id: materialId },
        include: { competency: true },
      });
      if (material) {
        materialContent = material.contentSnippet;
        materialTitle = material.title;
        competencyId = material.competencyId || "";
        domain = material.competency?.domain || "Survey Methodology";
      }
    }

    if (!competencyId) {
      const comp = await prisma.competency.findFirst({
        where: { domain: { contains: domain } },
      });
      if (comp) competencyId = comp.id;
    }

    // Call AI Service to generate MCQs (PRD §22, §23)
    const generated = await aiService.generateQuestions(
      materialContent,
      materialTitle,
      domain,
      topic || "Sampling",
      Math.min(10, Math.max(1, Number(numberOfQuestions) || 5)),
      difficulty as "EASY" | "MEDIUM" | "HARD"
    );

    // Save questions into database with status DRAFT (PRD §25 & §49)
    const savedQuestions = [];
    for (const q of generated) {
      const saved = await prisma.quizQuestion.create({
        data: {
          materialId: materialId || null,
          competencyId: competencyId,
          topic: q.topic || topic || "General",
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          sourceReference: q.sourceReference,
          status: "DRAFT",
          qualityScore: q.qualityScore || 95.0,
          validationNotes: JSON.stringify(q.validationNotes || []),
        },
      });
      savedQuestions.push(saved);
    }

    return NextResponse.json({
      success: true,
      generatedCount: savedQuestions.length,
      questions: savedQuestions,
    });
  } catch (error: any) {
    console.error("MCQ Generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate MCQs" },
      { status: 500 }
    );
  }
}
