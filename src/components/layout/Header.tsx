"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Shield, Sparkles, BookOpen, GraduationCap } from "lucide-react";
import { SessionUser } from "@/types";

import { auth, signOut } from "@/lib/firebase";
import { clearClientCache } from "@/lib/clientCache";

import ThemeToggle from "@/components/theme/ThemeToggle";

interface HeaderProps {
  user: SessionUser;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Preserve theme selection before clearing storage
      const savedTheme = typeof window !== "undefined" ? localStorage.getItem("nexstep_theme") : null;

      // 2. Purge client-side memory cache and storage immediately
      clearClientCache();
      if (typeof window !== "undefined") {
        try {
          sessionStorage.clear();
          localStorage.clear();
          if (savedTheme) localStorage.setItem("nexstep_theme", savedTheme);
        } catch {}
      }

      // 3. Sign out of Firebase if initialized
      try {
        await signOut(auth);
      } catch (fbErr) {
        console.warn("Firebase signout note:", fbErr);
      }

      // 4. Clear server session cookie
      await fetch("/api/auth/logout", { method: "POST" });

      // 5. Force hard navigation to /login to ensure clean state
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
      window.location.href = "/login";
    }
  };

  const isAdmin = user.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md shadow-xs transition-colors duration-200">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                NexStep <span className="text-blue-500">AI</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              AI-Powered Personalized Learning Platform
            </p>
          </div>
        </Link>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link
            href="/profile"
            className="hidden md:flex flex-col items-end hover:opacity-90 transition group p-1 rounded-lg"
          >
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
              {user.name}
            </span>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="truncate max-w-[180px]">
                {user.branch || user.department || "Engineering"}
              </span>
              {user.year && (
                <>
                  <span>•</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{user.year}</span>
                </>
              )}
            </div>
          </Link>

          {/* Theme Switcher */}
          <ThemeToggle />

          <div className="flex items-center space-x-1.5 border-l border-slate-200 dark:border-slate-800 pl-2 sm:pl-3">
            <Link
              href="/profile"
              className="btn-press p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all"
              title="Edit Profile & Skills"
            >
              <UserIcon className="w-4 h-4" />
            </Link>

            {isAdmin ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800/60">
                <Shield className="w-3 h-3 mr-1 text-purple-600 dark:text-purple-400" />
                Admin
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60">
                Learner
              </span>
            )}

            <button
              onClick={handleLogout}
              className="btn-press p-2 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
