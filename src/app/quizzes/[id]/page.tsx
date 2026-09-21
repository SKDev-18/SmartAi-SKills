"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import LearnerNav from "@/components/layout/LearnerNav";
import { SessionUser } from "@/types";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Clock,
  Layers,
  AlertTriangle,
  Check,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

interface Question {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  difficulty: string;
  topic: string;
  sourceReference: string;
  competency?: {
    id: string;
    domain: string;
    name: string;
  } | null;
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  topic: string;
  passPercentage: number;
  topicRel?: {
    id: string;
    title: string;
    slug: string;
    module?: {
      id: string;
      title: string;
      course?: {
        id: string;
        title: string;
        slug: string;
      };
    };
  } | null;
  questions: Question[];
}

export default function QuizExecutionPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const rawQuizId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const loadQuiz = useCallback(async () => {
    if (!rawQuizId) return;
    setLoading(true);
    setError(null);

    try {
      // Load session user
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.user) setUser(userData.user);
      }

      // Fetch quiz details with timeout safeguard
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const search = typeof window !== "undefined" ? window.location.search : "";
      const res = await fetch(`/api/quizzes/${rawQuizId}${search}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to load quiz assessment.");
      }
      if (!data.quiz) {
        throw new Error("Assessment details could not be retrieved.");
      }

      setQuiz(data.quiz);
    } catch (err: any) {
      console.error("Failed to load quiz assessment:", err);
      if (err?.name === "AbortError") {
        setError("Quiz request timed out. Please check your network and retry.");
      } else {
        setError(err?.message || "Unable to load the assessment. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [rawQuizId]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  // Elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (opt: string) => {
    if (!quiz) return;
    const currentQ = quiz.questions[currentIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: opt,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setShowSubmitModal(false);
    setSubmitting(true);

    try {
      const search = typeof window !== "undefined" ? window.location.search : "";
      const res = await fetch(`/api/quizzes/${quiz.id}/submit${search}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();
      if (res.ok && data.attemptId) {
        sessionStorage.setItem(`quiz_result_${data.attemptId}`, JSON.stringify(data));
        router.push(`/quizzes/${quiz.id}/result?attemptId=${data.attemptId}`);
      } else {
        alert(data.error || "Failed to submit assessment");
      }
    } catch (err) {
      console.error("Failed to submit quiz", err);
      alert("An error occurred while submitting. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  // State 1: Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
            Loading Assessment Questions...
          </p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Preparing 30-question mastery evaluation
          </span>
        </div>
      </div>
    );
  }

  // State 2: Error State with Retry Button
  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] flex flex-col pb-20 md:pb-12">
        {user && <Header user={user} />}
        <LearnerNav />
        <main className="max-w-md mx-auto px-4 pt-16 pb-12 w-full flex-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-900/60 shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              Unable to Load Assessment
            </h2>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              {error || "We encountered an issue retrieving the questions for this quiz."}
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => loadQuiz()}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Loading Assessment
              </button>

              <Link
                href="/learn"
                className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Return to Curriculum
              </Link>

              <Link
                href="/quizzes"
                className="block text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-center pt-1"
              >
                Browse All Published Quizzes →
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // State 3: Empty Questions in Quiz
  if (quiz.questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] flex flex-col pb-20 md:pb-12">
        {user && <Header user={user} />}
        <LearnerNav />
        <main className="max-w-md mx-auto px-4 pt-16 pb-12 w-full flex-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-100 dark:border-amber-900/60 shadow-inner">
              <HelpCircle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              No Questions Available
            </h2>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              This quiz is currently being assembled. Please retry or return to your topic notes.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => loadQuiz()}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Refresh Quiz
              </button>

              <Link
                href="/learn"
                className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Return to Learning Curriculum
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentQ = quiz.questions[currentIndex];
  const total = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / total) * 100);
  const selected = answers[currentQ.id];
  const isLastQuestion = currentIndex === total - 1;

  const difficultyColors: Record<string, string> = {
    EASY: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
    MEDIUM: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
    HARD: "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60",
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col pb-20 md:pb-12 transition-colors duration-200">
      {user && <Header user={user} />}
      <LearnerNav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-12 w-full flex-1">
        {/* Top Assessment Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <span>{quiz.topicRel?.module?.course?.title || "Engineering"}</span>
                <span>•</span>
                <span>{quiz.topic || quiz.topicRel?.title || "Topic Assessment"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Question {currentIndex + 1} of {total}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate max-w-[240px] sm:max-w-md">
                  {quiz.title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>{formatTimer(elapsedSeconds)}</span>
              </div>

              <button
                onClick={() => setShowPalette(!showPalette)}
                className="text-xs font-bold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900/60 flex items-center gap-1 transition"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>
                  {answeredCount}/{total} Answered
                </span>
              </button>

              <button
                onClick={() => setShowSubmitModal(true)}
                className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg transition shadow-xs"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Collapsible Question Matrix Palette (1 - 30) */}
          {showPalette && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Question Matrix:</span>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    Answered
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 inline-block" />
                    Unanswered
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 pt-1">
                {quiz.questions.map((q, idx) => {
                  const isAns = !!answers[q.id];
                  const isCurr = idx === currentIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setShowPalette(false);
                      }}
                      className={`h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                        isCurr
                          ? "ring-2 ring-blue-600 ring-offset-1 ring-offset-white dark:ring-offset-slate-900 bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300"
                          : isAns
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Single Question Container (PRD §26) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
              {currentQ.sourceReference || currentQ.topic || "Core Concept"}
            </span>

            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                difficultyColors[currentQ.difficulty] || "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              {currentQ.difficulty}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQ.questionText}
          </h2>

          {/* Readable Options (PRD §26) */}
          <div className="space-y-3 pt-2">
            {[
              { key: "A", text: currentQ.optionA },
              { key: "B", text: currentQ.optionB },
              { key: "C", text: currentQ.optionC },
              { key: "D", text: currentQ.optionD },
            ].map((opt) => {
              const isChecked = selected === opt.key;

              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelectOption(opt.key)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start space-x-3.5 ${
                    isChecked
                      ? "bg-blue-50 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 ring-1 ring-blue-600 dark:ring-blue-500"
                      : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                      isChecked
                        ? "bg-blue-600 text-white"
                        : "border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800"
                    }`}
                  >
                    {opt.key}
                  </div>
                  <span
                    className={`text-sm leading-relaxed ${
                      isChecked
                        ? "font-semibold text-blue-950 dark:text-blue-200"
                        : "text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons (Previous, Next, Submit) */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Previous
            </button>

            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 hidden sm:block">
              Question {currentIndex + 1} of {total}
            </div>

            {isLastQuestion ? (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="inline-flex items-center px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
              >
                Finish & Submit
                <CheckCircle className="w-4 h-4 ml-1.5" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(total - 1, prev + 1))}
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Jump Bar */}
        <div className="mt-4 flex items-center justify-between px-2 text-xs text-slate-500 dark:text-slate-400">
          <button
            onClick={() => setShowPalette(!showPalette)}
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
          >
            {showPalette ? "Hide Question Matrix" : "View All 30 Questions Matrix"}
          </button>

          <span>
            {total - answeredCount === 0
              ? "All questions answered! Ready to submit."
              : `${total - answeredCount} unanswered`}
          </span>
        </div>

        {/* Submission Confirmation Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 animate-fadeIn">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">
                Submit 30-Question Assessment?
              </h3>

              <div className="space-y-3 mb-6 text-xs text-slate-600 dark:text-slate-300">
                <p>
                  You have answered <span className="font-bold text-slate-900 dark:text-white">{answeredCount}</span> of{" "}
                  <span className="font-bold text-slate-900 dark:text-white">{total}</span> questions.
                </p>

                {answeredCount < total && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 rounded-xl text-amber-800 dark:text-amber-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      You have {total - answeredCount} unanswered questions. They will be marked incorrect.
                    </span>
                  </div>
                )}

                <div className="bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">Adaptive Unlock Rules:</div>
                  <div>• &lt; 60%: Relearn topic (topic remains active)</div>
                  <div>• 60% – 79%: Practice weak areas & retry</div>
                  <div>• 80% – 90%: <span className="text-emerald-600 dark:text-emerald-400 font-bold">Pass & Unlock Next Topic</span></div>
                  <div>• &gt; 90%: <span className="text-amber-600 dark:text-amber-400 font-bold">Mastery Star ⭐ & Unlock Next Topic</span></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Review Questions
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  {submitting ? "Analyzing..." : "Confirm & Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
