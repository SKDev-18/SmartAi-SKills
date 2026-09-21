import { GeneratedQuestion } from "@/types";

export interface ValidationCheckResult {
  passed: boolean;
  score: number; // 0 to 100
  issues: string[];
  passedChecks: string[];
}

export function validateQuestionQuality(
  q: GeneratedQuestion,
  sourceMaterialText?: string
): ValidationCheckResult {
  const issuesList: string[] = [];
  const passedList: string[] = [];

  // Check 1: Exactly one correct answer for single-answer MCQ
  if (["A", "B", "C", "D"].includes(q.correctAnswer)) {
    passedList.push("Valid single correct answer designated (A/B/C/D)");
  } else {
    issuesList.push("Invalid correct answer indicator. Must be A, B, C, or D.");
  }

  // Check 2: No duplicate options
  const options = [
    q.optionA?.trim().toLowerCase(),
    q.optionB?.trim().toLowerCase(),
    q.optionC?.trim().toLowerCase(),
    q.optionD?.trim().toLowerCase(),
  ];
  const uniqueOptions = new Set(options.filter(Boolean));
  if (uniqueOptions.size === 4) {
    passedList.push("All 4 distinct options provided without duplicate choices");
  } else {
    issuesList.push("Duplicate or missing options detected across choices");
  }

  // Check 3: No incomplete question text
  if (q.questionText && q.questionText.trim().length >= 15 && q.questionText.includes("?")) {
    passedList.push("Question prompt is complete and syntactically structured");
  } else if (q.questionText && q.questionText.trim().length >= 15) {
    passedList.push("Question prompt is adequately detailed");
  } else {
    issuesList.push("Question text is too short or incomplete");
  }

  // Check 4: Competency mapping exists
  if (q.competency && q.competency.trim().length > 0) {
    passedList.push(`Mapped to official competency: ${q.competency}`);
  } else {
    issuesList.push("Missing competency domain mapping");
  }

  // Check 5: Explanation consistency and substance
  if (q.explanation && q.explanation.trim().length >= 20) {
    passedList.push("Substantive rationalized explanation provided");
  } else {
    issuesList.push("Explanation is absent or too terse to support learning");
  }

  // Check 6: Appropriate difficulty rating
  if (["EASY", "MEDIUM", "HARD"].includes(q.difficulty)) {
    passedList.push(`Valid difficulty calibrated: ${q.difficulty}`);
  } else {
    issuesList.push("Invalid difficulty rating; must be EASY, MEDIUM, or HARD");
  }

  // Check 7: Grounded source reference exists
  if (q.sourceReference && q.sourceReference.trim().length > 3) {
    passedList.push(`Source reference cited: ${q.sourceReference}`);
  } else {
    issuesList.push("Missing source material citation or page reference");
  }

  // Check 8: Grounding against source material text if available
  if (sourceMaterialText && sourceMaterialText.length > 50) {
    // Check keywords from question and answer in material
    const keywords = q.questionText
      .split(/\W+/)
      .filter((w) => w.length > 4)
      .map((w) => w.toLowerCase());
    
    const matched = keywords.filter((k) => sourceMaterialText.toLowerCase().includes(k));
    const groundingRatio = keywords.length > 0 ? matched.length / keywords.length : 1;

    if (groundingRatio >= 0.25) {
      passedList.push("Question verified against source text vocabulary");
    } else {
      issuesList.push("Low semantic alignment with provided source material (potential hallucination)");
    }
  } else {
    passedList.push("Material-grounding check bypassed (no raw text context supplied)");
  }

  const totalChecks = 8;
  const score = Math.round((passedList.length / totalChecks) * 100);
  const passed = issuesList.length === 0;

  return {
    passed,
    score,
    issues: issuesList,
    passedChecks: passedList,
  };
}
