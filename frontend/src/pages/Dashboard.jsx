// import MainLayout from "../layouts/MainLayout";
// import { useEffect, useState } from "react";
// import api from "../services/api";
// import { Link } from "react-router-dom";
// import {
//   FileText, Brain, Trophy, Award, Sparkles,
//   ChevronRight, TrendingUp, ArrowUpRight,
//   Calendar, Clock, BarChart3, Zap,
//   CheckCircle2, AlertCircle,
// } from "lucide-react";

// /* ── Score helpers ── */
// const scoreColor = (s) => s >= 80 ? "text-emerald-400" : s >= 60 ? "text-amber-400" : "text-rose-400";
// const scoreBg    = (s) => s >= 80 ? "from-emerald-500 to-teal-400" : s >= 60 ? "from-amber-400 to-yellow-300" : "from-rose-500 to-red-400";
// const scoreBorder= (s) => s >= 80 ? "border-emerald-500/25 bg-emerald-500/10" : s >= 60 ? "border-amber-500/25 bg-amber-500/10" : "border-rose-500/25 bg-rose-500/10";

// const typeIcon = (type) => {
//   const t = type?.toLowerCase();
//   if (t?.includes("technical")) return "🧑‍💻";
//   if (t?.includes("hr"))        return "🤝";
//   if (t?.includes("behav"))     return "💬";
//   if (t?.includes("system"))    return "🏗️";
//   return "📋";
// };

// /* ── Inline stat card ── */
// const StatCard = ({ title, value, icon: Icon, gradient, border, glow, delay = 0 }) => (
//   <div
//     className={`group relative overflow-hidden rounded-2xl border ${border} bg-gradient-to-br ${gradient} p-5 backdrop-blur transition-all duration-200 hover:-translate-y-1`}
//     style={{ animation: `cardIn 0.4s ease-out ${delay}s both`, boxShadow: "none" }}
//     onMouseEnter={e => e.currentTarget.style.boxShadow = glow}
//     onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
//   >
//     <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
//       style={{ background: glow.replace("0 0 28px ", "").replace(")", "").replace("(", "rgba(").split(",").slice(0,3).join(",") + ",1)" }} />
//     <div className="flex items-start justify-between">
//       <div>
//         <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">{title}</p>
//         <p className="mt-2 text-3xl font-bold text-white" style={{ animation: `countUp 0.6s cubic-bezier(0.34,1.56,0.64,1) ${delay + 0.2}s both` }}>
//           {value}
//         </p>
//       </div>
//       <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/8 transition-transform group-hover:scale-110 group-hover:bg-white/15">
//         <Icon className="h-5 w-5 text-white" />
//       </div>
//     </div>
//   </div>
// );

// /* ═══════════════════════════════════════ */
// const Dashboard = () => {
//   const [stats,   setStats]   = useState({
//     totalResumes: 0, totalInterviews: 0,
//     averageScore: 0, highestScore: 0,
//     recentResumes: [], recentInterviews: [],
//   });
//   const [loading, setLoading] = useState(true);
//   const [user,    setUser]    = useState(null);

//   useEffect(() => {
//     Promise.all([
//       api.get("/dashboard/stats"),
//       api.get("/auth/me").catch(() => ({ data: { user: null } })),
//     ]).then(([statsRes, userRes]) => {
//       setStats(statsRes.data.stats);
//       setUser(userRes.data.user);
//     }).catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   const greeting = () => {
//     const h = new Date().getHours();
//     if (h < 12) return "Good Morning";
//     if (h < 17) return "Good Afternoon";
//     return "Good Evening";
//   };

//   return (
//     <>
//       <style>{`
//         @keyframes slideUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
//         @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
//         @keyframes cardIn   { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
//         @keyframes countUp  { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }
//         @keyframes floatGlow{ 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:0.45;transform:scale(1.1)} }
//         @keyframes shimmer  { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
//         @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.45} }
//         @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0.3} }
//         .action-btn { transition:all .18s ease; }
//         .action-btn:hover { transform:translateY(-2px); }
//         .action-btn:active { transform:scale(0.97); }
//         .row-hover { transition:background .15s ease,border-color .15s ease; }
//         .row-hover:hover { background:rgba(30,41,59,0.7); border-color:rgba(71,85,105,0.6)!important; }
//       `}</style>

//       <MainLayout>
//         <div className="relative min-h-screen">

//           {/* Ambient glows */}
//           <div className="pointer-events-none absolute inset-0 overflow-hidden">
//             <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-600/8 blur-3xl" style={{animation:"floatGlow 6s ease-in-out infinite"}} />
//             <div className="absolute top-1/3 -right-20 h-64 w-64 rounded-full bg-purple-600/7 blur-3xl" style={{animation:"floatGlow 7s ease-in-out 2s infinite"}} />
//             <div className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-cyan-500/5 blur-3xl" style={{animation:"floatGlow 8s ease-in-out 1s infinite"}} />
//           </div>

//           {/* pt-16 = space for mobile hamburger */}
//           <div className="relative pb-12 pt-16 lg:pt-0">

//             {/* ── Welcome banner ── */}
//             <div className="mb-6" style={{animation:"slideUp 0.4s ease-out both"}}>
//               <div className="overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/60 via-indigo-950/40 to-slate-950 p-5 sm:p-7">
//                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                   <div>
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="text-xl">👋</span>
//                       <span className="text-sm font-medium text-blue-300">{greeting()}</span>
//                     </div>
//                     <h1 className="bg-gradient-to-r from-white via-blue-100 to-slate-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
//                       {user?.name ? `Welcome, ${user.name.split(" ")[0]}!` : "Welcome Back!"}
//                     </h1>
//                     <p className="mt-1 text-sm text-slate-500">
//                       {stats.totalInterviews > 0
//                         ? `You've completed ${stats.totalInterviews} interview${stats.totalInterviews !== 1 ? "s" : ""}. Keep going! 🚀`
//                         : "Start your first AI interview to track your progress."}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2 rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-3">
//                     <Sparkles className="h-5 w-5 text-blue-400" style={{animation:"blink 2s ease-in-out infinite"}} />
//                     <div>
//                       <p className="text-[10px] text-blue-400/70 uppercase tracking-widest font-medium">AI Ready</p>
//                       <p className="text-sm font-semibold text-blue-300">HireMind Active</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ── Quick actions ── */}
//             <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3"
//               style={{animation:"slideUp 0.4s ease-out 0.06s both"}}>
//               <Link to="/resume"
//                 className="action-btn group flex items-center justify-between rounded-2xl border border-blue-500/25 bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 shadow-lg shadow-blue-500/20">
//                 <div className="flex items-center gap-3">
//                   <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
//                     <FileText className="h-5 w-5 text-white" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-blue-200/70">Upload</p>
//                     <p className="font-semibold text-white">Resume</p>
//                   </div>
//                 </div>
//                 <ArrowUpRight className="h-4 w-4 text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
//               </Link>

//               <Link to="/interview"
//                 className="action-btn group flex items-center justify-between rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 shadow-lg shadow-emerald-500/20">
//                 <div className="flex items-center gap-3">
//                   <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
//                     <Brain className="h-5 w-5 text-white" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-emerald-200/70">Start</p>
//                     <p className="font-semibold text-white">AI Interview</p>
//                   </div>
//                 </div>
//                 <ArrowUpRight className="h-4 w-4 text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
//               </Link>

//               <Link to="/profile"
//                 className="action-btn group flex items-center justify-between rounded-2xl border border-purple-500/25 bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-4 shadow-lg shadow-purple-500/20">
//                 <div className="flex items-center gap-3">
//                   <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
//                     <Zap className="h-5 w-5 text-white" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-purple-200/70">View</p>
//                     <p className="font-semibold text-white">Profile</p>
//                   </div>
//                 </div>
//                 <ArrowUpRight className="h-4 w-4 text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
//               </Link>
//             </div>

//             {/* ── Stat cards — 2 col mobile / 4 col lg ── */}
//             {loading ? (
//               <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
//                 {[0,1,2,3].map(i => (
//                   <div key={i} className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5"
//                     style={{animation:`pulse 1.4s ease-in-out ${i*0.1}s infinite`}}>
//                     <div className="h-3 w-20 rounded bg-slate-800/80 mb-3" />
//                     <div className="h-8 w-12 rounded-lg bg-slate-800/60" />
//                     <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/3 to-transparent"
//                       style={{animation:"shimmer 1.6s ease-in-out infinite"}} />
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
//                 <StatCard title="Total Resumes"   value={stats.totalResumes}    icon={FileText} delay={0.1}
//                   gradient="from-blue-950/80 via-slate-900 to-slate-950"
//                   border="border-blue-500/20" glow="0 0 28px rgba(59,130,246,0.2)" />
//                 <StatCard title="Interviews Done" value={stats.totalInterviews} icon={Brain}    delay={0.16}
//                   gradient="from-indigo-950/80 via-slate-900 to-slate-950"
//                   border="border-indigo-500/20" glow="0 0 28px rgba(99,102,241,0.2)" />
//                 <StatCard title="Average Score"   value={`${stats.averageScore}%`} icon={BarChart3} delay={0.22}
//                   gradient="from-emerald-950/70 via-slate-900 to-slate-950"
//                   border="border-emerald-500/20" glow="0 0 28px rgba(16,185,129,0.2)" />
//                 <StatCard title="Best Score"      value={`${stats.highestScore ?? 0}%`} icon={Trophy} delay={0.28}
//                   gradient="from-amber-950/60 via-slate-900 to-slate-950"
//                   border="border-amber-500/20" glow="0 0 28px rgba(245,158,11,0.2)" />
//               </div>
//             )}

//             {/* ── Main grid: Recent interviews + Activity ── */}
//             <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

//               {/* Recent Interviews — 2/3 width */}
//               <div className="lg:col-span-2" style={{animation:"cardIn 0.4s ease-out 0.3s both"}}>
//                 <div className="flex items-center justify-between mb-3">
//                   <h2 className="font-bold text-white text-base sm:text-lg">Recent Interviews</h2>
//                   <Link to="/interview-history"
//                     className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
//                     View all <ChevronRight className="h-3.5 w-3.5" />
//                   </Link>
//                 </div>

//                 <div className="space-y-2.5">
//                   {loading ? (
//                     [0,1,2].map(i => (
//                       <div key={i} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4"
//                         style={{animation:`pulse 1.4s ease-in-out ${i*0.1}s infinite`}}>
//                         <div className="flex items-center gap-3">
//                           <div className="h-10 w-10 rounded-xl bg-slate-800/80 shrink-0" />
//                           <div className="flex-1 space-y-2">
//                             <div className="h-3.5 w-32 rounded bg-slate-800/80" />
//                             <div className="h-2.5 w-20 rounded bg-slate-800/60" />
//                           </div>
//                           <div className="h-8 w-12 rounded-lg bg-slate-800/60 shrink-0" />
//                         </div>
//                       </div>
//                     ))
//                   ) : stats.recentInterviews?.length > 0 ? (
//                     stats.recentInterviews.slice(0, 5).map((iv, idx) => (
//                       <Link to={`/interview/${iv._id}`} key={iv._id}
//                         className="row-hover flex items-center gap-3 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4 backdrop-blur"
//                         style={{animation:`cardIn 0.35s ease-out ${0.33+idx*0.06}s both`}}>
//                         <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-800/80 text-lg">
//                           {typeIcon(iv.interviewType)}
//                         </div>
//                         <div className="min-w-0 flex-1">
//                           <p className="truncate text-sm font-semibold text-white capitalize">
//                             {iv.interviewType?.replace(/_/g, " ")} Interview
//                           </p>
//                           <div className="flex items-center gap-1.5 mt-0.5">
//                             <Calendar className="h-3 w-3 text-slate-600" />
//                             <span className="text-[11px] text-slate-500">
//                               {new Date(iv.createdAt).toLocaleDateString("en-US",{day:"numeric",month:"short",year:"numeric"})}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="shrink-0 text-right">
//                           <span className={`text-lg font-bold ${scoreColor(iv.overallScore)}`}>
//                             {iv.overallScore}%
//                           </span>
//                           <div className={`mt-1 h-1 w-14 overflow-hidden rounded-full bg-slate-800`}>
//                             <div className={`h-full rounded-full bg-gradient-to-r ${scoreBg(iv.overallScore)}`}
//                               style={{width:`${iv.overallScore}%`,transition:"width 1s ease"}} />
//                           </div>
//                         </div>
//                       </Link>
//                     ))
//                   ) : (
//                     <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-8 text-center">
//                       <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-slate-800/60 text-2xl">🎤</div>
//                       <p className="text-sm font-medium text-slate-400">No interviews yet</p>
//                       <p className="mt-1 text-xs text-slate-600">Take your first AI interview to see results here</p>
//                       <Link to="/interview"
//                         className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:brightness-110">
//                         <Brain className="h-3.5 w-3.5" /> Start Interview
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Right column: Resumes + Activity */}
//               <div className="space-y-5" style={{animation:"cardIn 0.4s ease-out 0.36s both"}}>

//                 {/* Recent Resumes */}
//                 <div>
//                   <div className="mb-3 flex items-center justify-between">
//                     <h2 className="font-bold text-white text-base">Recent Resumes</h2>
//                     <Link to="/resume" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
//                       View all <ChevronRight className="h-3.5 w-3.5" />
//                     </Link>
//                   </div>
//                   <div className="space-y-2">
//                     {loading ? (
//                       [0,1].map(i => (
//                         <div key={i} className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-3.5"
//                           style={{animation:`pulse 1.4s ease-in-out ${i*0.1}s infinite`}}>
//                           <div className="h-3.5 w-3/4 rounded bg-slate-800/80" />
//                         </div>
//                       ))
//                     ) : stats.recentResumes?.length > 0 ? (
//                       stats.recentResumes.slice(0, 3).map((r, idx) => (
//                         <div key={r._id}
//                           className="row-hover flex items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-900/60 p-3.5 backdrop-blur"
//                           style={{animation:`cardIn 0.35s ease-out ${0.38+idx*0.06}s both`}}>
//                           <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-500/15 text-blue-400">
//                             <FileText className="h-4 w-4" />
//                           </div>
//                           <div className="min-w-0 flex-1">
//                             <p className="truncate text-xs font-medium text-slate-300">
//                               {r.fileName?.split("-").slice(1).join("-") || r.fileName}
//                             </p>
//                             <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-600">
//                               <Clock className="h-2.5 w-2.5" />
//                               {new Date(r.createdAt).toLocaleDateString("en-US",{day:"numeric",month:"short"})}
//                             </p>
//                           </div>
//                           <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500/60" />
//                         </div>
//                       ))
//                     ) : (
//                       <div className="rounded-xl border border-slate-800/50 bg-slate-900/40 p-5 text-center">
//                         <p className="text-xs text-slate-600">No resumes uploaded yet</p>
//                         <Link to="/resume" className="mt-2 inline-flex items-center gap-1 text-xs text-blue-400 hover:underline">
//                           Upload one →
//                         </Link>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Activity feed */}
//                 <div>
//                   <h2 className="mb-3 font-bold text-white text-base">Recent Activity</h2>
//                   <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 divide-y divide-slate-800/60 overflow-hidden backdrop-blur">
//                     {!loading && stats.recentResumes?.length === 0 && stats.recentInterviews?.length === 0 ? (
//                       <div className="p-5 text-center">
//                         <AlertCircle className="mx-auto mb-2 h-6 w-6 text-slate-700" />
//                         <p className="text-xs text-slate-600">No activity yet</p>
//                       </div>
//                     ) : (
//                       <>
//                         {stats.recentInterviews?.slice(0, 3).map((iv, i) => (
//                           <div key={iv._id}
//                             className="flex items-center gap-3 px-4 py-3"
//                             style={{animation:`fadeIn 0.3s ease-out ${0.4+i*0.07}s both`}}>
//                             <span className="text-base shrink-0">{typeIcon(iv.interviewType)}</span>
//                             <div className="min-w-0 flex-1">
//                               <p className="truncate text-xs text-slate-300 capitalize">
//                                 {iv.interviewType?.replace(/_/g," ")} interview
//                               </p>
//                               <p className="text-[10px] text-slate-600">
//                                 {new Date(iv.createdAt).toLocaleDateString("en-US",{day:"numeric",month:"short"})}
//                               </p>
//                             </div>
//                             <span className={`shrink-0 text-xs font-bold ${scoreColor(iv.overallScore)}`}>
//                               {iv.overallScore}%
//                             </span>
//                           </div>
//                         ))}
//                         {stats.recentResumes?.slice(0, 2).map((r, i) => (
//                           <div key={r._id}
//                             className="flex items-center gap-3 px-4 py-3"
//                             style={{animation:`fadeIn 0.3s ease-out ${0.5+i*0.07}s both`}}>
//                             <span className="text-base shrink-0">📄</span>
//                             <div className="min-w-0 flex-1">
//                               <p className="truncate text-xs text-slate-300">Resume uploaded</p>
//                               <p className="text-[10px] text-slate-600">
//                                 {new Date(r.createdAt).toLocaleDateString("en-US",{day:"numeric",month:"short"})}
//                               </p>
//                             </div>
//                             <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500/60" />
//                           </div>
//                         ))}
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* Performance tip */}
//                 {!loading && stats.averageScore > 0 && (
//                   <div className={`rounded-2xl border p-4 ${scoreBorder(stats.averageScore)}`}
//                     style={{animation:"cardIn 0.4s ease-out 0.5s both"}}>
//                     <div className="flex items-start gap-2.5">
//                       <TrendingUp className={`h-4 w-4 mt-0.5 shrink-0 ${scoreColor(stats.averageScore)}`} />
//                       <div>
//                         <p className={`text-xs font-semibold ${scoreColor(stats.averageScore)}`}>Performance Insight</p>
//                         <p className="mt-0.5 text-[11px] text-slate-500 leading-relaxed">
//                           {stats.averageScore >= 80
//                             ? "Excellent! You're performing at a high level. Keep it up!"
//                             : stats.averageScore >= 60
//                             ? "Good progress! Practice more to reach the top tier."
//                             : "Keep practicing — consistency leads to improvement!"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//           </div>
//         </div>
//       </MainLayout>
//     </>
//   );
// };

// export default Dashboard;


import MainLayout from "../layouts/MainLayout";
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import {
  FileText,
  Brain,
  Trophy,
  Sparkles,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Clock,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Flame,
  Target,
  Activity,
  UserCircle2,
  BadgeCheck,
  Star,
  ChevronLeft,
  ChevronRight as CarouselNext,
  Video,
  Mic,
  ScanSearch,
} from "lucide-react";

const CAROUSEL_SLIDES = [
  {
    eyebrow: "AI Interview Studio",
    title: "Practice interviews that feel real",
    description:
      "Choose your technology and difficulty, then answer through text, voice, or video.",
    action: "Start Interview",
    to: "/interview",
    icon: Brain,
    accent: "blue",
    gradient: "from-slate-950 via-blue-950/90 to-indigo-950",
  },
  {
    eyebrow: "Smart Resume Analysis",
    title: "Turn your resume into a stronger profile",
    description:
      "Upload your PDF, discover strengths and gaps, and get practical AI suggestions.",
    action: "Analyze Resume",
    to: "/resume",
    icon: ScanSearch,
    accent: "emerald",
    gradient: "from-slate-950 via-emerald-950/80 to-teal-950",
  },
  {
    eyebrow: "Voice & Video Mode",
    title: "Build confidence before the real call",
    description:
      "Hear questions, record your answers, and review your interview performance.",
    action: "Try Video Mode",
    to: "/interview",
    icon: Video,
    accent: "violet",
    gradient: "from-slate-950 via-violet-950/85 to-fuchsia-950/70",
  },
];

/* ── Score helpers ── */
const scoreColor = (s) =>
  s >= 80 ? "text-emerald-400" : s >= 60 ? "text-amber-400" : "text-rose-400";

const scoreBg = (s) =>
  s >= 80
    ? "from-emerald-500 to-teal-400"
    : s >= 60
    ? "from-amber-400 to-yellow-300"
    : "from-rose-500 to-red-400";

const scoreBorder = (s) =>
  s >= 80
    ? "border-emerald-500/25 bg-emerald-500/10"
    : s >= 60
    ? "border-amber-500/25 bg-amber-500/10"
    : "border-rose-500/25 bg-rose-500/10";

const typeIcon = (type) => {
  const t = type?.toLowerCase();
  if (t?.includes("technical")) return "🧑‍💻";
  if (t?.includes("hr")) return "🤝";
  if (t?.includes("behav")) return "💬";
  if (t?.includes("system")) return "🏗️";
  return "📋";
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

const getMotivation = (avg) => {
  if (avg >= 80) return "You’re in top form — keep sharpening your edge 🚀";
  if (avg >= 60) return "Strong progress! A little more practice can boost your scores ⚡";
  return "Every attempt improves you. Keep practicing and trust the process 💪";
};

const getStreak = (interviews = []) => {
  if (!interviews.length) return 0;
  const dates = interviews
    .map((i) => new Date(i.createdAt).toDateString())
    .filter(Boolean);

  const uniqueDates = [...new Set(dates)].sort(
    (a, b) => new Date(b) - new Date(a)
  );

  let streak = 0;
  let current = new Date();

  for (let i = 0; i < uniqueDates.length; i++) {
    const d = new Date(uniqueDates[i]);
    const currentDate = new Date(current.toDateString());
    const compareDate = new Date(d.toDateString());
    const diff = Math.round(
      (currentDate - compareDate) / (1000 * 60 * 60 * 24)
    );

    if (diff === streak) streak++;
    else if (diff > streak) break;
  }

  return streak;
};

const getTopInterviewType = (items = []) => {
  if (!items.length) return null;
  const freq = {};
  items.forEach((i) => {
    const key = i.interviewType || "general";
    freq[key] = (freq[key] || 0) + 1;
  });
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
};

const getProfileCompletion = (user) => {
  if (!user) return 0;
  const checks = [
    !!user?.name,
    !!user?.bio,
    !!user?.github,
    !!user?.linkedin,
    !!user?.skills?.length,
    !!user?.education?.length,
    !!user?.experience?.length,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

/* ── Reusable Stat Card ── */
const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  gradient,
  border,
  glow,
  delay = 0,
}) => (
  <div
    className={`group relative overflow-hidden rounded-2xl border ${border} bg-gradient-to-br ${gradient} p-4 sm:p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1`}
    style={{ animation: `cardIn 0.4s ease-out ${delay}s both`, boxShadow: "none" }}
    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = glow)}
    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
  >
    <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/5 blur-2xl opacity-30 transition-opacity group-hover:opacity-50" />
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-slate-500">
          {title}
        </p>
        <p
          className="mt-2 text-2xl font-bold text-white sm:text-3xl"
          style={{
            animation: `countUp 0.6s cubic-bezier(0.34,1.56,0.64,1) ${
              delay + 0.2
            }s both`,
          }}
        >
          {value}
        </p>
        {subtext && <p className="mt-1 text-xs text-slate-500">{subtext}</p>}
      </div>

      <div className="grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-xl bg-white/10 transition-transform group-hover:scale-110 group-hover:bg-white/15">
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalResumes: 0,
    totalInterviews: 0,
    averageScore: 0,
    highestScore: 0,
    recentResumes: [],
    recentInterviews: [],
  });

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/dashboard/stats"),
      api.get("/auth/me").catch(() => ({ data: { user: null } })),
    ])
      .then(([statsRes, userRes]) => {
        setStats(statsRes.data.stats);
        setUser(userRes.data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (carouselPaused) return undefined;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % CAROUSEL_SLIDES.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, [carouselPaused]);

  const profileCompletion = useMemo(() => getProfileCompletion(user), [user]);
  const streak = useMemo(
    () => getStreak(stats.recentInterviews || []),
    [stats.recentInterviews]
  );
  const topInterviewType = useMemo(
    () => getTopInterviewType(stats.recentInterviews || []),
    [stats.recentInterviews]
  );

  const weeklyGoal = Math.min(Math.round(((stats.totalInterviews || 0) / 5) * 100), 100);

  return (
    <>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes cardIn { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes countUp { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }
        @keyframes floatGlow { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:0.45;transform:scale(1.1)} }
        @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes progressGrow { from{width:0} to{width:var(--w)} }
        .action-btn { transition:all .18s ease; }
        .action-btn:hover { transform:translateY(-2px); filter:brightness(1.05); }
        .action-btn:active { transform:scale(0.97); }
        .row-hover { transition:background .15s ease,border-color .15s ease, transform .15s ease; }
        .row-hover:hover { background:rgba(30,41,59,0.78); border-color:rgba(71,85,105,0.6)!important; transform:translateY(-1px); }
        .glass-card { backdrop-filter: blur(12px); }
      `}</style>

      <MainLayout>
        <div className="relative min-h-screen">
          {/* Ambient glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl"
              style={{ animation: "floatGlow 6s ease-in-out infinite" }}
            />
            <div
              className="absolute top-1/3 -right-20 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl"
              style={{ animation: "floatGlow 7s ease-in-out 2s infinite" }}
            />
            <div
              className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-cyan-500/8 blur-3xl"
              style={{ animation: "floatGlow 8s ease-in-out 1s infinite" }}
            />
            <div
              className="absolute bottom-10 right-1/4 h-52 w-52 rounded-full bg-emerald-500/8 blur-3xl"
              style={{ animation: "floatGlow 9s ease-in-out 1.5s infinite" }}
            />
          </div>

          <div className="relative pb-12 pt-16 lg:pt-0">
            {/* Welcome Banner */}
            <div className="mb-6" style={{ animation: "slideUp 0.4s ease-out both" }}>
              <div className="overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/70 via-indigo-950/50 to-slate-950 p-4 sm:p-6 lg:p-7">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xl">👋</span>
                      <span className="text-sm font-medium text-blue-300">
                        {getGreeting()}
                      </span>
                    </div>

                    <h1 className="bg-gradient-to-r from-white via-blue-100 to-slate-300 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                      {user?.name
                        ? `Welcome, ${user.name.split(" ")[0]}!`
                        : "Welcome Back!"}
                    </h1>

                    <p className="mt-1 max-w-2xl text-sm text-slate-400">
                      {stats.totalInterviews > 0
                        ? `You've completed ${stats.totalInterviews} interview${
                            stats.totalInterviews !== 1 ? "s" : ""
                          }. ${getMotivation(stats.averageScore)}`
                        : "Start your first AI interview to track your progress and build confidence."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] text-blue-300">
                        <Sparkles className="h-3.5 w-3.5" /> AI Powered
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-300">
                        <BadgeCheck className="h-3.5 w-3.5" /> Smart Tracking
                      </span>
                      {streak > 0 && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-[11px] text-orange-300">
                          <Flame className="h-3.5 w-3.5" /> {streak} day streak
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                    <div className="flex items-center gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-3">
                      <Sparkles
                        className="h-5 w-5 text-blue-400"
                        style={{ animation: "blink 2s ease-in-out infinite" }}
                      />
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-widest text-blue-400/70">
                          AI Ready
                        </p>
                        <p className="text-sm font-semibold text-blue-300">
                          HireMind Active
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                      <Target className="h-5 w-5 text-emerald-400" />
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-widest text-emerald-400/70">
                          Weekly Goal
                        </p>
                        <p className="text-sm font-semibold text-emerald-300">
                          {Math.min(stats.totalInterviews, 5)}/5 Interviews
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weekly progress */}
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Weekly practice progress</span>
                    <span className="font-medium text-slate-300">{weeklyGoal}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800/90">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400"
                      style={{
                        width: `${weeklyGoal}%`,
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Carousel */}
            <section
              className="relative mb-6 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950 shadow-2xl shadow-black/20"
              onMouseEnter={() => setCarouselPaused(true)}
              onMouseLeave={() => setCarouselPaused(false)}
              style={{ animation: "slideUp 0.45s ease-out 0.08s both" }}
              aria-label="HireMind features"
            >
              <div
                className="flex will-change-transform transition-transform duration-1000 ease-[cubic-bezier(0.65,0,0.35,1)]"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {CAROUSEL_SLIDES.map((slide, index) => {
                  const SlideIcon = slide.icon;
                  const accentClasses = {
                    blue: {
                      badge: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
                      button: "from-cyan-500 to-blue-600 shadow-cyan-500/20",
                      glow: "bg-cyan-400/15",
                      visual: "from-cyan-400 to-blue-600",
                    },
                    emerald: {
                      badge: "border-lime-300/25 bg-lime-300/10 text-lime-200",
                      button: "from-emerald-500 to-teal-600 shadow-emerald-500/20",
                      glow: "bg-emerald-400/15",
                      visual: "from-emerald-400 to-teal-600",
                    },
                    violet: {
                      badge: "border-pink-300/25 bg-pink-300/10 text-pink-200",
                      button: "from-violet-500 to-fuchsia-600 shadow-violet-500/20",
                      glow: "bg-fuchsia-400/15",
                      visual: "from-violet-400 to-fuchsia-600",
                    },
                  }[slide.accent];

                  return (
                    <article
                      key={slide.title}
                      className={`relative min-w-full overflow-hidden bg-gradient-to-br ${slide.gradient} px-5 py-7 transition-opacity duration-700 sm:px-8 sm:py-9 lg:px-10 ${
                        index === activeSlide ? "opacity-100" : "opacity-70"
                      }`}
                      aria-hidden={index !== activeSlide}
                    >
                      <div className={`pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full ${accentClasses.glow} blur-3xl`} />
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:22px_22px]" />

                      <div className="relative grid min-h-64 items-center gap-7 md:grid-cols-[1.25fr_0.75fr]">
                        <div>
                          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${accentClasses.badge}`}>
                            <Sparkles className="h-3.5 w-3.5" />
                            {slide.eyebrow}
                          </span>
                          <h2 className="mt-4 max-w-xl text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                            {slide.title}
                          </h2>
                          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
                            {slide.description}
                          </p>
                          <Link
                            to={slide.to}
                            className={`mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${accentClasses.button} px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:brightness-110`}
                          >
                            {slide.action}
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </div>

                        <div className="relative hidden h-52 items-center justify-center md:flex">
                          <div className={`absolute h-40 w-40 rounded-full ${accentClasses.glow} blur-2xl`} />
                          <div className="relative grid h-36 w-36 place-items-center rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
                            <div className={`grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br ${accentClasses.visual} shadow-2xl`}>
                              <SlideIcon className="h-9 w-9 text-white" />
                            </div>
                            {slide.accent === "violet" && (
                              <>
                                <div className="absolute -left-7 top-5 grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-slate-900/90 text-violet-300 shadow-xl">
                                  <Mic className="h-5 w-5" />
                                </div>
                                <div className="absolute -right-6 bottom-6 grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-slate-900/90 text-blue-300 shadow-xl">
                                  <Video className="h-5 w-5" />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setActiveSlide((activeSlide - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length)}
                className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-slate-950/60 text-slate-300 backdrop-blur transition-all hover:bg-slate-800 hover:text-white sm:grid"
                aria-label="Previous banner"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setActiveSlide((activeSlide + 1) % CAROUSEL_SLIDES.length)}
                className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-slate-950/60 text-slate-300 backdrop-blur transition-all hover:bg-slate-800 hover:text-white sm:grid"
                aria-label="Next banner"
              >
                <CarouselNext className="h-4 w-4" />
              </button>

              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
                {CAROUSEL_SLIDES.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === activeSlide ? "w-7 bg-white" : "w-2 bg-white/30 hover:bg-white/60"
                    }`}
                    aria-label={`Show banner ${index + 1}`}
                  />
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <div
              className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
              style={{ animation: "slideUp 0.4s ease-out 0.06s both" }}
            >
              <Link
                to="/resume"
                className="action-btn group flex items-center justify-between rounded-2xl border border-blue-500/25 bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4 shadow-lg shadow-blue-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200/70">Upload</p>
                    <p className="font-semibold text-white">Resume</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                to="/interview"
                className="action-btn group flex items-center justify-between rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-4 shadow-lg shadow-emerald-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-200/70">Start</p>
                    <p className="font-semibold text-white">AI Interview</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                to="/profile"
                className="action-btn group flex items-center justify-between rounded-2xl border border-purple-500/25 bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-4 shadow-lg shadow-purple-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
                    <UserCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-200/70">View</p>
                    <p className="font-semibold text-white">Profile</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                to="/interview-history"
                className="action-btn group flex items-center justify-between rounded-2xl border border-amber-500/25 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-4 shadow-lg shadow-amber-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-amber-100/80">Track</p>
                    <p className="font-semibold text-white">History</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            {/* Stats */}
            {loading ? (
              <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5"
                    style={{
                      animation: `pulse 1.4s ease-in-out ${i * 0.1}s infinite`,
                    }}
                  >
                    <div className="mb-3 h-3 w-20 rounded bg-slate-800/80" />
                    <div className="h-8 w-12 rounded-lg bg-slate-800/60" />
                    <div
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/3 to-transparent"
                      style={{ animation: "shimmer 1.6s ease-in-out infinite" }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
                <StatCard
                  title="Total Resumes"
                  value={stats.totalResumes}
                  subtext="Uploaded documents"
                  icon={FileText}
                  delay={0.1}
                  gradient="from-blue-950/80 via-slate-900 to-slate-950"
                  border="border-blue-500/20"
                  glow="0 0 28px rgba(59,130,246,0.2)"
                />
                <StatCard
                  title="Interviews Done"
                  value={stats.totalInterviews}
                  subtext="Practice sessions"
                  icon={Brain}
                  delay={0.16}
                  gradient="from-indigo-950/80 via-slate-900 to-slate-950"
                  border="border-indigo-500/20"
                  glow="0 0 28px rgba(99,102,241,0.2)"
                />
                <StatCard
                  title="Average Score"
                  value={`${stats.averageScore}%`}
                  subtext="Overall performance"
                  icon={BarChart3}
                  delay={0.22}
                  gradient="from-emerald-950/70 via-slate-900 to-slate-950"
                  border="border-emerald-500/20"
                  glow="0 0 28px rgba(16,185,129,0.2)"
                />
                <StatCard
                  title="Best Score"
                  value={`${stats.highestScore ?? 0}%`}
                  subtext="Highest achievement"
                  icon={Trophy}
                  delay={0.28}
                  gradient="from-amber-950/60 via-slate-900 to-slate-950"
                  border="border-amber-500/20"
                  glow="0 0 28px rgba(245,158,11,0.2)"
                />
              </div>
            )}

            {/* Extra Insight Cards */}
            {!loading && (
              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div
                  className="glass-card rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/80 to-slate-950 p-4"
                  style={{ animation: "cardIn 0.4s ease-out 0.3s both" }}
                >
                  <div className="mb-2 flex items-center gap-2 text-emerald-400">
                    <Flame className="h-4 w-4" />
                    <p className="text-sm font-semibold text-white">Current Streak</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{streak} day{streak !== 1 ? "s" : ""}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Stay consistent to improve faster.
                  </p>
                </div>

                <div
                  className="glass-card rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/80 to-slate-950 p-4"
                  style={{ animation: "cardIn 0.4s ease-out 0.36s both" }}
                >
                  <div className="mb-2 flex items-center gap-2 text-blue-400">
                    <Star className="h-4 w-4" />
                    <p className="text-sm font-semibold text-white">Top Interview Type</p>
                  </div>
                  <p className="text-lg font-bold capitalize text-white">
                    {topInterviewType ? topInterviewType.replace(/_/g, " ") : "No data yet"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Most practiced category on your dashboard.
                  </p>
                </div>

                <div
                  className="glass-card rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/80 to-slate-950 p-4 sm:col-span-2 xl:col-span-1"
                  style={{ animation: "cardIn 0.4s ease-out 0.42s both" }}
                >
                  <div className="mb-2 flex items-center gap-2 text-purple-400">
                    <UserCircle2 className="h-4 w-4" />
                    <p className="text-sm font-semibold text-white">Profile Completion</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{profileCompletion}%</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                      style={{ width: `${profileCompletion}%`, transition: "width 1s ease" }}
                    />
                  </div>
                  <Link
                    to="/profile"
                    className="mt-3 inline-flex items-center gap-1 text-xs text-purple-300 hover:text-purple-200"
                  >
                    Complete profile <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              {/* Recent Interviews */}
              <div
                className="xl:col-span-2"
                style={{ animation: "cardIn 0.4s ease-out 0.46s both" }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-bold text-white sm:text-lg">
                    Recent Interviews
                  </h2>
                  <Link
                    to="/interview-history"
                    className="flex items-center gap-1 text-xs text-blue-400 transition-colors hover:text-blue-300"
                  >
                    View all <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {loading ? (
                    [0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4"
                        style={{
                          animation: `pulse 1.4s ease-in-out ${i * 0.1}s infinite`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-800/80" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3.5 w-32 rounded bg-slate-800/80" />
                            <div className="h-2.5 w-20 rounded bg-slate-800/60" />
                          </div>
                          <div className="h-8 w-12 shrink-0 rounded-lg bg-slate-800/60" />
                        </div>
                      </div>
                    ))
                  ) : stats.recentInterviews?.length > 0 ? (
                    stats.recentInterviews.slice(0, 5).map((iv, idx) => (
                      <Link
                        to={`/interview/${iv._id}`}
                        key={iv._id}
                        className="row-hover flex items-center gap-3 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-3 sm:p-4 backdrop-blur"
                        style={{
                          animation: `cardIn 0.35s ease-out ${0.5 + idx * 0.06}s both`,
                        }}
                      >
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-800/80 text-lg">
                          {typeIcon(iv.interviewType)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold capitalize text-white">
                            {iv.interviewType?.replace(/_/g, " ")} Interview
                          </p>
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-slate-600" />
                            <span className="text-[11px] text-slate-500">
                              {new Date(iv.createdAt).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="w-16 shrink-0 text-right sm:w-20">
                          <span className={`text-base sm:text-lg font-bold ${scoreColor(iv.overallScore)}`}>
                            {iv.overallScore}%
                          </span>
                          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${scoreBg(iv.overallScore)}`}
                              style={{
                                width: `${iv.overallScore}%`,
                                transition: "width 1s ease",
                              }}
                            />
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-6 sm:p-8 text-center">
                      <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-slate-800/60 text-2xl">
                        🎤
                      </div>
                      <p className="text-sm font-medium text-slate-400">
                        No interviews yet
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        Take your first AI interview to see results here
                      </p>
                      <Link
                        to="/interview"
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:brightness-110"
                      >
                        <Brain className="h-3.5 w-3.5" /> Start Interview
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5" style={{ animation: "cardIn 0.4s ease-out 0.52s both" }}>
                {/* Recent Resumes */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-base font-bold text-white">Recent Resumes</h2>
                    <Link
                      to="/resume"
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                    >
                      View all <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {loading ? (
                      [0, 1].map((i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-3.5"
                          style={{
                            animation: `pulse 1.4s ease-in-out ${i * 0.1}s infinite`,
                          }}
                        >
                          <div className="h-3.5 w-3/4 rounded bg-slate-800/80" />
                        </div>
                      ))
                    ) : stats.recentResumes?.length > 0 ? (
                      stats.recentResumes.slice(0, 3).map((r, idx) => (
                        <div
                          key={r._id}
                          className="row-hover flex items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-900/60 p-3.5 backdrop-blur"
                          style={{
                            animation: `cardIn 0.35s ease-out ${0.56 + idx * 0.06}s both`,
                          }}
                        >
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-500/15 text-blue-400">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-slate-300">
                              {r.fileName?.split("-").slice(1).join("-") || r.fileName}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-600">
                              <Clock className="h-2.5 w-2.5" />
                              {new Date(r.createdAt).toLocaleDateString("en-US", {
                                day: "numeric",
                                month: "short",
                              })}
                            </p>
                          </div>
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500/60" />
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-slate-800/50 bg-slate-900/40 p-5 text-center">
                        <p className="text-xs text-slate-600">No resumes uploaded yet</p>
                        <Link
                          to="/resume"
                          className="mt-2 inline-flex items-center gap-1 text-xs text-blue-400 hover:underline"
                        >
                          Upload one →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Activity Feed */}
                <div>
                  <h2 className="mb-3 text-base font-bold text-white">Recent Activity</h2>
                  <div className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 divide-y divide-slate-800/60 backdrop-blur">
                    {!loading &&
                    stats.recentResumes?.length === 0 &&
                    stats.recentInterviews?.length === 0 ? (
                      <div className="p-5 text-center">
                        <AlertCircle className="mx-auto mb-2 h-6 w-6 text-slate-700" />
                        <p className="text-xs text-slate-600">No activity yet</p>
                      </div>
                    ) : (
                      <>
                        {stats.recentInterviews?.slice(0, 3).map((iv, i) => (
                          <div
                            key={iv._id}
                            className="flex items-center gap-3 px-4 py-3"
                            style={{ animation: `fadeIn 0.3s ease-out ${0.6 + i * 0.07}s both` }}
                          >
                            <span className="shrink-0 text-base">{typeIcon(iv.interviewType)}</span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs capitalize text-slate-300">
                                {iv.interviewType?.replace(/_/g, " ")} interview
                              </p>
                              <p className="text-[10px] text-slate-600">
                                {new Date(iv.createdAt).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </p>
                            </div>
                            <span className={`shrink-0 text-xs font-bold ${scoreColor(iv.overallScore)}`}>
                              {iv.overallScore}%
                            </span>
                          </div>
                        ))}

                        {stats.recentResumes?.slice(0, 2).map((r, i) => (
                          <div
                            key={r._id}
                            className="flex items-center gap-3 px-4 py-3"
                            style={{ animation: `fadeIn 0.3s ease-out ${0.7 + i * 0.07}s both` }}
                          >
                            <span className="shrink-0 text-base">📄</span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs text-slate-300">Resume uploaded</p>
                              <p className="text-[10px] text-slate-600">
                                {new Date(r.createdAt).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </p>
                            </div>
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500/60" />
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {/* Performance Insight */}
                {!loading && stats.averageScore > 0 && (
                  <div
                    className={`rounded-2xl border p-4 ${scoreBorder(stats.averageScore)}`}
                    style={{ animation: "cardIn 0.4s ease-out 0.75s both" }}
                  >
                    <div className="flex items-start gap-2.5">
                      <TrendingUp
                        className={`mt-0.5 h-4 w-4 shrink-0 ${scoreColor(stats.averageScore)}`}
                      />
                      <div>
                        <p className={`text-xs font-semibold ${scoreColor(stats.averageScore)}`}>
                          Performance Insight
                        </p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                          {stats.averageScore >= 80
                            ? "Excellent! You're performing at a high level. Keep it up!"
                            : stats.averageScore >= 60
                            ? "Good progress! Practice more to reach the top tier."
                            : "Keep practicing — consistency leads to improvement!"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Profile CTA */}
                {!loading && profileCompletion < 100 && (
                  <Link
                    to="/profile"
                    className="block rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-4 transition-all hover:border-purple-500/40 hover:bg-purple-500/15"
                    style={{ animation: "cardIn 0.4s ease-out 0.8s both" }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-500/15 text-purple-300">
                        <UserCircle2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">
                          Complete your profile
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          A stronger profile improves your interview experience and insights.
                        </p>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                            style={{
                              width: `${profileCompletion}%`,
                              transition: "width 1s ease",
                            }}
                          />
                        </div>
                        <p className="mt-2 text-[11px] text-purple-300">
                          {profileCompletion}% completed
                        </p>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Dashboard;
