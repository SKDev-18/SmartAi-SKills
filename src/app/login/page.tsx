"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, UserCheck, ArrowRight, Lock, Mail, User, GraduationCap, Sparkles } from "lucide-react";
import { clearClientCache } from "@/lib/clientCache";

import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "@/lib/firebase";

function formatFirebaseError(err: any): string {
  const code = err?.code || "";
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Please check your credentials.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please sign in instead.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    default:
      return err?.message || "Authentication failed. Please try again.";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  // Wipe any stale client caches whenever login page is visited
  useEffect(() => {
    clearClientCache();
  }, []);

  // Login form state
  const [emailOrEmpId, setEmailOrEmpId] = useState("");
  const [password, setPassword] = useState("");

  // Signup form state (PRD §5)
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent, demoEmail?: string) => {
    if (e) e.preventDefault();
    clearClientCache();
    setError("");
    setLoading(true);

    // If quick demo access button clicked, use standard demo login route
    if (demoEmail) {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: demoEmail,
            isDemoUser: true,
            demoEmail,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Demo login failed.");
          setLoading(false);
          return;
        }
        router.push(data.user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard");
        router.refresh();
        return;
      } catch (demoErr) {
        setError("Demo login failed.");
        setLoading(false);
        return;
      }
    }

    if (!emailOrEmpId) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      setLoading(false);
      return;
    }

    // 1. Authenticate with Firebase Email/Password
    try {
      let firebaseUser = null;
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          emailOrEmpId.trim(),
          password
        );
        firebaseUser = userCredential.user;
      } catch (firebaseErr: any) {
        // If not found in Firebase yet, fall back to local database verify
        console.warn("Firebase email sign-in note:", firebaseErr?.code);
        const fallbackRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailOrEmpId,
            password,
          }),
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackRes.ok && fallbackData.user) {
          router.push(
            fallbackData.user.role === "ADMIN"
              ? "/admin/dashboard"
              : fallbackData.user.onboardingCompleted
              ? "/dashboard"
              : "/onboarding/step-1"
          );
          router.refresh();
          return;
        }

        // If local database also rejected, format Firebase error
        setError(formatFirebaseError(firebaseErr));
        setLoading(false);
        return;
      }

      // 2. Sync Firebase user session with NexStep backend
      if (firebaseUser?.email) {
        const syncRes = await fetch("/api/auth/firebase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            uid: firebaseUser.uid,
            providerId: "password",
          }),
        });

        const syncData = await syncRes.json();
        if (!syncRes.ok) {
          throw new Error(syncData.error || "Session synchronization failed.");
        }

        router.push(syncData.redirectTo || "/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      console.error("Login process error:", err);
      setError(err?.message || "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!signupName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create account in Firebase Auth
      let firebaseUser = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          signupEmail.trim(),
          signupPassword
        );
        firebaseUser = userCredential.user;
      } catch (fbErr: any) {
        // If email already in use or Firebase error
        console.warn("Firebase create user error:", fbErr?.code);
        setError(formatFirebaseError(fbErr));
        setLoading(false);
        return;
      }

      // 2. Sync with NexStep database & establish session
      const syncRes = await fetch("/api/auth/firebase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupEmail.trim(),
          name: signupName.trim(),
          uid: firebaseUser?.uid,
          providerId: "password",
          isNewUser: true,
        }),
      });

      const syncData = await syncRes.json();
      if (!syncRes.ok) {
        throw new Error(syncData.error || "Account setup failed.");
      }

      // Purge any residual cache before starting fresh onboarding
      clearClientCache();

      // Per PRD §5: After successful signup, route to onboarding step 1
      router.push("/onboarding/step-1");
      router.refresh();
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err?.message || "An unexpected error occurred during signup.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Top Banner */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center animate-fade-in-down">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white shadow-xl shadow-blue-500/20 mb-3 animate-float">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          NexStep <span className="text-blue-600 dark:text-blue-500">AI</span>
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 font-medium">
          AI-Powered Personalized Learning Platform for Engineering Students
        </p>
        <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full border border-blue-200 dark:border-blue-500/20 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-float" />
          Autonomous Adaptive Learning Platform
        </span>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-scale-in">
        <div className="bg-white dark:bg-slate-900/90 py-8 px-6 shadow-xl dark:shadow-2xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 sm:px-10">
          {/* Tab Switcher */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setError("");
              }}
              className={`flex-1 pb-3 text-sm font-semibold text-center border-b-2 transition-colors ${
                activeTab === "login"
                  ? "border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                setError("");
              }}
              className={`flex-1 pb-3 text-sm font-semibold text-center border-b-2 transition-colors ${
                activeTab === "signup"
                  ? "border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          {activeTab === "login" ? (
            <form className="space-y-4" onSubmit={(e) => handleLogin(e)}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email or Student ID
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={emailOrEmpId}
                    onChange={(e) => setEmailOrEmpId(e.target.value)}
                    placeholder="harshal.patel@engg.edu"
                    className="block w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-press w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-md hover:shadow-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Signing in..." : "Sign In to Platform"}
              </button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleSignup}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Aryan Kulkarni"
                    className="block w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="block w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="block w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Confirm Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="block w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-press w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-md hover:shadow-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Creating Account..." : "Create Account & Start Onboarding →"}
              </button>
            </form>
          )}

          {/* Quick Demo Access Buttons */}
          <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 text-center">
              Quick Demo Access
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleLogin(undefined, "harshal.patel@engg.edu")}
                className="btn-press card-hover w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform">
                    HP
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Harshal Patel (Engineering Student)
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Computer Engineering • 2nd Year • DSA Roadmap Active
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleLogin(undefined, "admin@mospi.gov.in")}
                className="btn-press card-hover w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      Dr. Arvind Saxena (Admin / Faculty)
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Curriculum & Capacity Building Lead
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
