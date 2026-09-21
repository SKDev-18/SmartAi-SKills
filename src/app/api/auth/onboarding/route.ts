import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSessionUser, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { initializeStudentRoadmap } from "@/lib/roadmap";
import { goalNameToCourseSlug } from "@/lib/courses";
import { SessionUser } from "@/types";

export async function POST(req: NextRequest) {
  try {
    let sessionUser = await getSessionUser();
    const body = await req.json();
    const {
      step,
      name,
      dob,
      mobile,
      gender,
      branch,
      year,
      semester,
      college,
      graduationYear,
      skills,
      learningGoals,
      primaryLearningGoal,
      referralSource,
      finishSetup,
    } = body;

    const updateData: any = {};

    if (name) updateData.name = name.trim();
    if (dob) updateData.dob = dob;
    if (mobile) updateData.mobile = mobile;
    if (gender) updateData.gender = gender;
    if (branch) {
      updateData.branch = branch;
      updateData.department = branch;
    }
    if (year) updateData.year = year;
    if (semester) updateData.semester = semester;
    if (college) updateData.college = college;
    if (graduationYear) updateData.graduationYear = graduationYear;
    if (skills) {
      updateData.skills = typeof skills === "string" ? skills : JSON.stringify(skills);
    }
    if (learningGoals) {
      updateData.learningGoals =
        typeof learningGoals === "string" ? learningGoals : JSON.stringify(learningGoals);
    }
    if (primaryLearningGoal) {
      updateData.primaryLearningGoal = primaryLearningGoal;
      updateData.targetSkill = primaryLearningGoal;
      const slug = goalNameToCourseSlug(primaryLearningGoal);
      updateData.currentCourseId = slug;
    }
    if (referralSource) updateData.referralSource = referralSource;

    if (finishSetup) {
      updateData.onboardingCompleted = true;
    }

    // Resolve user in DB: by session ID, session email, body email, or mobile
    let dbUser = null;
    if (sessionUser?.id) {
      dbUser = await prisma.user.findUnique({ where: { id: sessionUser.id } });
    }
    if (!dbUser && sessionUser?.email) {
      dbUser = await prisma.user.findUnique({ where: { email: sessionUser.email.toLowerCase().trim() } });
    }
    if (!dbUser && body.email) {
      dbUser = await prisma.user.findUnique({ where: { email: body.email.toLowerCase().trim() } });
    }
    if (!dbUser && mobile) {
      dbUser = await prisma.user.findFirst({ where: { mobile: mobile } });
    }

    if (dbUser) {
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: updateData,
      });
    } else {
      // Auto-provision student account so direct visitors or new signups never get blocked
      const cleanMobile = (mobile || "").replace(/\D/g, "");
      const generatedEmail =
        body.email?.trim()?.toLowerCase() ||
        (cleanMobile ? `${cleanMobile}@student.nexstep.ai` : `student_${Date.now()}@student.nexstep.ai`);

      const existingByEmail = await prisma.user.findUnique({ where: { email: generatedEmail } });
      if (existingByEmail) {
        dbUser = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: updateData,
        });
      } else {
        dbUser = await prisma.user.create({
          data: {
            email: generatedEmail,
            name: updateData.name || "Student",
            employeeId: `STU-${Date.now().toString().slice(-6)}`,
            passwordHash: "session_authenticated",
            role: "LEARNER",
            department: updateData.branch || "Computer Engineering",
            designation: "Engineering Student",
            experienceLevel: "Beginner",
            ...updateData,
          },
        });
      }
    }

    const updatedUser = dbUser;

    // Initialize roadmap for active learning path & all chosen goals
    if (finishSetup || skills || learningGoals || primaryLearningGoal) {
      try {
        let parsedSkills: any[] = [];
        if (skills) {
          parsedSkills = Array.isArray(skills) ? skills : typeof skills === "string" ? JSON.parse(skills) : [];
        } else if (updatedUser.skills) {
          try {
            parsedSkills = JSON.parse(updatedUser.skills);
          } catch {}
        }

        const activeSlug =
          (updatedUser.primaryLearningGoal ? goalNameToCourseSlug(updatedUser.primaryLearningGoal) : null) ||
          updatedUser.currentCourseId ||
          "dsa";

        await initializeStudentRoadmap(updatedUser.id, parsedSkills, activeSlug);

        // Initialize any other selected learning goals so their roadmaps and progress exist
        if (updatedUser.learningGoals) {
          try {
            const goals: string[] = JSON.parse(updatedUser.learningGoals);
            for (const g of goals) {
              const s = goalNameToCourseSlug(g);
              if (s !== activeSlug) {
                await initializeStudentRoadmap(updatedUser.id, parsedSkills, s);
              }
            }
          } catch {}
        }
      } catch (roadmapErr) {
        console.warn("[Onboarding] Non-critical roadmap initialization warning:", roadmapErr);
      }
    }

    const sessionPayload: SessionUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      employeeId: updatedUser.employeeId,
      department: updatedUser.department,
      designation: updatedUser.designation,
      experienceLevel: updatedUser.experienceLevel,
      role: updatedUser.role as "LEARNER" | "ADMIN",
      onboardingCompleted: updatedUser.onboardingCompleted,
      primaryLearningGoal: updatedUser.primaryLearningGoal || undefined,
      targetSkill: updatedUser.targetSkill || undefined,
      currentCourseId: updatedUser.currentCourseId || undefined,
      skills: updatedUser.skills || undefined,
      learningGoals: updatedUser.learningGoals || undefined,
      branch: updatedUser.branch || undefined,
    };

    const token = createSessionToken(sessionPayload);

    const response = NextResponse.json({
      success: true,
      user: updatedUser,
      stepCompleted: step,
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
  } catch (error: any) {
    console.error("Onboarding update error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save profile information." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
