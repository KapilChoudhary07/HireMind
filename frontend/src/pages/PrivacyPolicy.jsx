


import MainLayout from "../layouts/MainLayout";
import { Shield, Lock, Eye, Database, Bell } from "lucide-react";

const SECTIONS = [
  { icon: <Database className="h-5 w-5" />, color: "bg-blue-500/15 text-blue-400",    title: "Data We Collect",       body: "We collect your name, email, uploaded resumes, and interview-related performance data to provide personalized career assistance and AI-powered feedback." },
  { icon: <Lock className="h-5 w-5" />,    color: "bg-emerald-500/15 text-emerald-400", title: "How We Use Your Data",  body: "Your data is used exclusively to power resume analysis, generate interview questions, and track your performance. We never use your data for advertising." },
  { icon: <Eye className="h-5 w-5" />,     color: "bg-purple-500/15 text-purple-400", title: "Third-Party Sharing",   body: "We do not sell, share, or distribute your personal information to any third parties under any circumstances. Your privacy is our top priority." },
  { icon: <Bell className="h-5 w-5" />,    color: "bg-amber-500/15 text-amber-400",   title: "Your Rights",           body: "You can request to delete your account and associated data at any time. Contact us and we'll process your request within 7 business days." },
];

const PrivacyPolicy = () => (
  <>
    <style>{`
      @keyframes slideUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      @keyframes cardIn    { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
      @keyframes floatGlow { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.1)} }
    `}</style>
    <MainLayout>
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-emerald-600/5 blur-3xl" style={{animation:"floatGlow 7s ease-in-out infinite"}} />
        </div>
        <div className="relative pb-12 pt-16 lg:pt-0">

          <div className="mb-8" style={{animation:"slideUp 0.4s ease-out both"}}>
            <div className="flex items-center gap-3 mb-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
                <Shield className="h-5 w-5" />
              </div>
              <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                Privacy Policy
              </h1>
            </div>
            <p className="pl-12 text-xs text-slate-600">Last updated: January 2026</p>
          </div>

          {/* Trust badge */}
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 px-5 py-4"
            style={{animation:"cardIn 0.4s ease-out 0.06s both"}}>
            <Shield className="h-5 w-5 shrink-0 text-emerald-400" />
            <p className="text-sm font-medium text-emerald-300">
              HireMind is committed to protecting your privacy. We collect only what is necessary to serve you.
            </p>
          </div>

          <div className="space-y-4">
            {SECTIONS.map((s, i) => (
              <div key={s.title}
                className="rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/80 to-slate-950 p-5 backdrop-blur"
                style={{animation:`cardIn 0.4s ease-out ${0.12+i*0.07}s both`}}>
                <div className="flex items-start gap-4">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${s.color}`}>
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="mb-1.5 font-semibold text-white">{s.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  </>
);

export default PrivacyPolicy;