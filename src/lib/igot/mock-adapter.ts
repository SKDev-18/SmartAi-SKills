import { IGOTCourseItem } from "@/types";
import { CourseSearchParams, IGOTService } from "./interface";
import prisma from "../db";

export class IGOTKarmayogiAdapter implements IGOTService {
  private apiEndpoint: string;
  private apiKey?: string;

  constructor() {
    this.apiEndpoint = process.env.IGOT_API_ENDPOINT || "https://karmayogi.gov.in/api/v1/courses";
    this.apiKey = process.env.IGOT_API_KEY;
  }

  public isLiveApiConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey !== "mock-api-key");
  }

  public async searchCourses(params: CourseSearchParams): Promise<IGOTCourseItem[]> {
    const whereClause: any = {};

    if (params.competencyDomain) {
      whereClause.domain = {
        contains: params.competencyDomain,
      };
    }

    if (params.query) {
      whereClause.OR = [
        { title: { contains: params.query } },
        { description: { contains: params.query } },
        { domain: { contains: params.query } },
      ];
    }

    if (params.difficulty) {
      whereClause.difficulty = params.difficulty;
    }

    const courses = await prisma.iGOTCourse.findMany({
      where: whereClause,
      take: params.limit || 10,
      orderBy: { rating: "desc" },
    });

    return courses.map((c) => ({
      id: c.id,
      courseCode: c.courseCode,
      title: c.title,
      description: c.description,
      domain: c.domain,
      competencyMapped: c.competencyMapped,
      durationMinutes: c.durationMinutes,
      difficulty: c.difficulty,
      provider: c.provider,
      externalUrl: c.externalUrl,
      thumbnailUrl: c.thumbnailUrl,
      rating: c.rating,
    }));
  }

  public async getCourseDetails(courseIdOrCode: string): Promise<IGOTCourseItem | null> {
    const course = await prisma.iGOTCourse.findFirst({
      where: {
        OR: [{ id: courseIdOrCode }, { courseCode: courseIdOrCode }],
      },
    });

    if (!course) return null;

    return {
      id: course.id,
      courseCode: course.courseCode,
      title: course.title,
      description: course.description,
      domain: course.domain,
      competencyMapped: course.competencyMapped,
      durationMinutes: course.durationMinutes,
      difficulty: course.difficulty,
      provider: course.provider,
      externalUrl: course.externalUrl,
      thumbnailUrl: course.thumbnailUrl,
      rating: course.rating,
    };
  }

  public async getRecommendedCourses(competencyGaps: string[]): Promise<IGOTCourseItem[]> {
    if (competencyGaps.length === 0) {
      return this.searchCourses({ limit: 4 });
    }

    const matchedCourses: IGOTCourseItem[] = [];

    for (const gap of competencyGaps) {
      const results = await prisma.iGOTCourse.findMany({
        where: {
          OR: [
            { domain: { contains: gap } },
            { competencyMapped: { contains: gap } },
            { title: { contains: gap } },
          ],
        },
        take: 2,
      });

      for (const r of results) {
        if (!matchedCourses.some((c) => c.id === r.id)) {
          matchedCourses.push({
            id: r.id,
            courseCode: r.courseCode,
            title: r.title,
            description: r.description,
            domain: r.domain,
            competencyMapped: r.competencyMapped,
            durationMinutes: r.durationMinutes,
            difficulty: r.difficulty,
            provider: r.provider,
            externalUrl: r.externalUrl,
            thumbnailUrl: r.thumbnailUrl,
            rating: r.rating,
          });
        }
      }
    }

    if (matchedCourses.length === 0) {
      return this.searchCourses({ limit: 4 });
    }

    return matchedCourses.slice(0, 4);
  }

  public async getCourseProgress(
    userId: string,
    courseCode: string
  ): Promise<{ progress: number; status: string }> {
    // In production, queries iGOT external user webhook or database sync
    return {
      progress: 45,
      status: "IN_PROGRESS",
    };
  }
}

export const igotService = new IGOTKarmayogiAdapter();
