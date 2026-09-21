"use client";

import { useEffect, useState, Suspense, Component, ReactNode } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import LearnerNav from "@/components/layout/LearnerNav";
import { SessionUser } from "@/types";
import {
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen,
  RotateCcw,
  Star,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Check,
  Flame,
} from "lucide-react";

function ResultInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const attemptId = searchParams.get("attemptId");

  const [user, setUser] = useState<SessionUser | null>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [showReview, setShowReview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserAndResult = async () => {
    setLoading(true);
    setError(null);
    try {
      const userRes = await fetch("/api/auth/me");
      const userData = await userRes.json();
      if (userData.user) setUser(userData.user);

      if (attemptId) {
        const stored = sessionStorage.getItem(`quiz_result_${attemptId}`);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed === "object") {
              setResultData(parsed);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn("Invalid stored result json", e);
          }
        }

        // Fetch real attempt from database API
        const attRes = await fetch(`/api/quizzes/attempts/${attemptId}`);
        if (attRes.ok) {
          const attData = await attRes.json();
          setResultData(attData);
          setLoading(false);
          return;
        }
      }

      // Fallback: Query quiz info
      const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
      if (rawId) {
        const res = await fetch(`/api/quizzes/${rawId}`);
        const data = await res.json();
        if (data.quiz) {
          setResultData({
            score: 0,
            totalQuestions: data.quiz.questions?.length || 30,
            percentage: 0,
            correctAnswers: 0,
            incorrectAnswers: data.quiz.questions?.length || 30,
            quiz: data.quiz,
          });
        } else {
          throw new Error(data.error || "Unable to retrieve assessment result.");
        }
      } else {
        throw new Error("No assessment attempt found.");
      }
    } catch (err: any) {
      console.error("Failed to load result", err);
      setError(err?.message || "Failed to load quiz results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserAndResult();
  }, [attemptId, params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-600 font-semibold">Loading Performance Results...</p>
        </div>
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-12">
        {user && <Header user={user} />}
        <LearnerNav />
        <main className="max-w-md mx-auto px-4 pt-16 pb-12 w-full flex-1">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-center shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">
              Unable to Load Results
            </h2>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              {error || "We could not retrieve the performance record for this quiz attempt."}
            </p>
            <div className="space-y-2.5">
              <button
                onClick={() => loadUserAndResult()}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Retry Loading Results
              </button>
              <Link
                href="/dashboard"
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition block text-center"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const {
    score = 0,
    totalQuestions = 30,
    percentage = 0,
    correctAnswers = 0,
    incorrectAnswers = 0,
    progression = null,
    weakAreas = [],
    evaluatedAnswers = [],
    analysis = null,
  } = resultData || {};

  const safeWeakAreas = Array.isArray(weakAreas) ? weakAreas : [];
  const safeEvaluatedAnswers = Array.isArray(evaluatedAnswers) ? evaluatedAnswers : [];
  const quizId = Array.isArray(params?.id) ? params.id[0] : params?.id || "";

  // Determine Tier:
  // < 60%: RELEARN
  // 60-79%: RETRY
  // 80-90%: COMPLETED
  // > 90%: MASTERED
  const tier = progression?.tier || (
    percentage > 90 ? "MASTERED" :
    percentage >= 80 ? "COMPLETED" :
    percentage >= 60 ? "RETRY" : "RELEARN"
  );

  const nextTopic = progression?.nextTopic;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col pb-20 md:pb-12 transition-colors duration-200">
      {user && <Header user={user} />}
      <LearnerNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-12 w-full flex-1">
        {/* Tier-Specific Hero Card */}
        {tier === "MASTERED" && (
          <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center mb-6 relative overflow-hidden animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner animate-float">
              <Star className="w-9 h-9 fill-white text-white animate-pulse" />
            </div>
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider shadow-xs">
              Topic Mastery Level Achieved
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">Excellent! Topic Mastered 🌟</h1>
            <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
              You scored {percentage}% ({score}/{totalQuestions})! You have demonstrated exceptional mastery over these concepts.
            </p>

            <div className="my-6">
              <span className="text-6xl font-black tracking-tight drop-shadow-md">{percentage}%</span>
            </div>

            {nextTopic ? (
              <Link
                href={`/learn/${nextTopic.slug}`}
                className="btn-press inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-amber-900 font-extrabold text-sm shadow-lg hover:bg-amber-50 transition-all hover:scale-102"
              >
                <span>Continue to Next Topic: {nextTopic.title}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/learn"
                className="btn-press inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-amber-900 font-extrabold text-sm shadow-lg hover:bg-amber-50 transition-all hover:scale-102"
              >
                <span>View Full Learning Curriculum</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}

        {tier === "COMPLETED" && (
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center mb-6 relative overflow-hidden animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner animate-float">
              <Award className="w-9 h-9 text-white" />
            </div>
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider shadow-xs">
              Passed & Unlocked
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">Great Work! Topic Completed 🎉</h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
              Great work! You scored {percentage}% ({score}/{totalQuestions}) and demonstrated sufficient understanding. Next topic is now unlocked!
            </p>

            <div className="my-6">
              <span className="text-6xl font-black tracking-tight drop-shadow-md">{percentage}%</span>
            </div>

            {nextTopic ? (
              <Link
                href={`/learn/${nextTopic.slug}`}
                className="btn-press inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-900 font-extrabold text-sm shadow-lg hover:bg-emerald-50 transition-all hover:scale-102"
              >
                <span>Continue to Next Topic: {nextTopic.title}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/learn"
                className="btn-press inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-emerald-900 font-extrabold text-sm shadow-lg hover:bg-emerald-50 transition-all hover:scale-102"
              >
                <span>Return to Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}

        {tier === "RETRY" && (
          <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center mb-6 relative overflow-hidden animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner animate-float">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider shadow-xs">
              60% – 79% Practice Required
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">Almost There! Keep Going 💪</h1>
            <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
              You scored {percentage}% ({score}/{totalQuestions}). You are making good progress. Review your weak areas below and retry to achieve 80%+ to unlock the next milestone.
            </p>

            <div className="my-6">
              <span className="text-6xl font-black tracking-tight drop-shadow-md">{percentage}%</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/quizzes/${quizId}`}
                className="btn-press inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-orange-900 font-extrabold text-xs shadow-lg hover:bg-orange-50 transition-all hover:scale-102"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Quiz</span>
              </Link>
              <Link
                href="/learn"
                className="btn-press inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/20 text-white font-bold text-xs hover:bg-white/30 transition-all"
              >
                <span>Review Topic Notes</span>
              </Link>
            </div>
          </div>
        )}

        {tier === "RELEARN" && (
          <div className="bg-gradient-to-br from-rose-600 to-red-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center mb-6 relative overflow-hidden animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner animate-float">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider shadow-xs">
              Score &lt; 60% • Relearn Advised
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">Strengthen Your Foundation 📚</h1>
            <p className="text-rose-100 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
              You scored {percentage}% ({score}/{totalQuestions}). You should strengthen this topic before moving ahead. Next topic remains locked until you score 80% or higher.
            </p>

            <div className="my-6">
              <span className="text-6xl font-black tracking-tight drop-shadow-md">{percentage}%</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/learn"
                className="btn-press inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-rose-900 font-extrabold text-xs shadow-lg hover:bg-rose-50 transition-all hover:scale-102"
              >
                <BookOpen className="w-4 h-4" />
                <span>Review Topic Notes & Lectures</span>
              </Link>
              <Link
                href={`/quizzes/${quizId}`}
                className="btn-press inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/20 text-white font-bold text-xs hover:bg-white/30 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Quiz</span>
              </Link>
            </div>
          </div>
        )}

        {/* Quick Summary Pill Bar */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-xs card-hover">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Correct Answers</div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {correctAnswers} of {totalQuestions}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-xs card-hover">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Incorrect Answers</div>
              <div className="text-base font-extrabold text-slate-900 dark:text-white">
                {incorrectAnswers} of {totalQuestions}
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Concept Weak Areas Diagnostics */}
        {safeWeakAreas.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Concept Diagnostics & Weak Areas
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              Our adaptive engine detected lower accuracy in these specific sub-topics. We recommend reviewing these before attempting again:
            </p>

            <div className="flex flex-wrap gap-2">
              {safeWeakAreas.map((area: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-xs font-bold"
                >
                  ⚡ {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Constructive Feedback */}
        {analysis?.recommendedNextStep && (
          <div className="bg-slate-900 dark:bg-slate-900/90 border border-slate-800 text-white rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Adaptive AI Recommendation</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              «{analysis.recommendedNextStep}»
            </p>
          </div>
        )}

        {/* Question-by-Question Detailed Review Accordion */}
        {safeEvaluatedAnswers.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mb-6">
            <button
              onClick={() => setShowReview(!showReview)}
              className="w-full p-5 text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Review All {safeEvaluatedAnswers.length} Questions & Explanations</span>
              </div>
              {showReview ? (
                <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              )}
            </button>

            {showReview && (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-200 dark:border-slate-800 max-h-[600px] overflow-y-auto p-4 space-y-4">
                {safeEvaluatedAnswers.map((ans: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      ans.isCorrect
                        ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60"
                        : "bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-800 dark:text-slate-200">Question {idx + 1}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ans.isCorrect
                            ? "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300"
                            : "bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300"
                        }`}
                      >
                        {ans.isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>

                    <p className="font-semibold text-slate-900 dark:text-white text-xs leading-relaxed">
                      {ans.questionText || `Question ID: ${ans.questionId || idx + 1}`}
                    </p>

                    <div className="flex items-center gap-4 text-[11px]">
                      <div>
                        Your Answer:{" "}
                        <span
                          className={`font-bold ${
                            ans.isCorrect ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"
                          }`}
                        >
                          Option {ans.selectedOption || "Unanswered"}
                        </span>
                      </div>
                      {!ans.isCorrect && ans.correctAnswer && (
                        <div>
                          Correct Answer:{" "}
                          <span className="font-bold text-emerald-700 dark:text-emerald-400">
                            Option {ans.correctAnswer}
                          </span>
                        </div>
                      )}
                    </div>

                    {ans.explanation && (
                      <div className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                        <span className="font-bold text-slate-800 dark:text-slate-200">Explanation: </span>
                        {ans.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            href="/learn"
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold transition"
          >
            ← View Curriculum Roadmap
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
          >
            Return to Dashboard
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}

// Client-side Error Boundary to safeguard against unexpected runtime errors
class ResultErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ResultErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-center shadow-lg max-w-md w-full">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Display Notice</h2>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              We encountered a temporary rendering issue loading your progress report. Please retry or return to dashboard.
            </p>
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Reload Progress Report
              </button>
              <Link
                href="/dashboard"
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition block text-center"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function QuizResultPage() {
  return (
    <ResultErrorBoundary>
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <ResultInner />
      </Suspense>
    </ResultErrorBoundary>
  );
}
