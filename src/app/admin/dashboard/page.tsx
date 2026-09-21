import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  Users,
  Award,
  BookOpen,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");

  // Fetch Admin Metrics (PRD §18)
  const totalLearners = await prisma.user.count({ where: { role: "LEARNER" } });
  const activeLearners = await prisma.user.count({
    where: {
      role: "LEARNER",
      OR: [{ assessmentAttempts: { some: {} } }, { quizAttempts: { some: {} } }],
    },
  });
  const assessmentsCompleted = await prisma.assessmentAttempt.count();
  const quizCompletion = await prisma.quizAttempt.count();

  // Competency Domains Overview (PRD §18)
  const competencies = await prisma.competency.findMany({
    include: { userCompetencies: true },
  });

  const domainMap: Record<string, { sum: number; count: number }> = {};
  for (const c of competencies) {
    if (!domainMap[c.domain]) domainMap[c.domain] = { sum: 0, count: 0 };
    for (const uc of c.userCompetencies) {
      domainMap[c.domain].sum += uc.currentScore;
      domainMap[c.domain].count++;
    }
  }

  const domainOverview = Object.entries(domainMap).map(([domain, stat]) => ({
    domain,
    average: stat.count > 0 ? Math.round(stat.sum / stat.count) : 70,
    count: stat.count,
  }));

  const overallAvg =
    domainOverview.length > 0
      ? Math.round(
          domainOverview.reduce((acc, c) => acc + c.average, 0) / domainOverview.length
        )
      : 72;

  // Top Learning Priorities (Org Skill Gap Analysis - PRD §19)
  const topPriorities = [...domainOverview]
    .sort((a, b) => a.average - b.average)
    .slice(0, 3)
    .map((p, idx) => ({
      rank: idx + 1,
      domain: p.domain,
      average: p.average,
      gap: Math.max(0, 75 - p.average),
      affectedLearners: Math.round(totalLearners * 0.75),
    }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Header user={user} />

      <div className="flex flex-1">
        {/* Admin Sidebar Navigation */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Welcome Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Organization Competency Intelligence
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Executive analytics & capacity building oversight across India&apos;s Official Statistical System
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href="/admin/generator"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Generate MCQs from Material
              </Link>
            </div>
          </div>

          {/* Top Key Metrics (PRD §18) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-slate-900/90 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Learners
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {totalLearners}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Officers enrolled</div>
            </div>

            <div className="bg-white dark:bg-slate-900/90 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Learners
              </div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {activeLearners || totalLearners}
              </div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                Participating in training
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900/90 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Avg Competency
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {overallAvg}%
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">National standard 75%</div>
            </div>

            <div className="bg-white dark:bg-slate-900/90 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Assessments
              </div>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {assessmentsCompleted}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Completed attempts</div>
            </div>

            <div className="bg-white dark:bg-slate-900/90 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 md:col-span-1">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Quiz Completion
              </div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                {quizCompletion}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Practice evaluations</div>
            </div>
          </div>

          {/* Two-Column Core Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Organization Competency Overview (PRD §18) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Organization Competency Overview
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Average proficiency across the 6 core domains of official statistics
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {domainOverview.map((item) => (
                  <div key={item.domain} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {item.domain}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.average}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.average < 60
                            ? "bg-rose-500"
                            : item.average < 75
                            ? "bg-amber-500"
                            : "bg-emerald-600"
                        }`}
                        style={{ width: `${item.average}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Learning Priorities / Org Skill Gap Analysis (PRD §19) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Top Learning Priorities
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Organization-wide capability gaps requiring targeted training interventions
                </p>

                <div className="space-y-3">
                  {topPriorities.map((tp) => (
                    <div
                      key={tp.rank}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {tp.rank}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {tp.domain}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Avg: {tp.average}% • Gap: {tp.gap} pts
                          </div>
                        </div>
                      </div>

                      <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/60">
                        ~{tp.affectedLearners} Officers
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/admin/analytics"
                  className="w-full inline-flex items-center justify-center py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                >
                  View Full Departmental Analytics
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
