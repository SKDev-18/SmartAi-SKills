"use client";

import { useState } from "react";
import { CheckCircle2, Check, Loader2 } from "lucide-react";

interface VideoCompleteButtonProps {
  videoId: string;
  initialCompleted?: boolean;
}

export default function VideoCompleteButton({
  videoId,
  initialCompleted = false,
}: VideoCompleteButtonProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  const handleMarkComplete = async () => {
    if (completed || loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/videos/${videoId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setCompleted(true);
      }
    } catch (err) {
      console.error("Failed to mark video complete", err);
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold animate-fadeIn">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        <span>Video Completed ✓</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleMarkComplete}
      disabled={loading}
      className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Check className="w-4 h-4 stroke-[3]" />
      )}
      <span>Mark as Completed</span>
    </button>
  );
}
