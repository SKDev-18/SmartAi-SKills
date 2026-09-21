"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import LearnerNav from "@/components/layout/LearnerNav";
import LearningPathSelector from "@/components/dashboard/LearningPathSelector";
import { SessionUser, RoadmapTopicItem } from "@/types";
import {
  BookOpen,
  CheckCircle2,
  Lock,
  PlayCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
  Search,
  Star,
  Flame,
  Check,
  Award,
  Compass,
  Code,
  BarChart3,
  Terminal,
  Coffee,
  FileCode,
  Globe,
  Cpu,
  Database,
  Cloud,
  Shield,
  Network,
  Filter,
  FileDown,
  FileText,
} from "lucide-react";
import TopicPdfDownloadCard from "@/components/notes/TopicPdfDownloadCard";
import { downloadCourseMasterPdf } from "@/lib/pdf/generateNotesPdf";
import { goalNameToCourseSlug, courseSlugToGoalName } from "@/lib/courses";
import {
  getCachedUser,
  setCachedUser,
  getCachedRoadmap,
  setCachedRoadmap,
  getCachedCourses,
  setCachedCourses,
  fetchUserWithCache,
  fetchRoadmapWithCache,
  fetchCoursesWithCache,
} from "@/lib/clientCache";

interface ModuleData {
  id: string;
  title: string;
  description: string;
  order: number;
  topics: RoadmapTopicItem[];
}

interface CatalogCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  branch?: string;
  icon?: string;
  topicsCount: number;
  modulesCount: number;
  isEnrolled: boolean;
}

const CATEGORY_TABS = [
  { id: "ALL", label: "All Disciplines" },
  { id: "Data", label: "Data & AI" },
  { id: "Development", label: "Web & Apps" },
  { id: "Core Computer Science", label: "Core CS & Systems" },
  { id: "Programming", label: "Programming Languages" },
  { id: "Modern Technology", label: "Cloud, DevOps & Security" },
];

function LearnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialView = searchParams.get("view") === "catalog" || searchParams.get("tab") === "courses" ? "catalog" : "curriculum";

  const cachedUser = getCachedUser();
  const cachedRoadmap = getCachedRoadmap("default");
  const cachedCourses = getCachedCourses();

  const [activeTab, setActiveTab] = useState<"curriculum" | "catalog">(initialView);
  const [user, setUser] = useState<SessionUser | null>(cachedUser);
  const [course, setCourse] = useState<any>(cachedRoadmap?.course || null);
  const [modules, setModules] = useState<ModuleData[]>(() => {
    if (cachedRoadmap?.course?.modules && cachedRoadmap?.roadmap) {
      return cachedRoadmap.course.modules.map((mod: any) => ({
        ...mod,
        topics: cachedRoadmap.roadmap.filter((t: RoadmapTopicItem) => t.moduleId === mod.id),
      }));
    }
    return [];
  });
  const [topics, setTopics] = useState<RoadmapTopicItem[]>(cachedRoadmap?.roadmap || []);
  const [catalogCourses, setCatalogCourses] = useState<CatalogCourse[]>(cachedCourses || []);
  const [loading, setLoading] = useState(!cachedRoadmap);
  const [catalogLoading, setCatalogLoading] = useState(!cachedCourses);
  const [enrollingSlug, setEnrollingSlug] = useState<string | null>(null);

  // Curriculum filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  // Catalog filters
  const [catalogSearch, setCatalogSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [roadmapsCache, setRoadmapsCache] = useState<Record<string, any>>({});

  const handlePathSwitch = async (slug: string) => {
    const memoryCached = roadmapsCache[slug] || getCachedRoadmap(slug);
    if (memoryCached) {
      if (memoryCached.course) setCourse(memoryCached.course);
      if (memoryCached.roadmap) {
        setTopics(memoryCached.roadmap);
        if (memoryCached.course?.modules) {
          const grouped = memoryCached.course.modules.map((mod: any) => ({
            ...mod,
            topics: memoryCached.roadmap.filter((t: RoadmapTopicItem) => t.moduleId === mod.id),
          }));
          setModules(grouped);
        }
      }
      return;
    }

    try {
      const data = await fetchRoadmapWithCache(slug, true);
      if (data?.course) setCourse(data.course);
      if (data?.roadmap) {
        setTopics(data.roadmap);
        if (data.course?.modules) {
          const grouped = data.course.modules.map((mod: any) => ({
            ...mod,
            topics: data.roadmap.filter((t: RoadmapTopicItem) => t.moduleId === mod.id),
          }));
          setModules(grouped);
        }
      }
      if (data) {
        setRoadmapsCache((prev) => ({ ...prev, [slug]: data }));
      }
    } catch (err) {
      console.error("Failed to fetch roadmap for course:", err);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [userData, roadmapData, coursesData] = await Promise.all([
          fetchUserWithCache(),
          fetchRoadmapWithCache(),
          fetchCoursesWithCache(),
        ]);

        if (userData) setUser(userData);
        if (roadmapData?.course) setCourse(roadmapData.course);
        if (roadmapData?.roadmap) {
          setTopics(roadmapData.roadmap);
          if (roadmapData.course?.modules) {
            const grouped = roadmapData.course.modules.map((mod: any) => ({
              ...mod,
              topics: roadmapData.roadmap.filter((t: RoadmapTopicItem) => t.moduleId === mod.id),
            }));
            setModules(grouped);
          }
        }
        if (coursesData) {
          setCatalogCourses(coursesData);
        }
      } catch (err) {
        console.error("Failed to load learning catalog", err);
      } finally {
        setLoading(false);
        setCatalogLoading(false);
      }
    }
    loadData();
  }, []);

  const handleEnrollOrSwitch = async (courseSlug: string) => {
    setEnrollingSlug(courseSlug);
    try {
      const res = await fetch("/api/courses/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug }),
      });

      if (res.ok) {
        // Refresh roadmap and user data
        const roadmapRes = await fetch("/api/roadmap");
        const roadmapData = await roadmapRes.json();
        if (roadmapData.course) setCourse(roadmapData.course);
        if (roadmapData.roadmap) {
          setTopics(roadmapData.roadmap);
          if (roadmapData.course?.modules) {
            const grouped = roadmapData.course.modules.map((mod: any) => ({
              ...mod,
              topics: roadmapData.roadmap.filter((t: RoadmapTopicItem) => t.moduleId === mod.id),
            }));
            setModules(grouped);
          }
        }
        await loadCatalog();
        setActiveTab("curriculum");
      }
    } catch (err) {
      console.error("Failed to switch course", err);
    } finally {
      setEnrollingSlug(null);
    }
  };

  // Extract available paths for selector
  let availablePaths: { slug: string; name: string; isPrimary?: boolean }[] = [];
  if (user?.learningGoals) {
    try {
      const parsed: string[] = JSON.parse(user.learningGoals);
      availablePaths = parsed.map((name) => ({
        slug: goalNameToCourseSlug(name),
        name,
        isPrimary: name === user.primaryLearningGoal,
      }));
    } catch {}
  }
  if (availablePaths.length === 0 && course?.slug) {
    availablePaths.push({
      slug: course.slug,
      name: course.title,
      isPrimary: true,
    });
  }

  const completedCount = topics.filter(
    (t) => t.status === "COMPLETED" || t.status === "MASTERED"
  ).length;
  const progressPercent = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;
  const activeTopic =
    topics.find((t) => t.status === "IN_PROGRESS" || t.status === "QUIZ_PENDING") ||
    topics.find((t) => t.status === "AVAILABLE");

  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchesSearch =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === "ALL" ||
        (filterStatus === "COMPLETED" && (t.status === "COMPLETED" || t.status === "MASTERED")) ||
        t.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [topics, searchQuery, filterStatus]);

  const filteredCatalog = useMemo(() => {
    return catalogCourses.filter((c) => {
      const matchesCategory =
        selectedCategory === "ALL" ||
        (selectedCategory === "Data" && (c.category === "Data" || c.slug.includes("data") || c.slug.includes("machine-learning"))) ||
        (selectedCategory === "Development" && (c.category === "Development" || c.slug.includes("web") || c.slug.includes("app"))) ||
        (selectedCategory === "Core Computer Science" && (c.category === "Core Computer Science" || c.slug === "dsa" || c.slug === "dbms" || c.slug === "operating-systems" || c.slug === "computer-networks")) ||
        (selectedCategory === "Programming" && (c.category === "Programming" || c.slug === "python" || c.slug === "java" || c.slug === "cpp")) ||
        (selectedCategory === "Modern Technology" && (c.category === "Modern Technology" || c.slug === "cloud-devops" || c.slug === "cyber-security"));

      const matchesSearch =
        !catalogSearch ||
        c.title.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        c.description.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        c.category.toLowerCase().includes(catalogSearch.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [catalogCourses, selectedCategory, catalogSearch]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col pb-20 md:pb-12 transition-colors duration-200">
      {user && <Header user={user} />}
      <LearnerNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 w-full flex-1">
        {/* View Toggle Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
                activeTab === "curriculum"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Active Curriculum
            </button>
            <button
              onClick={() => setActiveTab("catalog")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${
                activeTab === "catalog"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore All Courses
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold ml-1 border border-blue-200 dark:border-blue-800/60">
                {catalogCourses.length || 13}
              </span>
            </button>
          </div>

          {activeTab === "curriculum" && availablePaths.length > 1 && (
            <div className="hidden sm:block">
              <LearningPathSelector
                currentCourseSlug={course?.slug || "data-analytics"}
                availablePaths={availablePaths}
                onSelectPath={handlePathSwitch}
              />
            </div>
          )}
        </div>

        {/* VIEW 1: CURRENT ACTIVE CURRICULUM */}
        <div className={activeTab === "curriculum" ? "block" : "hidden"}>
          <div>
            {/* Course Header Banner */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200 border border-white/10">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Engineering Skill Curriculum</span>
                  </div>

                  <div className="sm:hidden">
                    {availablePaths.length > 1 && (
                      <LearningPathSelector
                        currentCourseSlug={course?.slug || "data-analytics"}
                        availablePaths={availablePaths}
                        onSelectPath={handlePathSwitch}
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      {course?.title || "Engineering Skill Curriculum"}
                    </h1>
                    <p className="text-blue-100 text-sm mt-1.5 max-w-2xl leading-relaxed">
                      {course?.description ||
                        "Master comprehensive engineering concepts with structured topic notes, interactive video sessions, and rigorous 30-question mastery assessments."}
                    </p>

                    {/* Progress Mini Bar */}
                    <div className="mt-4 flex items-center gap-4 max-w-md">
                      <div className="flex-1 bg-white/20 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-emerald-400 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-blue-100 whitespace-nowrap">
                        {completedCount} / {topics.length} Topics ({progressPercent}%)
                      </span>
                    </div>
                  </div>

                  {activeTopic && (
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col gap-2 min-w-[280px]">
                      <div className="text-xs text-blue-200 font-medium flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-300" />
                        Next Learning Milestone
                      </div>
                      <div className="font-bold text-base text-white truncate">{activeTopic.title}</div>
                      <Link
                        href={`/learn/${activeTopic.slug}`}
                        className="mt-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-blue-800 hover:bg-blue-50 font-bold text-xs rounded-xl shadow transition"
                      >
                        Resume Learning
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* COURSE MASTER HANDWRITTEN NOTES PDF SECTION */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-blue-800/60 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/20 mb-1">
                    <span>Handwritten PDF Notes Compendium</span>
                    <span>•</span>
                    <span>All {topics.length} Topics</span>
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Download Complete {course?.title || "Course"} Notes PDF
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xl">
                    All module summaries, code templates, derivations, and exam cheatsheets compiled into a single printable PDF guide.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  downloadCourseMasterPdf(
                    course?.title || "Engineering Course",
                    modules.map((m) => ({
                      title: m.title,
                      topics: m.topics.map((t) => ({
                        title: t.title,
                        notesContent: t.description,
                      })),
                    }))
                  );
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md transition-all flex-shrink-0 w-full md:w-auto justify-center"
              >
                <FileDown className="w-4 h-4" />
                <span>Download Complete Course PDF</span>
              </button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search topics or concepts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
                {[
                  { id: "ALL", label: "All Topics" },
                  { id: "IN_PROGRESS", label: "In Progress" },
                  { id: "COMPLETED", label: "Completed" },
                  { id: "LOCKED", label: "Locked" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilterStatus(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                      filterStatus === f.id
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Course Modules List */}
            {loading ? (
              <div className="p-12 text-center text-slate-500">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                Loading curriculum and topic roadmaps...
              </div>
            ) : (
              <div className="space-y-8">
                {modules.length > 0 ? (
                  modules.map((mod, modIdx) => {
                    const moduleTopics = mod.topics.filter((t) =>
                      filteredTopics.some((ft) => ft.id === t.id)
                    );

                    if (moduleTopics.length === 0 && searchQuery) return null;

                    return (
                      <div
                        key={mod.id}
                        className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden backdrop-blur-xs transition-colors duration-200"
                      >
                        {/* Module Header */}
                        <div className="bg-slate-100 dark:bg-slate-950/80 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 font-bold flex items-center justify-center text-xs">
                              M{modIdx + 1}
                            </div>
                            <div>
                              <h2 className="text-base font-bold text-slate-900 dark:text-white">{mod.title}</h2>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{mod.description}</p>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {mod.topics.length} topics
                          </span>
                        </div>

                        {/* Topics List */}
                        <div className="divide-y divide-slate-200 dark:divide-slate-800/60">
                          {mod.topics.map((topic) => {
                            const isLocked = topic.status === "LOCKED";
                            const isCompleted =
                              topic.status === "COMPLETED" || topic.status === "MASTERED";
                            const isMastered = topic.status === "MASTERED";
                            const isInProgress =
                              topic.status === "IN_PROGRESS" || topic.status === "QUIZ_PENDING";
                            const isPriorSkill = topic.isExistingSkill;

                            return (
                              <div
                                key={topic.id}
                                className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                                  isLocked
                                    ? "opacity-60 bg-slate-950/30"
                                    : "hover:bg-slate-800/40"
                                }`}
                              >
                                <div className="flex items-start gap-4">
                                  <div className="pt-0.5">
                                    {isPriorSkill ? (
                                      <div className="w-7 h-7 rounded-full bg-teal-950 text-teal-400 border border-teal-800/60 flex items-center justify-center font-bold" title="Prior Knowledge">
                                        <Check className="w-4 h-4" />
                                      </div>
                                    ) : isMastered ? (
                                      <div className="w-7 h-7 rounded-full bg-amber-950 text-amber-400 border border-amber-800/60 flex items-center justify-center font-bold">
                                        <Star className="w-4 h-4 fill-amber-400" />
                                      </div>
                                    ) : isCompleted ? (
                                      <div className="w-7 h-7 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center">
                                        <Check className="w-4 h-4" />
                                      </div>
                                    ) : isInProgress ? (
                                      <div className="w-7 h-7 rounded-full bg-blue-950 text-blue-400 border border-blue-800/60 flex items-center justify-center">
                                        <PlayCircle className="w-4 h-4" />
                                      </div>
                                    ) : (
                                      <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-500 border border-slate-700 flex items-center justify-center">
                                        <Lock className="w-3.5 h-3.5" />
                                      </div>
                                    )}
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-bold text-white text-sm">
                                        {topic.order}. {topic.title}
                                      </span>

                                      {isPriorSkill && (
                                        <span className="px-2 py-0.5 rounded-full bg-teal-950/60 text-teal-300 border border-teal-800/60 text-[10px] font-bold flex items-center gap-1">
                                          <Check className="w-3 h-3" />
                                          Existing Skill
                                        </span>
                                      )}
                                      {isMastered && (
                                        <span className="px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/60 text-[10px] font-bold">
                                          Mastered (90%+)
                                        </span>
                                      )}
                                      {isCompleted && !isMastered && !isPriorSkill && (
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 text-[10px] font-bold">
                                          Completed
                                        </span>
                                      )}
                                      {topic.status === "QUIZ_PENDING" && (
                                        <span className="px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/60 text-[10px] font-bold">
                                          Quiz Pending
                                        </span>
                                      )}
                                      {topic.status === "IN_PROGRESS" && (
                                        <span className="px-2 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/60 text-[10px] font-bold">
                                          In Progress
                                        </span>
                                      )}
                                      {topic.status === "AVAILABLE" && (
                                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold">
                                          Ready to Start
                                        </span>
                                      )}
                                      {isLocked && (
                                        <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-500 border border-slate-700 text-[10px] font-semibold">
                                          Locked
                                        </span>
                                      )}
                                    </div>

                                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                      {topic.description}
                                    </p>

                                    <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500">
                                      <span className="inline-flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        {topic.estimatedTime}
                                      </span>
                                      {topic.bestQuizScore ? (
                                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                                          <Award className="w-3 h-3" />
                                          Quiz Score: {topic.bestQuizScore}%
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 self-end md:self-center">
                                  <TopicPdfDownloadCard
                                    topicTitle={topic.title}
                                    courseTitle={course?.title || "Engineering Curriculum"}
                                    moduleTitle={mod.title}
                                    estimatedTime={topic.estimatedTime}
                                    notesContent={topic.description}
                                    variant="button"
                                  />

                                  {isLocked ? (
                                    <button
                                      disabled
                                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-500 cursor-not-allowed flex items-center gap-1.5 border border-slate-750"
                                    >
                                      <Lock className="w-3.5 h-3.5" />
                                      Locked
                                    </button>
                                  ) : (
                                    <Link
                                      href={`/learn/${topic.slug}`}
                                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                        isCompleted
                                          ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                                          : "bg-blue-600 text-white hover:bg-blue-500 shadow-sm"
                                      }`}
                                    >
                                      {isCompleted
                                        ? "Review Topic"
                                        : isInProgress
                                        ? "Continue Learning"
                                        : "Start Topic"}
                                      <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* DEDICATED MODULE HANDWRITTEN NOTES PDF SECTION */}
                        <div className="bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/60 flex items-center justify-center font-bold text-xs flex-shrink-0">
                              PDF
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  Module {modIdx + 1} Handwritten Notes Sheet
                                </span>
                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/60">
                                  {mod.topics.length} Topics
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Formulas, memory diagrams, algorithms, and key revision points compiled for this module.
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              downloadCourseMasterPdf(
                                `${course?.title || "Engineering"} - Module ${modIdx + 1}: ${mod.title}`,
                                [
                                  {
                                    title: mod.title,
                                    topics: mod.topics.map((t) => ({
                                      title: t.title,
                                      notesContent: t.description,
                                    })),
                                  },
                                ]
                              );
                            }}
                            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-slate-200 dark:border-blue-800/60 shadow-xs transition flex-shrink-0"
                          >
                            <FileDown className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                            <span>Download Module PDF</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    No roadmap topics found. Please complete onboarding or enroll in a course.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* VIEW 2: COMPLETE ENGINEERING COURSE CATALOG */}
        <div className={activeTab === "catalog" ? "block" : "hidden"}>
          <div>
            {/* Catalog Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative border border-slate-800 overflow-hidden">
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/20 mb-3">
                  <Compass className="w-3.5 h-3.5 text-blue-300" />
                  <span>Engineering Course Catalog</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Explore Engineering Disciplines & Skills
                </h1>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                  Browse structured curricula spanning Data Analytics, Mobile App Development, Web Development, Core Computer Science, Machine Learning, Systems, and Cloud DevOps. Enroll with one click to personalize your roadmap.
                </p>
              </div>
            </div>

            {/* Catalog Search & Category Filters */}
            <div className="space-y-4 mb-8">
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search courses, e.g. App Development, Data Analytics, Python..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {CATEGORY_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedCategory === tab.id
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Course Grid */}
            {catalogLoading ? (
              <div className="p-12 text-center text-slate-500">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                Loading engineering courses...
              </div>
            ) : filteredCatalog.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                No courses found matching &ldquo;{catalogSearch}&rdquo;. Try another keyword.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCatalog.map((c) => {
                  const isCurrentActive = course?.slug === c.slug;
                  const isEnrolled = c.isEnrolled;
                  const isPending = enrollingSlug === c.slug;

                  return (
                    <div
                      key={c.id}
                      className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between backdrop-blur-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold border border-blue-200 dark:border-blue-800/60">
                            {c.category}
                          </span>

                          {isCurrentActive ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60 text-[10px] font-extrabold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Current Active
                            </span>
                          ) : isEnrolled ? (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-[10px] font-bold">
                              Enrolled
                            </span>
                          ) : null}
                        </div>

                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1.5">
                          {c.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                          {c.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-6">
                          <span className="inline-flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            {c.modulesCount} Modules
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            {c.topicsCount} Topics
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                        {isCurrentActive ? (
                          <button
                            onClick={() => setActiveTab("curriculum")}
                            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <span>Resume Curriculum</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : isEnrolled ? (
                          <button
                            onClick={() => handleEnrollOrSwitch(c.slug)}
                            disabled={isPending}
                            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                          >
                            <span>{isPending ? "Switching..." : "Switch to this Course"}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEnrollOrSwitch(c.slug)}
                            disabled={isPending}
                            className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-800 dark:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 border border-slate-200 dark:border-slate-700"
                          >
                            <span>{isPending ? "Enrolling..." : "Start Learning / Enroll"}</span>
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-300" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LearnCoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090D16] flex items-center justify-center p-4">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LearnContent />
    </Suspense>
  );
}
