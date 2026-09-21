"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Award,
  BookOpen,
  Sparkles,
  HelpCircle,
  BarChart3,
  Network,
  Settings,
} from "lucide-react";
import { clsx } from "clsx";

const adminNavItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Learners", href: "/admin/learners", icon: Users },
  { name: "Competencies", href: "/admin/competencies", icon: Award },
  { name: "Learning Materials", href: "/admin/materials", icon: BookOpen },
  { name: "AI Question Generator", href: "/admin/generator", icon: Sparkles },
  { name: "Quizzes", href: "/admin/quizzes", icon: HelpCircle },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "iGOT Integration", href: "/admin/igot", icon: Network },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 border-r border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Admin Administration
          </span>
        </div>

        <nav className="space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Icon className={clsx("w-5 h-5 mr-3", isActive ? "text-white" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 pt-4 px-3">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          <p className="font-medium text-slate-800 dark:text-slate-300">NexStep AI Platform</p>
          <p className="mt-0.5">Adaptive Intelligence Node 2.4</p>
        </div>
      </div>
    </aside>
  );
}
