"use client";

import React from "react";
import { GraduationCap } from "lucide-react";

interface OnboardingHeaderProps {
  currentStep: 1 | 2 | 3 | 4 | 5;
  title: string;
  subtitle: string;
}

export default function OnboardingHeader({ currentStep, title, subtitle }: OnboardingHeaderProps) {
  const steps = [
    { num: 1, label: "Basic Profile" },
    { num: 2, label: "Engineering Profile" },
    { num: 3, label: "Current Skills" },
    { num: 4, label: "Learning Goals" },
    { num: 5, label: "Platform Source" },
  ];

  return (
    <div className="mb-6 text-center max-w-lg mx-auto">
      {/* Brand Icon */}
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 mb-3">
        <GraduationCap className="w-6 h-6" />
      </div>

      {/* Progress Dots & Lines */}
      <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 my-3">
        {steps.map((s, idx) => (
          <React.Fragment key={s.num}>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                s.num < currentStep
                  ? "bg-emerald-500 text-white"
                  : s.num === currentStep
                  ? "bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
              }`}
            >
              {s.num < currentStep ? "✓" : s.num}
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`w-7 sm:w-10 h-1 rounded-full transition-colors ${
                  s.num < currentStep ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
        Step {currentStep} of 5 • {steps[currentStep - 1].label}
      </span>

      <h1 className="text-2xl font-black text-slate-900 dark:text-white">{title}</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{subtitle}</p>
    </div>
  );
}
