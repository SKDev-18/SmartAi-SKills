import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE_URL = "http://localhost:3000";

function createSessionToken(user) {
  const payload = {
    ...user,
    timestamp: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

async function runTests() {
  console.log("==================================================================");
  console.log("  LEARNING CONTENT & QUIZ ISOLATION END-TO-END VERIFICATION");
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

  // 1. Database Audit: All 74 topics have videos and dedicated quizzes
  console.log("--- 1. Database Audit: 74 Topics Video & Quiz Coverage ---");
  const topics = await prisma.topic.findMany({
    include: {
      module: { include: { course: true } },
      videos: true,
      quizzes: {
        where: { isPublished: true },
        include: { questions: true },
      },
    },
  });

  assert(topics.length >= 74, `Total topics in database is at least 74 (actual: ${topics.length})`);

  const missingVideos = topics.filter((t) => t.videos.length === 0);
  assert(
    missingVideos.length === 0,
    `Zero topics missing video resources (missing: ${missingVideos.length})`
  );

  const missingQuizzes = topics.filter(
    (t) => t.quizzes.length === 0 || t.quizzes[0].questions.length === 0
  );
  assert(
    missingQuizzes.length === 0,
    `Zero topics missing dedicated quiz or questions (missing: ${missingQuizzes.length})`
  );

  // 2. Auth Session setup
  const user = await prisma.user.findFirst({ where: { role: "LEARNER" } });
  const sessionToken = createSessionToken({
    id: user.id,
    email: user.email,
    name: user.name,
    employeeId: user.employeeId,
    department: user.department,
    designation: user.designation,
    experienceLevel: user.experienceLevel,
    role: user.role,
  });
  const cookieHeader = `mospi_session_token=${sessionToken}`;

  // 3. Topic Detail API (/api/topics/:id) for HTML (Web Development)
  console.log("\n--- 2. Topic Detail API (/api/topics/html) ---");
  const topicRes = await fetch(`${BASE_URL}/api/topics/html`, {
    headers: { Cookie: cookieHeader },
  });
  assert(topicRes.status === 200, `Topic detail endpoint returns 200 (actual: ${topicRes.status})`);
  const topicData = await topicRes.json();
  assert(topicData.topic?.title === "HTML & Semantic Markup", `Topic title is "HTML & Semantic Markup"`);
  assert(
    topicData.topic?.module?.course?.title === "Web Development",
    `Topic belongs to Web Development course`
  );
  assert(
    topicData.topic?.videos?.length > 0,
    `Topic has ${topicData.topic?.videos?.length} embedded video(s)`
  );
  assert(
    topicData.topic?.quiz?.id === "quiz_html",
    `Topic quiz is strictly "quiz_html", NOT "linked-list-quiz"`
  );

  // 4. Quiz Content Isolation: Web Dev Topic MUST NOT contain Linked List questions
  console.log("\n--- 3. Quiz Question Content Isolation (Web Dev vs DSA) ---");
  const quizRes = await fetch(`${BASE_URL}/api/quizzes/quiz_html`, {
    headers: { Cookie: cookieHeader },
  });
  assert(quizRes.status === 200, `Quiz endpoint returns 200 for quiz_html`);
  const quizData = await quizRes.json();
  const qList = quizData.quiz?.questions || [];
  assert(qList.length >= 5, `quiz_html has at least 5 questions (actual: ${qList.length})`);

  let dsaContaminationFound = false;
  for (const q of qList) {
    const text = (q.questionText + " " + q.explanation).toLowerCase();
    if (
      text.includes("linked list") ||
      text.includes("pointer dereference") ||
      text.includes("floyd") ||
      text.includes("two-pointer")
    ) {
      dsaContaminationFound = true;
      console.error("  Contaminant found:", q.questionText);
    }
  }
  assert(
    !dsaContaminationFound,
    `HTML quiz is 100% free of Linked List / DSA questions`
  );

  // 5. Strict Validation: courseId + topicId validation
  console.log("\n--- 4. courseId + topicId Validation Rules ---");
  // A. Matching course and topic
  const validPairRes = await fetch(
    `${BASE_URL}/api/quizzes/quiz_html?topicId=html&courseId=web-development`,
    { headers: { Cookie: cookieHeader } }
  );
  assert(
    validPairRes.status === 200,
    `Valid courseId + topicId (web-development + html) returns 200 OK`
  );

  // B. Mismatched course (e.g. asking for HTML quiz under dsa course)
  const mismatchCourseRes = await fetch(
    `${BASE_URL}/api/quizzes/quiz_html?topicId=html&courseId=dsa`,
    { headers: { Cookie: cookieHeader } }
  );
  assert(
    mismatchCourseRes.status === 400,
    `Mismatched courseId (courseId=dsa for HTML quiz) is rejected with 400 (actual: ${mismatchCourseRes.status})`
  );
  const mismatchCourseData = await mismatchCourseRes.json();
  assert(
    mismatchCourseData.error?.includes("Validation Error"),
    `Rejection contains clear validation error message: "${mismatchCourseData.error}"`
  );

  // C. Mismatched topic (e.g. asking for HTML quiz with linked-list topic)
  const mismatchTopicRes = await fetch(
    `${BASE_URL}/api/quizzes/quiz_html?topicId=linked-list&courseId=web-development`,
    { headers: { Cookie: cookieHeader } }
  );
  assert(
    mismatchTopicRes.status === 400,
    `Mismatched topicId (topicId=linked-list for HTML quiz) is rejected with 400 (actual: ${mismatchTopicRes.status})`
  );

  // 6. Cross-domain Content Correctness across multiple courses
  console.log("\n--- 5. Diverse Course Content Verification ---");
  const crossChecks = [
    { slug: "docker-containers", expectedCourse: "Cloud Computing & DevOps", keyword: "docker" },
    { slug: "os-processes", expectedCourse: "Operating Systems", keyword: "process" },
    { slug: "python-fundamentals", expectedCourse: "Python for Engineering", keyword: "python" },
    { slug: "dbms-relational-model", expectedCourse: "Database Management & SQL", keyword: "relational" },
    { slug: "security-fundamentals", expectedCourse: "Cyber Security", keyword: "security" },
    { slug: "cn-transport", expectedCourse: "Computer Networks", keyword: "tcp" },
  ];

  for (const check of crossChecks) {
    const r = await fetch(`${BASE_URL}/api/quizzes/${check.slug}`, {
      headers: { Cookie: cookieHeader },
    });
    const d = await r.json();
    const courseTitle = d.quiz?.topicRel?.module?.course?.title;
    const firstQ = (d.quiz?.questions?.[0]?.questionText || "").toLowerCase();

    assert(
      r.status === 200 && courseTitle === check.expectedCourse,
      `[${check.slug}] belongs to "${check.expectedCourse}" (actual: "${courseTitle}")`
    );
    assert(
      firstQ.includes(check.keyword) || (d.quiz?.title || "").toLowerCase().includes(check.keyword),
      `[${check.slug}] content strictly relates to topic keyword "${check.keyword}"`
    );
  }

  // 7. Quiz Submission Test
  console.log("\n--- 6. Quiz Submission & Adaptive Evaluation ---");
  const htmlQuiz = await prisma.quiz.findUnique({
    where: { id: "quiz_html" },
    include: { questions: true },
  });

  const answers = {};
  for (const q of htmlQuiz.questions) {
    answers[q.id] = q.correctAnswer; // Perfect score
  }

  const submitRes = await fetch(
    `${BASE_URL}/api/quizzes/quiz_html/submit?topicId=html&courseId=web-development`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ answers }),
    }
  );

  assert(submitRes.status === 200, `Quiz submission returns 200 OK (actual: ${submitRes.status})`);
  const submitData = await submitRes.json();
  assert(submitData.percentage === 100, `Percentage score calculated correctly as 100%`);
  assert(!!submitData.attemptId, `Attempt ID generated: ${submitData.attemptId}`);

  // 8. Video Lecture Page Verification
  console.log("\n--- 7. Video Learning Page Route ---");
  const htmlVideo = await prisma.topicVideo.findFirst({
    where: { topic: { slug: "html" } },
  });
  assert(!!htmlVideo, `HTML topic has TopicVideo record (ID: ${htmlVideo?.id})`);
  assert(htmlVideo.youtubeUrl.startsWith("https://www.youtube.com"), `YouTube URL is valid`);

  const videoPageRes = await fetch(`${BASE_URL}/learn/video/${htmlVideo.id}`, {
    headers: { Cookie: cookieHeader },
  });
  assert(
    videoPageRes.status === 200,
    `Video learning page (/learn/video/${htmlVideo.id}) renders successfully with status 200`
  );

  console.log("\n==================================================================");
  console.log(`  RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests()
  .catch((err) => {
    console.error("Test execution failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
