"use client";

import React, { useEffect, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, HelpCircle, TrendingUp, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { prefetchAllTabs, prefetchTab } from "@/lib/clientCache";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Learn", href: "/learn", icon: BookOpen },
  { name: "Quizzes", href: "/quizzes", icon: HelpCircle },
  { name: "Progress", href: "/competencies", icon: TrendingUp },
];

function LearnerNavComponent() {
  const pathname = usePathname();

  // Idle pre-warm all tab routes and APIs on client load
  useEffect(() => {
    prefetchAllTabs();
  }, []);

  return (
    <>
      {/* Desktop Top Navigation Bar */}
      <nav className="hidden md:block bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-12">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={true}
                  onMouseEnter={() => prefetchTab(item.name)}
                  onTouchStart={() => prefetchTab(item.name)}
                  className={clsx(
                    "group inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "border-blue-500 text-blue-600 dark:text-blue-400 font-bold"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700"
                  )}
                >
                  <Icon className={clsx(
                    "w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-blue-600 dark:text-blue-400 animate-float" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                  )} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl px-2 py-1 transition-colors duration-200">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                onMouseEnter={() => prefetchTab(item.name)}
                onTouchStart={() => prefetchTab(item.name)}
                className={clsx(
                  "btn-press flex flex-col items-center justify-center py-2 text-xs font-medium rounded-xl transition-all duration-200",
                  isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-500/10 font-bold shadow-xs border border-blue-500/20"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 active:bg-slate-100 dark:active:bg-slate-800/60"
                )}
              >
                <Icon className={clsx(
                  "w-5 h-5 mb-0.5 transition-transform duration-200",
                  isActive ? "scale-110 text-blue-600 dark:text-blue-400" : ""
                )} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

const LearnerNav = memo(LearnerNavComponent);
export default LearnerNav;
