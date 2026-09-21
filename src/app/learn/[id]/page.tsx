"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import LearnerNav from "@/components/layout/LearnerNav";
import { SessionUser } from "@/types";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Play,
  Check,
  ChevronRight,
  Code,
  Layers,
  FileDown,
} from "lucide-react";
import Link from "next/link";
import EmbeddedPdfViewer from "@/components/notes/EmbeddedPdfViewer";

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [topic, setTopic] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"notes" | "videos" | "quiz" | "progress">("notes");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();
        if (userData.user) setUser(userData.user);

        const res = await fetch(`/api/topics/${params.id}`);
        const data = await res.json();
        if (data.topic) {
          setTopic(data.topic);
          setProgress(data.progress);
        }
      } catch (err) {
        console.error("Failed to load topic", err);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) loadData();
  }, [params.id]);

  const handleToggleNotes = async () => {
    if (!topic) return;
    setUpdating(true);
    const newStatus = !progress?.notesCompleted;

    try {
      const res = await fetch(`/api/topics/${topic.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notesCompleted: newStatus }),
      });
      const data = await res.json();
      if (data.progress) setProgress(data.progress);
    } catch (err) {
      console.error("Failed to update notes progress", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleVideo = async () => {
    if (!topic) return;
    setUpdating(true);
    const newStatus = !progress?.videoCompleted;

    try {
      const res = await fetch(`/api/topics/${topic.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoCompleted: newStatus }),
      });
      const data = await res.json();
      if (data.progress) setProgress(data.progress);
    } catch (err) {
      console.error("Failed to update video progress", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !topic) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate composite topic progress %
  let calcProgress = 0;
  if (progress?.notesCompleted) calcProgress += 33;
  if (progress?.videoCompleted) calcProgress += 33;
  if (progress?.quizCompleted) calcProgress += 34;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col pb-20 md:pb-10 transition-colors duration-200">
      {user && <Header user={user} />}
      <LearnerNav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-12 w-full flex-1">
        {/* Back link */}
        <div className="mb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Learning Roadmap
          </Link>
        </div>

        {/* Topic Header Card (PRD §17) */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-6 animate-fade-in-down backdrop-blur-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800/60 shadow-xs">
              {topic.module?.course?.title || "DSA"} • {topic.module?.title || "Linear Data Structures"}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center font-medium">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {topic.estimatedTime || "45 mins"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
            {topic.title}
          </h1>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 my-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed card-hover">
            <span className="font-bold text-slate-900 dark:text-white block mb-1">Why this topic matters:</span>
            {topic.description}
          </div>

          {/* Progress Bar (PRD §17) */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-300">Topic Completion</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400 transition-all">{calcProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${calcProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4 Interactive Section Tabs (PRD §17) */}
        <div className="flex border border-slate-200 dark:border-slate-800 mb-6 bg-white dark:bg-slate-900/90 rounded-xl p-1 shadow-xs animate-fade-in-up backdrop-blur-xs">
          <button
            onClick={() => setActiveTab("notes")}
            className={`btn-press flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === "notes"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 Multi-Page Notes (PDF Preview)</span>
            {progress?.notesCompleted && <span className="text-xs">✓</span>}
          </button>

          <button
            onClick={() => setActiveTab("videos")}
            className={`btn-press flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === "videos"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Play className="w-4 h-4" />
            <span>🎬 Videos ({topic.videos?.length || 0})</span>
            {progress?.videoCompleted && <span className="text-xs">✓</span>}
          </button>

          <button
            onClick={() => setActiveTab("quiz")}
            className={`btn-press flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === "quiz"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>🧠 {topic.quiz?.questionCount || 30}-Q Quiz</span>
            {progress?.quizCompleted && <span className="text-xs">✓</span>}
          </button>

          <button
            onClick={() => setActiveTab("progress")}
            className={`btn-press flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeTab === "progress"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>📊 Status</span>
          </button>
        </div>

        {/* SECTION 1: NOTES (EMBEDDED INLINE PDF VIEWER & MULTI-PAGE NOTES) */}
        <div className={activeTab === "notes" ? "block" : "hidden"}>
          <EmbeddedPdfViewer
            topicId={topic.id}
            topicTitle={topic.title}
            courseTitle={topic.module?.course?.title || "Computer Science & Engineering"}
            moduleTitle={topic.module?.title || "Core Concepts"}
            category={topic.module?.course?.category || "Engineering"}
            estimatedTime={topic.estimatedTime || "25-30 mins"}
            initialContent={topic.notesContent || ""}
            onMarkCompleted={handleToggleNotes}
            isCompleted={progress?.notesCompleted}
          />
        </div>

        {/* SECTION 2: FREE VIDEO LECTURES (PRD §19) */}
        <div className={activeTab === "videos" ? "block" : "hidden"}>
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm backdrop-blur-xs">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Curated Free YouTube Lectures</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Publicly available high-yield tutorials from verified educators.
                </p>
              </div>
              <button
                onClick={handleToggleVideo}
                disabled={updating}
                className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  progress?.videoCompleted
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                    : "bg-blue-600 text-white hover:bg-blue-500 shadow-xs"
                }`}
              >
                {progress?.videoCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Videos Watched ✓</span>
                  </>
                ) : (
                  <span>Mark Videos as Watched</span>
                )}
              </button>
            </div>

            <div className="space-y-4">
              {topic.videos && topic.videos.length > 0 ? (
                topic.videos.map((vid: any) => (
                  <div
                    key={vid.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 transition-all bg-slate-50/60 dark:bg-slate-950/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
                        <Play className="w-5 h-5 fill-red-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{vid.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {vid.channel} • {vid.duration}
                        </p>
                        {vid.description && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{vid.description}</p>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/learn/video/${vid.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs transition-colors flex-shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 mr-1.5 fill-white" />
                      Watch Video Inside Platform
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-xs">
                  No videos attached yet for this topic.
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Ready to test your knowledge? Take the {topic.quiz?.questionCount || 30}-question quiz.
              </span>
              <button
                onClick={() => setActiveTab("quiz")}
                className="inline-flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500"
              >
                <span>Go to {topic.quiz?.questionCount || 30}-Q Quiz</span>
                <ChevronRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: PRACTICE QUIZ (PRD §21, §22) */}
        <div className={activeTab === "quiz" ? "block animate-fade-in-up" : "hidden"}>
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm backdrop-blur-xs">
            <div className="max-w-xl mx-auto text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4 shadow-inner animate-float">
                <HelpCircle className="w-8 h-8" />
              </div>

              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                Ready for the {topic.title} Quiz?
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                Test your understanding with our rigorous {topic.quiz?.questionCount || 30}-question assessment. Score ≥80% to demonstrate proficiency and unlock the next roadmap milestone.
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8 text-left text-xs bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 card-hover">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Total Questions</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">{topic.quiz?.questionCount || 30} Questions</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Passing Rule</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">≥ 80% to Unlock</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Relearn Threshold</span>
                  <span className="text-sm font-black text-amber-600 dark:text-amber-400">&lt; 60% Relearn</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Mastery Score</span>
                  <span className="text-sm font-black text-purple-600 dark:text-purple-400">&gt; 90% Mastered</span>
                </div>
              </div>

              {progress?.bestQuizScore > 0 && (
                <div className="mb-6 inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 rounded-full text-xs font-bold text-blue-700 dark:text-blue-300 animate-scale-in">
                  <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Your Best Score: {progress.bestQuizScore}% ({progress.status})</span>
                </div>
              )}

              <div>
                <Link
                  href={`/quizzes/${topic.quiz?.id || topic.slug}?topicId=${topic.id}&courseId=${topic.module?.course?.id || ""}`}
                  className="btn-press inline-flex items-center justify-center py-3.5 px-8 rounded-xl font-black text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-md hover:shadow-blue-500/25 transition-all"
                >
                  <Play className="w-4 h-4 mr-2 fill-white" />
                  Start {topic.quiz?.questionCount || 30}-Question Quiz Now →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: PROGRESS BREAKDOWN (PRD §20, §32) */}
        <div className={activeTab === "progress" ? "block animate-fade-in-up" : "hidden"}>
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm backdrop-blur-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Topic Progress Breakdown</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 card-hover transition-all">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  1. Notes Studied
                </span>
                <span
                  className={`text-sm font-bold flex items-center ${
                    progress?.notesCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                  }`}
                >
                  {progress?.notesCompleted ? "✓ Completed" : "○ In Progress"}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 card-hover transition-all">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  2. Video Learning
                </span>
                <span
                  className={`text-sm font-bold flex items-center ${
                    progress?.videoCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                  }`}
                >
                  {progress?.videoCompleted ? "✓ Watched" : "○ Pending"}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 card-hover transition-all">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  3. Quiz Status
                </span>
                <span
                  className={`text-sm font-bold flex items-center ${
                    progress?.quizCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                  }`}
                >
                  {progress?.quizCompleted
                    ? `✓ Passed (${progress.bestQuizScore}%)`
                    : "○ Quiz Pending"}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200 leading-relaxed card-hover">
              <span className="font-bold block mb-1 text-slate-900 dark:text-white">Adaptive Progression Rule:</span>
              Once you complete the quiz with at least 80%, this topic will be marked as Completed and the next roadmap topic will automatically unlock!
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
