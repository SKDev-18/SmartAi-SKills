"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by rendering a neutral placeholder until mounted
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={`p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 transition-colors ${className}`}
      >
        <span className="w-4 h-4 block" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`btn-press group relative flex items-center space-x-2 p-2 rounded-xl border transition-all duration-200 ${
        isDark
          ? "border-slate-800 bg-slate-900/80 text-amber-400 hover:bg-slate-800 hover:border-slate-700 shadow-sm"
          : "border-slate-200 bg-slate-100 text-indigo-600 hover:bg-slate-200/80 hover:border-slate-300 shadow-sm"
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-semibold select-none text-slate-700 dark:text-slate-200">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}
