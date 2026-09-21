"use client";

import { SessionUser } from "@/types";

// In-memory module-level cache for instantaneous 0ms client-side reads
let memoryUser: SessionUser | null = null;
let memoryRoadmaps: Record<string, any> = {};
let memoryDefaultRoadmap: any | null = null;
let memoryCourses: any[] | null = null;
let memoryQuizzes: any[] | null = null;
let memoryCompetencies: any | null = null;
let memoryAssistantMessages: any[] | null = null;

// In-flight promise registry to deduplicate simultaneous requests
let inFlightRequests: Record<string, Promise<any>> = {};

// Cache timestamps for stale-while-revalidate (SWR)
let cacheTimestamps: Record<string, number> = {};
const CACHE_TTL_MS = 60 * 1000; // 60 seconds freshness

/**
 * Completely purges all in-memory, session, and local storage caches.
 * Must be invoked on logout, account switch, or login initialization.
 */
export function clearClientCache() {
  memoryUser = null;
  memoryRoadmaps = {};
  memoryDefaultRoadmap = null;
  memoryCourses = null;
  memoryQuizzes = null;
  memoryCompetencies = null;
  memoryAssistantMessages = null;
  inFlightRequests = {};
  cacheTimestamps = {};
  hasPrewarmed = false;

  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem("nexstep_cached_user");
      sessionStorage.removeItem("learnflow_cached_user");
      sessionStorage.clear();
      localStorage.removeItem("nexstep_cached_user");
      localStorage.removeItem("learnflow_cached_user");
    } catch {}
  }
}

export function isCacheFresh(key: string): boolean {
  const ts = cacheTimestamps[key];
  if (!ts) return false;
  return Date.now() - ts < CACHE_TTL_MS;
}

export function markCacheFresh(key: string) {
  cacheTimestamps[key] = Date.now();
}

// USER CACHE
export function getCachedUser(): SessionUser | null {
  if (memoryUser) return memoryUser;
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem("nexstep_cached_user") || sessionStorage.getItem("learnflow_cached_user");
      if (stored) {
        memoryUser = JSON.parse(stored);
        return memoryUser;
      }
    } catch {}
  }
  return null;
}

export function setCachedUser(user: SessionUser | null) {
  memoryUser = user;
  markCacheFresh("user");
  if (typeof window !== "undefined") {
    try {
      if (user) {
        sessionStorage.setItem("nexstep_cached_user", JSON.stringify(user));
      } else {
        sessionStorage.removeItem("nexstep_cached_user");
      }
    } catch {}
  }
}

export async function fetchUserWithCache(force = false): Promise<SessionUser | null> {
  const cached = getCachedUser();
  if (cached && !force && isCacheFresh("user")) {
    return cached;
  }
  if (inFlightRequests["user"]) {
    return inFlightRequests["user"];
  }

  const promise = (async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setCachedUser(data.user);
          return data.user;
        }
      }
    } catch (err) {
      console.warn("Background user fetch error:", err);
    } finally {
      delete inFlightRequests["user"];
    }
    return cached;
  })();

  inFlightRequests["user"] = promise;
  return promise;
}

// ROADMAP CACHE
export function getCachedRoadmap(slug?: string): any | null {
  if (!slug || slug === "default") {
    return memoryDefaultRoadmap || Object.values(memoryRoadmaps)[0] || null;
  }
  return memoryRoadmaps[slug] || null;
}

export function setCachedRoadmap(slug: string, data: any) {
  memoryRoadmaps[slug] = data;
  if (!memoryDefaultRoadmap || slug === "default") {
    memoryDefaultRoadmap = data;
  }
  markCacheFresh(`roadmap_${slug}`);
}

export async function fetchRoadmapWithCache(slug?: string, force = false): Promise<any | null> {
  const cacheKey = slug || "default";
  const cached = getCachedRoadmap(slug);
  if (cached && !force && isCacheFresh(`roadmap_${cacheKey}`)) {
    return cached;
  }
  if (inFlightRequests[`roadmap_${cacheKey}`]) {
    return inFlightRequests[`roadmap_${cacheKey}`];
  }

  const promise = (async () => {
    try {
      const url = slug && slug !== "default" ? `/api/roadmap?course=${slug}` : "/api/roadmap";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.course && data.roadmap) {
          setCachedRoadmap(slug || data.course.slug || "default", data);
          return data;
        }
      }
    } catch (err) {
      console.warn("Background roadmap fetch error:", err);
    } finally {
      delete inFlightRequests[`roadmap_${cacheKey}`];
    }
    return cached;
  })();

  inFlightRequests[`roadmap_${cacheKey}`] = promise;
  return promise;
}

// COURSES CACHE
export function getCachedCourses(): any[] | null {
  return memoryCourses;
}

export function setCachedCourses(courses: any[]) {
  memoryCourses = courses;
  markCacheFresh("courses");
}

export async function fetchCoursesWithCache(force = false): Promise<any[] | null> {
  const cached = getCachedCourses();
  if (cached && !force && isCacheFresh("courses")) {
    return cached;
  }
  if (inFlightRequests["courses"]) {
    return inFlightRequests["courses"];
  }

  const promise = (async () => {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        if (data.courses) {
          setCachedCourses(data.courses);
          return data.courses;
        }
      }
    } catch (err) {
      console.warn("Background courses fetch error:", err);
    } finally {
      delete inFlightRequests["courses"];
    }
    return cached;
  })();

  inFlightRequests["courses"] = promise;
  return promise;
}

// QUIZZES CACHE
export function getCachedQuizzes(): any[] | null {
  return memoryQuizzes;
}

export function setCachedQuizzes(quizzes: any[]) {
  memoryQuizzes = quizzes;
  markCacheFresh("quizzes");
}

export async function fetchQuizzesWithCache(force = false): Promise<any[] | null> {
  const cached = getCachedQuizzes();
  if (cached && !force && isCacheFresh("quizzes")) {
    return cached;
  }
  if (inFlightRequests["quizzes"]) {
    return inFlightRequests["quizzes"];
  }

  const promise = (async () => {
    try {
      const res = await fetch("/api/quizzes");
      if (res.ok) {
        const data = await res.json();
        if (data.quizzes) {
          setCachedQuizzes(data.quizzes);
          return data.quizzes;
        }
      }
    } catch (err) {
      console.error("Background quizzes fetch error:", err);
    } finally {
      delete inFlightRequests["quizzes"];
    }
    return cached;
  })();

  inFlightRequests["quizzes"] = promise;
  return promise;
}

// COMPETENCIES CACHE
export function getCachedCompetencies(): any | null {
  return memoryCompetencies;
}

export function setCachedCompetencies(data: any) {
  memoryCompetencies = data;
  markCacheFresh("competencies");
}

export async function fetchCompetenciesWithCache(force = false): Promise<any | null> {
  const cached = getCachedCompetencies();
  if (cached && !force && isCacheFresh("competencies")) {
    return cached;
  }
  if (inFlightRequests["competencies"]) {
    return inFlightRequests["competencies"];
  }

  const promise = (async () => {
    try {
      const res = await fetch("/api/competencies/me");
      if (res.ok) {
        const data = await res.json();
        if (data.competencies) {
          setCachedCompetencies(data);
          return data;
        }
      }
    } catch (err) {
      console.error("Background competencies fetch error:", err);
    } finally {
      delete inFlightRequests["competencies"];
    }
    return cached;
  })();

  inFlightRequests["competencies"] = promise;
  return promise;
}

// ASSISTANT CHAT CACHE
export function getCachedAssistantMessages(): any[] | null {
  return memoryAssistantMessages;
}

export function setCachedAssistantMessages(messages: any[]) {
  memoryAssistantMessages = messages;
}

// PRE-WARMING / TAB PRE-FETCHING
let hasPrewarmed = false;

export function prefetchTab(tabName: string) {
  if (typeof window === "undefined") return;
  switch (tabName) {
    case "Home":
      fetchRoadmapWithCache();
      fetchUserWithCache();
      break;
    case "Learn":
      fetchRoadmapWithCache();
      fetchCoursesWithCache();
      break;
    case "Quizzes":
      fetchQuizzesWithCache();
      break;
    case "Progress":
      fetchCompetenciesWithCache();
      break;
    case "Assistant":
      fetchUserWithCache();
      break;
  }
}

export function prefetchAllTabs() {
  if (typeof window === "undefined" || hasPrewarmed) return;
  hasPrewarmed = true;

  const run = () => {
    fetchUserWithCache();
    fetchRoadmapWithCache();
    fetchCoursesWithCache();
    fetchQuizzesWithCache();
    fetchCompetenciesWithCache();
  };

  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(run, { timeout: 1500 });
  } else {
    setTimeout(run, 300);
  }
}
