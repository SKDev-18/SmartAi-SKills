import { GeneratedQuestion, QuizPerformanceInsight } from "@/types";
import { statisticalEngine } from "./statistical-engine";
import { validateQuestionQuality } from "./validator";

export class GeminiAIService {
  private apiKey?: string;
  private primaryModels = ["gemini-3.5-flash-lite", "gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];

  constructor() {
    this.apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      "";
  }

  private async callGemini(prompt: string, jsonMode: boolean = false): Promise<string> {
    const activeKey =
      this.apiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      "";

    if (!activeKey) {
      throw new Error("No Gemini API key configured");
    }

    let lastError: any = null;

    for (const model of this.primaryModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              ...(jsonMode ? { responseMimeType: "application/json" } : {}),
            },
          }),
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`Gemini model ${model} HTTP ${response.status}: ${errText}`);
          lastError = new Error(`Gemini ${model} error: ${response.statusText}`);
          continue;
        }

        const json = await response.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 0) {
          return text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Gemini model ${model} request failed:`, err?.message || err);
      }
    }

    throw lastError || new Error("All Gemini models failed to respond");
  }

  public async generateQuestions(
    materialContent: string,
    materialTitle: string,
    domain: string,
    topic: string,
    count: number,
    difficulty: "EASY" | "MEDIUM" | "HARD"
  ): Promise<GeneratedQuestion[]> {
    const activeKey =
      this.apiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      "";

    if (!activeKey) {
      return statisticalEngine.generateMCQs(materialContent, materialTitle, domain, topic, count, difficulty);
    }

    try {
      const prompt = `You are a Principal Engineering Professor and Technical Assessment expert for NexStep.
Generate exactly ${count} multiple-choice questions (MCQs) strictly grounded in the following text from "${materialTitle}":
---
${materialContent.slice(0, 6000)}
---
Domain: ${domain}
Topic: ${topic}
Target Difficulty: ${difficulty}

Respond ONLY with a valid JSON array of objects with the exact structure:
[
  {
    "questionText": "...",
    "optionA": "...",
    "optionB": "...",
    "optionC": "...",
    "optionD": "...",
    "correctAnswer": "A", // must be A, B, C, or D
    "explanation": "...",
    "competency": "${domain}",
    "topic": "${topic}",
    "difficulty": "${difficulty}",
    "sourceReference": "${materialTitle}"
  }
]`;

      const text = await this.callGemini(prompt, true);
      const parsed = JSON.parse(text) as GeneratedQuestion[];

      return parsed.map((q) => {
        const audit = validateQuestionQuality(q, materialContent);
        return {
          ...q,
          qualityScore: audit.score,
          validationNotes: audit.issues.length > 0 ? audit.issues : audit.passedChecks,
        };
      });
    } catch (err) {
      console.warn("Falling back to local Statistical Intelligence Engine for MCQ generation:", err);
      return statisticalEngine.generateMCQs(materialContent, materialTitle, domain, topic, count, difficulty);
    }
  }

  public analyzeQuizPerformance(
    answers: { questionText: string; isCorrect: boolean; selectedOption: string; correctAnswer: string; explanation: string; competency: string; topic: string }[],
    currentCompetencies: { code: string; name: string; currentScore: number; requiredLevel: number }[]
  ): QuizPerformanceInsight {
    return statisticalEngine.analyzeQuizPerformance(answers, currentCompetencies);
  }

  public async answerLearningQuestion(
    query: string,
    availableContexts: { title: string; text: string }[]
  ): Promise<{ answer: string; source: string; confidence?: number; suggestedResources?: string[] }> {
    if (!this.apiKey) {
      return statisticalEngine.answerStatisticalQuestion(query, availableContexts);
    }

    try {
      const contextSummary = availableContexts
        .map((c, i) => `[Reference ${i + 1}: ${c.title}]\n${c.text}`)
        .join("\n\n---\n\n");

      const prompt = `You are NexStep AI, an intelligent AI tutor and mentor for Engineering Students.
Your role is to assist engineering students with clear, authoritative, and pedagogically sound guidance on Data Structures & Algorithms (DSA), Computer Science, Software Engineering, and branch-specific technical concepts.

Curriculum Reference Materials & Notes:
${contextSummary.slice(0, 6000)}

Student's Query:
${query}

Instructions:
1. Provide a comprehensive, accurate, and easy-to-understand explanation tailored for engineering students.
2. Include intuitive analogies, clean code examples (C++, Python, or Java where appropriate), and asymptotic Big-O time and space complexity analysis.
3. Structure your response clearly with markdown headings, bullet points, and code blocks.
4. Keep the tone supportive, encouraging, and academically rigorous.`;

      const geminiAnswer = await this.callGemini(prompt, false);
      const primaryDoc = availableContexts[0]?.title || "NexStep Engineering Curriculum";

      return {
        answer: geminiAnswer,
        source: `Gemini AI Assistant • ${primaryDoc}`,
        confidence: 0.98,
        suggestedResources: availableContexts.map((c) => c.title).slice(0, 3),
      };
    } catch (err) {
      console.warn("Falling back to local Intelligence Engine for chat assistant:", err);
      return statisticalEngine.answerStatisticalQuestion(query, availableContexts);
    }
  }

  public async generateDeepDiveNotes(
    topicTitle: string,
    courseName?: string,
    existingNotes?: string
  ): Promise<string> {
    if (this.apiKey) {
      try {
        const prompt = `You are a Principal Engineering Professor and Technical Lead at NexStep.
Generate an exhaustive, multi-page handwritten-style technical PDF manual (minimum 2000-2500 words across 6 comprehensive sections, filling at least 3-4 full A4 pages) for the topic: "${topicTitle}" (Course: ${courseName || "Computer Science & Engineering"}).

${existingNotes ? `Existing syllabus baseline:\n${existingNotes.slice(0, 2500)}\n` : ""}

Format your output in clean, structured Markdown adhering strictly to these 6 extensive sections:
# ${topicTitle} - Comprehensive Engineering Manual & Revision Guide

> Official NexStep Academic Syllabus Reference: In-depth technical specification covering theoretical foundations, memory layout, mathematical derivations, asymptotic complexity, production templates, and high-yield interview questions.

## 1. Executive Architectural Overview & Core Motivation
- Deep concept definition, motivation, and trade-offs.
- Real-world distributed systems / production engineering analogy.
- Historical evolution and modern systems architecture.

## 2. Deep Theoretical Foundations & Memory Architecture
- Stack vs Heap allocation dynamics, pointer dereferencing, and memory footprints.
- CPU cache line locality (L1/L2 prefetching, avoiding stall cycles).
- Formal state invariants and boundary guarantees.

## 3. Mathematical Foundations & Asymptotic Complexity Breakdown
- Detailed Asymptotic Table (Best, Average, Worst Time $\\mathcal{O}$, Auxiliary Space $\\mathcal{O}$).
- Recurrence relations, Master Theorem derivations, and induction proofs.

## 4. Production-Grade Reference Implementation
Provide a clean, battle-tested C++ or Python template with extensive line-by-line engineering commentary, bounds checking, and exception safety.

## 5. Critical Edge Cases, Failure Modes & Debugging Traps
- 5 subtle failure modes (off-by-one errors, integer overflow in midpoints, memory leaks, cyclic references, shallow vs deep copying).

## 6. University & Technical Interview Mastery Cheatsheet
- 6 rapid-recall bullet points, exam formulas, and high-yield interview questions with model answers.

Write with extreme technical depth and rigor.`;

        const response = await this.callGemini(prompt, false);
        if (response && response.length > 500) {
          return response;
        }
      } catch (err) {
        console.warn("Gemini notes generation failed, using structured multi-page fallback:", err);
      }
    }

    // High quality multi-page fallback guaranteed to fill 2-3+ pages
    const { generateComprehensiveTopicNotes } = require("./../pdf/generateNotesPdf");
    return generateComprehensiveTopicNotes(topicTitle, courseName, undefined, existingNotes);
  }
}

export const aiService = new GeminiAIService();
