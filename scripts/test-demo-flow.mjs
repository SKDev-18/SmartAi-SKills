// Automated End-to-End Verification of Demo Flow (PRD §54)
import assert from "assert";

const BASE = "http://localhost:3000";

async function runVerification() {
  console.log("=================================================");
  console.log("STARTING PRD §54 DEMO FLOW & API VERIFICATION");
  console.log("=================================================");

  // 1. Admin Login
  console.log("\n[Step 1] Testing Admin Login...");
  const adminLoginRes = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@mospi.gov.in", password: "Password@123" }),
  });
  assert.strictEqual(adminLoginRes.status, 200, "Admin login should return 200");
  const adminLoginData = await adminLoginRes.json();
  assert.strictEqual(adminLoginData.user.role, "ADMIN", "Role should be ADMIN");
  const adminCookie = adminLoginRes.headers.get("set-cookie")?.split(";")[0] || "";
  console.log(`✓ Admin logged in successfully: ${adminLoginData.user.name} (${adminLoginData.user.role})`);

  // 2. Admin Analytics API
  console.log("\n[Step 2] Testing Admin Analytics API...");
  const analyticsRes = await fetch(`${BASE}/api/admin/analytics`, {
    headers: { Cookie: adminCookie },
  });
  assert.strictEqual(analyticsRes.status, 200, "Analytics should return 200");
  const analyticsData = await analyticsRes.json();
  console.log(`✓ Analytics loaded: Total Learners=${analyticsData.metrics.totalLearners}, Avg Competency=${analyticsData.metrics.averageCompetency}%`);
  console.log(`✓ Top Priorities Detected: ${analyticsData.topLearningPriorities.map(p => `${p.domain} (${p.averageScore}%)`).join(", ")}`);

  // 3. Admin Upload Learning Material & AI Document Analysis (PRD §20, §21)
  console.log("\n[Step 3] Testing Admin Upload Material & AI Document Analysis...");
  const uploadRes = await fetch(`${BASE}/api/admin/materials`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({
      title: "MoSPI National Accounts & Inflation Metrics Compendium",
      description: "Official guide on Gross Value Added (GVA), Consumer Price Index (CPI), and Wholesale Price Index (WPI).",
      fileName: "National_Accounts_and_CPI_2024.pdf",
      rawContent: `
CHAPTER 2: COMPILATION OF NATIONAL ACCOUNTS AND PRICE INDICES
Central Statistics Office (CSO), Ministry of Statistics and Programme Implementation

1. Gross Domestic Product (GDP) and Gross Value Added (GVA):
In accordance with SNA 2008 standards, India measures national economic output using both GDP at market prices and GVA at basic prices. GVA at basic prices equals GDP at market prices minus net product taxes.

2. Consumer Price Index (CPI) Compilation Framework:
The All India Consumer Price Index (Combined: Rural + Urban) is compiled monthly with base year 2012=100. Price data is collected across 1,181 village markets and 1,114 urban blocks by NSSO enumerators.

3. Index Number Formula:
MoSPI computes the Consumer Price Index using the Laspeyres base-weighted formula with geometric mean price relatives at elementary aggregate levels, ensuring statistical consistency and international comparability.
      `,
      topic: "Statistical Standards",
      difficulty: "INTERMEDIATE",
    }),
  });
  assert.strictEqual(uploadRes.status, 200, "Upload should return 200");
  const uploadData = await uploadRes.json();
  assert(uploadData.materialId, "Should return created materialId");
  console.log(`✓ Material ingested and analyzed by AI: ID=${uploadData.materialId}`);
  console.log(`✓ Extracted Topics: ${uploadData.analysis.topics.join(", ")}`);

  // 4. AI MCQ Generation from Ingested Material (PRD §22, §23, §24)
  console.log("\n[Step 4] Testing AI MCQ Generation & 8-Point Quality Validation...");
  const genRes = await fetch(`${BASE}/api/admin/ai/generate-mcqs`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({
      materialId: uploadData.materialId,
      topic: "Statistical Standards",
      numberOfQuestions: 3,
      difficulty: "MEDIUM",
    }),
  });
  assert.strictEqual(genRes.status, 200, "Generate MCQs should return 200");
  const genData = await genRes.json();
  assert(genData.questions.length > 0, "Should generate questions");
  console.log(`✓ Generated ${genData.questions.length} MCQs with 8-point automated validation audit.`);
  console.log(`  Sample Question: "${genData.questions[0].questionText}"`);
  console.log(`  Quality Score: ${genData.questions[0].qualityScore}%`);
  console.log(`  Source Reference: ${genData.questions[0].sourceReference}`);

  // 5. Admin Approves Generated Question & Publishes Quiz (PRD §25)
  console.log("\n[Step 5] Approving Question & Publishing Quiz...");
  const qId = genData.questions[0].id;
  const approveRes = await fetch(`${BASE}/api/admin/questions/${qId}/approve`, {
    method: "POST",
    headers: { Cookie: adminCookie },
  });
  assert.strictEqual(approveRes.status, 200, "Approve should return 200");

  const pubQuizRes = await fetch(`${BASE}/api/admin/quizzes/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({
      title: "National Accounts & CPI Verification Quiz",
      topic: "Statistical Standards",
      materialId: uploadData.materialId,
      questionIds: [qId],
      passPercentage: 70.0,
    }),
  });
  assert.strictEqual(pubQuizRes.status, 200, "Publish quiz should return 200");
  const pubQuizData = await pubQuizRes.json();
  console.log(`✓ Quiz published for learners: "${pubQuizData.quiz.title}" (ID: ${pubQuizData.quiz.id})`);

  // 6. Learner Login (Priya Sharma - ISS Officer)
  console.log("\n[Step 6] Testing Learner Login...");
  const learnerLoginRes = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "iss.officer@mospi.gov.in", password: "Password@123" }),
  });
  assert.strictEqual(learnerLoginRes.status, 200, "Learner login should return 200");
  const learnerData = await learnerLoginRes.json();
  const learnerCookie = learnerLoginRes.headers.get("set-cookie")?.split(";")[0] || "";
  console.log(`✓ Learner logged in: ${learnerData.user.name} (${learnerData.user.department})`);

  // 7. Learner Competency Profile & Gap Detection (PRD §9, §10, §14)
  console.log("\n[Step 7] Checking Learner Competency Profile & Priority Gaps...");
  const compMeRes = await fetch(`${BASE}/api/competencies/me`, {
    headers: { Cookie: learnerCookie },
  });
  assert.strictEqual(compMeRes.status, 200, "Competencies/me should return 200");
  const compMeData = await compMeRes.json();
  console.log(`✓ Overall Competency: ${compMeData.overallCompetency}%`);
  console.log(`✓ Priority Skill Gaps Detected:`);
  for (const gap of compMeData.priorityGaps) {
    console.log(`  - ${gap.name}: Current=${gap.currentScore}%, Target=${gap.requiredLevel}%, Gap=${gap.gap} pts, Status=${gap.status}`);
  }

  // 8. AI Recommendations Engine (PRD §11 & §48)
  console.log("\n[Step 8] Checking Personalized Recommendations with Justification...");
  const recRes = await fetch(`${BASE}/api/recommendations`, {
    headers: { Cookie: learnerCookie },
  });
  assert.strictEqual(recRes.status, 200, "Recommendations should return 200");
  const recData = await recRes.json();
  assert(recData.recommendations.length > 0, "Should have recommendations");
  const topRec = recData.recommendations[0];
  console.log(`✓ Top Recommendation: "${topRec.title}"`);
  console.log(`✓ Visible Why-Recommended Justification: "${topRec.reasonExplanation}"`);
  console.log(`✓ Source: ${topRec.source}, Duration: ${topRec.durationMinutes}m`);

  // 9. Learner Takes Quiz & Submits Answers (PRD §26, §27, §28)
  console.log("\n[Step 9] Submitting Quiz Attempt & Triggering AI Performance Analysis...");
  const quizzesRes = await fetch(`${BASE}/api/quizzes`, {
    headers: { Cookie: learnerCookie },
  });
  const quizzesData = await quizzesRes.json();
  const targetQuiz = quizzesData.quizzes.find((q) => q.title.includes("Sampling") || q.title.includes("National"));
  assert(targetQuiz, "Target quiz must exist");

  const quizDetailRes = await fetch(`${BASE}/api/quizzes/${targetQuiz.id}`, {
    headers: { Cookie: learnerCookie },
  });
  const quizDetail = await quizDetailRes.json();
  const sampleAnswers = {};
  for (const q of quizDetail.quiz.questions) {
    sampleAnswers[q.id] = "B"; // Choose option B
  }

  const submitRes = await fetch(`${BASE}/api/quizzes/${targetQuiz.id}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: learnerCookie },
    body: JSON.stringify({ answers: sampleAnswers }),
  });
  assert.strictEqual(submitRes.status, 200, "Quiz submit should return 200");
  const submitResult = await submitRes.json();
  console.log(`✓ Quiz Evaluated: Score = ${submitResult.score} / ${submitResult.totalQuestions} (${submitResult.percentage}%)`);
  console.log(`✓ What you did well: ${submitResult.analysis.strongCompetencies.join(", ")}`);
  console.log(`✓ AI Recommended Next Step: "${submitResult.analysis.recommendedNextStep}"`);
  if (submitResult.analysis.competencyDelta.length > 0) {
    console.log(`✓ Dynamic Database Competency Update:`);
    for (const d of submitResult.analysis.competencyDelta) {
      console.log(`  - ${d.competencyCode}: ${d.oldScore}% -> ${d.newScore}%`);
    }
  }

  // 10. AI Chat Assistant Grounded RAG (PRD §30)
  console.log("\n[Step 10] Testing AI Chat Assistant (RAG with citations)...");
  const chatRes = await fetch(`${BASE}/api/assistant/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: "What is stratified sampling?" }),
  });
  assert.strictEqual(chatRes.status, 200, "Chat assistant should return 200");
  const chatData = await chatRes.json();
  console.log(`✓ Answer: "${chatData.answer.slice(0, 140)}..."`);
  console.log(`✓ Citation: "${chatData.source}"`);

  console.log("\n=================================================");
  console.log("ALL 10 DEMO JOURNEY STEPS VERIFIED SUCCESSFULLY! ✓");
  console.log("=================================================\n");
}

runVerification().catch((err) => {
  console.error("\n❌ Verification Failed:", err);
  process.exit(1);
});
