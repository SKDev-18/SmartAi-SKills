import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, isDemoUser, demoEmail } = body;

    const rawTarget = isDemoUser && demoEmail ? demoEmail : email;

    if (!rawTarget) {
      return NextResponse.json(
        { error: "Please enter your Email or Employee ID" },
        { status: 400 }
      );
    }

    const targetEmail = String(rawTarget).trim();
    const lowerEmail = targetEmail.toLowerCase();

    // Find user by email or employee ID
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: targetEmail },
          { email: lowerEmail },
          { employeeId: targetEmail },
        ],
      },
    });

    // Auto-seed known demo users if not present in database
    if (!user && (isDemoUser || lowerEmail.includes("@"))) {
      const knownDemoAccounts: Record<string, { name: string; role: "LEARNER" | "ADMIN"; department: string; designation: string }> = {
        "harshal.patel@engg.edu": {
          name: "Harshal Patel",
          role: "LEARNER",
          department: "Computer Engineering",
          designation: "Engineering Student",
        },
        "admin@mospi.gov.in": {
          name: "Dr. Arvind Saxena",
          role: "ADMIN",
          department: "CSO - Training Division",
          designation: "Director & Head of Capacity Building",
        },
        "rajesh.kumar@des.gov.in": {
          name: "Rajesh Kumar",
          role: "LEARNER",
          department: "DES Maharashtra",
          designation: "Assistant Director of Statistics",
        },
        "iss.officer@mospi.gov.in": {
          name: "Priya Sharma",
          role: "LEARNER",
          department: "NSSO - Field Operations Division",
          designation: "Senior Statistical Officer",
        },
        "anita.deshmukh@mospi.gov.in": {
          name: "Anita Deshmukh",
          role: "LEARNER",
          department: "MoSPI Data Innovation Lab",
          designation: "Junior Statistical Officer",
        },
      };

      const demoConfig = knownDemoAccounts[lowerEmail];
      if (demoConfig && (isDemoUser || !password)) {
        try {
          user = await prisma.user.create({
            data: {
              email: lowerEmail,
              name: demoConfig.name,
              role: demoConfig.role,
              department: demoConfig.department,
              designation: demoConfig.designation,
              employeeId: `EMP-${Date.now().toString().slice(-6)}`,
              passwordHash: "demo_user_authenticated",
              experienceLevel: demoConfig.role === "ADMIN" ? "Executive" : "Intermediate",
              onboardingCompleted: true,
              currentCourseId: "course_dsa",
              targetSkill: "Data Structures & Algorithms",
              primaryLearningGoal: "Data Structures & Algorithms",
            },
          });
        } catch (createErr) {
          console.warn("Could not auto-create demo user:", createErr);
        }
      }
    }

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
      onboardingCompleted: Boolean(user.onboardingCompleted),
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
      { error: error?.message || "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
