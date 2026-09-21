import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params?.id;
    if (!rawId) {
      return NextResponse.json({ error: "Quiz ID parameter is required" }, { status: 400 });
    }

    const cleanId = decodeURIComponent(rawId).trim();

    const targetTopicId = req.nextUrl.searchParams.get("topicId")?.trim();
    const targetCourseId = req.nextUrl.searchParams.get("courseId")?.trim();

    const includeConfig = {
      material: {
        select: { title: true, fileName: true },
      },
      topicRel: {
        select: {
          id: true,
          title: true,
          slug: true,
          moduleId: true,
          module: {
            select: {
              id: true,
              title: true,
              courseId: true,
              course: {
                select: { id: true, title: true, slug: true },
              },
            },
          },
        },
      },
      questions: {
        where: { status: "APPROVED" },
        select: {
          id: true,
          questionText: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
          difficulty: true,
          competency: {
            select: { id: true, domain: true, name: true },
          },
          topic: true,
          sourceReference: true,
        },
      },
    };

    let quiz: any = null;

    // 1. If targetTopicId is explicitly provided in query, prioritize finding the quiz for that topic
    if (targetTopicId) {
      quiz = await prisma.quiz.findFirst({
        where: {
          OR: [
            { topicId: targetTopicId },
            { topicRel: { slug: targetTopicId } },
          ],
          isPublished: true,
        },
        include: includeConfig,
      });
    }

    // 2. Otherwise look up by cleanId (quiz ID, topic slug, or topic ID)
    if (!quiz) {
      quiz = await prisma.quiz.findUnique({
        where: { id: cleanId },
        include: includeConfig,
      });
    }

    const normalizedSlug = cleanId.replace(/[-_]quiz$/i, "");

    if (!quiz) {
      quiz = await prisma.quiz.findFirst({
        where: {
          OR: [
            { topicRel: { slug: cleanId } },
            { topicRel: { slug: normalizedSlug } },
            { topicId: cleanId },
            { topicId: normalizedSlug },
            { id: `quiz_${cleanId.replace(/[^a-zA-Z0-9_-]/g, "_")}` },
            { id: `quiz_${normalizedSlug.replace(/[^a-zA-Z0-9_-]/g, "_")}` },
            { title: { contains: cleanId.replace(/-/g, " ") } },
            { title: { contains: normalizedSlug.replace(/-/g, " ") } },
          ],
          isPublished: true,
        },
        include: includeConfig,
      });
    }

    if (!quiz) {
      // Find if cleanId or normalizedSlug matches a topic by slug or ID, and get its first published quiz
      const topic = await prisma.topic.findFirst({
        where: {
          OR: [
            { id: cleanId },
            { slug: cleanId },
            { id: normalizedSlug },
            { slug: normalizedSlug },
          ],
        },
        include: {
          quizzes: {
            where: { isPublished: true },
            take: 1,
            include: includeConfig,
          },
        },
      });
      if (topic && topic.quizzes.length > 0) {
        quiz = topic.quizzes[0];
      }
    }

    if (!quiz) {
      return NextResponse.json(
        { error: `Assessment not found for "${cleanId}". Please return to the curriculum.` },
        { status: 404 }
      );
    }

    // STRICT VALIDATION: courseId + topicId check
    if (targetTopicId) {
      const topicMatches =
        quiz.topicId === targetTopicId ||
        quiz.topicRel?.id === targetTopicId ||
        quiz.topicRel?.slug === targetTopicId;

      if (!topicMatches) {
        return NextResponse.json(
          {
            error: `Validation Error: The requested quiz "${quiz.title}" does not match the requested topic "${targetTopicId}".`,
          },
          { status: 400 }
        );
      }
    }

    if (targetCourseId) {
      const actualCourseId = quiz.topicRel?.module?.course?.id;
      const actualCourseSlug = quiz.topicRel?.module?.course?.slug;

      const courseMatches =
        actualCourseId === targetCourseId || actualCourseSlug === targetCourseId;

      if (!courseMatches) {
        return NextResponse.json(
          {
            error: `Validation Error: The requested quiz does not belong to course "${targetCourseId}".`,
          },
          { status: 400 }
        );
      }
    }

    // Fallback: If no APPROVED questions returned, load any available questions for this quiz
    if (quiz.questions.length === 0) {
      const allQ = await prisma.quizQuestion.findMany({
        where: { quizId: quiz.id },
        select: includeConfig.questions.select,
      });
      if (allQ.length > 0) {
        quiz.questions = allQ;
      }
    }

    return NextResponse.json({ quiz });
  } catch (error: any) {
    console.error("Failed to fetch quiz:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch quiz assessment" },
      { status: 500 }
    );
  }
}
