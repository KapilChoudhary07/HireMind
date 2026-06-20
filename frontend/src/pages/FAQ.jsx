
import MainLayout from "../layouts/MainLayout";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  { q: "How does Resume Analysis work?",        a: "HireMind uses AI to analyze your uploaded PDF resume and provides a detailed breakdown including ATS compatibility score, key strengths, areas to improve, and specific suggestions to make your resume stand out." },
  { q: "How are interview questions generated?", a: "Our AI generates questions based on your skills, experience level, and the selected interview type (Technical, HR, Behavioral, etc.). Each question is tailored to give you a realistic practice experience." },
  { q: "Is HireMind free to use?",              a: "Yes! HireMind is completely free for learning and interview preparation. You can upload resumes, practice interviews, and track your progress at no cost." },
  { q: "How is my score calculated?",           a: "Your interview score is calculated by AI based on the quality, relevance, and depth of your answers. Each question is scored individually and combined to give an overall performance score." },
  { q: "Can I retake an interview?",            a: "Absolutely! You can take as many mock interviews as you want. We recommend practicing regularly to see consistent improvement in your scores." },
  { q: "Is my data secure?",                    a: "Yes. We do not sell or share your personal information or resume data with any third parties. Your data is used exclusively for providing AI analysis and feedback." },
];

const FAQItem = ({ q, a, delay }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`overflow-hidden rounded-2xl border transition-all ${open ? "border-blue-500/30 bg-blue-500/5" : "border-slate-800/70 bg-slate-900/50"}`}
      style={{animation:`cardIn 0.4s ease-out ${delay}s both`}}>
      <button onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-all hover:bg-slate-800/30">
        <span className={`text-sm font-semibold flex-1 ${open ? "text-blue-300" : "text-white"}`}>{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${open ? "rotate-180 text-blue-400" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4" style={{animation:"slideUp 0.2s ease-out both"}}>
          <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
};

const FAQ = () => (
  <>
    <style>{`
      @keyframes slideUp   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      @keyframes cardIn    { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
      @keyframes floatGlow { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.1)} }
    `}</style>
    <MainLayout>
      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-600/6 blur-3xl" style={{animation:"floatGlow 7s ease-in-out infinite"}} />
        </div>
        <div className="relative pb-12 pt-16 lg:pt-0">
          <div className="mb-8" style={{animation:"slideUp 0.4s ease-out both"}}>
            <div className="flex items-center gap-3 mb-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500/15 text-indigo-400">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                Frequently Asked Questions
              </h1>
            </div>
            <p className="text-sm text-slate-500 pl-12">Everything you need to know about HireMind</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} delay={0.08 + i * 0.06} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  </>
);

export default FAQ;