"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { SessionUser } from "@/types";
import { Users, Search, Filter, Award, CheckCircle, Clock } from "lucide-react";

export default function AdminLearnersPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [learners, setLearners] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();
        if (userData.user) setUser(userData.user);

        await fetchLearners();
      } catch (err) {
        console.error("Init error", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const fetchLearners = async (q = query, dept = department) => {
    try {
      const url = `/api/admin/learners?query=${encodeURIComponent(q)}&department=${encodeURIComponent(dept)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.learners) setLearners(data.learners);
    } catch (err) {
      console.error("Fetch learners error", err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLearners();
  };

  const departments = [
    "",
    "NSSO - Field Operations Division",
    "DES Maharashtra",
    "SDRD - Survey Design & Research Division",
    "CSO - Training Division",
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {user && <Header user={user} />}

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Learner & Officer Competency Roster
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Monitor individual competency profiles, assessment progress, and priority skill gaps (PRD §33)
              </p>
            </div>
            <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
              {learners.length} Registered Officers
            </div>
          </div>

          {/* Search & Filter Bar (PRD §33) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by officer name, employee ID, or designation..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="w-full md:w-64">
                <select
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    fetchLearners(query, e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">All Divisions & Cadres</option>
                  {departments.filter(Boolean).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors shadow-xs"
              >
                Filter
              </button>
            </form>
          </div>

          {/* Learners Roster Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Officer / Cadre</th>
                    <th className="py-3.5 px-4">Division</th>
                    <th className="py-3.5 px-4">Avg Competency</th>
                    <th className="py-3.5 px-4">Priority Skill Gaps</th>
                    <th className="py-3.5 px-4">Baseline Assessment</th>
                    <th className="py-3.5 px-4">Quizzes Taken</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {learners.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{l.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {l.designation} • {l.employeeId}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-700 font-medium">
                        {l.department}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {l.averageCompetency}%
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              l.averageCompetency >= 75
                                ? "bg-emerald-100 text-emerald-800"
                                : l.averageCompetency >= 60
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {l.averageCompetency >= 75 ? "Proficient" : "Developing"}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {l.priorityGaps?.length > 0 ? (
                            l.priorityGaps.map((gap: string, i: number) => (
                              <span
                                key={i}
                                className="inline-block text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mr-1.5"
                              >
                                {gap}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-semibold">
                              No major gaps
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {l.lastAssessment ? (
                          <div>
                            <span className="font-bold text-slate-900">
                              {l.lastAssessment.percentage}%
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                              {new Date(l.lastAssessment.completedAt).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Pending</span>
                        )}
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-800">
                        {l.totalQuizzesTaken} Attempts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
