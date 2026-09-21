import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { courseSlugToGoalName } from "@/lib/courses";
import { initializeStudentRoadmap } from "@/lib/roadmap";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseSlug } = await req.json();
    if (!courseSlug) {
      return NextResponse.json({ error: "courseSlug is required" }, { status: 400 });
    }

    const targetSkill = courseSlugToGoalName(courseSlug);

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        currentCourseId: courseSlug,
        targetSkill,
        primaryLearningGoal: targetSkill,
      },
    });

    // Ensure this course roadmap is initialized for the user
    let userSkills = [];
    if (user.skills) {
      try {
        userSkills = JSON.parse(user.skills);
      } catch {}
    }
    await initializeStudentRoadmap(user.id, userSkills, courseSlug);

    return NextResponse.json({
      success: true,
      activeCourseId: courseSlug,
      currentCourseId: courseSlug,
      targetSkill,
      user: updated,
    });
  } catch (error: any) {
    console.error("Failed to update active learning path", error);
    return NextResponse.json(
      { error: error?.message || "Failed to switch learning path" },
      { status: 500 }
    );
  }
}
