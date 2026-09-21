"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Sparkles,
  X,
  Minus,
  Send,
  Bot,
  User as UserIcon,
  Copy,
  Check,
  Compass,
  BookOpen,
  HelpCircle,
  Code,
  Layers,
  ChevronDown,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  suggestedResources?: Array<{
    title: string;
    topic: string;
    description: string;
  }>;
}

export default function FloatingAssistant() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial greeting
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "Hello! I am your **NexStep AI Mentor**. I'm here to answer questions, explain concepts, generate practice problems, or guide your learning path. What would you like to explore today?",
      timestamp: "Just now",
    },
  ]);

  // Context detection based on route
  const getContextInfo = () => {
    if (!pathname) return { title: "Dashboard", topic: "" };

    if (pathname.startsWith("/learn/")) {
      const topicSlug = pathname.replace("/learn/", "");
      const formatted = topicSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return {
        title: `Topic: ${formatted}`,
        topic: formatted,
      };
    }
    if (pathname.startsWith("/quizzes/")) {
      return { title: "Quiz Assessment", topic: "Quiz" };
    }
    if (pathname.startsWith("/quizzes")) {
      return { title: "Quiz Hub", topic: "Assessments" };
    }
    if (pathname.startsWith("/competencies")) {
      return { title: "Competency Radar", topic: "Skill Matrix" };
    }
    if (pathname.startsWith("/learn")) {
      return { title: "Curriculum Catalog", topic: "Courses" };
    }
    if (pathname.startsWith("/profile")) {
      return { title: "Profile & Settings", topic: "Goals" };
    }
    return { title: "Dashboard", topic: "Roadmap" };
  };

  const currentContext = getContextInfo();

  // Open automatically if redirected with ?openAssistant=true
  useEffect(() => {
    if (searchParams?.get("openAssistant") === "true") {
      setIsOpen(true);
      setIsMinimized(false);
    }
  }, [searchParams]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  // Context-aware suggestion chips
  const getSuggestionChips = () => {
    if (pathname.startsWith("/learn/")) {
      return [
        `Explain ${currentContext.topic || "this topic"} simply`,
        `Give me 3 practice questions on this`,
        "Key interview questions for this topic",
        "What should I build with this?",
      ];
    }
    if (pathname.startsWith("/quizzes")) {
      return [
        "How can I improve my assessment scores?",
        "Explain common mistakes in this track",
        "Quiz me on core principles",
      ];
    }
    if (pathname.startsWith("/competencies")) {
      return [
        "How do I close my skill gaps fastest?",
        "What competencies are most valued?",
        "Recommend next steps for my matrix",
      ];
    }
    return [
      "What should I learn next?",
      "Tips for Mobile App Development",
      "Explain how the adaptive roadmap works",
      "Help me debug an error",
    ];
  };

  const handleSend = async (userText?: string) => {
    const textToSend = (userText || input).trim();
    if (!textToSend || loading) return;

    setInput("");

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          currentTopic: currentContext.topic,
          currentCourse: currentContext.title,
          pathname,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reach AI mentor");

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        text: data.answer || "I processed your request. Let me know if you need more details!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedResources: data.suggestedResources,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        text: "I encountered a momentary issue processing your question. Please feel free to retry or rephrase your prompt.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Render markdown bold/code snippets simply
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-blue-600 dark:text-blue-300 font-mono text-xs"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 sm:right-6 z-50 flex flex-col items-end pointer-events-auto transition-all duration-300">
      {/* Floating Chat Panel */}
      {isOpen && (
        <div
          className={`transition-all duration-300 ease-out origin-bottom-right mb-3 rounded-2xl shadow-2xl border flex flex-col overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-slate-200 dark:border-slate-800 ${
            isMinimized
              ? "w-80 h-14"
              : "w-[360px] sm:w-[420px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-8.5rem)] md:max-h-[calc(100vh-6rem)]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-100/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700/60 select-none">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
                <Bot className="w-4 h-4" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>
              <div className="truncate">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    NexStep AI Mentor
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded">
                    RAG
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {currentContext.title}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 shrink-0">
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                aria-label={isMinimized ? "Expand" : "Minimize"}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition"
              >
                {isMinimized ? <ChevronDown className="w-4 h-4 rotate-180" /> : <Minus className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant"
                className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
                {messages.map((msg) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`group relative max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed transition-all ${
                          isUser
                            ? "bg-blue-600 text-white rounded-br-xs shadow-md shadow-blue-500/15"
                            : "bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/80 dark:border-slate-700/60"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{renderFormattedText(msg.text)}</div>

                        {!isUser && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(msg.id, msg.text)}
                            aria-label="Copy response"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition p-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                            title="Copy to clipboard"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Suggested Resources if attached */}
                      {msg.suggestedResources && msg.suggestedResources.length > 0 && (
                        <div className="mt-2 w-full max-w-[88%] space-y-1 pl-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Recommended Next:
                          </span>
                          {msg.suggestedResources.map((res, i) => (
                            <div
                              key={i}
                              className="p-2 rounded-lg bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 flex items-center justify-between"
                            >
                              <span className="font-medium truncate">{res.title}</span>
                              <span className="text-[10px] text-blue-500 shrink-0 ml-2">
                                {res.topic}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex items-center space-x-2 text-slate-400 dark:text-slate-500 p-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse [animation-delay:150ms]" />
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse [animation-delay:300ms]" />
                    <span className="text-[11px] font-medium text-slate-500">
                      Analyzing context & notes...
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Context Prompt Chips */}
              <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex space-x-1.5 overflow-x-auto no-scrollbar">
                {getSuggestionChips().map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(chip)}
                    disabled={loading}
                    className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-800 text-slate-600 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700 transition"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask about ${currentContext.topic || "concepts, roadmap, code..."}`}
                  disabled={loading}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          aria-label="Open AI Learning Assistant"
          className="btn-press group relative flex items-center space-x-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
        >
          {/* Subtle pulse ring */}
          <span className="badge-ping-ring bg-blue-400/40" />
          <Sparkles className="w-5 h-5 text-white animate-float" />
          <span className="text-xs font-bold tracking-wide hidden sm:inline select-none">
            AI Mentor
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white/40" />
        </button>
      )}
    </div>
  );
}
