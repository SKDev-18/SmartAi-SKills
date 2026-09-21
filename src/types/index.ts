export type UserRole = "LEARNER" | "ADMIN";

export type CompetencyStatus = "STRONG" | "DEVELOPING" | "NEEDS_IMPROVEMENT" | "CRITICAL_GAP";

export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  employeeId?: string;
  department?: string;
  designation?: string;
  experienceLevel?: string;
  role: UserRole;
  dob?: string | null;
  mobile?: string | null;
  gender?: string | null;
  branch?: string | null;
  year?: string | null;
  semester?: string | null;
  college?: string | null;
  graduationYear?: string | null;
  skills?: string | null;
  referralSource?: string | null;
  onboardingCompleted?: boolean;
  currentCourseId?: string | null;
  targetSkill?: string | null;
  learningGoals?: string | null;
  primaryLearningGoal?: string | null;
  photoURL?: string | null;
}

export type TopicStatus = "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "QUIZ_PENDING" | "COMPLETED" | "MASTERED";

export interface RoadmapTopicItem {
  id: string;
  title: string;
  slug: string;
  order: number;
  description: string;
  prerequisiteId?: string | null;
  estimatedTime: string;
  status: TopicStatus;
  notesCompleted: boolean;
  videoCompleted: boolean;
  quizCompleted: boolean;
  bestQuizScore: number;
  quizId?: string | null;
  moduleId?: string;
  moduleTitle?: string;
  isExistingSkill?: boolean;
}

export interface SkillItem {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

export interface CompetencyScoreItem {
  id: string;
  competencyId: string;
  domain: string;
  name: string;
  code: string;
  description: string;
  currentScore: number;
  requiredLevel: number;
  gap: number;
  status: CompetencyStatus;
  lastEvaluatedAt: string;
  topics: string[];
}

export interface GeneratedQuestion {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
  competency: string;
  topic: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  sourceReference: string;
  qualityScore?: number;
  validationNotes?: string[];
}

export interface DocumentAnalysisResult {
  title: string;
  topics: string[];
  subtopics: string[];
  keyConcepts: string[];
  definitions: { term: string; definition: string }[];
  learningObjectives: string[];
  competencyMapping: {
    domain: string;
    subcompetency: string;
    relevanceScore: number;
  }[];
  summary: string;
}

export interface QuizPerformanceInsight {
  score: number;
  maxScore: number;
  percentage: number;
  strongCompetencies: string[];
  weakCompetencies: string[];
  mistakeAnalysis: {
    concept: string;
    userChoice: string;
    correctExplanation: string;
  }[];
  recommendedNextStep: string;
  competencyDelta: {
    competencyCode: string;
    oldScore: number;
    newScore: number;
    statusChange?: string;
  }[];
}

export interface IGOTCourseItem {
  id: string;
  courseCode: string;
  title: string;
  description: string;
  domain: string;
  competencyMapped: string;
  durationMinutes: number;
  difficulty: string;
  provider: string;
  externalUrl: string;
  thumbnailUrl?: string | null;
  rating: number;
}
