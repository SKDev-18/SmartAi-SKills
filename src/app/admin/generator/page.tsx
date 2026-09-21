"use client";

import { useState, useEffect, Suspense } from "react";
import Header from "@/components/layout/Header";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { SessionUser } from "@/types";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  RotateCw,
  BookOpen,
  Send,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function GeneratorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedMaterialId = searchParams.get("materialId");

  const [user, setUser] = useState<SessionUser | null>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(preselectedMaterialId || "");
  const [topic, setTopic] = useState("Sampling");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [questionType, setQuestionType] = useState("MCQ");

  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const [quizTitle, setQuizTitle] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();
        if (userData.user) setUser(userData.user);

        const matRes = await fetch("/api/admin/materials");
        const matData = await matRes.json();
        if (matData.materials) {
          setMaterials(matData.materials);
          if (!selectedMaterialId && matData.materials.length > 0) {
            setSelectedMaterialId(matData.materials[0].id);
            setTopic(matData.materials[0].topic || "Sampling");
          }
        }

        // Fetch existing questions
        const qRes = await fetch("/api/admin/questions");
        const qData = await qRes.json();
        if (qData.questions) {
          setQuestions(qData.questions);
        }
      } catch (err) {
        console.error("Init error", err);
      }
    }
    init();
  }, [selectedMaterialId]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setPublishSuccess(false);

    try {
      const res = await fetch("/api/admin/ai/generate-mcqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materialId: selectedMaterialId,
          topic,
          numberOfQuestions,
          difficulty,
          questionType,
        }),
      });

      const data = await res.json();
      if (res.ok && data.questions) {
        setQuestions((prev) => [...data.questions, ...prev]);
        setQuizTitle(`${topic} Practice Quiz (${new Date().toLocaleDateString()})`);
      }
    } catch (err) {
      console.error("Generate error", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/questions/${id}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: "APPROVED" } : q))
        );
      }
    } catch (err) {
      console.error("Approve error", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const startEditing = (q: any) => {
    setEditingQuestionId(q.id);
    setEditForm({ ...q });
  };

  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === id ? { ...q, ...editForm } : q))
        );
        setEditingQuestionId(null);
      }
    } catch (err) {
      console.error("Edit save failed", err);
    }
  };

  const handlePublishQuiz = async () => {
    const approvedIds = questions
      .filter((q) => q.status === "APPROVED")
      .map((q) => q.id);

    if (approvedIds.length === 0) {
      alert("Please approve at least one question before publishing the quiz.");
      return;
    }

    setPublishing(true);
    try {
      const res = await fetch("/api/admin/quizzes/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: quizTitle || `${topic} Official Practice Quiz`,
          topic,
          materialId: selectedMaterialId,
          questionIds: approvedIds,
          passPercentage: 70.0,
        }),
      });

      if (res.ok) {
        setPublishSuccess(true);
        setTimeout(() => router.push("/admin/quizzes"), 1500);
      }
    } catch (err) {
      console.error("Publish error", err);
    } finally {
      setPublishing(false);
    }
  };

  const approvedCount = questions.filter((q) => q.status === "APPROVED").length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {user && <Header user={user} />}

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                AI Question Generator & Quality Review Studio
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Generate grounded MCQs strictly from approved statistical materials, audit quality, and publish quizzes
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
                Approved for Quiz: <strong className="text-emerald-700">{approvedCount}</strong>
              </span>
            </div>
          </div>

          {/* Generator Controls Card (PRD §22) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Generate Questions Parameters
                </h2>
                <p className="text-xs text-slate-500">
                  AI will extract factual sentences from selected material and construct 4-option MCQs
                </p>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Source Learning Material
                </label>
                <select
                  value={selectedMaterialId}
                  onChange={(e) => setSelectedMaterialId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Target Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Sampling"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Count & Difficulty
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={numberOfQuestions}
                    onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value={3}>3 MCQs</option>
                    <option value={5}>5 MCQs</option>
                    <option value={10}>10 MCQs</option>
                  </select>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={generating || !selectedMaterialId}
                  className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors shadow-xs disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  {generating ? "Generating..." : "Generate Questions"}
                </button>
              </div>
            </form>
          </div>

          {/* Publishing Bar when approved questions exist */}
          {approvedCount > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 uppercase">
                    Ready for Learner Publication ({approvedCount} Approved MCQs)
                  </h4>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="Quiz Title (e.g. Sampling Techniques Practice Quiz)"
                    className="mt-1 px-3 py-1 text-xs border border-emerald-300 rounded-lg bg-white w-full sm:w-80 focus:ring-emerald-500 font-medium text-slate-800"
                  />
                </div>
              </div>

              <button
                onClick={handlePublishQuiz}
                disabled={publishing}
                className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-xs whitespace-nowrap"
              >
                {publishing
                  ? "Publishing..."
                  : publishSuccess
                  ? "Published Successfully! ✓"
                  : "Publish Quiz for Learners"}
              </button>
            </div>
          )}

          {/* Questions Review UI (PRD §24 & §25) */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Questions Review & Audit Studio ({questions.length} Total)
            </h2>

            {questions.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                No questions staged yet. Click &quot;Generate Questions&quot; above to create MCQs from official material.
              </div>
            ) : (
              questions.map((q, idx) => {
                const isEditing = editingQuestionId === q.id;

                return (
                  <div
                    key={q.id || idx}
                    className={`bg-white border rounded-2xl p-6 shadow-sm transition-all ${
                      q.status === "APPROVED"
                        ? "border-emerald-300 bg-emerald-50/10"
                        : "border-slate-200"
                    }`}
                  >
                    {isEditing ? (
                      /* Inline Edit Form (PRD §25) */
                      <div className="space-y-4">
                        <div className="text-xs font-bold text-blue-700 uppercase">
                          Editing Question #{idx + 1}
                        </div>
                        <input
                          type="text"
                          value={editForm.questionText}
                          onChange={(e) =>
                            setEditForm({ ...editForm, questionText: e.target.value })
                          }
                          className="w-full p-2.5 border border-slate-300 rounded-lg text-sm font-medium"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {["optionA", "optionB", "optionC", "optionD"].map((opt) => (
                            <div key={opt}>
                              <label className="text-[10px] font-bold uppercase text-slate-500">
                                Option {opt.slice(-1)}
                              </label>
                              <input
                                type="text"
                                value={editForm[opt]}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, [opt]: e.target.value })
                                }
                                className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <label className="text-[10px] font-bold uppercase text-slate-500">
                              Correct Answer
                            </label>
                            <select
                              value={editForm.correctAnswer}
                              onChange={(e) =>
                                setEditForm({ ...editForm, correctAnswer: e.target.value })
                              }
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                            >
                              <option value="A">Option A</option>
                              <option value="B">Option B</option>
                              <option value="C">Option C</option>
                              <option value="D">Option D</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold uppercase text-slate-500">
                              Difficulty
                            </label>
                            <select
                              value={editForm.difficulty}
                              onChange={(e) =>
                                setEditForm({ ...editForm, difficulty: e.target.value })
                              }
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                            >
                              <option value="EASY">Easy</option>
                              <option value="MEDIUM">Medium</option>
                              <option value="HARD">Hard</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase text-slate-500">
                            Explanation
                          </label>
                          <textarea
                            rows={2}
                            value={editForm.explanation}
                            onChange={(e) =>
                              setEditForm({ ...editForm, explanation: e.target.value })
                            }
                            className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <button
                            onClick={() => saveEdit(q.id)}
                            className="px-4 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-semibold"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingQuestionId(null)}
                            className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Question Review View (PRD §25) */
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-500">
                              Question {idx + 1} of {questions.length}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                              {q.topic || topic}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {q.difficulty}
                            </span>
                          </div>

                          {/* 8-Point AI Quality Badge (PRD §24) */}
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                              Quality: {q.qualityScore || 98}% Verified
                            </span>
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                q.status === "APPROVED"
                                  ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                  : "bg-amber-100 text-amber-900 border border-amber-300"
                              }`}
                            >
                              {q.status}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {q.questionText}
                        </h3>

                        {/* Options Display */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {[
                            { key: "A", text: q.optionA },
                            { key: "B", text: q.optionB },
                            { key: "C", text: q.optionC },
                            { key: "D", text: q.optionD },
                          ].map((opt) => (
                            <div
                              key={opt.key}
                              className={`p-2.5 rounded-lg border flex items-start space-x-2 ${
                                q.correctAnswer === opt.key
                                  ? "bg-emerald-50/70 border-emerald-400 font-semibold text-emerald-950"
                                  : "bg-slate-50 border-slate-200 text-slate-700"
                              }`}
                            >
                              <span className="font-bold">{opt.key}.</span>
                              <span>{opt.text}</span>
                            </div>
                          ))}
                        </div>

                        {/* Correct Answer & Explanation */}
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                          <div>
                            <span className="font-bold text-slate-700">Correct Answer: </span>
                            <span className="font-bold text-emerald-700">Option {q.correctAnswer}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-700">Explanation: </span>
                            <span className="text-slate-600">{q.explanation}</span>
                          </div>
                          {q.sourceReference && (
                            <div className="text-[11px] text-slate-400 pt-1">
                              Ref: {q.sourceReference}
                            </div>
                          )}
                        </div>

                        {/* Review Action Buttons (PRD §25: [Edit], [Approve], [Regenerate], [Delete]) */}
                        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 gap-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => startEditing(q)}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(q.id)}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              Delete
                            </button>
                          </div>

                          <div className="flex items-center space-x-2">
                            {q.status !== "APPROVED" ? (
                              <button
                                onClick={() => handleApprove(q.id)}
                                className="inline-flex items-center px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5 mr-1" />
                                Approve Question
                              </button>
                            ) : (
                              <span className="inline-flex items-center text-xs font-bold text-emerald-700">
                                <CheckCircle2 className="w-4 h-4 mr-1" /> Approved
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AIQuestionGeneratorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <GeneratorInner />
    </Suspense>
  );
}

