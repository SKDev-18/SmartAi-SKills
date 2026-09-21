import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE_URL = "http://localhost:3000";

function parseCookie(res) {
  const setCookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [res.headers.get("set-cookie")];
  for (const sc of setCookies) {
    if (sc) {
      const match = sc.match(/mospi_session_token=([^;]+)/);
      if (match) return match[1];
    }
  }
  return "";
}

async function runTests() {
  console.log("==================================================================");
  console.log("  NEXSTEP MULTI-USER ISOLATION & ZERO-PROGRESS TEST SUITE");
  console.log("==================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  PASS: ${message}`);
      passed++;
    } else {
      console.error(`  FAIL: ${message}`);
      failed++;
    }
  }

  const timestamp = Date.now();
  const userAEmail = `test_usera_${timestamp}@example.com`;
  const userBEmail = `test_userb_${timestamp}@example.com`;
  const password = "Password123!";

  // 1. SIGN UP USER A
  console.log("--- 1. Register & Setup User A ---");
  const signupARes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userAEmail,
      password: password,
      confirmPassword: password,
      name: "User A Test",
    }),
  });
  assert(signupARes.status === 201 || signupARes.status === 200, `User A signup status 200/201 (got ${signupARes.status})`);
  const tokenA = parseCookie(signupARes);
  assert(!!tokenA, "User A received mospi_session_token cookie");

  const cookieA = `mospi_session_token=${tokenA}`;

  // 2. SET USER A SKILLS (Java, Python, React)
  console.log("\n--- 2. Save User A Profile Skills (Java, Python, React) ---");
  const updateARes = await fetch(`${BASE_URL}/api/auth/onboarding`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieA,
    },
    body: JSON.stringify({
      name: "User A Test",
      branch: "Computer Engineering",
      year: "2nd Year",
      semester: "Semester 3",
      college: "Test Engineering College",
      graduationYear: "2026",
      skills: [
        { name: "Java", level: "Advanced" },
        { name: "Python", level: "Intermediate" },
        { name: "React", level: "Beginner" },
      ],
      learningGoals: ["Web Development", "Data Analytics"],
      primaryLearningGoal: "Web Development",
    }),
  });
  assert(updateARes.status === 200, `User A profile updated successfully (got ${updateARes.status})`);

  // Verify User A profile returns these skills
  const meARes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: cookieA },
  });
  const meAData = await meARes.json();
  let loadedSkillsA = {};
  if (meAData.user?.skills) {
    try {
      const parsed = typeof meAData.user.skills === "string" ? JSON.parse(meAData.user.skills) : meAData.user.skills;
      if (Array.isArray(parsed)) {
        parsed.forEach(s => { loadedSkillsA[s.name] = s.level; });
      }
    } catch {}
  }
  assert(loadedSkillsA.Java === "Advanced" && loadedSkillsA.Python === "Intermediate", `User A profile correctly persisted Java & Python (got ${JSON.stringify(loadedSkillsA)})`);

  // 3. LOG OUT USER A
  console.log("\n--- 3. Log Out User A (Cookie Clearing & Session Purge) ---");
  const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: { Cookie: cookieA },
  });
  assert(logoutRes.status === 200, `Logout endpoint returned 200 (got ${logoutRes.status})`);
  const logoutCookies = logoutRes.headers.getSetCookie ? logoutRes.headers.getSetCookie().join("; ") : (logoutRes.headers.get("set-cookie") || "");
  assert(logoutCookies.includes("Max-Age=0") || logoutCookies.includes("expires=") || logoutCookies.includes("mospi_session_token=;"), "Logout header explicitly deletes session cookie");

  // 4. SIGN UP BRAND NEW USER B
  console.log("\n--- 4. Register Brand New User B ---");
  const signupBRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userBEmail,
      password: password,
      confirmPassword: password,
      name: "User B Test",
    }),
  });
  assert(signupBRes.status === 201 || signupBRes.status === 200, `User B signup status 200/201 (got ${signupBRes.status})`);
  const tokenB = parseCookie(signupBRes);
  assert(!!tokenB, "User B received new unique mospi_session_token cookie");
  assert(tokenB !== tokenA, "User B token is different from User A token");

  const cookieB = `mospi_session_token=${tokenB}`;

  // 5. VERIFY USER B HAS ZERO SKILLS LEAKED FROM USER A
  console.log("\n--- 5. Verify User B Has Completely Clean Profile (No Leaked Skills) ---");
  const meBRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: cookieB },
  });
  const meBData = await meBRes.json();
  let loadedSkillsB = {};
  if (meBData.user?.skills) {
    try {
      const parsed = typeof meBData.user.skills === "string" ? JSON.parse(meBData.user.skills) : meBData.user.skills;
      if (Array.isArray(parsed)) {
        parsed.forEach(s => { loadedSkillsB[s.name] = s.level; });
      }
    } catch {}
  }
  assert(!loadedSkillsB.Java, "User B does NOT have User A's Java skill");
  assert(!loadedSkillsB.Python, "User B does NOT have User A's Python skill");
  assert(!loadedSkillsB.React, "User B does NOT have User A's React skill");
  assert(Object.keys(loadedSkillsB).length === 0, `User B skills is completely empty (got ${JSON.stringify(loadedSkillsB)})`);

  // 6. VERIFY USER B LEARNING PROGRESS IS STRICTLY 0%
  console.log("\n--- 6. Verify User B Learning Progress Is Strictly 0% ---");
  const roadmapBRes = await fetch(`${BASE_URL}/api/roadmap`, {
    headers: { Cookie: cookieB },
  });
  assert(roadmapBRes.status === 200, `User B roadmap returned 200 (got ${roadmapBRes.status})`);
  const roadmapBData = await roadmapBRes.json();
  
  assert(roadmapBData.progressSummary?.percentage === 0, `User B progress percentage is strictly 0% (got ${roadmapBData.progressSummary?.percentage}%)`);
  assert(roadmapBData.progressSummary?.completed === 0, `User B completed topics count is strictly 0 (got ${roadmapBData.progressSummary?.completed})`);
  
  const completedBTopics = (roadmapBData.roadmap || []).filter(t => t.status === "COMPLETED" || t.status === "MASTERED");
  assert(completedBTopics.length === 0, `User B has 0 completed topics in roadmap (got ${completedBTopics.length})`);

  // 7. VERIFY USER B QUIZ ATTEMPTS ARE 0
  console.log("\n--- 7. Verify User B Quiz Attempts Are 0 ---");
  const quizzesBRes = await fetch(`${BASE_URL}/api/quizzes`, {
    headers: { Cookie: cookieB },
  });
  assert(quizzesBRes.status === 200, `User B quizzes returned 200 (got ${quizzesBRes.status})`);
  const quizzesBData = await quizzesBRes.json();
  assert((quizzesBData.recentAttempts || []).length === 0, `User B has 0 recent quiz attempts (got ${(quizzesBData.recentAttempts || []).length})`);

  // 8. LOG BACK IN AS USER A & VERIFY DATA INTEGRITY
  console.log("\n--- 8. Log Back In As User A & Verify Data Integrity ---");
  const loginARes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userAEmail,
      password: password,
    }),
  });
  assert(loginARes.status === 200, `User A re-login returned 200 (got ${loginARes.status})`);
  const tokenARelogin = parseCookie(loginARes);
  const cookieARelogin = `mospi_session_token=${tokenARelogin}`;

  const meAReturnRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: cookieARelogin },
  });
  const meAReturnData = await meAReturnRes.json();
  let returnedSkillsA = {};
  if (meAReturnData.user?.skills) {
    try {
      const parsed = typeof meAReturnData.user.skills === "string" ? JSON.parse(meAReturnData.user.skills) : meAReturnData.user.skills;
      if (Array.isArray(parsed)) {
        parsed.forEach(s => { returnedSkillsA[s.name] = s.level; });
      }
    } catch {}
  }
  assert(returnedSkillsA.Java === "Advanced", "User A still has Java: Advanced intact");
  assert(returnedSkillsA.Python === "Intermediate", "User A still has Python: Intermediate intact");

  console.log("\n==================================================================");
  console.log(`  RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================================\n");

  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
