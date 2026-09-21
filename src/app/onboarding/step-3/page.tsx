"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import { ArrowRight, ArrowLeft, Check, Sparkles, Layers } from "lucide-react";
import Link from "next/link";
import { getSkillsForBranch } from "@/lib/branch-skills";

interface SelectedSkill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

export default function OnboardingStep3Page() {
  const router = useRouter();
  const [branch, setBranch] = useState("Computer Engineering");
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Record<string, "Beginner" | "Intermediate" | "Advanced">>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          const userBranch = data.user.branch || "Computer Engineering";
          setBranch(userBranch);
          const skillsList = getSkillsForBranch(userBranch);
          setAvailableSkills(skillsList);

          if (data.user.skills) {
            try {
              const parsed = JSON.parse(data.user.skills);
              const map: Record<string, "Beginner" | "Intermediate" | "Advanced"> = {};
              parsed.forEach((s: any) => {
                map[s.name] = s.level || "Beginner";
              });
              if (Object.keys(map).length > 0) {
                setSelectedSkills(map);
              }
            } catch {}
          }
        }
      } catch (err) {
        console.error("Failed to load user branch", err);
      }
    }
    loadUser();
  }, []);

  const toggleSkill = (skillName: string) => {
    setSelectedSkills((prev) => {
      const next = { ...prev };
      if (next[skillName]) {
        delete next[skillName];
      } else {
        next[skillName] = "Beginner";
      }
      return next;
    });
  };

  const setLevel = (skillName: string, level: "Beginner" | "Intermediate" | "Advanced", e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSkills((prev) => ({
      ...prev,
      [skillName]: level,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const skillsArray: SelectedSkill[] = Object.entries(selectedSkills).map(([name, level]) => ({
      name,
      level,
    }));

    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 3,
          skills: skillsArray,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to save skills.");
      }

      router.push("/onboarding/step-4");
    } catch (err: any) {
      setError(err?.message || "Failed to save skills.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-2xl mx-auto w-full">
        <OnboardingHeader
          currentStep={3}
          title="What skills do you already have?"
          subtitle={`Showing skills tailored for ${branch}. Pick what you know to skip redundant basics.`}
        />

        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl backdrop-blur-md p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{Object.keys(selectedSkills).length} skills selected</span>
            <span>Click any card to select/deselect and choose your level</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
              {availableSkills.map((skill) => {
                const isSelected = Boolean(selectedSkills[skill]);
                const currentLevel = selectedSkills[skill] || "Beginner";

                return (
                  <div
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 shadow-xs shadow-blue-500/10"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-950/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${isSelected ? "text-blue-700 dark:text-blue-300" : "text-slate-800 dark:text-slate-200"}`}>
                        {skill}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                          isSelected ? "bg-blue-600 text-white" : "border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    {/* Skill Level Selector (PRD §9) */}
                    {isSelected && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-1">
                        {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={(e) => setLevel(skill, lvl, e)}
                            className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                              currentLevel === lvl
                                ? "bg-blue-600 text-white shadow-xs"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
              <Link
                href="/onboarding/step-2"
                className="inline-flex items-center px-4 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                <span>{loading ? "Personalizing Roadmap..." : "Continue to Learning Goals"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
