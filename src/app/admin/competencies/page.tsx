"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { SessionUser } from "@/types";
import { Award, Plus, Check, Edit2 } from "lucide-react";

export default function AdminCompetenciesPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();
        if (userData.user) setUser(userData.user);

        const res = await fetch("/api/competencies");
        const data = await res.json();
        if (data.competencies) setCompetencies(data.competencies);
      } catch (err) {
        console.error("Init error", err);
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
                Official Statistical Competency Framework
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Configure domains, sub-competency topics, and target benchmark thresholds for national capacity building (PRD §7)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competencies.map((comp) => (
              <div
                key={comp.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {comp.domain}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      Target Benchmark: {comp.targetLevel}%
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{comp.name}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {comp.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <h4 className="text-[11px] font-bold uppercase text-slate-400 mb-2">
                      Sub-Competencies ({comp.topics?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {comp.topics?.map((t: any) => (
                        <span
                          key={t.id}
                          className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Code: {comp.code}</span>
                  <span className="text-emerald-700 font-semibold flex items-center">
                    <Check className="w-3.5 h-3.5 mr-1" /> Active Framework
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
