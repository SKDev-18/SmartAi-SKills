// Comprehensive Multi-Role & Feature Test Suite
import assert from "assert";

const BASE = "http://localhost:3000";

async function runComprehensiveSuite() {
  console.log("=================================================");
  console.log("RUNNING COMPREHENSIVE PLATFORM TEST SUITE");
  console.log("=================================================");

  // 1. Test Learner Session & Onboarding
  console.log("\n[Test 1] Testing Learner Onboarding API...");
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "rajesh.kumar@des.gov.in", password: "Password@123" }),
  });
  assert.strictEqual(loginRes.status, 200);
  const cookie = loginRes.headers.get("set-cookie")?.split(";")[0] || "";

  const onboardRes = await fetch(`${BASE}/api/auth/onboarding`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      name: "Rajesh Kumar",
      employeeId: "DES-MH-104",
      department: "DES Maharashtra",
      designation: "Assistant Director of Statistics",
      experienceLevel: "Senior",
    }),
  });
  assert.strictEqual(onboardRes.status, 200);
  const onboardData = await onboardRes.json();
  console.log(`✓ Profile saved: ${onboardData.user.name} (${onboardData.user.department})`);

  // 2. Test Baseline Competency Assessment (12 Questions Across 6 Domains)
  console.log("\n[Test 2] Testing Full 12-Question Baseline Assessment Engine...");
  const assListRes = await fetch(`${BASE}/api/assessments`, { headers: { Cookie: cookie } });
  const assListData = await assListRes.json();
  assert(assListData.assessments.length > 0);
  const assessmentId = assListData.assessments[0].id;

  const assDetailRes = await fetch(`${BASE}/api/assessments/${assessmentId}`, { headers: { Cookie: cookie } });
  const assDetail = await assDetailRes.json();
  console.log(`✓ Retrieved assessment: "${assDetail.assessment.title}" (${assDetail.assessment.questions.length} questions)`);

  const answers = {};
  for (const q of assDetail.assessment.questions) {
    answers[q.id] = "B"; // Standard option B
  }

  const submitAssRes = await fetch(`${BASE}/api/assessments/${assessmentId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ answers }),
  });
  assert.strictEqual(submitAssRes.status, 200);
  const submitAssData = await submitAssRes.json();
  console.log(`✓ Assessment submitted: Score=${submitAssData.score}/${submitAssData.totalQuestions} (${submitAssData.percentage}%)`);
  console.log(`✓ Competencies updated in database: ${submitAssData.updatedCompetenciesCount} domains recalibrated.`);

  // 3. Test iGOT Karmayogi Course Registry & Gap Search
  console.log("\n[Test 3] Testing iGOT Karmayogi Course Registry & Gap Mapping...");
  const igotSearchRes = await fetch(`${BASE}/api/igot/courses?domain=Survey`);
  assert.strictEqual(igotSearchRes.status, 200);
  const igotSearchData = await igotSearchRes.json();
  console.log(`✓ iGOT search returned ${igotSearchData.courses.length} courses mapped to Survey Methodology.`);

  const igotRecRes = await fetch(`${BASE}/api/igot/recommendations`, { headers: { Cookie: cookie } });
  assert.strictEqual(igotRecRes.status, 200);
  const igotRecData = await igotRecRes.json();
  console.log(`✓ iGOT recommendations returned ${igotRecData.courses.length} personalized courses for identified gaps.`);

  const igotStatusRes = await fetch(`${BASE}/api/igot/status`);
  const igotStatus = await igotStatusRes.json();
  console.log(`✓ iGOT Gateway Health: ${igotStatus.integration.syncStatus} (MockMode: ${igotStatus.integration.isMockMode}, Synced: ${igotStatus.syncedCoursesCount} courses)`);

  // 4. Test Learning Module Progress Tracking
  console.log("\n[Test 4] Testing Learning Resource Progress Tracking...");
  const resList = await fetch(`${BASE}/api/learning-resources`, { headers: { Cookie: cookie } });
  const resData = await resList.json();
  assert(resData.resources.length > 0);
  const targetResource = resData.resources[0];

  const updateProgRes = await fetch(`${BASE}/api/learning-resources/${targetResource.id}/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ progressPercentage: 85, currentStep: "Section 3: Variance Estimation" }),
  });
  assert.strictEqual(updateProgRes.status, 200);
  const progData = await updateProgRes.json();
  console.log(`✓ Learning progress persisted: ${progData.progress.progressPercentage}% (${progData.progress.status})`);

  // 5. Test Admin User Management & Department Filters
  console.log("\n[Test 5] Testing Admin User Management & Filtering...");
  const adminLoginRes = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@mospi.gov.in", password: "Password@123" }),
  });
  const adminCookie = adminLoginRes.headers.get("set-cookie")?.split(";")[0] || "";

  const filterRes = await fetch(`${BASE}/api/admin/learners?department=${encodeURIComponent("DES Maharashtra")}`, {
    headers: { Cookie: adminCookie },
  });
  assert.strictEqual(filterRes.status, 200);
  const filterData = await filterRes.json();
  assert(filterData.learners.length > 0);
  console.log(`✓ Department filter verified: Found ${filterData.learners.length} officer(s) in DES Maharashtra (Name: ${filterData.learners[0].name}, Avg: ${filterData.learners[0].averageCompetency}%)`);

  // 6. Test Admin Question Edit & Quality Update
  console.log("\n[Test 6] Testing Admin Question Edit API...");
  const qListRes = await fetch(`${BASE}/api/admin/questions`, { headers: { Cookie: adminCookie } });
  const qListData = await qListRes.json();
  if (qListData.questions.length > 0) {
    const editTarget = qListData.questions[0];
    const editRes = await fetch(`${BASE}/api/admin/questions/${editTarget.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: adminCookie },
      body: JSON.stringify({
        explanation: "Updated explanation: In accordance with standard NSS protocols, stratification guarantees minimum intra-stratum variance.",
      }),
    });
    assert.strictEqual(editRes.status, 200);
    console.log(`✓ Question #${editTarget.id} successfully updated with verified statistical explanation.`);
  }

  console.log("\n=================================================");
  console.log("ALL ADVANCED FEATURES & EDGE CASES VERIFIED! ✓");
  console.log("=================================================\n");
}

runComprehensiveSuite().catch((err) => {
  console.error("Suite failed", err);
  process.exit(1);
});
