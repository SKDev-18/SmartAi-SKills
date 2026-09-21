"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Check, BookOpen } from "lucide-react";
import { courseSlugToGoalName } from "@/lib/courses";

export interface LearningPathOption {
  slug: string;
  name: string;
  isPrimary?: boolean;
}

interface LearningPathSelectorProps {
  currentCourseSlug: string;
  availablePaths: LearningPathOption[];
  onSelectPath?: (slug: string) => void;
  className?: string;
}

export default function LearningPathSelector({
  currentCourseSlug,
  availablePaths,
  onSelectPath,
  className = "",
}: LearningPathSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(currentCourseSlug);

  // Sync with prop changes
  useEffect(() => {
    if (currentCourseSlug) {
      setSelectedSlug(currentCourseSlug);
    }
  }, [currentCourseSlug]);

  const currentPath =
    availablePaths.find((p) => p.slug === selectedSlug) ||
    availablePaths.find((p) => p.slug === currentCourseSlug) ||
    availablePaths[0] || {
      slug: selectedSlug || currentCourseSlug,
      name: courseSlugToGoalName(selectedSlug || currentCourseSlug),
    };

  const handleSelectPath = (slug: string) => {
    setIsOpen(false);
    if (slug === selectedSlug) return;

    // 1. Instant UI update in state
    setSelectedSlug(slug);

    // 2. Immediate parent notification (instant 0ms content update)
    if (onSelectPath) {
      onSelectPath(slug);
    } else {
      // Dispatch event for any active page listeners and update URL without reload
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("path", slug);
        window.history.replaceState({}, "", url.toString());
        window.dispatchEvent(new CustomEvent("learning-path-change", { detail: { slug } }));
      }
    }

    // 3. Asynchronous background persistence (non-blocking, no page reload)
    fetch("/api/user/active-path", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseSlug: slug }),
    }).catch((err) => {
      console.error("Background sync for active path failed:", err);
    });
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <div className="flex items-center space-x-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Learning Path:
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-between space-x-2 px-3.5 py-1.5 rounded-xl border border-blue-400/40 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold transition-all shadow-xs"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="truncate max-w-[200px]">{currentPath.name}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-blue-600 dark:text-blue-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-30 animate-fadeIn backdrop-blur-md">
            <div className="px-3 py-1.5 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Switch Learning Path</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Instant</span>
            </div>

            <div className="max-h-60 overflow-y-auto py-1">
              {availablePaths.map((p) => {
                const isSelected = p.slug === selectedSlug;
                return (
                  <button
                    key={p.slug}
                    onClick={() => handleSelectPath(p.slug)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium"
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="truncate">{p.name}</span>
                      {p.isPrimary && (
                        <span className="text-[10px] bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded font-semibold flex-shrink-0">
                          Primary
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="px-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <a
                href="/learn?view=catalog"
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 block text-center py-1"
              >
                + Explore Course Catalog
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
