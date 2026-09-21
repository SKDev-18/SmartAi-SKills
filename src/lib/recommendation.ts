import prisma from "./db";

export interface ComputedRecommendation {
  resourceId: string;
  title: string;
  description: string;
  topic: string;
  competencyDomain: string;
  durationMinutes: number;
  difficulty: string;
  source: string;
  externalUrl?: string | null;
  priorityScore: number;
  reasonExplanation: string;
}

export async function generatePersonalizedRecommendations(
  userId: string
): Promise<ComputedRecommendation[]> {
  // 1. Fetch user competencies
  const userCompetencies = await prisma.userCompetency.findMany({
    where: { userId },
    include: { competency: true },
    orderBy: { gap: "desc" },
  });

  // 2. Fetch recent quiz attempts to detect failed topics/competencies
  const recentQuizAttempts = await prisma.quizAttempt.findMany({
    where: { userId },
    take: 3,
    orderBy: { completedAt: "desc" },
    include: {
      answers: {
        where: { isCorrect: false },
        include: { question: true },
      },
    },
  });

  // 3. Fetch completed / in-progress learning resources to avoid re-recommending completed ones
  const userProgress = await prisma.learningProgress.findMany({
    where: { userId },
  });
  const completedResourceIds = new Set(
    userProgress.filter((p) => p.status === "COMPLETED").map((p) => p.resourceId)
  );

  // 4. Fetch available learning resources
  const availableResources = await prisma.learningResource.findMany({
    include: { competency: true },
  });

  const recommendations: ComputedRecommendation[] = [];

  for (const resource of availableResources) {
    if (completedResourceIds.has(resource.id)) continue;

    // Find matching user competency
    const matchingComp = userCompetencies.find(
      (uc) => uc.competencyId === resource.competencyId
    );

    const gap = matchingComp ? matchingComp.gap : 20.0;
    const currentScore = matchingComp ? matchingComp.currentScore : 50.0;
    const requiredLevel = matchingComp ? matchingComp.requiredLevel : 75.0;

    // Check if user recently failed questions in this competency/topic
    let missedInQuizCount = 0;
    for (const attempt of recentQuizAttempts) {
      for (const ans of attempt.answers) {
        if (
          ans.question.competencyId === resource.competencyId ||
          ans.question.topic.toLowerCase() === resource.topic.toLowerCase()
        ) {
          missedInQuizCount++;
        }
      }
    }

    // Check in-progress status
    const inProgressItem = userProgress.find((p) => p.resourceId === resource.id);
    const progressScore = inProgressItem ? (100 - inProgressItem.progressPercentage) / 100 : 1.0;

    // PRD §48 Formula:
    // Priority = Competency Gap + Assessment Score Delta + Recent Quiz Performance + Learning History + Required Level
    const gapFactor = gap / 100.0; // 0.0 - 1.0
    const quizMistakeFactor = Math.min(1.0, missedInQuizCount * 0.25);
    const targetImportanceFactor = requiredLevel / 100.0;

    const priorityScore = Number(
      (gapFactor * 0.45 + quizMistakeFactor * 0.3 + progressScore * 0.15 + targetImportanceFactor * 0.1).toFixed(3)
    );

    // Formulate human-readable "WHY recommended" explanation (PRD §11 & §48)
    let reasonExplanation = "";
    if (missedInQuizCount > 0) {
      reasonExplanation = `Recommended because your ${resource.competency.name} competency is below target (${Math.round(currentScore)}% vs ${Math.round(requiredLevel)}%) and you recently missed questions related to ${resource.topic}.`;
    } else if (gap > 20) {
      reasonExplanation = `Your recent assessment indicates a significant priority gap of ${Math.round(gap)} percentage points in ${resource.competency.name}.`;
    } else if (inProgressItem) {
      reasonExplanation = `You have partially completed this module (${Math.round(inProgressItem.progressPercentage)}%). Finish to solidify your ${resource.topic} skills.`;
    } else {
      reasonExplanation = `Targeted reinforcement for ${resource.competency.name} to advance your official statistical capacity.`;
    }

    recommendations.push({
      resourceId: resource.id,
      title: resource.title,
      description: resource.description,
      topic: resource.topic,
      competencyDomain: resource.competency.domain,
      durationMinutes: resource.durationMinutes,
      difficulty: resource.difficulty,
      source: resource.source,
      externalUrl: resource.externalUrl,
      priorityScore,
      reasonExplanation,
    });
  }

  // Sort by priority descending
  recommendations.sort((a, b) => b.priorityScore - a.priorityScore);

  return recommendations.slice(0, 6);
}
