"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import LearnerNav from "@/components/layout/LearnerNav";
import { SessionUser } from "@/types";
import {
  User,
  Mail,
  Phone,
  Calendar,
  School,
  GraduationCap,
  Sparkles,
  Edit2,
  Check,
  X,
  Layers,
  Award,
  BookOpen,
  Target,
  Star,
} from "lucide-react";
import { getSkillsForBranch } from "@/lib/branch-skills";
import { ALL_LEARNING_GOALS } from "@/lib/courses";

const BRANCH_OPTIONS = [
  "Computer Engineering",
  "Information Technology",
  "Artificial Intelligence & Data Science",
  "Artificial Intelligence & Machine Learning",
  "Electronics & Telecommunication",
  "Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Other",
];

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate / Other"];
const SEMESTER_OPTIONS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];
const GRAD_YEARS = ["2025", "2026", "2027", "2028", "2029", "2030"];

import { getCachedUser, setCachedUser } from "@/lib/clientCache";

export default function ProfilePage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form edit states
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [branch, setBranch] = useState("Computer Engineering");
  const [year, setYear] = useState("2nd Year");
  const [semester, setSemester] = useState("Semester 3");
  const [college, setCollege] = useState("");
  const [graduationYear, setGraduationYear] = useState("2026");
  const [selectedSkills, setSelectedSkills] = useState<Record<string, "Beginner" | "Intermediate" | "Advanced">>({});
  const [learningGoals, setLearningGoals] = useState<string[]>([]);
  const [primaryGoal, setPrimaryGoal] = useState<string>("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          const u = data.user;
          setUser(u);
          setCachedUser(u);
          setName(u.name || "");
          setDob(u.dob || "");
          setMobile(u.mobile || "");
          setGender(u.gender || "");
          setBranch(u.branch || "Computer Engineering");
          setYear(u.year || "2nd Year");
          setSemester(u.semester || "Semester 3");
          setCollege(u.college || "");
          setGraduationYear(u.graduationYear || "2026");

          // Explicitly isolate skills per account
          const skillMap: Record<string, "Beginner" | "Intermediate" | "Advanced"> = {};
          if (u.skills) {
            try {
              const parsed = JSON.parse(u.skills);
              if (Array.isArray(parsed)) {
                parsed.forEach((s: any) => {
                  if (s?.name) {
                    skillMap[s.name] = s.level || "Beginner";
                  }
                });
              }
            } catch {}
          }
          setSelectedSkills(skillMap);

          // Explicitly isolate learning goals per account
          let goals: string[] = [];
          if (u.learningGoals) {
            try {
              const parsed = JSON.parse(u.learningGoals);
              if (Array.isArray(parsed)) goals = parsed;
            } catch {}
          }
          setLearningGoals(goals);

          if (u.primaryLearningGoal) {
            setPrimaryGoal(u.primaryLearningGoal);
          } else if (u.targetSkill) {
            setPrimaryGoal(u.targetSkill);
          } else {
            setPrimaryGoal(goals[0] || "");
          }
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => {
      const next = { ...prev };
      if (next[skill]) delete next[skill];
      else next[skill] = "Beginner";
      return next;
    });
  };

  const setLevel = (skill: string, level: "Beginner" | "Intermediate" | "Advanced", e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSkills((prev) => ({ ...prev, [skill]: level }));
  };

  const toggleGoal = (goalName: string) => {
    setLearningGoals((prev) => {
      if (prev.includes(goalName)) {
        const next = prev.filter((g) => g !== goalName);
        if (primaryGoal === goalName) {
          setPrimaryGoal(next[0] || "");
        }
        return next;
      } else {
        const next = [...prev, goalName];
        if (!primaryGoal) setPrimaryGoal(goalName);
        return next;
      }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const skillsArray = Object.entries(selectedSkills).map(([skillName, level]) => ({
      name: skillName,
      level,
    }));

    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          dob,
          mobile,
          gender,
          branch,
          year,
          semester,
          college,
          graduationYear,
          skills: skillsArray,
          learningGoals,
          primaryLearningGoal: primaryGoal || learningGoals[0] || "Data Analytics",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save profile.");

      setUser(data.user);
      setIsEditing(false);
      setSuccessMsg("Profile and learning goals updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const skillsList = getSkillsForBranch(branch);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col pb-20 md:pb-10 transition-colors duration-200">
      <Header user={user} />
      <LearnerNav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-12 w-full flex-1">
        {/* Profile Card Header */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl backdrop-blur-md mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/20">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 text-blue-800 dark:text-blue-300">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{user.email}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-600 dark:text-slate-400">
                <span>{user.branch || user.department}</span>
                <span>•</span>
                <span>{user.year || "2nd Year"}</span>
                <span>•</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">{user.college || "PICT"}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="self-start sm:self-center inline-flex items-center px-4 py-2 border border-blue-200 dark:border-blue-500/40 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-bold rounded-xl transition shadow-xs"
          >
            {isEditing ? (
              <>
                <X className="w-3.5 h-3.5 mr-1.5" />
                Cancel
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                Edit Profile & Goals
              </>
            )}
          </button>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center">
            <Check className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs font-semibold flex items-center">
            <X className="w-4 h-4 mr-2 text-rose-600 dark:text-rose-400" />
            {errorMsg}
          </div>
        )}

        {isEditing ? (
          /* Profile Edit Form */
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-6 flex items-center">
              <Edit2 className="w-4 h-4 mr-2 text-blue-400" />
              Update Learner Profile & Goals
            </h2>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Section 1: Basic Information */}
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider">
                  1. Basic Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="block w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white [color-scheme:dark] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 9876543210"
                      className="block w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value="" className="bg-slate-900 text-slate-300">Select gender</option>
                      <option value="Male" className="bg-slate-900 text-slate-300">Male</option>
                      <option value="Female" className="bg-slate-900 text-slate-300">Female</option>
                      <option value="Other" className="bg-slate-900 text-slate-300">Other</option>
                      <option value="Prefer not to say" className="bg-slate-900 text-slate-300">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Academic Details */}
              <div className="pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider">
                  2. Academic & Engineering Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Engineering Branch
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      {BRANCH_OPTIONS.map((b) => (
                        <option key={b} value={b} className="bg-slate-900 text-slate-300">
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Academic Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y} className="bg-slate-900 text-slate-300">
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Semester</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      {SEMESTER_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-slate-900 text-slate-300">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      College / University Name
                    </label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. Pune Institute of Computer Technology"
                      className="block w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Graduation Year
                    </label>
                    <select
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      className="block w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      {GRAD_YEARS.map((gy) => (
                        <option key={gy} value={gy} className="bg-slate-900 text-slate-300">
                          {gy}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Learning Goals & Primary Focus */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-blue-400" />
                    3. Learning Goals & Primary Focus
                  </h3>
                  <span className="text-[11px] text-blue-400 font-semibold">
                    {learningGoals.length} goals selected
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Select the engineering skills you want to learn, and pick one as your Primary Focus.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-1 border border-slate-800 rounded-xl mb-4 bg-slate-950/40">
                  {ALL_LEARNING_GOALS.map((goal) => {
                    const isSelected = learningGoals.includes(goal.name);
                    const isPrimary = primaryGoal === goal.name;

                    return (
                      <div
                        key={goal.id}
                        onClick={() => toggleGoal(goal.name)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-blue-500 bg-blue-950/40 shadow-xs shadow-blue-500/10"
                            : "border-slate-800 bg-slate-900/60 hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-semibold text-slate-200 block">{goal.name}</span>
                            <span className="text-[10px] text-slate-400">{goal.category}</span>
                          </div>
                          <span
                            className={`w-4 h-4 rounded shrink-0 flex items-center justify-center ${
                              isSelected ? "bg-blue-600 text-white" : "border border-slate-700 bg-slate-900"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">Primary Goal:</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPrimaryGoal(goal.name);
                              }}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                                isPrimary
                                  ? "bg-amber-400 text-amber-950 shadow-xs"
                                  : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-amber-950/50 hover:text-amber-300"
                              }`}
                            >
                              {isPrimary ? "★ Primary Focus" : "Set Primary"}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Skills & Proficiency Levels */}
              <div className="pt-4 border-t border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  4. Current Skills & Proficiency Levels (Prior Knowledge)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto p-1 border border-slate-800 rounded-xl bg-slate-950/40">
                  {skillsList.map((skill) => {
                    const isSelected = Boolean(selectedSkills[skill]);
                    const currentLevel = selectedSkills[skill] || "Beginner";
                    return (
                      <div
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-950/40 shadow-xs shadow-blue-500/10"
                            : "border-slate-800 bg-slate-900/60 hover:bg-slate-800/60"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{skill}</span>
                          <span
                            className={`w-4 h-4 rounded flex items-center justify-center ${
                              isSelected ? "bg-blue-600 text-white" : "border border-slate-700 bg-slate-900"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3" />}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="mt-2 flex gap-1">
                            {(["Beginner", "Intermediate", "Advanced"] as const).map((lvl) => (
                              <button
                                key={lvl}
                                type="button"
                                onClick={(e) => setLevel(skill, lvl, e)}
                                className={`flex-1 py-0.5 text-[10px] rounded font-semibold ${
                                  currentLevel === lvl
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                }`}
                              >
                                {lvl}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 disabled:opacity-50 transition"
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Profile Details View */
          <div className="space-y-6">
            {/* Learning Goals Card */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl backdrop-blur-md">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-4 flex items-center">
                <Target className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                Engineering Learning Goals & Focus
              </h2>

              <div className="mb-4">
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1.5">Primary Target Goal</span>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{primaryGoal || user.targetSkill || "Data Analytics"}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-200/60 dark:bg-amber-400/20 border border-amber-300 dark:border-amber-400/30 text-amber-900 dark:text-amber-300 font-extrabold uppercase">
                    Primary Path
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mb-2">All Selected Goals ({learningGoals.length})</span>
                <div className="flex flex-wrap gap-2">
                  {learningGoals.length > 0 ? (
                    learningGoals.map((g) => {
                      const isPrimary = g === primaryGoal;
                      return (
                        <div
                          key={g}
                          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                            isPrimary
                              ? "bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-500/40 text-blue-800 dark:text-blue-300"
                              : "bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                          }`}
                        >
                          <span>{g}</span>
                          {isPrimary && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400 text-amber-950 font-bold">
                              Primary
                            </span>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      No learning goals selected yet. Click Edit Profile to set your goals.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information Card */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl backdrop-blur-md">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-4 flex items-center">
                <GraduationCap className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                Academic Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Engineering Branch</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    {user.branch || user.department}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Academic Standing</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    {user.year || "2nd Year"} • {user.semester || "Semester 3"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Expected Graduation</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    {user.graduationYear || "2026"}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5">College / University</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    {user.college || "Pune Institute of Computer Technology"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Active Curriculum Slug</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                    {user.currentCourseId || "data-analytics"}
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Details Card */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl backdrop-blur-md">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-4 flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                Contact & Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Email</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Mobile Number</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.mobile || "Not specified"}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Date of Birth</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{user.dob || "Not specified"}</span>
                </div>
              </div>
            </div>

            {/* Skills Card */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-xl backdrop-blur-md">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-4 flex items-center">
                <Sparkles className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                Current Skills & Levels (Prior Knowledge)
              </h2>
              <div className="flex flex-wrap gap-2">
                {Object.keys(selectedSkills).length > 0 ? (
                  Object.entries(selectedSkills).map(([skill, lvl]) => (
                    <div
                      key={skill}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/90 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <span>{skill}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 text-blue-800 dark:text-blue-300 font-bold">
                        {lvl}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No skills recorded yet. Click Edit Profile to add your skills.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
