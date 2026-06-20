


import { Link, useNavigate } from "react-router-dom";
import api from "../services/api"
import { saveToken } from "../utils/auth";
import { useState } from "react";
import {
  Eye, EyeOff, Mail, Lock, Loader2, Sparkles, ArrowRight, User, ShieldCheck,
} from "lucide-react";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agreed, setAgreed] = useState(false);const handleRegister = async (e) => {
  e.preventDefault();
  setError(null);

  if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
    setError("All fields are required."); return;
  }
  if (formData.password.length < 6) {
    setError("Password must be at least 6 characters."); return;
  }
  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match."); return;
  }
  if (!agreed) {
    setError("Please accept the Terms of Service to continue."); return;
  }

  setLoading(true);
  try {
    const { data } = await api.post("/auth/register", {
      name:     formData.name,
      email:    formData.email,
      password: formData.password,
    });

    if (data.token) saveToken(data.token);

    // ✅ Register hone ke baad login page pe aao
    navigate(data.token ? "/dashboard" : "/login", { replace: true });

  } catch (err) {
    let msg = err?.response?.data?.message || err?.response?.data?.error;

    if (!msg && err?.code === "ECONNABORTED") {
      msg = "The registration server took too long to respond. Please try again.";
    } else if (!msg && !err?.response) {
      msg = "Could not reach the registration server. Please check the deployed API URL and CORS settings.";
    } else if (!msg && err?.response?.status) {
      msg = `Registration server returned an unexpected response (${err.response.status}).`;
    }

    setError(msg || "Registration failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-22px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes floatDot { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; } 50% { transform: translateY(-20px) scale(1.1); opacity: 0.6; } }
        @keyframes logoBounce { 0%, 100% { transform: translateY(0) scale(1); } 30% { transform: translateY(-7px) scale(1.05); } 60% { transform: translateY(-2px) scale(1.02); } }
        @keyframes blobPulse { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.08); } }
      `}</style>

      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">

        {/* Animated blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" style={{ animation: "blobPulse 4s ease-in-out infinite" }} />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-600/30 blur-3xl" style={{ animation: "blobPulse 4s ease-in-out 1.5s infinite" }} />
          <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" style={{ animation: "blobPulse 5s ease-in-out 0.8s infinite" }} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.08)_1px,transparent_0)] [background-size:24px_24px]" />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">

            {/* Left brand panel */}
            <section className="hidden flex-col gap-6 lg:flex" style={{ animation: "fadeIn 0.6s ease-out both" }}>
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur"
                style={{ animation: "fadeInLeft 0.55s ease-out 0.1s both" }}>
                <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                Your AI interview coach
              </div>
              <h2 className="text-5xl font-bold leading-tight tracking-tight"
                style={{ animation: "fadeInLeft 0.55s ease-out 0.2s both" }}>
                Join{" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">HireMind</span>
              </h2>
              <p className="max-w-md text-base text-slate-400" style={{ animation: "fadeInLeft 0.55s ease-out 0.3s both" }}>
                Build your profile, upload your resume, and practice technical
                interviews with instant AI feedback.
              </p>
              <ul className="mt-2 space-y-3 text-sm text-slate-300">
                {[
                  "Practice text, voice, and video interviews",
                  "Choose your technology and difficulty level",
                  "Review scores, strengths, and improvement tips",
                ].map((item, i) => (
                  <li key={item} className="flex items-center gap-3"
                    style={{ animation: `fadeInLeft 0.5s ease-out ${0.4 + i * 0.1}s both` }}>
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-500/20 text-blue-400">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              {/* Floating dots */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {[
                  { size: 5, left: "12%", top: "28%", delay: "0s", dur: "3.6s" },
                  { size: 3, left: "28%", top: "60%", delay: "0.9s", dur: "4.2s" },
                  { size: 4, left: "6%", top: "72%", delay: "1.4s", dur: "3.9s" },
                  { size: 3, left: "38%", top: "18%", delay: "0.4s", dur: "5.1s" },
                ].map((dot, i) => (
                  <span key={i} className="absolute rounded-full bg-blue-400/20"
                    style={{ width: dot.size * 4, height: dot.size * 4, left: dot.left, top: dot.top, animation: `floatDot ${dot.dur} ease-in-out ${dot.delay} infinite` }} />
                ))}
              </div>
            </section>

            {/* Form card */}
            <section className="mx-auto w-full max-w-md" style={{ animation: "scaleIn 0.4s ease-out both" }}>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-blue-500/5 backdrop-blur-xl sm:p-8">
                <div className="mb-6 text-center" style={{ animation: "slideUp 0.4s ease-out 0.05s both" }}>
                  <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30"
                    style={{ animation: "logoBounce 1.8s ease-in-out infinite" }}>
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
                  <p className="mt-2 text-sm text-slate-400">Start practicing smarter with HireMind</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4" noValidate>
                  {/* Full Name */}
                  <div className="space-y-2" style={{ animation: "slideUp 0.4s ease-out 0.1s both" }}>
                    <label className="block text-sm font-medium text-slate-300" htmlFor="name">Full Name</label>
                    <div className="group relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
                      <input id="name" type="text" placeholder="John Doe" value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="auth-input w-full rounded-xl border border-slate-700 bg-slate-800/60 py-3 pl-10 pr-3 text-sm text-white shadow-inner shadow-black/10 placeholder:text-slate-500 transition-all hover:border-slate-600 focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2" style={{ animation: "slideUp 0.4s ease-out 0.16s both" }}>
                    <label className="block text-sm font-medium text-slate-300" htmlFor="email">Email</label>
                    <div className="group relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
                      <input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="auth-input w-full rounded-xl border border-slate-700 bg-slate-800/60 py-3 pl-10 pr-3 text-sm text-white shadow-inner shadow-black/10 placeholder:text-slate-500 transition-all hover:border-slate-600 focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2" style={{ animation: "slideUp 0.4s ease-out 0.22s both" }}>
                    <label className="block text-sm font-medium text-slate-300" htmlFor="password">Password</label>
                    <div className="group relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
                      <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="auth-input w-full rounded-xl border border-slate-700 bg-slate-800/60 py-3 pl-10 pr-11 text-sm text-white shadow-inner shadow-black/10 placeholder:text-slate-500 transition-all hover:border-slate-600 focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide" : "Show"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-slate-200">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2" style={{ animation: "slideUp 0.4s ease-out 0.28s both" }}>
                    <label className="block text-sm font-medium text-slate-300" htmlFor="confirmPassword">Confirm Password</label>
                    <div className="group relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
                      <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="auth-input w-full rounded-xl border border-slate-700 bg-slate-800/60 py-3 pl-10 pr-11 text-sm text-white shadow-inner shadow-black/10 placeholder:text-slate-500 transition-all hover:border-slate-600 focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? "Hide" : "Show"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-slate-200">
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-2" style={{ animation: "slideUp 0.4s ease-out 0.34s both" }}>
                    <input id="terms" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500/40" />
                    <label htmlFor="terms" className="text-sm text-slate-400">
                      I agree to the{" "}
                      <Link to="/terms" className="text-blue-400 hover:text-blue-300 hover:underline">Terms of Service</Link>
                      {" "}and{" "}
                      <Link to="/privacy-policy" className="text-blue-400 hover:text-blue-300 hover:underline">Privacy Policy</Link>
                    </label>
                  </div>

                  {/* Error */}
                  {error && (
                    <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                      style={{ animation: "slideUp 0.2s ease-out both" }}>
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <div style={{ animation: "slideUp 0.4s ease-out 0.4s both" }}>
                    <button type="submit" disabled={loading}
                      className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
                      {loading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" />Creating account...</>
                      ) : (
                        <>Register<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                      )}
                    </button>
                  </div>

                  <p className="pt-1 text-center text-sm text-slate-400" style={{ animation: "slideUp 0.4s ease-out 0.46s both" }}>
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">Login</Link>
                  </p>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

export default RegisterPage;
