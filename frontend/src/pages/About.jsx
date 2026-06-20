

import MainLayout from "../layouts/MainLayout";
import { Sparkles, Target, Brain, FileText, BarChart3, Users } from "lucide-react";

const FEATURES = [
  { icon: <FileText className="h-5 w-5" />,  color: "from-blue-500/20 to-blue-600/10 text-blue-400",    title: "Resume Analysis",    desc: "AI scans your resume and gives ATS score, strengths, weaknesses, and improvement tips." },
  { icon: <Brain className="h-5 w-5" />,     color: "from-purple-500/20 to-purple-600/10 text-purple-400", title: "AI Mock Interviews", desc: "Practice with AI-generated questions tailored to your skills and job role." },
  { icon: <BarChart3 className="h-5 w-5" />, color: "from-emerald-500/20 to-emerald-600/10 text-emerald-400", title: "Performance Tracking", desc: "Track scores across all interviews and measure your improvement over time." },
  { icon: <Target className="h-5 w-5" />,    color: "from-amber-500/20 to-amber-600/10 text-amber-400",  title: "Personalized Feedback", desc: "Get detailed feedback on every answer with actionable suggestions to improve." },
];

const About = () => (
  <>
    <style>{`
      @keyframes slideUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      @keyframes cardIn    { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
      @keyframes floatGlow { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.1)} }
    `}</style>
    <MainLayout>
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-600/7 blur-3xl" style={{animation:"floatGlow 6s ease-in-out infinite"}} />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-600/6 blur-3xl" style={{animation:"floatGlow 8s ease-in-out 2s infinite"}} />
        </div>

        <div className="relative pb-12 pt-16 lg:pt-0">

          {/* Hero */}
          <div className="mb-8 text-center" style={{animation:"slideUp 0.4s ease-out both"}}>
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/25">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              About HireMind
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 sm:text-base leading-relaxed">
              An AI-powered career preparation platform designed to help students and professionals
              land their dream jobs with confidence.
            </p>
          </div>

          {/* Mission card */}
          <div className="mb-6 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/50 via-slate-900/80 to-slate-950 p-6 backdrop-blur sm:p-8"
            style={{animation:"cardIn 0.4s ease-out 0.08s both"}}>
            <div className="flex items-start gap-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-500/15 text-blue-400">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h2 className="mb-2 font-bold text-white text-lg">Our Mission</h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Our goal is to help every job seeker become more confident and better prepared for
                  real-world opportunities. We combine AI technology with proven interview strategies
                  to give you an unfair advantage in the hiring process.
                </p>
              </div>
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <div key={f.title}
                className="rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/80 to-slate-950 p-5 backdrop-blur transition-all hover:border-slate-700/80"
                style={{animation:`cardIn 0.4s ease-out ${0.14+i*0.07}s both`}}>
                <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="mb-1.5 font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Team note */}
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-800/50 bg-slate-900/40 p-4"
            style={{animation:"cardIn 0.4s ease-out 0.45s both"}}>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <Users className="h-4 w-4" />
            </div>
            <p className="text-sm text-slate-500">
              Built by a passionate team who believe <span className="text-slate-300 font-medium">every candidate deserves a fair shot</span> at their dream career.
            </p>
          </div>

        </div>
      </div>
    </MainLayout>
  </>
);

export default About;