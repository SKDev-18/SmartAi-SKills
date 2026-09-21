"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { SessionUser } from "@/types";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Users,
  BookOpen,
  Award,
  Building,
} from "lucide-react";
import Link from "next/link";

export default function AdminAnalyticsPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();
        if (userData.user) setUser(userData.user);

        const res = await fetch("/api/admin/analytics");
        const data = await res.json();
        setAnalytics(data);
        if (data.domainAverages && data.domainAverages.length > 0) {
          setSelectedDomain(data.domainAverages[0].domain);
        }
      } catch (err) {
        console.error("Analytics load failed", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const selectedDomainData = analytics.domainAverages.find(
    (d: any) => d.domain === selectedDomain
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {user && <Header user={user} />}

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Organization Skill Gap & Competency Analytics
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Deep-dive metrics across divisions, cadres, and official statistical domains (PRD §19 & §50)
            </p>
          </div>

          {/* Top Priority Cards (PRD §19) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.topLearningPriorities.map((tp: any) => (
              <div
                key={tp.rank}
                onClick={() => setSelectedDomain(tp.domain)}
                className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                  selectedDomain === tp.domain
                    ? "bg-white border-blue-600 ring-1 ring-blue-600 shadow-md"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Priority #{tp.rank}
                  </span>
                  <span className="font-bold text-slate-900">{tp.averageScore}%</span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{tp.domain}</h3>
                <div className="text-xs text-slate-500 mt-1">
                  Average gap: {tp.gapPercentage} percentage points
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Affected Officers</span>
                  <span className="font-bold text-blue-700">
                    ~{tp.affectedLearnersCount} Enrolled
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Breakdown Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Domain Overview Table & Selector (PRD §19) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4">
                Competency Area Score Breakdown
              </h2>

              <div className="divide-y divide-slate-100">
                {analytics.domainAverages.map((item: any) => (
                  <div
                    key={item.domain}
                    onClick={() => setSelectedDomain(item.domain)}
                    className={`py-3.5 px-3 rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                      selectedDomain === item.domain
                        ? "bg-blue-50/70 text-blue-900 font-semibold"
                        : "hover:bg-slate-50 text-slate-800"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{item.domain}</div>
                      <div className="text-xs text-slate-500">
                        Evaluations Recorded: {item.count}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-base font-extrabold">{item.average}%</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.average >= 75
                            ? "bg-emerald-100 text-emerald-800"
                            : item.average >= 60
                            ? "bg-blue-100 text-blue-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {item.average >= 75
                          ? "Target Met"
                          : item.average >= 60
                          ? "Developing"
                          : "Needs Improvement"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Domain Drilldown Card (PRD §19) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
              {selectedDomainData ? (
                <>
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      Domain Drilldown
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {selectedDomainData.domain}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        Org Average
                      </span>
                      <div className="text-2xl font-black text-slate-900 mt-0.5">
                        {selectedDomainData.average}%
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        Benchmark Gap
                      </span>
                      <div className="text-2xl font-black text-amber-700 mt-0.5">
                        {Math.max(0, 75 - selectedDomainData.average)} pts
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-700 mb-2">
                      Recommended Capacity Interventions
                    </h4>
                    <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 text-xs text-blue-950 space-y-1.5">
                      <p className="font-semibold">
                        • Deploy targeted 10-question practice quizzes to NSSO & DES cadres.
                      </p>
                      <p className="font-semibold">
                        • Assign mandatory iGOT course modules covering {selectedDomainData.domain}.
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/admin/generator`}
                    className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    Generate Targeted Quiz for {selectedDomainData.domain}
                  </Link>
                </>
              ) : null}
            </div>
          </div>

          {/* Department Breakdown (PRD §50) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Building className="w-4 h-4 text-slate-600" />
              <h2 className="text-base font-bold text-slate-900">
                Learner Distribution by Statistical Division
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {analytics.departmentBreakdown?.map((d: any) => (
                <div
                  key={d.department}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70"
                >
                  <span className="text-xs font-bold text-slate-800 block">
                    {d.department}
                  </span>
                  <div className="text-xl font-extrabold text-blue-900 mt-1">
                    {d.learnerCount} Officers
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Active capacity profile
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
