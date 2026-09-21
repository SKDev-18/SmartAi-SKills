import { cookies } from "next/headers";
import prisma from "./db";
import bcrypt from "bcryptjs";
import { SessionUser } from "@/types";

const SESSION_COOKIE_NAME = "mospi_session_token";

export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 10);
}

export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

export function createSessionToken(user: SessionUser): string {
  const payload = {
    ...user,
    timestamp: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function parseSessionToken(token: string): SessionUser | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.id || !parsed.email) return null;
    return {
      id: parsed.id,
      email: parsed.email,
      name: parsed.name || "Student",
      employeeId: parsed.employeeId || "",
      department: parsed.department || "Computer Engineering",
      designation: parsed.designation || "Engineering Student",
      experienceLevel: parsed.experienceLevel || "Beginner",
      role: parsed.role || "LEARNER",
      dob: parsed.dob || undefined,
      mobile: parsed.mobile || undefined,
      gender: parsed.gender || undefined,
      branch: parsed.branch || undefined,
      year: parsed.year || undefined,
      semester: parsed.semester || undefined,
      college: parsed.college || undefined,
      graduationYear: parsed.graduationYear || undefined,
      skills: parsed.skills || undefined,
      referralSource: parsed.referralSource || undefined,
      onboardingCompleted: Boolean(parsed.onboardingCompleted),
      currentCourseId: parsed.currentCourseId || undefined,
      targetSkill: parsed.targetSkill || undefined,
      learningGoals: parsed.learningGoals || undefined,
      primaryLearningGoal: parsed.primaryLearningGoal || undefined,
      photoURL: parsed.photoURL || undefined,
    };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const parsed = parseSessionToken(token);
  if (!parsed || !parsed.id) return null;

  try {
    let user = await prisma.user.findUnique({
      where: { id: parsed.id },
      select: {
        id: true,
        email: true,
        name: true,
        employeeId: true,
        department: true,
        designation: true,
        experienceLevel: true,
        role: true,
        dob: true,
        mobile: true,
        gender: true,
        branch: true,
        year: true,
        semester: true,
        college: true,
        graduationYear: true,
        skills: true,
        referralSource: true,
        onboardingCompleted: true,
        currentCourseId: true,
        targetSkill: true,
        learningGoals: true,
        primaryLearningGoal: true,
      },
    });

    // Auto-restore user across serverless containers if missing in local instance
    if (!user && parsed.email) {
      try {
        const restored = await prisma.user.upsert({
          where: { id: parsed.id },
          update: {},
          create: {
            id: parsed.id,
            email: parsed.email,
            name: parsed.name || "Student",
            employeeId: parsed.employeeId || `STU-${Date.now().toString().slice(-6)}`,
            passwordHash: "session_authenticated",
            role: parsed.role || "LEARNER",
            department: parsed.department || "Computer Engineering",
            designation: parsed.designation || "Engineering Student",
            experienceLevel: parsed.experienceLevel || "Beginner",
            onboardingCompleted: Boolean(parsed.onboardingCompleted),
            primaryLearningGoal: parsed.primaryLearningGoal || "Data Structures & Algorithms",
            targetSkill: parsed.targetSkill || "Data Structures & Algorithms",
            currentCourseId: parsed.currentCourseId || "dsa",
            skills: parsed.skills || "[]",
            learningGoals: parsed.learningGoals || JSON.stringify(["Data Structures & Algorithms"]),
          },
        });
        return restored as unknown as SessionUser;
      } catch (upsertErr) {
        console.warn("Auto-restore in container skipped:", upsertErr);
      }
    }

    if (!user) {
      return parsed;
    }

    return user as SessionUser;
  } catch (err) {
    console.error("Database query fallback in getSessionUser:", err);
    return parsed;
  }
}

export async function requireLearner(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized: Please sign in");
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Forbidden: Administrator access required");
  }
  return user;
}

export { SESSION_COOKIE_NAME };
