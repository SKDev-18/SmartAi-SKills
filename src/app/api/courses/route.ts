import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { goalNameToCourseSlug } from "@/lib/courses";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getSessionUser();

    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            topics: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                slug: true,
                order: true,
                estimatedTime: true,
              },
            },
          },
        },
      },
    });

    let enrolledSlugs: string[] = [];
    if (user?.learningGoals) {
      try {
        const goals: string[] = JSON.parse(user.learningGoals);
        enrolledSlugs = goals.map((g) => goalNameToCourseSlug(g));
      } catch {}
    }
    if (user?.currentCourseId && !enrolledSlugs.includes(user.currentCourseId)) {
      enrolledSlugs.push(user.currentCourseId);
    }

    const formatted = courses.map((c) => {
      const allTopics = c.modules.flatMap((m) => m.topics);
      return {
        id: c.id,
        title: c.title,
        slug: c.slug,
        description: c.description,
        category: c.category || "Core Computer Science",
        branch: c.branch,
        icon: c.icon,
        topicsCount: allTopics.length,
        modulesCount: c.modules.length,
        isEnrolled: enrolledSlugs.includes(c.slug),
        topics: allTopics,
      };
    });

    return NextResponse.json({ courses: formatted });
  } catch (error: any) {
    console.error("Failed to fetch courses", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
