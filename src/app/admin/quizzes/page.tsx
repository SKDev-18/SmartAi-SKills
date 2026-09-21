"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { SessionUser } from "@/types";
import { HelpCircle, CheckCircle, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminQuizzesPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();
        if (userData.user) setUser(userData.user);

        const res = await fetch("/api/quizzes");
        const data = await res.json();
        if (data.quizzes) setQuizzes(data.quizzes);
      } catch (err) {
        console.error("Failed to load quizzes", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {user && <Header user={user} />}

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Quiz Management & Assessment Publishing
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Monitor and manage active quizzes deployed across India&apos;s Official Statistical System
              </p>
            </div>

            <Link
              href="/admin/generator"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Generate New Quiz
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Published Quizzes ({quizzes.length})
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900">
                        {quiz.title}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Active / Published
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">{quiz.description}</p>

                    <div className="flex items-center space-x-4 text-xs text-slate-400 pt-1">
                      <span>Topic: <strong className="text-slate-700">{quiz.topic}</strong></span>
                      <span>•</span>
                      <span>Questions: <strong className="text-slate-700">{quiz.questionCount}</strong></span>
                      <span>•</span>
                      <span>Pass Requirement: <strong className="text-slate-700">{quiz.passPercentage}%</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/quizzes/${quiz.id}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs"
                    >
                      Preview Quiz
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
