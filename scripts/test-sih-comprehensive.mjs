/**
 * test-sih-comprehensive.mjs
 * End-to-End automated validation for SIH 2026 Engineering Platform
 * Tests Demo Flow 1 (Data Analytics) and Demo Flow 2 (DSA + Multi-Path Switching)
 */

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("=================================================================");
  console.log("🚀 STARTING SIH 2026 END-TO-END AUTOMATED VERIFICATION");
  console.log("=================================================================\n");

  let testPassed = 0;
  let testFailed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      testPassed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      testFailed++;
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // Helper to maintain cookies across requests
  class SessionClient {
    constructor() {
      this.cookies = new Map();
    }

    async fetch(url, options = {}) {
      const headers = { ...(options.headers || {}) };
      if (this.cookies.size > 0) {
        const cookieStr = Array.from(this.cookies.entries())
          .map(([k, v]) => `${k}=${v}`)
          .join("; ");
        headers["Cookie"] = cookieStr;
      }

      const res = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
      });

      // Handle set-cookie headers
      let rawCookies = [];
      if (typeof res.headers.getSetCookie === "function") {
        rawCookies = res.headers.getSetCookie();
      } else {
        const sc = res.headers.get("set-cookie");
        if (sc) rawCookies = [sc];
      }

      for (const c of rawCookies) {
        const firstPart = c.split(";")[0];
        const eqIdx = firstPart.indexOf("=");
        if (eqIdx !== -1) {
          const k = firstPart.slice(0, eqIdx).trim();
          const v = firstPart.slice(eqIdx + 1).trim();
          this.cookies.set(k, v);
        }
      }

      return res;
    }

    async get(url) {
      return this.fetch(url, { method: "GET" });
    }

    async post(url, data) {
      return this.fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
  }

  /* -----------------------------------------------------------------
     FLOW 1: DATA ANALYTICS STUDENT
     ----------------------------------------------------------------- */
  console.log("-----------------------------------------------------------------");
  console.log("📌 FLOW 1: DATA ANALYTICS STUDENT (PRIMARY SIH DEMO)");
  console.log("-----------------------------------------------------------------");

  const student1 = new SessionClient();
  const timestamp = Date.now();
  const email1 = `sih_data_analyst_${timestamp}@engineering.edu`;
  const password = "Password@123";

  // Step 0: Sign up
  console.log("\n[1] Registering New Engineering Student (/api/auth/signup)...");
  const signupRes = await student1.post("/api/auth/signup", {
    name: "Rohan Deshmukh",
    email: email1,
    password,
    confirmPassword: password,
  });
  const signupData = await signupRes.json();
  assert(signupRes.ok, "Student account created successfully");
  assert(signupData.user?.email === email1, "User email registered in session");

  // Step 1: Basic Profile Details (Mobile, DOB, Gender)
  console.log("\n[2] Submitting Step 1: Basic Profile...");
  const step1Res = await student1.post("/api/auth/onboarding", {
    step: 1,
    name: "Rohan Deshmukh",
    dob: "2004-05-15",
    mobile: "+91 9823012345",
    gender: "Male",
  });
  assert(step1Res.ok, "Step 1 basic details saved");

  // Step 2: Engineering Profile (Branch, Year, College)
  console.log("\n[3] Submitting Step 2: Engineering Profile...");
  const step2Res = await student1.post("/api/auth/onboarding", {
    step: 2,
    branch: "Computer Engineering",
    year: "2nd Year",
    semester: "Semester 3",
    college: "Pune Institute of Computer Technology",
    graduationYear: "2026",
  });
  assert(step2Res.ok, "Step 2 engineering profile saved");

  // Step 3: Prior Skills (C++ Intermediate, Python Intermediate)
  console.log("\n[4] Submitting Step 3: Current Skills (Prior Knowledge)...");
  const step3Res = await student1.post("/api/auth/onboarding", {
    step: 3,
    skills: [
      { name: "C++", level: "Intermediate" },
      { name: "Python", level: "Intermediate" },
    ],
  });
  assert(step3Res.ok, "Step 3 prior skills saved");

  // Step 4: Learning Goals (Data Analytics Primary, Python, Database Management)
  console.log("\n[5] Submitting Step 4: Learning Goals & Primary Goal...");
  const step4Res = await student1.post("/api/auth/onboarding", {
    step: 4,
    learningGoals: ["Data Analytics", "Python", "Database Management"],
    primaryLearningGoal: "Data Analytics",
  });
  assert(step4Res.ok, "Step 4 learning goals and primary focus saved");

  // Step 5: Referral Source & Finalize Personalization
  console.log("\n[6] Submitting Step 5: Personalization & Referral Source...");
  const step5Res = await student1.post("/api/auth/onboarding", {
    step: 5,
    referralSource: "College Professor / Mentor",
    finishSetup: true,
  });
  assert(step5Res.ok, "Step 5 finalized and personalized roadmap generated");

  // Verify User Session Profile
  console.log("\n[7] Verifying User Profile & Active Path (/api/auth/me)...");
  const meRes = await student1.get("/api/auth/me");
  const meData = await meRes.json();
  assert(meData.user.primaryLearningGoal === "Data Analytics", "Primary learning goal is Data Analytics");
  assert(meData.user.currentCourseId === "data-analytics", "Active course is data-analytics");
  const parsedGoals = JSON.parse(meData.user.learningGoals);
  assert(parsedGoals.includes("Data Analytics") && parsedGoals.includes("Python"), "Goals array includes all selections");

  // Verify Roadmap recognizes prior skills (Python Basics skipped / existing skill)
  console.log("\n[8] Verifying Adaptive Roadmap for Data Analytics (/api/roadmap)...");
  const roadmapRes = await student1.get("/api/roadmap");
  const roadmapData = await roadmapRes.json();
  assert(roadmapData.course?.slug === "data-analytics", "Roadmap is for Data Analytics course");
  assert(roadmapData.roadmap?.length > 0, "Topics retrieved in roadmap");

  const pythonBasicsTopic = roadmapData.roadmap.find((t) => t.slug === "python-basics");
  assert(pythonBasicsTopic !== undefined, "Found Python Basics topic in curriculum");
  assert(pythonBasicsTopic.isExistingSkill === true, "Python Basics is marked as ✓ Existing Skill");
  assert(pythonBasicsTopic.status === "COMPLETED", "Python Basics status is COMPLETED due to prior knowledge");

  const pandasTopic = roadmapData.roadmap.find((t) => t.slug === "pandas");
  assert(pandasTopic !== undefined, "Found Pandas DataFrame topic in curriculum");
  console.log(`  ℹ️ Pandas Topic Status: ${pandasTopic.status} (Ready to Learn)`);

  // Verify Topic Details (Notes, Curated Videos, 30-Question Quiz)
  console.log("\n[9] Loading Pandas Topic Details (/api/topics/pandas)...");
  const topicRes = await student1.get("/api/topics/pandas");
  const topicData = await topicRes.json();
  assert(topicRes.ok, "Pandas topic fetched successfully");
  assert(topicData.topic?.notesContent?.length > 50, "Comprehensive notes present");
  assert(topicData.topic?.videos?.length > 0, "Curated YouTube lectures attached");
  assert(topicData.topic?.quiz?.id === "pandas-basics-quiz", "30-Question Pandas quiz attached");

  const firstVideo = topicData.topic.videos[0];
  console.log(`  ℹ️ Found Curated Video: "${firstVideo.title}" (ID: ${firstVideo.id}, YouTube: ${firstVideo.youtubeUrl})`);

  // Verify Embedded Video Progress API
  console.log("\n[10] Testing Video Learning Progress API (/api/videos/:id/progress)...");
  const videoProgressRes = await student1.post(`/api/videos/${firstVideo.id}/progress`, {
    watchStatus: "COMPLETED",
  });
  const videoProgressData = await videoProgressRes.json();
  assert(videoProgressRes.ok, "Video completion recorded successfully");
  assert(videoProgressData.success === true, "Video progress marked complete in DB");

  // Verify 30-Question Quiz API
  console.log("\n[11] Loading 30-Question Assessment (/api/quizzes/pandas-basics-quiz)...");
  const quizRes = await student1.get("/api/quizzes/pandas-basics-quiz");
  const quizData = await quizRes.json();
  assert(quizRes.ok, "Quiz fetched successfully");
  assert(quizData.quiz?.questions?.length === 30, "Quiz has exactly 30 questions");

  // Test Tier 1: Score < 60% (RELEARN)
  console.log("\n[12] Testing Quiz Tier: Score < 60% (Adaptive RELEARN)...");
  const lowScoreAnswers = {};
  const questions = quizData.quiz.questions;
  // Answer with wrong option
  for (let i = 0; i < questions.length; i++) {
    lowScoreAnswers[questions[i].id] = "Z_WRONG";
  }

  const lowSubmitRes = await student1.post("/api/quizzes/pandas-basics-quiz/submit", {
    answers: lowScoreAnswers,
  });
  const lowSubmitData = await lowSubmitRes.json();
  assert(lowSubmitRes.ok, "Low-score quiz submitted successfully");
  console.log(`  ℹ️ Score: ${lowSubmitData.score}/${lowSubmitData.totalQuestions} (${lowSubmitData.percentage}%), Tier: ${lowSubmitData.progression?.tier}`);
  assert(lowSubmitData.percentage < 60, "Score is under 60%");
  assert(lowSubmitData.progression?.tier === "RELEARN", "Tier is RELEARN");
  assert(lowSubmitData.progression?.unlockedNextTopic === false, "Next topic remains locked");

  // Test Tier 2: Score >= 80% (COMPLETED / MASTERED -> UNLOCK NEXT TOPIC)
  console.log("\n[13] Testing Quiz Tier: Score >= 80% (COMPLETED / UNLOCK NEXT TOPIC)...");
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  const dbQuestions = await prisma.quizQuestion.findMany({
    where: { quizId: "pandas-basics-quiz" },
    select: { id: true, correctAnswer: true },
  });

  const highScoreAnswers = {};
  // Answer 27 out of 30 correctly (90%)
  for (let i = 0; i < dbQuestions.length; i++) {
    const q = dbQuestions[i];
    highScoreAnswers[q.id] = i < 27 ? q.correctAnswer : (q.correctAnswer === "A" ? "B" : "A");
  }

  const highSubmitRes = await student1.post("/api/quizzes/pandas-basics-quiz/submit", {
    answers: highScoreAnswers,
  });
  const highSubmitData = await highSubmitRes.json();
  assert(highSubmitRes.ok, "High-score quiz submitted successfully");
  console.log(`  ℹ️ Score: ${highSubmitData.score}/${highSubmitData.totalQuestions} (${highSubmitData.percentage}%), Tier: ${highSubmitData.progression?.tier}`);
  assert(highSubmitData.percentage >= 80, "Score is >= 80%");
  assert(highSubmitData.progression?.unlockedNextTopic === true, "Next topic is successfully unlocked!");

  // Verify next topic is unlocked in the roadmap
  const updatedRoadmapRes = await student1.get("/api/roadmap");
  const updatedRoadmapData = await updatedRoadmapRes.json();
  const nextTopicAfterPandas = updatedRoadmapData.roadmap.find((t) => t.slug === "data-cleaning");
  if (nextTopicAfterPandas) {
    assert(nextTopicAfterPandas.status === "AVAILABLE" || nextTopicAfterPandas.status === "IN_PROGRESS", "Data Cleaning topic is now AVAILABLE/UNLOCKED!");
  }

  /* -----------------------------------------------------------------
     FLOW 2: MULTI-COURSE ENROLLMENT & ACTIVE PATH SWITCHING
     ----------------------------------------------------------------- */
  console.log("\n-----------------------------------------------------------------");
  console.log("📌 FLOW 2: MULTI-COURSE ENROLLMENT & PATH SWITCHING (DSA -> Web Dev)");
  console.log("-----------------------------------------------------------------");

  const student2 = new SessionClient();
  const email2 = `sih_dsa_student_${timestamp}@engineering.edu`;

  console.log("\n[14] Registering DSA Student...");
  await student2.post("/api/auth/signup", {
    name: "Ananya Iyer",
    email: email2,
    password,
    confirmPassword: password,
  });

  await student2.post("/api/auth/onboarding", {
    step: 4,
    learningGoals: ["Data Structures & Algorithms", "Web Development"],
    primaryLearningGoal: "Data Structures & Algorithms",
    finishSetup: true,
  });

  const dsaRoadmapRes = await student2.get("/api/roadmap");
  const dsaRoadmapData = await dsaRoadmapRes.json();
  assert(dsaRoadmapData.course?.slug === "dsa", "DSA student's initial active roadmap is DSA");

  // Complete first DSA topic (Linked List)
  console.log("\n[15] Completing DSA Topic to create verified progress...");
  const linkedListTopic = dsaRoadmapData.roadmap.find((t) => t.slug === "linked-list");
  if (linkedListTopic) {
    const noteRes = await student2.post(`/api/topics/${linkedListTopic.id}/progress`, { notesCompleted: true });
    assert(noteRes.ok, "Linked List topic notes marked complete");
    console.log("  ℹ️ Linked List topic notes marked complete");
  }

  // Switch Active Learning Path to Web Development
  console.log("\n[16] Switching Active Path to Web Development via /api/user/active-path...");
  const switchRes = await student2.post("/api/user/active-path", {
    courseSlug: "web-development",
  });
  const switchData = await switchRes.json();
  assert(switchRes.ok, "Path switched successfully");
  assert(switchData.activeCourseId === "web-development", "Active course updated to web-development");

  // Verify Web Development Roadmap renders
  const webRoadmapRes = await student2.get("/api/roadmap");
  const webRoadmapData = await webRoadmapRes.json();
  assert(webRoadmapData.course?.slug === "web-development", "Roadmap is now Web Development");
  assert(webRoadmapData.roadmap?.length > 0, "Web Development topics loaded");

  // Switch back to DSA and verify progress is preserved!
  console.log("\n[17] Switching Back to DSA to verify progress preservation...");
  await student2.post("/api/user/active-path", {
    courseSlug: "dsa",
  });

  const dsaRestoredRes = await student2.get("/api/roadmap");
  const dsaRestoredData = await dsaRestoredRes.json();
  assert(dsaRestoredData.course?.slug === "dsa", "Active course restored to DSA");
  const restoredLinkedList = dsaRestoredData.roadmap.find((t) => t.slug === "linked-list");
  assert(restoredLinkedList.notesCompleted === true, "DSA Linked List progress was preserved!");

  // Test Course Catalog & Enrollment API
  console.log("\n[18] Testing Catalog Enrollment API (/api/courses/enroll)...");
  const enrollRes = await student2.post("/api/courses/enroll", {
    courseSlug: "cloud-devops",
  });
  const enrollData = await enrollRes.json();
  assert(enrollRes.ok, "Enrolled in Cloud Computing & DevOps");
  assert(enrollData.success === true, "Enrollment confirmed");

  const cloudRoadmapRes = await student2.get("/api/roadmap");
  const cloudRoadmapData = await cloudRoadmapRes.json();
  assert(cloudRoadmapData.course?.slug === "cloud-devops", "Active course switched to newly enrolled Cloud & DevOps");

  await prisma.$disconnect();

  console.log("\n=================================================================");
  console.log(`🎉 ALL SIH VERIFICATIONS PASSED! (${testPassed} passed, ${testFailed} failed)`);
  console.log("=================================================================\n");
}

runTests().catch((err) => {
  console.error("\n❌ TEST SUITE FAILED WITH ERROR:", err);
  process.exit(1);
});
