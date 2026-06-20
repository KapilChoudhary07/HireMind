

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import api from "../services/api";
import { saveToken } from "../utils/auth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    password: "",
  });
  const successMessage = location.state?.message;
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Please fill in both email and password.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", formData);
      saveToken(data.token, remember);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes authIconBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          45% { transform: translateY(-9px) scale(1.06); }
          60% { transform: translateY(-3px) scale(1.02); }
        }
      `}</style>
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-600/30 blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.08)_1px,transparent_0)] [background-size:24px_24px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">
          {/* Brand panel - desktop only */}
          <section
            className="hidden flex-col gap-6 lg:flex"
            style={{ animation: "fadeIn 0.6s ease-out" }}
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              AI-powered interview preparation
            </div>
            <h2 className="text-5xl font-bold leading-tight tracking-tight">
              Welcome back to{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                HireMind
              </span>
            </h2>
            <p className="max-w-md text-base text-slate-400">
              Practice realistic AI interviews, analyze your resume, and track
              your progress in one focused career workspace.
            </p>
            <ul className="mt-2 space-y-3 text-sm text-slate-300">
              {[
                "AI-generated technical interview questions",
                "Voice and video interview practice",
                "Resume analysis and performance tracking",
              ].map((item, i) => (
                <li
                  key={item}
                  className="flex items-center gap-3"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${0.2 + i * 0.1}s both`,
                  }}
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-500/20 text-blue-400">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Form card */}
          <section
            className="mx-auto w-full max-w-md"
            style={{ animation: "scaleIn 0.4s ease-out" }}
          >
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-blue-500/5 backdrop-blur-xl sm:p-8">
              <div className="mb-8 text-center">
                <div
                  className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30"
                  style={{ animation: "authIconBounce 1.8s ease-in-out infinite" }}
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome Back
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                  Continue your interview preparation
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5" noValidate>
                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Email
                  </label>
                  <div className="group relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="auth-input w-full rounded-xl border border-slate-700 bg-slate-800/60 py-3 pl-10 pr-3 text-sm text-white shadow-inner shadow-black/10 placeholder:text-slate-500 transition-all hover:border-slate-600 focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-300"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
                    >
                     
                      <Link to="/forgot-password" className="ml-1">
                        Forgot?
                      </Link>
                    </button>
                  </div>
                  <div className="group relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="auth-input w-full rounded-xl border border-slate-700 bg-slate-800/60 py-3 pl-10 pr-11 text-sm text-white shadow-inner shadow-black/10 placeholder:text-slate-500 transition-all hover:border-slate-600 focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-slate-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-slate-400">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500/40"
                  />
                  Remember me on this device
                </label>

                {successMessage && !error && (
                  <div
                    role="status"
                    className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
                    style={{ animation: "fadeIn 0.2s ease-out" }}
                  >
                    {successMessage}
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                    style={{ animation: "fadeIn 0.2s ease-out" }}
                  >
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Login
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                <p className="pt-2 text-center text-sm text-slate-400">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-blue-400 hover:text-blue-300"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
    </>
  );
};

export default Login;
