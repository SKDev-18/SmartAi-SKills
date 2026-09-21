import prisma from "./db";
import { RoadmapTopicItem, TopicStatus } from "@/types";

export interface ProgressionResult {
  score: number;
  percentage: number;
  tier: "RELEARN" | "RETRY" | "COMPLETED" | "MASTERED";
  status: TopicStatus;
  feedback: string;
  unlockedNextTopic: boolean;
  nextTopic: { id: string; title: string; slug: string } | null;
  weakAreas: string[];
}

/**
 * Retrieves the full structured roadmap for a student, merging topic prerequisites,
 * current user progress, and calculated status.
 */
export async function getStudentRoadmap(userId: string, courseSlug: string = "dsa") {
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          topics: {
            orderBy: { order: "asc" },
            include: {
              videos: { orderBy: { order: "asc" } },
              quizzes: {
                where: { isPublished: true },
                take: 1,
                select: { id: true, title: true, passPercentage: true },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    return { course: null, roadmap: [], progressSummary: { completed: 0, total: 0, percentage: 0 } };
  }

  // Fetch student progress for all topics in this course
  const allTopicIds = course.modules.flatMap((m) => m.topics.map((t) => t.id));
  const userProgressList = await prisma.userTopicProgress.findMany({
    where: {
      userId,
      topicId: { in: allTopicIds },
    },
  });

  const progressMap = new Map(userProgressList.map((p) => [p.topicId, p]));

  const flatRoadmap: RoadmapTopicItem[] = [];
  let previousTopicCompleted = true; // The first topic without prerequisites is available by default

  for (const mod of course.modules) {
    for (const t of mod.topics) {
      const userProg = progressMap.get(t.id);
      let status: TopicStatus = (userProg?.status as TopicStatus) || "LOCKED";

      // If no progress record exists yet, determine status by prerequisites
      if (!userProg) {
        if (!t.prerequisiteId || previousTopicCompleted) {
          status = "AVAILABLE";
        } else {
          status = "LOCKED";
        }
      }

      // Check if this topic is completed or mastered
      const isDone = status === "COMPLETED" || status === "MASTERED";
      previousTopicCompleted = isDone;

      // Identify if completed via existing skill (no quiz attempt taken yet)
      const isExistingSkill = isDone && (!userProg || userProg.attemptsCount === 0);

      flatRoadmap.push({
        id: t.id,
        title: t.title,
        slug: t.slug,
        order: t.order,
        description: t.description,
        prerequisiteId: t.prerequisiteId,
        estimatedTime: t.estimatedTime,
        status,
        notesCompleted: userProg?.notesCompleted || false,
        videoCompleted: userProg?.videoCompleted || false,
        quizCompleted: userProg?.quizCompleted || false,
        bestQuizScore: userProg?.bestQuizScore || 0,
        quizId: t.quizzes[0]?.id || null,
        moduleId: mod.id,
        moduleTitle: mod.title,
        isExistingSkill,
      });
    }
  }

  const completedCount = flatRoadmap.filter(
    (t) => t.status === "COMPLETED" || t.status === "MASTERED"
  ).length;
  const totalCount = flatRoadmap.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    course,
    roadmap: flatRoadmap,
    progressSummary: {
      completed: completedCount,
      total: totalCount,
      percentage,
    },
  };
}

/**
 * Initializes the student's roadmap based on their selected skills from onboarding.
 * Skips foundational skills if student already knows them (Prompt §11, §16).
 */
export async function initializeStudentRoadmap(
  userId: string,
  selectedSkills: { name: string; level: string }[] = [],
  courseSlug: string = "dsa"
) {
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      modules: {
        include: {
          topics: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!course) return;

  const topics = course.modules.flatMap((m) => m.topics).sort((a, b) => a.order - b.order);
  if (topics.length === 0) return;

  // Existing skills check
  const skillNames = selectedSkills.map((s) => s.name.toLowerCase());
  const hasSkill = (term: string) => skillNames.some((s) => s.includes(term.toLowerCase()));

  // Fetch existing progress to never wipe user achievements!
  const existingProgress = await prisma.userTopicProgress.findMany({
    where: {
      userId,
      topicId: { in: topics.map((t) => t.id) },
    },
  });
  const existingMap = new Map(existingProgress.map((p) => [p.topicId, p]));

  // Determine skipped topics based on course & skills (Prompt §11, §16)
  const isSkippedBySkill = (topicSlug: string): boolean => {
    if (courseSlug === "data-analytics") {
      if (topicSlug === "python-basics" && hasSkill("python")) return true;
      if (topicSlug === "numpy" && (hasSkill("numpy") || (hasSkill("python") && hasSkill("data")))) return true;
    } else if (courseSlug === "dsa") {
      if (
        topicSlug === "programming-fundamentals" &&
        (hasSkill("c++") || hasSkill("python") || hasSkill("java") || hasSkill("programming") || hasSkill("oop"))
      ) {
        return true;
      }
    } else if (courseSlug === "web-development") {
      if (topicSlug === "html" && (hasSkill("html") || hasSkill("web"))) return true;
      if (topicSlug === "css" && (hasSkill("css") || hasSkill("html & css") || hasSkill("web"))) return true;
    } else if (courseSlug === "python") {
      if (topicSlug === "python-fundamentals" && hasSkill("python")) return true;
    }
    return false;
  };

  let previousTopicCompleted = true;

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    const prevRecord = existingMap.get(topic.id);

    // If student already has a progress record for this topic, preserve it completely!
    if (prevRecord) {
      if (prevRecord.status === "COMPLETED" || prevRecord.status === "MASTERED") {
        previousTopicCompleted = true;
      } else {
        previousTopicCompleted = false;
      }
      continue;
    }

    const skipped = isSkippedBySkill(topic.slug);
    let initialStatus: TopicStatus = "LOCKED";

    if (skipped) {
      initialStatus = "COMPLETED";
      previousTopicCompleted = true;
    } else if (previousTopicCompleted) {
      initialStatus = "AVAILABLE";
      previousTopicCompleted = false;
    } else {
      initialStatus = "LOCKED";
    }

    await prisma.userTopicProgress.upsert({
      where: {
        userId_topicId: {
          userId,
          topicId: topic.id,
        },
      },
      update: {
        status: initialStatus,
        notesCompleted: skipped,
        videoCompleted: skipped,
        quizCompleted: skipped,
        bestQuizScore: skipped ? 85.0 : (prevRecord?.bestQuizScore || 0.0),
      },
      create: {
        userId,
        topicId: topic.id,
        status: initialStatus,
        notesCompleted: skipped,
        videoCompleted: skipped,
        quizCompleted: skipped,
        bestQuizScore: skipped ? 85.0 : 0.0,
      },
    });
  }
}

/**
 * Deterministic Adaptive Progression Engine (PRD §26 - §30)
 *
 * Rules:
 * - Score < 60%: RELEARN -> "You should strengthen this topic before moving ahead."
 * - 60% <= Score < 80%: RETRY -> "You're making progress. Review the weak areas and try again."
 * - 80% <= Score <= 90%: COMPLETED -> "Great work! You've demonstrated sufficient understanding of this topic." -> Unlocks next topic!
 * - Score > 90%: MASTERED -> "Excellent! You've mastered this topic." -> Unlocks next topic!
 */
export async function evaluateAdaptiveProgression(
  userId: string,
  topicId: string,
  percentage: number,
  weakConcepts: string[] = []
): Promise<ProgressionResult> {
  const currentTopic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: { module: { include: { course: true } } },
  });

  if (!currentTopic) {
    throw new Error("Topic not found");
  }

  // Find next topic in roadmap sequence
  const nextTopic = await prisma.topic.findFirst({
    where: {
      module: { courseId: currentTopic.module.courseId },
      order: { gt: currentTopic.order },
    },
    orderBy: { order: "asc" },
    select: { id: true, title: true, slug: true },
  });

  let tier: "RELEARN" | "RETRY" | "COMPLETED" | "MASTERED";
  let status: TopicStatus;
  let feedback: string;
  let unlockedNextTopic = false;

  if (percentage < 60) {
    tier = "RELEARN";
    status = "IN_PROGRESS";
    feedback = "You should strengthen this topic before moving ahead.";
  } else if (percentage < 80) {
    tier = "RETRY";
    status = "IN_PROGRESS";
    feedback = "You're making progress. Review the weak areas and try again.";
  } else if (percentage <= 90) {
    tier = "COMPLETED";
    status = "COMPLETED";
    feedback = "Great work! You've demonstrated sufficient understanding of this topic.";
    unlockedNextTopic = true;
  } else {
    tier = "MASTERED";
    status = "MASTERED";
    feedback = "Excellent! You've mastered this topic.";
    unlockedNextTopic = true;
  }

  // Update current topic progress
  const existingProg = await prisma.userTopicProgress.findUnique({
    where: { userId_topicId: { userId, topicId } },
  });

  const bestScore = Math.max(existingProg?.bestQuizScore || 0, percentage);

  await prisma.userTopicProgress.upsert({
    where: { userId_topicId: { userId, topicId } },
    update: {
      status,
      quizCompleted: percentage >= 80,
      bestQuizScore: bestScore,
      attemptsCount: { increment: 1 },
      updatedAt: new Date(),
    },
    create: {
      userId,
      topicId,
      status,
      quizCompleted: percentage >= 80,
      bestQuizScore: percentage,
      attemptsCount: 1,
    },
  });

  // If passed (>= 80%), unlock next topic in the roadmap
  if (unlockedNextTopic && nextTopic) {
    await prisma.userTopicProgress.upsert({
      where: { userId_topicId: { userId, topicId: nextTopic.id } },
      update: {
        status: "AVAILABLE",
      },
      create: {
        userId,
        topicId: nextTopic.id,
        status: "AVAILABLE",
      },
    });
  }

  return {
    score: percentage,
    percentage,
    tier,
    status,
    feedback,
    unlockedNextTopic,
    nextTopic,
    weakAreas: weakConcepts,
  };
}
