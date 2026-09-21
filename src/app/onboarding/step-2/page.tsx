"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import { ArrowRight, ArrowLeft, School, BookOpen } from "lucide-react";
import Link from "next/link";

const BRANCH_OPTIONS = [
  "Computer Engineering",
  "Information Technology",
  "Artificial Intelligence & Data Science",
  "Artificial Intelligence & Machine Learning",
  "Electronics & Telecommunication",
  "Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Other",
];

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate / Other"];

const SEMESTER_OPTIONS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

const GRAD_YEARS = ["2025", "2026", "2027", "2028", "2029", "2030"];

export default function OnboardingStep2Page() {
  const router = useRouter();
  const [branch, setBranch] = useState("Computer Engineering");
  const [year, setYear] = useState("2nd Year");
  const [semester, setSemester] = useState("Semester 3");
  const [college, setCollege] = useState("");
  const [graduationYear, setGraduationYear] = useState("2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          if (data.user.branch) setBranch(data.user.branch);
          if (data.user.year) setYear(data.user.year);
          if (data.user.semester) setSemester(data.user.semester);
          if (data.user.college) setCollege(data.user.college);
          if (data.user.graduationYear) setGraduationYear(data.user.graduationYear);
        }
      } catch (err) {
        console.error("Failed to load user", err);
      }
    }
    loadUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!college.trim()) {
      setError("Please enter your College or University name.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 2,
          branch,
          year,
          semester,
          college: college.trim(),
          graduationYear,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to save engineering profile.");
      }

      router.push("/onboarding/step-3");
    } catch (err: any) {
      setError(err?.message || "Failed to save engineering profile.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-xl mx-auto w-full">
        <OnboardingHeader
          currentStep={2}
          title="Your Engineering Profile"
          subtitle="Tell us about your academic background to unlock relevant roadmaps."
        />

        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl backdrop-blur-md p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Engineering Branch */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Engineering Branch <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="block w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {BRANCH_OPTIONS.map((b) => (
                  <option key={b} value={b} className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200">
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Year & Semester */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Current Year <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="block w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {YEAR_OPTIONS.map((y) => (
                    <option key={y} value={y} className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200">
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Current Semester <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="block w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {SEMESTER_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* College / University */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                College / University <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-lg shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <School className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. Pune Institute of Computer Technology (PICT)"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Expected Graduation Year */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Expected Graduation Year <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="block w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {GRAD_YEARS.map((gy) => (
                  <option key={gy} value={gy} className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200">
                    {gy}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
              <Link
                href="/onboarding/step-1"
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
                <span>{loading ? "Saving..." : "Continue to Skills Selection"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
