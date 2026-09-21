import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, isDemoUser, demoEmail } = body;

    const targetEmail = isDemoUser && demoEmail ? demoEmail : email;

    if (!targetEmail) {
      return NextResponse.json(
        { error: "Please enter your Email or Employee ID" },
        { status: 400 }
      );
    }

    // Find user by email or employee ID
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: targetEmail }, { employeeId: targetEmail }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this credential." },
        { status: 401 }
      );
    }

    // If demo bypass, or verify password
    if (!isDemoUser) {
      if (!password) {
        return NextResponse.json(
          { error: "Please enter your password." },
          { status: 400 }
        );
      }
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: "Invalid password. Please try again." },
          { status: 401 }
        );
      }
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      employeeId: user.employeeId,
      department: user.department,
      designation: user.designation,
      experienceLevel: user.experienceLevel,
      role: user.role as "LEARNER" | "ADMIN",
    };

    const token = createSessionToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
