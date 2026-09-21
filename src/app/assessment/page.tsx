"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import LearnerNav from "@/components/layout/LearnerNav";
import { SessionUser } from "@/types";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Award,
  AlertCircle,
} from "lucide-react";

interface Question {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  difficulty: string;
  competency: {
    id: string;
    domain: string;
    name: string;
  };
}

interface AssessmentData {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export default function AssessmentPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssessment() {
      try {
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();
        if (userData.user) setUser(userData.user);

        const assRes = await fetch("/api/assessments");
        const assData = await assRes.json();
        if (assData.assessments && assData.assessments.length > 0) {
          const detailRes = await fetch(
            `/api/assessments/${assData.assessments[0].id}`
          );
          const detailData = await detailRes.json();
          if (detailData.assessment) {
            setAssessment(detailData.assessment);
          }
        }
      } catch (err) {
        console.error("Failed to load assessment", err);
      } finally {
        setLoading(false);
      }
    }
    loadAssessment();
  }, []);

  const handleSelectOption = (option: string) => {
    if (!assessment) return;
    const currentQ = assessment.questions[currentIndex];
    setAnswers({
      ...answers,
      [currentQ.id]: option,
    });
  };

  const handleSubmit = async () => {
    if (!assessment) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/assessments/${assessment.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (res.ok) {
        router.push("/dashboard?assessment=completed");
      }
    } catch (err) {
      console.error("Submit error", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !assessment) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Loading Competency Assessment...
          </p>
        </div>
      </div>
    );
  }

  const currentQ = assessment.questions[currentIndex];
  const total = assessment.questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);
  const selectedOption = answers[currentQ.id];
  const isLastQuestion = currentIndex === total - 1;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col pb-20 md:pb-10 transition-colors duration-200">
      {user && <Header user={user} />}
      <LearnerNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-12 w-full flex-1">
        {/* Top Assessment Header */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-6 backdrop-blur-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/60">
                Official Diagnostic Evaluation
              </span>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {assessment.title}
              </h1>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Question {currentIndex + 1} of {total}
            </div>
          </div>

          {/* Progress Bar (PRD §26) */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>{progressPercent}% Complete</span>
              <span>
                {answeredCount} of {total} Answered
              </span>
            </div>
          </div>
        </div>

        {/* Question Container */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 backdrop-blur-xs">
          {/* Competency & Difficulty Tag */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
              {currentQ.competency.name}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {currentQ.difficulty}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
            {currentQ.questionText}
          </h2>

          {/* Large Readable Options (PRD §26) */}
          <div className="space-y-3 pt-2">
            {[
              { key: "A", text: currentQ.optionA },
              { key: "B", text: currentQ.optionB },
              { key: "C", text: currentQ.optionC },
              { key: "D", text: currentQ.optionD },
            ].map((opt) => {
              const isChecked = selectedOption === opt.key;

              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelectOption(opt.key)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start space-x-3.5 ${
                    isChecked
                      ? "bg-blue-50 dark:bg-blue-950/50 border-blue-600 ring-1 ring-blue-600 text-blue-900 dark:text-blue-100"
                      : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                      isChecked
                        ? "bg-blue-600 text-white"
                        : "border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900"
                    }`}
                  >
                    {opt.key}
                  </div>
                  <span
                    className={`text-sm leading-relaxed ${
                      isChecked
                        ? "font-semibold text-blue-900 dark:text-blue-100"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls (PRD §26: Previous, Next, Submit) */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={submitting || answeredCount === 0}
                className="inline-flex items-center px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs disabled:opacity-50"
              >
                {submitting ? "Calculating Competencies..." : "Submit Assessment"}
                <CheckCircle className="w-4 h-4 ml-1.5" />
              </button>
            ) : (
              <button
                onClick={() =>
                  setCurrentIndex((prev) => Math.min(total - 1, prev + 1))
                }
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-xs"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
