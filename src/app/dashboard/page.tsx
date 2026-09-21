import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import LearnerNav from "@/components/layout/LearnerNav";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";
import { getStudentRoadmap } from "@/lib/roadmap";
import {
  goalNameToCourseSlug,
  courseSlugToGoalName,
} from "@/lib/courses";
import InteractiveDashboard from "@/components/dashboard/InteractiveDashboard";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams?: { path?: string };
}

export default async function LearnerDashboardPage({ searchParams }: DashboardPageProps) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin/dashboard");

  if (!user.onboardingCompleted) {
    redirect("/onboarding/step-1");
  }

  // Parse user learning goals
  let userGoals: string[] = [];
  if (user.learningGoals) {
    try {
      const parsed = JSON.parse(user.learningGoals);
      if (Array.isArray(parsed) && parsed.length > 0) userGoals = parsed;
    } catch {}
  }
  if (userGoals.length === 0) {
    userGoals = [user.targetSkill || user.primaryLearningGoal || "Data Structures & Algorithms"];
  }

  const primaryGoal = user.primaryLearningGoal || userGoals[0] || "Data Structures & Algorithms";

  // Determine active course slug dynamically based on user's primary goal
  const primarySlug = user.primaryLearningGoal ? goalNameToCourseSlug(user.primaryLearningGoal) : null;
  const currentCourseSlug = user.currentCourseId
    ? user.currentCourseId.startsWith("course_")
      ? user.currentCourseId.replace("course_", "")
      : user.currentCourseId
    : null;

  const activeSlug =
    searchParams?.path ||
    primarySlug ||
    currentCourseSlug ||
    goalNameToCourseSlug(primaryGoal) ||
    "dsa";

  // Available learning paths for selector
  const availablePaths = userGoals.map((g) => ({
    slug: goalNameToCourseSlug(g),
    name: g,
    isPrimary: g === primaryGoal,
  }));

  // Ensure current active path is in availablePaths
  if (!availablePaths.some((p) => p.slug === activeSlug)) {
    availablePaths.push({
      slug: activeSlug,
      name: courseSlugToGoalName(activeSlug),
      isPrimary: false,
    });
  }

  // Pre-fetch student's roadmaps for all available paths to enable instant 0ms switching
  const initialRoadmaps: Record<string, any> = {};
  await Promise.all(
    availablePaths.map(async (p) => {
      try {
        const rm = await getStudentRoadmap(user.id, p.slug);
        initialRoadmaps[p.slug] = {
          course: rm.course,
          roadmap: rm.roadmap,
          progressSummary: rm.progressSummary,
        };
      } catch (err) {
        console.error(`Failed to preload roadmap for ${p.slug}:`, err);
      }
    })
  );

  // Fallback: Ensure at least the active slug is present
  if (!initialRoadmaps[activeSlug]) {
    const rm = await getStudentRoadmap(user.id, activeSlug);
    initialRoadmaps[activeSlug] = {
      course: rm.course,
      roadmap: rm.roadmap,
      progressSummary: rm.progressSummary,
    };
  }

  // Fetch Recent Quiz Attempts
  const recentAttempts = await prisma.quizAttempt.findMany({
    where: { userId: user.id },
    orderBy: { completedAt: "desc" },
    take: 4,
    include: {
      quiz: { select: { title: true, topic: true } },
    },
  });

  const totalAttempts = recentAttempts.length;
  const avgQuizScore =
    totalAttempts > 0
      ? Math.round(recentAttempts.reduce((acc, a) => acc + a.percentage, 0) / totalAttempts)
      : 0;

  // Greet based on local hour
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Parse user skills
  let userSkills: { name: string; level: string }[] = [];
  if (user.skills) {
    try {
      userSkills = JSON.parse(user.skills);
    } catch {}
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col pb-20 md:pb-10 transition-colors duration-200">
      <Header user={user} />
      <LearnerNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 w-full flex-1">
        <InteractiveDashboard
          user={user}
          initialActiveSlug={activeSlug}
          availablePaths={availablePaths}
          initialRoadmaps={initialRoadmaps}
          recentAttempts={recentAttempts}
          userSkills={userSkills}
          greeting={greeting}
          avgQuizScore={avgQuizScore}
        />
      </main>
    </div>
  );
}
