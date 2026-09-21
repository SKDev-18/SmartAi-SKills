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

    const goalName = courseSlugToGoalName(courseSlug);

    // Parse current goals
    let goals: string[] = [];
    if (user.learningGoals) {
      try {
        const parsed = JSON.parse(user.learningGoals);
        if (Array.isArray(parsed)) goals = parsed;
      } catch {}
    }

    // Add to goals if not present
    if (!goals.includes(goalName)) {
      goals.push(goalName);
    }

    // Update user
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        learningGoals: JSON.stringify(goals),
        currentCourseId: courseSlug,
        targetSkill: goalName,
      },
    });

    // Initialize roadmap
    let userSkills = [];
    if (user.skills) {
      try {
        userSkills = JSON.parse(user.skills);
      } catch {}
    }
    await initializeStudentRoadmap(user.id, userSkills, courseSlug);

    return NextResponse.json({
      success: true,
      courseSlug,
      goalName,
      user: updated,
    });
  } catch (error: any) {
    console.error("Failed to enroll in course", error);
    return NextResponse.json(
      { error: error?.message || "Failed to enroll in course" },
      { status: 500 }
    );
  }
}
