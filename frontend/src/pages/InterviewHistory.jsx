

import MainLayout from "../layouts/MainLayout";
import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import {
  Trophy, BarChart3, ClipboardList, Search,
  ArrowDownRight, Minus, Calendar, ChevronRight,
  TrendingUp, Star, X, SlidersHorizontal,
} from "lucide-react";

const scoreColor        = (s) => s >= 80 ? "text-emerald-400" : s >= 60 ? "text-amber-400" : "text-rose-400";
const scoreFillGradient = (s) => s >= 80 ? "from-emerald-500 to-teal-400" : s >= 60 ? "from-amber-400 to-yellow-300" : "from-rose-500 to-red-400";
const scoreRingStroke   = (s) => s >= 80 ? "#10b981" : s >= 60 ? "#f59e0b" : "#f43f5e";
const scoreLabelColor   = (s) => s >= 80 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" : s >= 60 ? "text-amber-400 bg-amber-500/10 border-amber-500/25" : "text-rose-400 bg-rose-500/10 border-rose-500/25";
const scoreLabel        = (s) => s >= 80 ? "Excellent 🎯" : s >= 60 ? "Good 👍" : "Needs Work 📈";
const statusBadge       = (s) => ({ completed:"bg-emerald-500/15 text-emerald-400 border-emerald-500/25", pending:"bg-amber-500/15 text-amber-400 border-amber-500/25", failed:"bg-rose-500/15 text-rose-400 border-rose-500/25" }[s?.toLowerCase()] ?? "bg-slate-700/50 text-slate-400 border-slate-600");
const typeIcon          = (type) => { const t = type?.toLowerCase(); if(t?.includes("technical")) return "🧑‍💻"; if(t?.includes("hr")) return "🤝"; if(t?.includes("behav")) return "💬"; if(t?.includes("system")) return "🏗️"; return "📋"; };

const SORT_OPTIONS = [
  { label: "Newest first",  value: "date-desc"  },
  { label: "Oldest first",  value: "date-asc"   },
  { label: "Highest score", value: "score-desc" },
  { label: "Lowest score",  value: "score-asc"  },
];

const SkeletonCard = ({ delay = 0 }) => (
  <div className="rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900 to-slate-900/40 p-4 sm:p-6"
    style={{ animation: `skeletonPulse 1.6s ease-in-out ${delay}s infinite` }}>
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-800/80 sm:h-12 sm:w-12" />
      <div className="flex-1 space-y-2.5">
        <div className="h-4 w-36 rounded-lg bg-slate-800/80" />
        <div className="h-3 w-24 rounded-md bg-slate-800/60" />
        <div className="h-2 w-full rounded-full bg-slate-800/50 mt-3" />
      </div>
    </div>
  </div>
);

const ScoreRing = ({ score }) => {
  const r = 22, circ = 2 * Math.PI * r, dash = circ - (circ * score) / 100;
  return (
    <div className="relative grid h-14 w-14 place-items-center">
      <svg className="-rotate-90" width="56" height="56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(30,41,59,0.9)" strokeWidth="4.5" />
        <circle cx="28" cy="28" r={r} fill="none" stroke={scoreRingStroke(score)} strokeWidth="4.5"
          strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)" }} />
      </svg>
      <span className={`absolute text-[11px] font-bold ${scoreColor(score)}`}>{score}%</span>
    </div>
  );
};

const InterviewHistory = () => {
  const [interviews,   setInterviews]  = useState([]);
  const [loading,      setLoading]     = useState(true);
  const [search,       setSearch]      = useState("");
  const [sort,         setSort]        = useState("date-desc");
  const [typeFilter,   setTypeFilter]  = useState("all");
  const [showFilters,  setShowFilters] = useState(false);

  useEffect(() => {
    api.get("/interview/my-interviews")
      .then(({ data }) => setInterviews(data.interviews))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalInterviews = interviews.length;
  const averageScore    = totalInterviews ? Math.round(interviews.reduce((a,b) => a + b.overallScore, 0) / totalInterviews) : 0;
  const highestScore    = totalInterviews ? Math.max(...interviews.map(i => i.overallScore)) : 0;

  const recentTrend = (() => {
    if (interviews.length < 2) return null;
    const sorted = [...interviews].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    const diff = sorted[0].overallScore - sorted[1].overallScore;
    return diff > 0 ? "up" : diff < 0 ? "down" : "same";
  })();

  const types = useMemo(() => ["all", ...new Set(interviews.map(i => i.interviewType))], [interviews]);

  const displayed = useMemo(() => {
    let list = [...interviews];
    if (typeFilter !== "all") list = list.filter(i => i.interviewType === typeFilter);
    if (search.trim()) list = list.filter(i =>
      i.interviewType.toLowerCase().includes(search.toLowerCase()) ||
      i.status?.toLowerCase().includes(search.toLowerCase())
    );
    return list.sort((a,b) =>
      sort === "date-desc"  ? new Date(b.createdAt) - new Date(a.createdAt) :
      sort === "date-asc"   ? new Date(a.createdAt) - new Date(b.createdAt) :
      sort === "score-desc" ? b.overallScore - a.overallScore :
                              a.overallScore - b.overallScore
    );
  }, [interviews, search, sort, typeFilter]);

  return (
    <>
      <style>{`
        @keyframes slideUp       { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn        { from{opacity:0} to{opacity:1} }
        @keyframes cardIn        { from{opacity:0;transform:translateY(12px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes countUp       { from{opacity:0;transform:scale(0.65)} to{opacity:1;transform:scale(1)} }
        @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:0.38} }
        @keyframes floatGlow     { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:0.55;transform:scale(1.1)} }
        .card-lift { transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease; }
        .card-lift:hover { transform:translateY(-2px); box-shadow:0 10px 36px rgba(0,0,0,.5); }
        .stat-blue:hover   { border-color:rgba(59,130,246,.45)!important;  box-shadow:0 0 24px rgba(59,130,246,.14); }
        .stat-score:hover  { border-color:rgba(16,185,129,.4)!important;   box-shadow:0 0 24px rgba(16,185,129,.1);  }
        .stat-trophy:hover { border-color:rgba(245,158,11,.4)!important;   box-shadow:0 0 24px rgba(245,158,11,.1);  }
      `}</style>

      <MainLayout>
        <div className="relative min-h-screen">

          {/* Ambient glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" style={{animation:"floatGlow 6s ease-in-out infinite"}} />
            <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-purple-600/8 blur-3xl" style={{animation:"floatGlow 7s ease-in-out 2s infinite"}} />
          </div>

          {/*
            ★ pt-16 = space for hamburger button on mobile
            ★ lg:pt-0 = no extra padding on desktop
          */}
          <div className="relative space-y-5 pb-8 pt-16 lg:pt-0">

            {/* ── Header ── */}
            <div style={{animation:"slideUp 0.4s ease-out both"}}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-xl font-bold text-transparent sm:text-3xl">
                    Interview History
                  </h1>
                  <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Track your performance across all sessions</p>
                </div>
                {recentTrend && (
                  <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold
                    ${recentTrend==="up"   ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : recentTrend==="down" ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                    :                        "border-slate-700 bg-slate-800/60 text-slate-400"}`}>
                    {recentTrend==="up"   && <TrendingUp    className="h-3 w-3" />}
                    {recentTrend==="down" && <ArrowDownRight className="h-3 w-3" />}
                    {recentTrend==="same" && <Minus          className="h-3 w-3" />}
                    {recentTrend==="up" ? "Improving" : recentTrend==="down" ? "Needs work" : "Consistent"}
                  </div>
                )}
              </div>
            </div>

            {/* ── Stat Cards — 1 col mobile / 3 col sm+ ── */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
              style={{animation:"slideUp 0.4s ease-out 0.08s both"}}>

              {/* Total — Blue */}
              <div className="card-lift stat-blue group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/80 via-slate-900 to-slate-950 p-4 sm:p-5 backdrop-blur">
                <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition-all group-hover:bg-blue-500/20" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-blue-400/70 sm:text-xs">Total Interviews</p>
                    <p className="mt-1.5 bg-gradient-to-br from-white to-blue-200 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl"
                      style={{animation:"countUp 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.3s both"}}>
                      {totalInterviews}
                    </p>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-110">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-blue-950/80">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000"
                    style={{width:`${Math.min(totalInterviews*10,100)}%`}} />
                </div>
                <p className="mt-1 text-right text-[10px] text-blue-500/60">{Math.min(totalInterviews*10,100)}% of goal</p>
              </div>

              {/* Average — Dynamic */}
              <div className={`card-lift stat-score group relative overflow-hidden rounded-2xl border p-4 sm:p-5 backdrop-blur
                ${averageScore>=80 ? "border-emerald-500/20 bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950"
                : averageScore>=60 ? "border-amber-500/20 bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950"
                :                    "border-rose-500/20 bg-gradient-to-br from-rose-950/60 via-slate-900 to-slate-950"}`}>
                <div className={`pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl transition-all
                  ${averageScore>=80?"bg-emerald-500/10 group-hover:bg-emerald-500/20":averageScore>=60?"bg-amber-500/10 group-hover:bg-amber-500/20":"bg-rose-500/10 group-hover:bg-rose-500/20"}`} />
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-[10px] font-medium uppercase tracking-widest sm:text-xs ${averageScore>=80?"text-emerald-400/70":averageScore>=60?"text-amber-400/70":"text-rose-400/70"}`}>Average Score</p>
                    <p className={`mt-1.5 bg-gradient-to-br bg-clip-text text-3xl font-bold text-transparent sm:text-4xl ${averageScore>=80?"from-white to-emerald-300":averageScore>=60?"from-white to-amber-300":"from-white to-rose-300"}`}
                      style={{animation:"countUp 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.4s both"}}>
                      {averageScore}%
                    </p>
                  </div>
                  <div className={`grid h-10 w-10 place-items-center rounded-xl shadow-lg transition-transform group-hover:scale-110
                    ${averageScore>=80?"bg-emerald-500/20 text-emerald-400 shadow-emerald-500/20":averageScore>=60?"bg-amber-500/20 text-amber-400 shadow-amber-500/20":"bg-rose-500/20 text-rose-400 shadow-rose-500/20"}`}>
                    <BarChart3 className="h-5 w-5" />
                  </div>
                </div>
                <div className={`mt-3 h-1.5 w-full overflow-hidden rounded-full ${averageScore>=80?"bg-emerald-950/80":averageScore>=60?"bg-amber-950/60":"bg-rose-950/60"}`}>
                  <div className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ${scoreFillGradient(averageScore)}`} style={{width:`${averageScore}%`}} />
                </div>
                <p className={`mt-1 text-right text-[10px] ${averageScore>=80?"text-emerald-500/60":averageScore>=60?"text-amber-500/60":"text-rose-500/60"}`}>
                  {averageScore>=80?"Excellent performance":averageScore>=60?"Good progress":"Keep improving"}
                </p>
              </div>

              {/* Highest — Gold */}
              <div className="card-lift stat-trophy group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/50 via-slate-900 to-slate-950 p-4 sm:p-5 backdrop-blur">
                <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl transition-all group-hover:bg-amber-500/20" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-amber-400/70 sm:text-xs">Highest Score</p>
                    <p className="mt-1.5 bg-gradient-to-br from-white to-amber-300 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl"
                      style={{animation:"countUp 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.5s both"}}>
                      {highestScore}%
                    </p>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/20 text-amber-400 shadow-lg shadow-amber-500/20 transition-transform group-hover:scale-110">
                    <Trophy className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-amber-950/60">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-1000" style={{width:`${highestScore}%`}} />
                </div>
                <p className="mt-1 text-right text-[10px] text-amber-500/60">Personal best</p>
              </div>
            </div>

            {/* ── Search + Filters ── */}
            {!loading && totalInterviews > 0 && (
              <div className="space-y-2" style={{animation:"slideUp 0.4s ease-out 0.18s both"}}>

                {/* Row 1: Search bar + Filter toggle button */}
                <div className="flex gap-2">
                  <div className="group relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-400" />
                    <input
                      type="text"
                      placeholder="Search interviews…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full rounded-xl border border-slate-700/80 bg-slate-900/60 py-2.5 pl-10 pr-8 text-sm text-white placeholder:text-slate-600 backdrop-blur transition-all focus:border-blue-500/70 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    {search && (
                      <button onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Filter toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm transition-all
                      ${showFilters
                        ? "border-blue-500/60 bg-blue-600/20 text-blue-400"
                        : "border-slate-700/80 bg-slate-900/60 text-slate-400 hover:text-slate-200"}`}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="hidden sm:inline">Filters</span>
                  </button>
                </div>

                {/* Row 2: Sort + Type pills — shown when filters toggled */}
                {showFilters && (
                  <div className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-900/60 p-3 sm:flex-row sm:flex-wrap sm:items-start"
                    style={{animation:"slideUp 0.2s ease-out both"}}>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase tracking-widest text-slate-600">Sort by</label>
                      <select value={sort} onChange={(e) => setSort(e.target.value)}
                        className="w-full cursor-pointer rounded-lg border border-slate-700/80 bg-slate-800/80 px-3 py-2 text-sm text-slate-300 focus:border-blue-500/70 focus:outline-none sm:w-auto">
                        {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>

                    {types.length > 2 && (
                      <div className="flex flex-col gap-1 sm:ml-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-600">Type</label>
                        <div className="flex flex-wrap gap-1.5">
                          {types.map(t => (
                            <button key={t} onClick={() => setTypeFilter(t)}
                              className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-all
                                ${typeFilter===t
                                  ? "border-blue-500/60 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                                  : "border-slate-700/60 bg-slate-800/60 text-slate-400 hover:border-slate-600 hover:text-slate-300"}`}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Active filter chips */}
                {(search || typeFilter !== "all") && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-slate-600">Active:</span>
                    {search && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs text-blue-400">
                        "{search}" <button onClick={() => setSearch("")}><X className="h-3 w-3" /></button>
                      </span>
                    )}
                    {typeFilter !== "all" && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-xs capitalize text-indigo-400">
                        {typeFilter} <button onClick={() => setTypeFilter("all")}><X className="h-3 w-3" /></button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Skeletons ── */}
            {loading && (
              <div className="space-y-3">
                {[0,.12,.24].map((d,i) => <SkeletonCard key={i} delay={d} />)}
              </div>
            )}

            {/* ── Empty state ── */}
            {!loading && displayed.length === 0 && (
              <div className="rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-8 text-center backdrop-blur sm:p-12"
                style={{animation:"fadeIn 0.4s ease-out both"}}>
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-2xl shadow-lg sm:h-16 sm:w-16 sm:text-3xl">
                  {search || typeFilter !== "all" ? "🔍" : "📋"}
                </div>
                <h3 className="text-base font-semibold text-white sm:text-lg">
                  {search || typeFilter!=="all" ? "No results found" : "No interviews yet"}
                </h3>
                <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                  {search || typeFilter!=="all" ? "Try adjusting filters" : "Your completed interviews will appear here"}
                </p>
                {(search || typeFilter!=="all") && (
                  <button onClick={() => { setSearch(""); setTypeFilter("all"); }}
                    className="mt-4 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700/80">
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {/* ── Interview cards ── */}
            {!loading && displayed.length > 0 && (
              <div className="space-y-3">
                {displayed.map((item, idx) => {
                  const s        = item.overallScore;
                  const leftBar  = s>=80 ? "from-emerald-500 to-teal-400" : s>=60 ? "from-amber-400 to-yellow-300" : "from-rose-500 to-red-400";
                  const hoverBdr = s>=80 ? "hover:border-emerald-500/35"  : s>=60 ? "hover:border-amber-500/35"   : "hover:border-rose-500/35";
                  const glowBg   = s>=80 ? "bg-emerald-500/10"            : s>=60 ? "bg-amber-500/10"             : "bg-rose-500/10";

                  return (
                    <div key={item._id}
                      className={`card-lift group relative overflow-hidden rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 p-4 backdrop-blur sm:p-6 ${hoverBdr}`}
                      style={{animation:`cardIn 0.4s ease-out ${0.05+idx*0.07}s both`}}>

                      {/* Left accent bar */}
                      <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-gradient-to-b ${leftBar} opacity-60 group-hover:opacity-100 transition-opacity`} />
                      {/* Corner glow on hover */}
                      <div className={`pointer-events-none absolute -top-5 -right-5 h-20 w-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${glowBg}`} />

                      <div className="flex items-start gap-3 pl-3 sm:gap-4">
                        {/* Type emoji */}
                        <div className="shrink-0 grid h-10 w-10 place-items-center rounded-xl bg-slate-800/80 text-lg shadow-inner transition-transform group-hover:scale-110 sm:h-12 sm:w-12 sm:text-xl">
                          {typeIcon(item.interviewType)}
                        </div>

                        <div className="min-w-0 flex-1">
                          {/* Title + score */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h2 className="truncate text-sm font-bold text-white sm:text-base lg:text-lg">
                                {item.interviewType.toUpperCase().replace(/_/g," ")}
                              </h2>
                              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                <span className="flex items-center gap-1 text-[11px] text-slate-500 sm:text-xs">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(item.createdAt).toLocaleDateString("en-US",{day:"numeric",month:"short",year:"numeric"})}
                                </span>
                                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize sm:text-xs ${statusBadge(item.status)}`}>
                                  {item.status}
                                </span>
                              </div>
                            </div>
                            {/* Ring on sm+, number on mobile */}
                            <div className="hidden sm:block shrink-0"><ScoreRing score={s} /></div>
                            <div className="block sm:hidden shrink-0">
                              <span className={`text-xl font-bold ${scoreColor(s)}`}>{s}%</span>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-2.5 sm:mt-3">
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-[11px] text-slate-600 sm:text-xs">Performance</span>
                              <span className={`text-[11px] font-semibold sm:text-xs ${scoreColor(s)}`}>{scoreLabel(s)}</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800/80">
                              <div className={`h-full rounded-full bg-gradient-to-r ${scoreFillGradient(s)} transition-all duration-1000`}
                                style={{width:`${s}%`, transitionDelay:`${0.1+idx*0.07}s`}} />
                            </div>
                          </div>

                          {/* Bottom action row */}
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                            <div className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-[11px] font-medium sm:px-3 sm:py-1.5 sm:text-xs ${scoreLabelColor(s)}`}>
                              <Star className="h-3 w-3" />{s}% score
                            </div>
                            <Link to={`/interview/${item._id}`}
                              className="group/btn inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40 active:scale-[0.97] sm:gap-1.5 sm:px-4 sm:py-2 sm:text-xs">
                              View Details
                              <ChevronRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5 sm:h-3.5 sm:w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && totalInterviews > 0 && (
              <p className="text-center text-xs text-slate-700" style={{animation:"fadeIn 0.4s ease-out 0.5s both"}}>
                Showing {displayed.length} of {totalInterviews} interview{totalInterviews !== 1 ? "s" : ""}
              </p>
            )}

          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default InterviewHistory;