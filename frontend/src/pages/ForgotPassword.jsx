

import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft,
  Loader2, ShieldCheck, CheckCircle2, KeyRound,
} from "lucide-react";
import api from "../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp+pass, 3=success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const otpRefs = useRef([]);

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };
  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };
  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split("")); otpRefs.current[5]?.focus(); }
  };

  const handleForgotPassword = async () => {
    setError("");
    if (!email) { setError("Please enter your email address."); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setSuccess(data.message || "OTP sent to your email!");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Try again.");
    } finally { setLoading(false); }
  };

  const handleResetPassword = async () => {
    setError("");
    const otpStr = otp.join("");
    if (otpStr.length < 6) { setError("Please enter the complete 6-digit OTP."); return; }
    if (!newPassword || newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp: otpStr, newPassword });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP or expired.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.93); } to { opacity:1; transform:scale(1); } }
        @keyframes blobPulse { 0%,100% { opacity:0.3; transform:scale(1); } 50% { opacity:0.55; transform:scale(1.1); } }
        @keyframes logoBounce { 0%,100% { transform:translateY(0) scale(1); } 30% { transform:translateY(-7px) scale(1.06); } 60% { transform:translateY(-2px) scale(1.02); } }
        @keyframes otpPop { from { opacity:0; transform:scale(0.7) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes successPop { 0% { transform:scale(0.5); opacity:0; } 70% { transform:scale(1.15); opacity:1; } 100% { transform:scale(1); opacity:1; } }
        @keyframes floatDot { 0%,100% { transform:translateY(0) scale(1); opacity:0.25; } 50% { transform:translateY(-18px) scale(1.1); opacity:0.5; } }
        .otp-input:focus { border-color:#3b82f6; background:rgba(30,41,59,0.9); box-shadow:0 0 0 3px rgba(59,130,246,0.2); outline:none; }
      `}</style>

      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
        {/* Blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" style={{ animation:"blobPulse 4s ease-in-out infinite" }} />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-600/30 blur-3xl" style={{ animation:"blobPulse 4s ease-in-out 1.5s infinite" }} />
          <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" style={{ animation:"blobPulse 5s ease-in-out 0.8s infinite" }} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.08)_1px,transparent_0)] [background-size:24px_24px]" />

        {/* Floating dots */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[{size:5,left:"8%",top:"20%",delay:"0s",dur:"3.6s"},{size:3,left:"88%",top:"15%",delay:"0.7s",dur:"4.2s"},{size:4,left:"92%",top:"70%",delay:"1.2s",dur:"3.9s"},{size:3,left:"5%",top:"75%",delay:"0.4s",dur:"5s"}]
            .map((dot, i) => <span key={i} className="absolute rounded-full bg-blue-400/20" style={{ width:dot.size*4, height:dot.size*4, left:dot.left, top:dot.top, animation:`floatDot ${dot.dur} ease-in-out ${dot.delay} infinite` }} />)}
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">

          {/* ── Step 3: Success ── */}
          {step === 3 && (
            <div className="mx-auto w-full max-w-md text-center" style={{ animation:"scaleIn 0.4s ease-out both" }}>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-10 shadow-2xl shadow-blue-500/5 backdrop-blur-xl">
                <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30"
                  style={{ animation:"successPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both" }}>
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold" style={{ animation:"slideUp 0.4s ease-out 0.3s both" }}>Password Reset!</h2>
                <p className="mt-3 text-slate-400" style={{ animation:"slideUp 0.4s ease-out 0.4s both" }}>
                  Your password has been updated. You can now login with your new password.
                </p>
                <button onClick={() => navigate("/login")}
                  className="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:brightness-110 hover:shadow-blue-500/50 active:scale-[0.98]"
                  style={{ animation:"slideUp 0.4s ease-out 0.5s both" }}>
                  Go to Login <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 1 & 2 ── */}
          {step !== 3 && (
            <div className="mx-auto w-full max-w-md" style={{ animation:"scaleIn 0.4s ease-out both" }}>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-blue-500/5 backdrop-blur-xl sm:p-8">

                {/* Header */}
                <div className="mb-8 text-center" style={{ animation:"slideUp 0.4s ease-out 0.05s both" }}>
                  <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30"
                    style={{ animation:"logoBounce 1s ease-out 0.3s both" }}>
                    {step === 1 ? <Mail className="h-6 w-6 text-white" /> : <KeyRound className="h-6 w-6 text-white" />}
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight">{step === 1 ? "Forgot Password" : "Verify & Reset"}</h1>
                  <p className="mt-2 text-sm text-slate-400">
                    {step === 1 ? "Enter your email and we'll send you an OTP" : `OTP sent to ${email}`}
                  </p>
                </div>

                {/* Step indicator */}
                <div className="mb-8 flex items-center gap-2" style={{ animation:"slideUp 0.4s ease-out 0.1s both" }}>
                  {[1, 2].map((s) => (
                    <div key={s} className="flex flex-1 items-center gap-2">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-500 ${step >= s ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md shadow-blue-500/30" : "border border-slate-700 bg-slate-800 text-slate-500"}`}>
                        {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                      </div>
                      <span className={`text-xs transition-colors ${step >= s ? "text-slate-300" : "text-slate-600"}`}>
                        {s === 1 ? "Email" : "Verify OTP"}
                      </span>
                      {s < 2 && <div className={`ml-auto h-px flex-1 transition-all duration-700 ${step > s ? "bg-blue-500" : "bg-slate-800"}`} />}
                    </div>
                  ))}
                </div>

                {/* Success banner */}
                {success && step === 2 && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-300" style={{ animation:"slideUp 0.25s ease-out both" }}>
                    <ShieldCheck className="h-4 w-4 shrink-0" /> {success}
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div role="alert" className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300" style={{ animation:"slideUp 0.2s ease-out both" }}>
                    {error}
                  </div>
                )}

                {/* ── Step 1: Email ── */}
                {step === 1 && (
                  <div className="space-y-5" style={{ animation:"slideUp 0.4s ease-out 0.15s both" }}>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email address</label>
                      <div className="group relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
                        <input id="email" type="email" autoComplete="email" placeholder="you@company.com" value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleForgotPassword()}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800/60 py-3 pl-10 pr-3 text-sm text-white placeholder:text-slate-500 transition-all focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                    </div>
                    <button onClick={handleForgotPassword} disabled={loading}
                      className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:brightness-110 hover:shadow-blue-500/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
                      {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending OTP...</> : <>Send OTP <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>}
                    </button>
                  </div>
                )}

                {/* ── Step 2: OTP + Password ── */}
                {step === 2 && (
                  <div className="space-y-5">
                    {/* OTP boxes */}
                    <div style={{ animation:"slideUp 0.4s ease-out 0.15s both" }}>
                      <label className="mb-3 block text-sm font-medium text-slate-300">Enter 6-digit OTP</label>
                      <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                        {otp.map((digit, idx) => (
                          <input key={idx} ref={(el) => (otpRefs.current[idx] = el)}
                            type="text" inputMode="numeric" maxLength={1} value={digit}
                            onChange={(e) => handleOtpChange(e.target.value, idx)}
                            onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                            className="otp-input h-10 w-10 sm:h-12 sm:w-12 rounded-xl border border-slate-700 bg-slate-800/60 text-center text-base sm:text-lg font-bold text-white transition-all"
                            style={{ animation:`otpPop 0.35s cubic-bezier(0.34,1.56,0.64,1) ${0.15 + idx * 0.06}s both` }} />
                        ))}
                      </div>
                      <p className="mt-2 text-center text-xs text-slate-500">
                        Didn't receive it?{" "}
                        <button type="button" onClick={() => { setStep(1); setOtp(["","","","","",""]); setError(""); setSuccess(""); }}
                          className="text-blue-400 hover:text-blue-300 hover:underline">Resend OTP</button>
                      </p>
                    </div>
                    {/* New password */}
                    <div className="space-y-2" style={{ animation:"slideUp 0.4s ease-out 0.3s both" }}>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300">New Password</label>
                      <div className="group relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
                        <input id="newPassword" type={showPassword ? "text" : "password"} placeholder="••••••••" value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-800/60 py-3 pl-10 pr-11 text-sm text-white placeholder:text-slate-500 transition-all focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="toggle"
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-slate-200">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    {/* Submit */}
                    <div style={{ animation:"slideUp 0.4s ease-out 0.38s both" }}>
                      <button onClick={handleResetPassword} disabled={loading}
                        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:brightness-110 hover:shadow-blue-500/50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
                        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Resetting...</> : <>Reset Password <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>}
                      </button>
                    </div>
                    <button type="button" onClick={() => { setStep(1); setOtp(["","","","","",""]); setError(""); setSuccess(""); }}
                      className="flex w-full items-center justify-center gap-1 text-sm text-slate-500 transition-colors hover:text-slate-300"
                      style={{ animation:"slideUp 0.4s ease-out 0.44s both" }}>
                      <ArrowLeft className="h-3.5 w-3.5" /> Back to email
                    </button>
                  </div>
                )}

                <p className="mt-6 text-center text-sm text-slate-500" style={{ animation:"slideUp 0.4s ease-out 0.5s both" }}>
                  Remember your password?{" "}
                  <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">Login</Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ForgotPassword;