import { IGOTCourseItem } from "@/types";

export interface CourseSearchParams {
  query?: string;
  competencyDomain?: string;
  difficulty?: string;
  limit?: number;
}

export interface IGOTService {
  searchCourses(params: CourseSearchParams): Promise<IGOTCourseItem[]>;
  getCourseDetails(courseIdOrCode: string): Promise<IGOTCourseItem | null>;
  getRecommendedCourses(competencyGaps: string[]): Promise<IGOTCourseItem[]>;
  getCourseProgress(userId: string, courseCode: string): Promise<{ progress: number; status: string }>;
  isLiveApiConfigured(): boolean;
}
