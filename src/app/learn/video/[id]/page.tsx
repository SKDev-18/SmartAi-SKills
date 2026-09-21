import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import LearnerNav from "@/components/layout/LearnerNav";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";
import YouTubePlayer from "@/components/video/YouTubePlayer";
import VideoCompleteButton from "@/components/video/VideoCompleteButton";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  HelpCircle,
  Play,
  Share2,
  Sparkles,
  Tv,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function VideoLearningPage({ params }: PageProps) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  // Fetch the video with topic, course, quizzes
  const video = await prisma.topicVideo.findUnique({
    where: { id: params.id },
    include: {
      topic: {
        include: {
          module: {
            include: {
              course: true,
            },
          },
          videos: {
            orderBy: { order: "asc" },
          },
          quizzes: {
            where: { isPublished: true },
            take: 1,
            include: {
              questions: { select: { id: true } },
            },
          },
        },
      },
    },
  });

  if (!video) {
    notFound();
  }

  // Check if current user has completed this video
  const videoProg = await prisma.videoProgress.findUnique({
    where: {
      userId_videoId: {
        userId: user.id,
        videoId: video.id,
      },
    },
  });

  const isCompleted = videoProg?.watchStatus === "WATCHED";

  // Related videos (other videos in this topic or module)
  const relatedVideos = video.topic.videos.filter((v) => v.id !== video.id);

  // Associated quiz
  const topicQuiz = video.topic.quizzes[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col pb-20 md:pb-12 transition-colors duration-200">
      <Header user={user} />
      <LearnerNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 w-full flex-1">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-5">
          <Link
            href={`/learn/${video.topic.slug}`}
            className="inline-flex items-center hover:text-blue-600 dark:hover:text-blue-400 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to {video.topic.title}
          </Link>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-600 dark:text-slate-400 truncate max-w-xs">{video.topic.module.course.title}</span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">{video.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video & Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Embedded YouTube Player (Prompt §19, §20) */}
            <div className="bg-black dark:bg-slate-950 rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
              <YouTubePlayer youtubeUrlOrId={video.youtubeUrl} title={video.title} />
            </div>

            {/* Video Header & Meta */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="inline-flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1.5">
                    <Tv className="w-3.5 h-3.5" />
                    <span>{video.topic.title}</span>
                    <span>•</span>
                    <span>{video.duration}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {video.title}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Channel: <span className="text-slate-800 dark:text-slate-200 font-bold">{video.channel}</span> • Free
                    Verified Educational Resource
                  </p>
                </div>

                {/* Mark as Complete Button (Client Component) */}
                <div className="flex-shrink-0">
                  <VideoCompleteButton videoId={video.id} initialCompleted={isCompleted} />
                </div>
              </div>

              {/* Learning Objective (Prompt §21 #6) */}
              <div className="mt-5 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs leading-relaxed">
                <div className="flex items-center space-x-1.5 font-bold text-blue-700 dark:text-blue-300 mb-1">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Why watch this video:</span>
                </div>
                <p className="text-blue-900 dark:text-blue-100">
                  {video.learningObjective ||
                    `Master foundational to practical applications of ${video.topic.title} with crystal-clear visual explanations and coding examples.`}
                </p>
              </div>

              {/* Description */}
              {video.description && (
                <div className="mt-5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <h3 className="font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider text-[11px]">
                    Video Overview
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">{video.description}</p>
                </div>
              )}
            </div>

            {/* Next Learning Action (Prompt §21 #9, §23) */}
            <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 border border-indigo-700/50 text-white rounded-2xl p-6 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 block mb-1">
                    Next Learning Action
                  </span>
                  <h3 className="text-lg font-black text-white">
                    {topicQuiz
                      ? "Ready to test yourself on this topic?"
                      : `Continue with ${video.topic.title} notes`}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-md">
                    {topicQuiz
                      ? `Take the comprehensive practice quiz (${topicQuiz.questions?.length || 30} Questions). Score 80% or higher to unlock the next milestone.`
                      : "Read the comprehensive formula derivations, code templates, and notes."}
                  </p>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                  <Link
                    href={`/learn/${video.topic.slug}`}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/10"
                  >
                    Read Notes
                  </Link>

                  {topicQuiz && (
                    <Link
                      href={`/quizzes/${topicQuiz.id}`}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg transition-all flex items-center space-x-1.5"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Start Quiz ({topicQuiz.questions?.length || 30} Q) →</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Related Videos & Topic Outline */}
          <div className="space-y-6">
            {/* Related Videos Card */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm backdrop-blur-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                <span>Related Topic Videos</span>
                <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                  {relatedVideos.length + 1} total
                </span>
              </h3>

              <div className="space-y-2.5">
                {/* Current Active Video Item */}
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                    <Play className="w-4 h-4 fill-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{video.title}</p>
                    <p className="text-[11px] text-blue-700 dark:text-blue-300">Now Playing • {video.duration}</p>
                  </div>
                </div>

                {/* Other Related Videos */}
                {relatedVideos.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/learn/video/${rel.id}`}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/70 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all flex items-start space-x-3 group text-left block"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 group-hover:bg-red-100 dark:group-hover:bg-red-950/60 text-slate-600 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 border border-slate-300 dark:border-slate-700 group-hover:border-red-200 dark:group-hover:border-red-800/60 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Play className="w-4 h-4 group-hover:fill-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors">
                        {rel.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {rel.channel} • {rel.duration}
                      </p>
                    </div>
                  </Link>
                ))}

                {relatedVideos.length === 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-3 text-center">
                    This is the featured lecture for this topic.
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 backdrop-blur-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Topic Learning Kit</h3>

              <Link
                href={`/learn/${video.topic.slug}`}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white group"
              >
                <div className="flex items-center space-x-2.5">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Topic Notes & Formulations</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {topicQuiz && (
                <Link
                  href={`/quizzes/${topicQuiz.id}?topicId=${video.topic.id}&courseId=${video.topic.module.course.id}`}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white group"
                >
                  <div className="flex items-center space-x-2.5">
                    <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Practice Quiz ({topicQuiz.questions?.length || 5} Q)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
