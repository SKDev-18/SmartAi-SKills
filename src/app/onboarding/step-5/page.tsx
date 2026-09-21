"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import { ArrowRight, ArrowLeft, Check, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const SOURCES = [
  { id: "YouTube", label: "YouTube" },
  { id: "Instagram", label: "Instagram" },
  { id: "LinkedIn", label: "LinkedIn" },
  { id: "College", label: "College / Faculty" },
  { id: "Friend / Classmate", label: "Friend / Classmate" },
  { id: "Google Search", label: "Google Search" },
  { id: "Technical Event", label: "Coding Competition / Technical Event" },
  { id: "Other", label: "Other" },
];

export default function OnboardingStep5Page() {
  const router = useRouter();
  const [selectedSource, setSelectedSource] = useState("YouTube");
  const [otherText, setOtherText] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("Data Analytics");
  const [loading, setLoading] = useState(false);
  const [personalizing, setPersonalizing] = useState(false);
  const [personalizeStep, setPersonalizeStep] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user?.primaryLearningGoal) {
          setPrimaryGoal(data.user.primaryLearningGoal);
        } else if (data.user?.targetSkill) {
          setPrimaryGoal(data.user.targetSkill);
        }
      } catch {}
    }
    loadUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const finalSource = selectedSource === "Other" && otherText.trim() ? otherText.trim() : selectedSource;

    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 5,
          referralSource: finalSource,
          finishSetup: true,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Failed to finalize onboarding.");
      }

      // Show animated personalization state per Prompt §51
      setPersonalizing(true);
      setTimeout(() => setPersonalizeStep(2), 600);
      setTimeout(() => setPersonalizeStep(3), 1200);
      setTimeout(() => setPersonalizeStep(4), 1800);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2300);
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
      setLoading(false);
      setPersonalizing(false);
    }
  };

  if (personalizing) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-6 text-center transition-colors duration-200">
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl dark:shadow-2xl max-w-md w-full backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>

          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
            Personalizing your learning experience...
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
            Building your adaptive roadmap according to your engineering profile and learning goals.
          </p>

          <div className="space-y-3.5 text-left max-w-xs mx-auto text-xs">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Analyzing prior skills & baseline</span>
            </div>

            <div className="flex items-center space-x-2.5">
              {personalizeStep >= 2 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0" />
              )}
              <span className={personalizeStep >= 2 ? "font-semibold text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}>
                Configuring {primaryGoal} milestone roadmap
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              {personalizeStep >= 3 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0" />
              )}
              <span className={personalizeStep >= 3 ? "font-semibold text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}>
                Structuring adaptive quiz thresholds
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              {personalizeStep >= 4 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0" />
              )}
              <span className={personalizeStep >= 4 ? "font-semibold text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}>
                Preparing your customized Home Feed
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-xl mx-auto w-full">
        <OnboardingHeader
          currentStep={5}
          title="How did you hear about us?"
          subtitle="Help us understand how students and engineering campuses discover NexStep."
        />

        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl backdrop-blur-md p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                Select Source <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SOURCES.map((src) => {
                  const isSelected = selectedSource === src.id;
                  return (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => setSelectedSource(src.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between text-xs font-semibold ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/30"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50/60 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <span className="truncate">{src.label}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                          isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedSource === "Other" && (
              <div className="animate-fadeIn">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Please specify
                </label>
                <input
                  type="text"
                  placeholder="e.g. Professor recommendation, Discord, etc."
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <Link
                href="/onboarding/step-4"
                className="inline-flex items-center text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to Learning Goals
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50"
              >
                {loading ? (
                  "Finalizing Setup..."
                ) : (
                  <>
                    <span>Finish Setup & Enter Platform</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
