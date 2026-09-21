"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AssistantPage() {
  const router = useRouter();

  useEffect(() => {
    // The Assistant is now a globally accessible floating AI mentor available on all pages
    router.replace("/dashboard?openAssistant=true");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] flex items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Redirecting to your Floating NexStep AI Mentor...
        </p>
      </div>
    </div>
  );
}
