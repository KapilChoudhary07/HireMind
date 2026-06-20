

import MainLayout from "../layouts/MainLayout";
import { FileText, AlertCircle, CheckCircle2, Info } from "lucide-react";

const TERMS = [
  { icon: <CheckCircle2 className="h-5 w-5" />, color: "bg-blue-500/15 text-blue-400",    title: "User Responsibility",    body: "Users are fully responsible for the accuracy and content they upload to HireMind, including resumes and other documents. Do not upload misleading or harmful content." },
  { icon: <Info className="h-5 w-5" />,         color: "bg-purple-500/15 text-purple-400", title: "AI-Generated Content",   body: "All AI-generated feedback, interview questions, and scores are intended for educational and career preparation purposes only. Results may vary." },
  { icon: <AlertCircle className="h-5 w-5" />,  color: "bg-amber-500/15 text-amber-400",  title: "No Guarantees",          body: "HireMind does not guarantee job placement, interview success, or hiring outcomes. Our platform is a practice and preparation tool, not an employment service." },
  { icon: <FileText className="h-5 w-5" />,     color: "bg-emerald-500/15 text-emerald-400", title: "Acceptable Use",       body: "HireMind must be used only for lawful and ethical career preparation purposes. Misuse, scraping, or reverse-engineering the platform is strictly prohibited." },
];

const Terms = () => (
  <>
    <style>{`
      @keyframes slideUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      @keyframes cardIn    { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
      @keyframes floatGlow { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.1)} }
    `}</style>
    <MainLayout>
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-600/5 blur-3xl" style={{animation:"floatGlow 6s ease-in-out infinite"}} />
        </div>
        <div className="relative pb-12 pt-16 lg:pt-0">

          <div className="mb-8" style={{animation:"slideUp 0.4s ease-out both"}}>
            <div className="flex items-center gap-3 mb-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/15 text-amber-400">
                <FileText className="h-5 w-5" />
              </div>
              <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                Terms & Conditions
              </h1>
            </div>
            <p className="pl-12 text-xs text-slate-600">Effective: January 2026 · By using HireMind you agree to these terms</p>
          </div>

          <div className="space-y-4">
            {TERMS.map((t, i) => (
              <div key={t.title}
                className="rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/80 to-slate-950 p-5 backdrop-blur transition-all hover:border-slate-700/80"
                style={{animation:`cardIn 0.4s ease-out ${0.08+i*0.08}s both`}}>
                <div className="flex items-start gap-4">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${t.color}`}>
                    {t.icon}
                  </div>
                  <div>
                    <h3 className="mb-1.5 font-semibold text-white">{t.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{t.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-slate-700"
            style={{animation:"slideUp 0.4s ease-out 0.45s both"}}>
            Questions about these terms? <a href="/contact" className="text-blue-400 hover:underline">Contact us</a>
          </p>
        </div>
      </div>
    </MainLayout>
  </>
);

export default Terms;