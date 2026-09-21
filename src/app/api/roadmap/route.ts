import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getStudentRoadmap } from "@/lib/roadmap";
import { goalNameToCourseSlug } from "@/lib/courses";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let courseSlug = req.nextUrl.searchParams.get("course");
    if (!courseSlug) {
      if (user.currentCourseId) {
        courseSlug = user.currentCourseId.startsWith("course_")
          ? user.currentCourseId.replace("course_", "")
          : user.currentCourseId;
      } else if (user.primaryLearningGoal) {
        courseSlug = goalNameToCourseSlug(user.primaryLearningGoal);
      } else {
        courseSlug = "dsa";
      }
    }
    const data = await getStudentRoadmap(user.id, courseSlug);

    // Identify active topic: the first topic that is IN_PROGRESS or AVAILABLE, or the first uncompleted topic
    let activeTopic = data.roadmap.find((t) => t.status === "IN_PROGRESS");
    if (!activeTopic) {
      activeTopic = data.roadmap.find((t) => t.status === "AVAILABLE");
    }
    if (!activeTopic && data.roadmap.length > 0) {
      activeTopic = data.roadmap[data.roadmap.length - 1];
    }

    return NextResponse.json({
      success: true,
      course: data.course,
      roadmap: data.roadmap,
      progressSummary: data.progressSummary,
      activeTopic,
    });
  } catch (err: any) {
    console.error("Roadmap API error:", err);
    return NextResponse.json({ error: "Failed to load roadmap" }, { status: 500 });
  }
}
