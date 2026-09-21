import assert from "node:assert";

const BASE_URL = process.env.TEST_URL || "http://localhost:3000";

async function postJson(url, body, cookie = "") {
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  const setCookie = res.headers.get("set-cookie") || "";
  return { status: res.status, data, setCookie, res };
}

async function getJson(url, cookie = "") {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: {
      ...(cookie ? { Cookie: cookie } : {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data, res };
}

function extractSessionCookie(setCookieHeader) {
  if (!setCookieHeader) return "";
  const match = setCookieHeader.match(/mospi_session_token=([^;]+)/);
  return match ? `mospi_session_token=${match[1]}` : "";
}

async function runTest() {
  console.log("==================================================================");
  console.log("?? TESTING APP DEVELOPMENT PERSONALIZATION & MULTI-USER ISOLATION");
  console.log("==================================================================");

  const timestamp = Date.now();

  // 1. User A selects "App Development"
  const userAEmail = `user_appdev_${timestamp}@nexstep.ai`;
  console.log(`\n[Step 1] Registering User A (${userAEmail}) with goal 'App Development'...`);
  
  const regA = await postJson("/api/auth/signup", {
    name: "Alex Mobile",
    email: userAEmail,
    password: "Password123!",
    confirmPassword: "Password123!",
  });
  assert.ok(regA.status === 201 || regA.status === 200, `User A registration failed: ${JSON.stringify(regA.data)}`);
  const cookieA = extractSessionCookie(regA.setCookie);

  // Complete onboarding for User A with App Development
  const onboardA = await postJson("/api/auth/onboarding", {
    step: 4,
    learningGoals: ["App Development"],
    primaryLearningGoal: "App Development",
    finishSetup: true,
  }, cookieA);
  assert.strictEqual(onboardA.status, 200, "User A onboarding failed");

  // Check User A's roadmap
  const roadmapA = await getJson("/api/roadmap", cookieA);
  assert.strictEqual(roadmapA.status, 200, "Failed to load User A roadmap");
  assert.ok(roadmapA.data.course, "User A roadmap has no course");
  console.log(`? User A course title: "${roadmapA.data.course.title}" (slug: ${roadmapA.data.course.slug})`);
  assert.strictEqual(roadmapA.data.course.slug, "app-development", `Expected app-development, got ${roadmapA.data.course.slug}`);
  
  // Verify topics are mobile development, not web development
  const topicSlugsA = roadmapA.data.roadmap.map(t => t.slug);
  console.log("? User A topics:", topicSlugsA);
  assert.ok(topicSlugsA.includes("kotlin-android"), "User A should have kotlin-android topic");
  assert.ok(topicSlugsA.includes("android-compose"), "User A should have android-compose topic");
  assert.ok(topicSlugsA.includes("flutter-dart"), "User A should have flutter-dart topic");
  assert.ok(topicSlugsA.includes("firebase-mobile"), "User A should have firebase-mobile topic");
  assert.ok(topicSlugsA.includes("app-deployment"), "User A should have app-deployment topic");
  assert.ok(!topicSlugsA.includes("html"), "User A must NOT have html topic");
  assert.ok(!topicSlugsA.includes("css"), "User A must NOT have css topic");

  // 2. User B selects "Web Development"
  const userBEmail = `user_webdev_${timestamp}@nexstep.ai`;
  console.log(`\n[Step 2] Registering User B (${userBEmail}) with goal 'Web Development'...`);
  
  const regB = await postJson("/api/auth/signup", {
    name: "Beth Web",
    email: userBEmail,
    password: "Password123!",
    confirmPassword: "Password123!",
  });
  assert.ok(regB.status === 201 || regB.status === 200, `User B registration failed: ${JSON.stringify(regB.data)}`);
  const cookieB = extractSessionCookie(regB.setCookie);

  const onboardB = await postJson("/api/auth/onboarding", {
    step: 4,
    learningGoals: ["Web Development"],
    primaryLearningGoal: "Web Development",
    finishSetup: true,
  }, cookieB);
  assert.strictEqual(onboardB.status, 200, "User B onboarding failed");

  const roadmapB = await getJson("/api/roadmap", cookieB);
  assert.strictEqual(roadmapB.status, 200, "Failed to load User B roadmap");
  assert.strictEqual(roadmapB.data.course.slug, "web-development", `Expected web-development, got ${roadmapB.data.course.slug}`);
  const topicSlugsB = roadmapB.data.roadmap.map(t => t.slug);
  console.log("? User B topics:", topicSlugsB);
  assert.ok(topicSlugsB.includes("html"), "User B should have html topic");
  assert.ok(topicSlugsB.includes("frontend-react"), "User B should have frontend-react topic");
  assert.ok(!topicSlugsB.includes("kotlin-android"), "User B must NOT have kotlin-android topic");

  // 3. User C selects "Data Analytics"
  const userCEmail = `user_data_${timestamp}@nexstep.ai`;
  console.log(`\n[Step 3] Registering User C (${userCEmail}) with goal 'Data Analytics'...`);
  
  const regC = await postJson("/api/auth/signup", {
    name: "Charlie Data",
    email: userCEmail,
    password: "Password123!",
    confirmPassword: "Password123!",
  });
  assert.ok(regC.status === 201 || regC.status === 200, `User C registration failed: ${JSON.stringify(regC.data)}`);
  const cookieC = extractSessionCookie(regC.setCookie);

  const onboardC = await postJson("/api/auth/onboarding", {
    step: 4,
    learningGoals: ["Data Analytics"],
    primaryLearningGoal: "Data Analytics",
    finishSetup: true,
  }, cookieC);
  assert.strictEqual(onboardC.status, 200, "User C onboarding failed");

  const roadmapC = await getJson("/api/roadmap", cookieC);
  assert.strictEqual(roadmapC.status, 200, "Failed to load User C roadmap");
  assert.strictEqual(roadmapC.data.course.slug, "data-analytics", `Expected data-analytics, got ${roadmapC.data.course.slug}`);
  const topicSlugsC = roadmapC.data.roadmap.map(t => t.slug);
  console.log("? User C topics:", topicSlugsC);
  assert.ok(topicSlugsC.includes("pandas"), "User C should have pandas topic");
  assert.ok(!topicSlugsC.includes("kotlin-android"), "User C must NOT have kotlin-android topic");
  assert.ok(!topicSlugsC.includes("html"), "User C must NOT have html topic");

  // 4. Verify User A is completely isolated and still has App Development
  console.log("\n[Step 4] Verifying User A retains App Development after User B & C logged in...");
  const roadmapARecheck = await getJson("/api/roadmap", cookieA);
  assert.strictEqual(roadmapARecheck.data.course.slug, "app-development");
  console.log("? User A roadmap strictly preserved as App Development!");

  console.log("\n==================================================================");
  console.log("?? ALL APP DEVELOPMENT PERSONALIZATION TESTS PASSED SUCCESSFULLY!");
  console.log("==================================================================");
}

runTest().catch((err) => {
  console.error("? Test failed:", err);
  process.exit(1);
});
