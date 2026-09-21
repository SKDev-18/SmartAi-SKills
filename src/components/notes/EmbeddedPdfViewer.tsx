"use client";

import React, { useState, useRef, useMemo } from "react";
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Maximize2,
  BookOpen,
} from "lucide-react";
import {
  downloadTopicNotesPdf,
  generateComprehensiveTopicNotes,
} from "@/lib/pdf/generateNotesPdf";
import { generateMultiPageNotesHtml } from "@/lib/pdf/generateNotesHtml";

interface EmbeddedPdfViewerProps {
  topicId: string;
  topicTitle: string;
  courseTitle?: string;
  moduleTitle?: string;
  category?: string;
  estimatedTime?: string;
  initialContent?: string;
  onMarkCompleted?: () => void;
  isCompleted?: boolean;
}

export default function EmbeddedPdfViewer({
  topicId,
  topicTitle,
  courseTitle = "Computer Science & Engineering",
  moduleTitle = "Core Engineering Concepts",
  category = "Engineering",
  estimatedTime = "25-30 mins",
  initialContent = "",
  onMarkCompleted,
  isCompleted = false,
}: EmbeddedPdfViewerProps) {
  const [content, setContent] = useState<string>(() =>
    generateComprehensiveTopicNotes(topicTitle, courseTitle, moduleTitle, initialContent)
  );
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Generate robust multi-page HTML document for inline iframe preview
  const viewerHtml = useMemo(() => {
    return generateMultiPageNotesHtml({
      topicTitle,
      courseTitle,
      moduleTitle,
      category,
      estimatedTime,
      content,
    });
  }, [topicTitle, courseTitle, moduleTitle, category, estimatedTime, content]);

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      downloadTopicNotesPdf({
        title: topicTitle,
        courseName: courseTitle,
        moduleName: moduleTitle,
        category,
        estimatedTime,
        content,
      });
    } catch (err) {
      console.error("PDF download failed:", err);
      window.open(`/api/topics/${topicId}/pdf`, "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenExternal = () => {
    window.open(`/api/topics/${topicId}/pdf`, "_blank");
  };

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
    } else {
      window.print();
    }
  };

  const handleGenerateAiDeepDive = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch(`/api/topics/${topicId}/ai-notes`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.notes) {
        setContent(data.notes);
      }
    } catch (err) {
      console.error("Failed to generate AI deep-dive notes:", err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
      {/* SINGLE STREAMLINED NOTES CONTROL BAR */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-inner">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Multi-Page Study Notes
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                3 Full Pages
              </span>
              <span className="text-slate-500 text-xs hidden sm:inline">•</span>
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                {estimatedTime}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1 mt-0.5">
              {topicTitle}
            </h2>
          </div>
        </div>

        {/* INTEGRATED ACTION CONTROLS */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* AI Deep-Dive */}
          <button
            onClick={handleGenerateAiDeepDive}
            disabled={isGeneratingAi}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xs transition disabled:opacity-50"
            title="Generate deep-dive theoretical notes with AI"
          >
            {isGeneratingAi ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Generating AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Deep-Dive</span>
              </>
            )}
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Print Notes"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Expand / Raw PDF */}
          <button
            onClick={handleOpenExternal}
            className="inline-flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Open Full PDF in New Tab"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Expand</span>
          </button>

          {/* PROMINENT DOWNLOAD NOTES PDF BUTTON */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-md transition disabled:opacity-50 flex-shrink-0"
            id="download-notes-pdf-btn"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download Notes PDF</span>
          </button>

          {/* Mark Done Toggle */}
          {onMarkCompleted && (
            <button
              onClick={onMarkCompleted}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                isCompleted
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isCompleted ? "Completed ✓" : "Mark Done"}</span>
            </button>
          )}
        </div>
      </div>

      {/* EMBEDDED INLINE MULTI-PAGE VIEWER */}
      <div className="relative w-full h-[680px] sm:h-[820px] bg-slate-900 overflow-hidden">
        <iframe
          ref={iframeRef}
          data-v-pdf-viewer="true"
          srcDoc={viewerHtml}
          className="w-full h-full border-0"
          title={`Handwritten Notes Preview: ${topicTitle}`}
        />
      </div>
    </div>
  );
}
