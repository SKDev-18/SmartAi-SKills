import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashPassword, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, confirmPassword } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const employeeId = `STU-${Date.now().toString().slice(-6)}`;

    // Create user with onboardingCompleted: false
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        employeeId,
        role: "LEARNER",
        department: "Computer Engineering",
        designation: "Engineering Student",
        experienceLevel: "Beginner",
        onboardingCompleted: false,
        currentCourseId: "course_dsa",
        targetSkill: "Data Structures & Algorithms",
      },
    });

    const sessionUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      employeeId: newUser.employeeId,
      department: newUser.department,
      designation: newUser.designation,
      experienceLevel: newUser.experienceLevel,
      role: newUser.role as "LEARNER" | "ADMIN",
      onboardingCompleted: false,
    };

    const token = createSessionToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
      redirectTo: "/onboarding/step-1",
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
