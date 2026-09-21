/**
 * test-switcher-and-quizzes.mjs
 * End-to-end verification for:
 * 1. Instant Learning-Path Switcher with progress preservation across paths
 * 2. Quiz Loading Reliability, Error Handling, and Attempt Recovery
 */

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("=================================================================");
  console.log("🧪 VERIFYING LEARNING-PATH SWITCHER & QUIZ RELIABILITY");
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

  // Session client helper
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
     SECTION 1: INSTANT LEARNING-PATH SWITCHER & PROGRESS PRESERVATION
     ----------------------------------------------------------------- */
  console.log("-----------------------------------------------------------------");
  console.log("📌 PART 1: INSTANT LEARNING-PATH SWITCHER & PROGRESS PRESERVATION");
  console.log("-----------------------------------------------------------------");

  const student = new SessionClient();
  const timestamp = Date.now();
  const email = `sih_switcher_test_${timestamp}@test.edu`;
  const password = "Password@123";

  // Create student
  console.log("\n[1] Registering Student with multiple engineering paths...");
  const signupRes = await student.post("/api/auth/signup", {
    name: "Vikram Sengupta",
    email,
    password,
    confirmPassword: password,
  });
  assert(signupRes.ok, "Student created");

  await student.post("/api/auth/onboarding", {
    step: 4,
    learningGoals: ["Data Analytics", "Data Structures & Algorithms", "Web Development"],
    primaryLearningGoal: "Data Analytics",
    finishSetup: true,
  });

  // Verify initial roadmap is Data Analytics
  console.log("\n[2] Verifying initial active path is Data Analytics...");
  const initialRoadmapRes = await student.get("/api/roadmap");
  const initialRoadmap = await initialRoadmapRes.json();
  assert(initialRoadmap.course?.slug === "data-analytics", "Active roadmap is Data Analytics");

  // Switch to DSA
  console.log("\n[3] Switching Active Path to DSA via /api/user/active-path...");
  const t0 = Date.now();
  const switchDsaRes = await student.post("/api/user/active-path", { courseSlug: "dsa" });
  const switchTimeMs = Date.now() - t0;
  const switchDsa = await switchDsaRes.json();
  assert(switchDsaRes.ok, `Switch to DSA returned 200 OK (${switchTimeMs}ms)`);
  assert(switchDsa.activeCourseId === "dsa", "Active course updated to dsa");

  const dsaRoadmapRes = await student.get("/api/roadmap");
  const dsaRoadmap = await dsaRoadmapRes.json();
  assert(dsaRoadmap.course?.slug === "dsa", "Roadmap is now DSA");

  // Record progress on DSA topic
  console.log("\n[4] Recording progress on DSA topic (Linked List notes)...");
  const linkedListTopic = dsaRoadmap.roadmap.find((t) => t.slug === "linked-list");
  assert(linkedListTopic !== undefined, "Found Linked List in DSA roadmap");

  const progressRes = await student.post(`/api/topics/${linkedListTopic.id}/progress`, {
    notesCompleted: true,
  });
  assert(progressRes.ok, "Linked List notes marked complete");

  // Switch to Web Development
  console.log("\n[5] Switching Active Path to Web Development...");
  const switchWebRes = await student.post("/api/user/active-path", { courseSlug: "web-development" });
  assert(switchWebRes.ok, "Switch to Web Development succeeded");

  const webRoadmapRes = await student.get("/api/roadmap");
  const webRoadmap = await webRoadmapRes.json();
  assert(webRoadmap.course?.slug === "web-development", "Roadmap is now Web Development");

  // Switch back to Data Analytics
  console.log("\n[6] Switching back to Data Analytics...");
  const switchDaRes = await student.post("/api/user/active-path", { courseSlug: "data-analytics" });
  assert(switchDaRes.ok, "Switch back to Data Analytics succeeded");

  const daRoadmapRes = await student.get("/api/roadmap");
  const daRoadmap = await daRoadmapRes.json();
  assert(daRoadmap.course?.slug === "data-analytics", "Roadmap restored to Data Analytics");

  // Switch back to DSA and verify progress is 100% PRESERVED!
  console.log("\n[7] Switching back to DSA to verify progress preservation...");
  const switchBackDsaRes = await student.post("/api/user/active-path", { courseSlug: "dsa" });
  assert(switchBackDsaRes.ok, "Switch back to DSA succeeded");

  const restoredDsaRes = await student.get("/api/roadmap");
  const restoredDsa = await restoredDsaRes.json();
  assert(restoredDsa.course?.slug === "dsa", "Roadmap is DSA again");
  const restoredTopic = restoredDsa.roadmap.find((t) => t.slug === "linked-list");
  assert(restoredTopic.notesCompleted === true, "DSA Linked List progress was 100% preserved across path switches!");

  /* -----------------------------------------------------------------
     SECTION 2: QUIZ RELIABILITY, ERROR HANDLING & RETRY SUPPORT
     ----------------------------------------------------------------- */
  console.log("\n-----------------------------------------------------------------");
  console.log("📌 PART 2: QUIZ LOADING RELIABILITY & ERROR HANDLING");
  console.log("-----------------------------------------------------------------");

  // 1. Valid 30-Question Quiz: Pandas
  console.log("\n[8] Loading Pandas 30-Question Quiz (/api/quizzes/pandas-basics-quiz)...");
  const pandasQuizRes = await student.get("/api/quizzes/pandas-basics-quiz");
  const pandasQuiz = await pandasQuizRes.json();
  assert(pandasQuizRes.ok, "Pandas quiz returned 200 OK");
  assert(pandasQuiz.quiz?.questions?.length === 30, "Pandas quiz has 30 questions");

  // 2. Valid 30-Question Quiz: Linked List
  console.log("\n[9] Loading Linked List 30-Question Quiz (/api/quizzes/linked-list-quiz)...");
  const llQuizRes = await student.get("/api/quizzes/linked-list-quiz");
  const llQuiz = await llQuizRes.json();
  assert(llQuizRes.ok, "Linked List quiz returned 200 OK");
  assert(llQuiz.quiz?.questions?.length === 30, "Linked List quiz has 30 questions");

  // 3. Query via topic slug alias: "pandas"
  console.log("\n[10] Loading Quiz via topic slug alias (/api/quizzes/pandas)...");
  const aliasQuizRes = await student.get("/api/quizzes/pandas");
  const aliasQuiz = await aliasQuizRes.json();
  assert(aliasQuizRes.ok, "Quiz resolved successfully via topic slug");
  assert(aliasQuiz.quiz?.questions?.length > 0, "Questions returned for topic slug");

  // 4. Test Invalid / Non-existent Quiz ID (Clean 404, no infinite loading)
  console.log("\n[11] Testing non-existent quiz (/api/quizzes/non-existent-quiz-xyz)...");
  const invalidQuizRes = await student.get("/api/quizzes/non-existent-quiz-xyz");
  const invalidQuizData = await invalidQuizRes.json();
  assert(invalidQuizRes.status === 404, "Returns clean 404 status code (not 500 or hang)");
  assert(typeof invalidQuizData.error === "string" && invalidQuizData.error.length > 5, "Returns user-friendly error message for Retry UI");

  // 5. Submit Quiz & Test Attempt Recovery API
  console.log("\n[12] Submitting Quiz and testing Attempt Retrieval API (/api/quizzes/attempts/:id)...");
  const submitRes = await student.post("/api/quizzes/pandas-basics-quiz/submit", {
    answers: {},
  });
  const submitData = await submitRes.json();
  assert(submitRes.ok, "Quiz submitted successfully");
  assert(submitData.attemptId !== undefined, "Quiz attempt ID generated");

  // Fetch Attempt by ID (simulating result page refresh or direct link without sessionStorage)
  console.log(`\n[13] Fetching Quiz Attempt by ID (/api/quizzes/attempts/${submitData.attemptId})...`);
  const attemptRes = await student.get(`/api/quizzes/attempts/${submitData.attemptId}`);
  const attemptData = await attemptRes.json();
  assert(attemptRes.ok, "Attempt fetched successfully from database");
  assert(attemptData.attemptId === submitData.attemptId, "Returned matching attempt ID");
  assert(attemptData.totalQuestions === 30, "Correct question count in attempt record");
  assert(attemptData.progression !== null, "Progression evaluation included in attempt record");

  // 6. Test Non-existent Attempt ID (Clean 404)
  console.log("\n[14] Testing non-existent attempt ID (/api/quizzes/attempts/invalid-attempt-999)...");
  const invalidAttRes = await student.get("/api/quizzes/attempts/invalid-attempt-999");
  assert(invalidAttRes.status === 404, "Invalid attempt returns 404 error cleanly");

  // 7. Test Quizzes List API
  console.log("\n[15] Testing Quizzes Catalog API (/api/quizzes)...");
  const listRes = await student.get("/api/quizzes");
  const listData = await listRes.json();
  assert(listRes.ok, "Quizzes list returned 200 OK");
  assert(Array.isArray(listData.quizzes) && listData.quizzes.length >= 2, "Returns published quizzes list");

  console.log("\n=================================================================");
  console.log(`🎉 ALL VERIFICATIONS PASSED! (${testPassed} passed, ${testFailed} failed)`);
  console.log("=================================================================\n");
}

runTests().catch((err) => {
  console.error("\n❌ TEST SUITE FAILED WITH ERROR:", err);
  process.exit(1);
});
