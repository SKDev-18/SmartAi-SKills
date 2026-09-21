"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { SessionUser } from "@/types";
import {
  Upload,
  CheckCircle2,
  FileText,
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
  Layers,
} from "lucide-react";
import Link from "next/link";

export default function MaterialsPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [competencyId, setCompetencyId] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("INTERMEDIATE");
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);

  // Processing state steps (PRD §20 & §45)
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSteps, setProcessingSteps] = useState({
    uploaded: false,
    textExtracted: false,
    topicsIdentified: false,
    competenciesMapped: false,
    completed: false,
  });
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    async function init() {
      try {
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();
        if (userData.user) setUser(userData.user);

        const compRes = await fetch("/api/competencies");
        const compData = await compRes.json();
        if (compData.competencies) setCompetencies(compData.competencies);

        const matRes = await fetch("/api/admin/materials");
        const matData = await matRes.json();
        if (matData.materials) setMaterials(matData.materials);
      } catch (err) {
        console.error("Init error", err);
      }
    }
    init();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);
    if (!title) setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content || "");
    };
    reader.readAsText(file);
  };

  const loadSampleHandbook = () => {
    setTitle("MoSPI Survey Methodology & Field Protocols Compendium 2024");
    setDescription(
      "Comprehensive guidelines on stratified sampling designs, PSU and USU selections, and non-sampling error control in NSS socio-economic rounds."
    );
    setTopic("Sampling");
    setDifficulty("INTERMEDIATE");
    setFileName("MoSPI_Survey_Methodology_Compendium_2024.pdf");
    setFileSize(4280500);
    setFileContent(`
CHAPTER 4: MULTI-STAGE STRATIFIED SAMPLING DESIGNS FOR SOCIO-ECONOMIC SURVEYS
National Statistical Office (NSO), Ministry of Statistics & Programme Implementation

1. Stratified Random Sampling Objectives:
Stratification is deployed to ensure optimal representation across heterogeneous geographic and administrative zones. Stratified estimates achieve higher precision than simple random sampling by reducing within-stratum variance. In rural sectors, stratification considers agro-climatic sub-zones and population size deciles.

2. Primary Sampling Units (PSUs) and Ultimate Sampling Units (USUs):
The NSS multi-stage sampling framework designates:
- Rural Primary Sampling Units: 2011 Census Villages (or Census Enumeration Blocks for villages with population exceeding 1,200).
- Urban Primary Sampling Units: Urban Frame Survey (UFS) blocks.
- Ultimate Sampling Units: Listed households selected through circular systematic sampling with random start.

3. Sampling vs Non-Sampling Errors:
Sampling errors represent the probabilistic variance resulting from estimating population parameters from a subset of observations. They decline as sample size (n) increases. Conversely, non-sampling errors arise from recall bias, questionnaire ambiguity, data canvassing errors, and non-response. Non-sampling errors affect both sample surveys and complete censuses, and often dominate total survey error.

4. Probability Proportional to Size (PPS) Selection:
When sampling units vary significantly in size, simple random sampling yields high variance in estimates. Systematic PPS sampling ensures that larger villages have a selection probability proportionate to their population size, balancing enumerator workloads and minimizing design effects.
`);
  };

  const handleUploadAndAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileContent) return;

    setIsProcessing(true);
    setAnalysisResult(null);
    setProcessingSteps({
      uploaded: false,
      textExtracted: false,
      topicsIdentified: false,
      competenciesMapped: false,
      completed: false,
    });

    // Simulated staggered step indicators for visual delight (PRD §20 & §45)
    setTimeout(() => setProcessingSteps((p) => ({ ...p, uploaded: true })), 300);
    setTimeout(() => setProcessingSteps((p) => ({ ...p, textExtracted: true })), 700);
    setTimeout(() => setProcessingSteps((p) => ({ ...p, topicsIdentified: true })), 1100);
    setTimeout(() => setProcessingSteps((p) => ({ ...p, competenciesMapped: true })), 1500);

    try {
      const res = await fetch("/api/admin/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          fileName,
          fileType: fileName.endsWith(".docx") ? "DOCX" : "PDF",
          fileSize,
          rawContent: fileContent,
          competencyId: competencyId || undefined,
          topic,
          difficulty,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setProcessingSteps((p) => ({ ...p, completed: true }));
        setAnalysisResult(data.analysis);
        // Refresh materials list
        const refreshed = await fetch("/api/admin/materials");
        const refData = await refreshed.json();
        if (refData.materials) setMaterials(refData.materials);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {user && <Header user={user} />}

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Learning Material Ingestion & AI Analysis
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Upload official handbooks (PDF/DOCX/TXT) for automatic text extraction, topic identification, and competency mapping
              </p>
            </div>

            <button
              type="button"
              onClick={loadSampleHandbook}
              className="inline-flex items-center px-3.5 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold hover:bg-blue-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              Pre-fill Official MoSPI Handbook
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Upload Form (PRD §20) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4">
                Upload Learning Material
              </h2>

              <form onSubmit={handleUploadAndAnalyze} className="space-y-4">
                {/* File Dropzone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Select Document (PDF, DOCX, PPTX, TXT)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-blue-500 transition-colors bg-slate-50/50">
                    <input
                      type="file"
                      id="file-upload"
                      accept=".pdf,.docx,.pptx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <span className="text-xs font-semibold text-blue-700 hover:text-blue-800">
                        {fileName ? fileName : "Click to select file or drag here"}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Supported formats: PDF, DOCX, PPTX, TXT (Max 25MB)
                      </p>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Material Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. MoSPI Survey Methodology & Sampling Handbook"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Description / Scope
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of training material..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Competency
                    </label>
                    <select
                      value={competencyId}
                      onChange={(e) => setCompetencyId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Auto-Detect via AI</option>
                      {competencies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Topic
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
                      Difficulty
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Document Text Content (Extracted preview)
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    placeholder="Document text will appear here automatically upon file selection..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing || !fileContent}
                    className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors shadow-xs disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isProcessing ? "Processing Document..." : "Upload & Analyze with AI"}
                  </button>
                </div>
              </form>
            </div>

            {/* Processing State & AI Analysis Results (PRD §20 & §21) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Progress Checklist (PRD §20 & §45) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                  AI Document Pipeline Status
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        processingSteps.uploaded
                          ? "text-emerald-600"
                          : "text-slate-300"
                      }`}
                    />
                    <span
                      className={
                        processingSteps.uploaded
                          ? "font-semibold text-slate-800"
                          : "text-slate-500"
                      }
                    >
                      Document uploaded
                    </span>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        processingSteps.textExtracted
                          ? "text-emerald-600"
                          : "text-slate-300"
                      }`}
                    />
                    <span
                      className={
                        processingSteps.textExtracted
                          ? "font-semibold text-slate-800"
                          : "text-slate-500"
                      }
                    >
                      Text extracted & cleaned
                    </span>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        processingSteps.topicsIdentified
                          ? "text-emerald-600"
                          : "text-slate-300"
                      }`}
                    />
                    <span
                      className={
                        processingSteps.topicsIdentified
                          ? "font-semibold text-slate-800"
                          : "text-slate-500"
                      }
                    >
                      Topics identified & clustered
                    </span>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        processingSteps.competenciesMapped
                          ? "text-emerald-600"
                          : "text-slate-300"
                      }`}
                    />
                    <span
                      className={
                        processingSteps.competenciesMapped
                          ? "font-semibold text-slate-800"
                          : "text-slate-500"
                      }
                    >
                      Competencies mapped to framework
                    </span>
                  </div>

                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        processingSteps.completed
                          ? "text-emerald-600"
                          : "text-slate-300"
                      }`}
                    />
                    <span
                      className={
                        processingSteps.completed
                          ? "font-semibold text-slate-800"
                          : "text-slate-500"
                      }
                    >
                      AI analysis completed & indexed
                    </span>
                  </div>
                </div>
              </div>

              {/* Analysis Metadata Display (PRD §21) */}
              {analysisResult && (
                <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                      AI Extracted Intelligence
                    </h3>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      Detected Topics:
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {analysisResult.topics?.map((t: string, i: number) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      Key Statistical Concepts:
                    </span>
                    <ul className="mt-1 space-y-1 text-xs text-slate-700">
                      {analysisResult.keyConcepts?.map((c: string, i: number) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      href="/admin/generator"
                      className="w-full flex items-center justify-center py-2 px-3 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-colors shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      Generate MCQs from this Document
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ingested Materials Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Ingested Statistical Materials Repository
            </h2>

            <div className="divide-y divide-slate-100">
              {materials.map((m) => (
                <div
                  key={m.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">
                        {m.title}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {m.fileType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {m.description}
                    </p>
                    <div className="text-[11px] text-slate-400">
                      Domain: <span className="text-slate-700">{m.competency?.name || "General"}</span> • Topic: <span className="text-slate-700">{m.topic || "Sampling"}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/generator?materialId=${m.id}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100 text-xs font-semibold transition-colors"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Generate MCQs
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
