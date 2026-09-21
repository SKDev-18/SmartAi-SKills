import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, uid, providerId, isNewUser, photoURL } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address provided by Firebase authentication." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    let displayName = name?.trim() || "";

    if (!displayName) {
      displayName = normalizedEmail.split("@")[0];
    }

    // Find existing user or create new student account
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Auto-create new student user account in database
      const employeeId = `STU-${Date.now().toString().slice(-6)}`;
      user = await prisma.user.create({
        data: {
          name: displayName,
          email: normalizedEmail,
          passwordHash: "firebase_auth_" + (uid ? uid.slice(0, 10) : "user"),
          employeeId,
          role: "LEARNER",
          department: "Computer Engineering",
          designation: "Engineering Student",
          experienceLevel: "Beginner",
          onboardingCompleted: false,
          currentCourseId: "course_dsa",
          targetSkill: "Data Structures & Algorithms",
          primaryLearningGoal: "Data Structures & Algorithms",
          referralSource: providerId === "google.com" ? "Firebase Google Auth" : "Firebase Email Auth",
        },
      });
    } else {
      // Update display name if user has default name
      if ((!user.name || user.name === "Student") && displayName) {
        try {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { name: displayName },
          });
        } catch {
          // ignore
        }
      }
    }

    // Build session object
    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      employeeId: user.employeeId,
      department: user.department,
      designation: user.designation,
      experienceLevel: user.experienceLevel,
      role: user.role as "LEARNER" | "ADMIN",
      onboardingCompleted: Boolean(user.onboardingCompleted),
      branch: user.branch || undefined,
      year: user.year || undefined,
      college: user.college || undefined,
      photoURL: photoURL || undefined,
    };

    const token = createSessionToken(sessionUser);

    const redirectPath = user.role === "ADMIN"
      ? "/admin/dashboard"
      : user.onboardingCompleted
      ? "/dashboard"
      : "/onboarding/step-1";

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
      redirectTo: redirectPath,
      message: "Firebase authentication synced successfully",
    });

    // Set secure HTTP-only session cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error("Firebase Auth Sync Route Error:", err);
    return NextResponse.json(
      { error: err?.message || "Firebase session synchronization failed." },
      { status: 500 }
    );
  }
}
