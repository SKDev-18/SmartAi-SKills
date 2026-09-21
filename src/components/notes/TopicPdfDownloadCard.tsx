"use client";

import React, { useState } from "react";
import { FileDown, Download, Check, Sparkles, FileText, Loader2 } from "lucide-react";
import { downloadTopicNotesPdf } from "@/lib/pdf/generateNotesPdf";

interface TopicPdfDownloadCardProps {
  topicTitle: string;
  courseTitle?: string;
  moduleTitle?: string;
  category?: string;
  estimatedTime?: string;
  notesContent?: string | null;
  variant?: "card" | "compact" | "button";
  className?: string;
}

export default function TopicPdfDownloadCard({
  topicTitle,
  courseTitle = "Computer Science & Engineering",
  moduleTitle = "Core Module",
  category = "Engineering",
  estimatedTime = "15-20 mins",
  notesContent = "",
  variant = "card",
  className = "",
}: TopicPdfDownloadCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setDownloading(true);
    try {
      downloadTopicNotesPdf({
        title: topicTitle,
        courseName: courseTitle,
        moduleName: moduleTitle,
        category,
        estimatedTime,
        content: notesContent || undefined,
      });

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error("Failed to download notes PDF:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleDownload}
        disabled={downloading}
        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
          downloaded
            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
            : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
        } ${className}`}
        title={`Download ${topicTitle} Handwritten PDF Notes`}
      >
        {downloading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : downloaded ? (
          <Check className="w-3.5 h-3.5 text-emerald-600" />
        ) : (
          <FileDown className="w-3.5 h-3.5 text-blue-600" />
        )}
        <span>{downloaded ? "PDF Downloaded!" : "Notes PDF"}</span>
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition ${className}`}
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
            PDF
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-800 line-clamp-1">
              {topicTitle}
            </h5>
            <span className="text-[10px] text-slate-500">
              Handwritten-Style Study Notes • {estimatedTime}
            </span>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
        >
          {downloading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Download className="w-3 h-3" />
          )}
          <span>{downloaded ? "Saved" : "Download PDF"}</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-r from-slate-50 via-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-xl p-4 transition-all hover:shadow-xs ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs flex-shrink-0 mt-0.5">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 mb-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                PDF NOTEBOOK
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-500">{moduleTitle}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
              Handwritten Notes PDF: {topicTitle}
            </h4>
            <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
              Contains core definitions, derivations, syntax cheatsheets & exam tips.
            </p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition disabled:opacity-50 flex-shrink-0 self-start sm:self-center"
        >
          {downloading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : downloaded ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-300" />
              <span>Downloaded ✓</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Download Notes PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
