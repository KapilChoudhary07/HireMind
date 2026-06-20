

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle2, XCircle, Lightbulb, Trophy,
  Share2, RotateCcw, ChevronRight, TrendingUp,
  Target, Zap, Star,
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const radius = 70;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const [animatedScore, setAnimatedScore] = useState(0);
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (score / 100) * circumference);
      let current = 0;
      const step = score / 60;
      const interval = setInterval(() => {
        current += step;
        if (current >= score) { setAnimatedScore(score); clearInterval(interval); }
        else setAnimatedScore(Math.floor(current));
      }, 16);
      return () => clearInterval(interval);
    }, 400);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  const getScoreColor = (s) =>
    s >= 80 ? "#22c55e" : s >= 60 ? "#f59e0b" : "#ef4444";

  const getGrade = (s) => {
    if (s >= 90) return { label: "Excellent", color: "#22c55e" };
    if (s >= 75) return { label: "Good",      color: "#3b82f6" };
    if (s >= 60) return { label: "Average",   color: "#f59e0b" };
    return          { label: "Needs Work", color: "#ef4444" };
  };

  const grade = getGrade(score);
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: radius * 2, height: radius * 2 }}>
        <svg height={radius * 2} width={radius * 2} style={{ transform: "rotate(-90deg)" }}>
          <circle stroke="rgba(255,255,255,0.08)" fill="transparent"
            strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
          <motion.circle
            stroke={color} fill="transparent" strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black tabular-nums" style={{ color }}>
            {animatedScore}
          </span>
          <span className="text-xs text-white/50 font-medium">/ 100</span>
        </div>
      </div>
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2 }}
        className="px-4 py-1 rounded-full text-sm font-bold"
        style={{ background: `${grade.color}22`, color: grade.color, border: `1px solid ${grade.color}44` }}
      >
        {grade.label}
      </motion.span>
    </div>
  );
}

// ─── Feedback List ─────────────────────────────────────────────────────────────
function FeedbackTab({ items, color, icon: Icon, bg, border }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, duration: 0.35 }}
          className="flex items-start gap-3 rounded-xl p-4"
          style={{ background: bg, border: `1px solid ${border}` }}
        >
          <div className="mt-0.5 shrink-0 rounded-full p-1" style={{ background: `${color}22` }}>
            <Icon size={14} style={{ color }} />
          </div>
          <p className="text-sm text-white/85 leading-relaxed">{item}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
const InterviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [activeTab, setActiveTab] = useState("strengths");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const { data } = await api.get(`/interview/${id}`);
        setInterview(data.interview);
      } catch (error) {
        console.log(error);
      }
    };
    fetchInterview();
  }, [id]);

  if (!interview) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <p className="text-white/40 text-sm">Loading your results...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const TABS = [
    { key: "strengths",   label: "Strengths",  icon: CheckCircle2, color: "#22c55e", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.2)",  count: interview.strengths?.length ?? 0 },
    { key: "weaknesses",  label: "Weaknesses", icon: XCircle,      color: "#ef4444", bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.2)",  count: interview.weaknesses?.length ?? 0 },
    { key: "suggestions", label: "Tips",       icon: Lightbulb,    color: "#a855f7", bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)", count: interview.suggestions?.length ?? 0 },
  ];

  const activeTabData = TABS.find((t) => t.key === activeTab);
  const items =
    activeTab === "strengths"  ? (interview.strengths  ?? []) :
    activeTab === "weaknesses" ? (interview.weaknesses ?? []) :
                                 (interview.suggestions ?? []);

  const stats = [
    { label: "Strengths",  value: interview.strengths?.length  ?? 0, icon: Star,   color: "#22c55e" },
    { label: "Weaknesses", value: interview.weaknesses?.length ?? 0, icon: Target, color: "#ef4444" },
    { label: "Tips",       value: interview.suggestions?.length ?? 0, icon: Zap,    color: "#a855f7" },
  ];

  return (
    <MainLayout>
      <div
        className="min-h-screen w-full flex items-start justify-center p-6 pt-10"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(168,85,247,0.12) 0%, transparent 60%), #09090b",
        }}
      >
        <div className="w-full max-w-2xl flex flex-col gap-5">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-1">
                Interview Review
              </p>
              <h1 className="text-2xl font-black text-white">Interview Details</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white/70 border border-white/10 hover:border-white/20 hover:text-white transition-all"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <Share2 size={14} />
              {copied ? "Copied!" : "Share"}
            </motion.button>
          </motion.div>

          {/* ── Score Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl p-6 border"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(168,85,247,0.1) 100%)",
              borderColor: "rgba(99,102,241,0.25)",
            }}
          >
            <div className="flex items-center gap-8">
              <ScoreRing score={interview.overallScore} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy size={16} className="text-yellow-400" />
                  <span className="text-white/70 text-sm font-semibold">Overall Performance</span>
                </div>
                <div className="flex flex-col gap-2">
                  {stats.map((stat, i) => (
                    <motion.div key={stat.label}
                      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <stat.icon size={13} style={{ color: stat.color }} />
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full" style={{ background: stat.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((stat.value / 6) * 100, 100)}%` }}
                          transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                        />
                      </div>
                      <span className="text-white/60 text-xs w-20">{stat.value} {stat.label}</span>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                  className="mt-4 flex items-center gap-1.5 text-xs text-white/40"
                >
                  <TrendingUp size={12} className="text-green-400" />
                  <span>You're above 65% of candidates</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* ── Tabs ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all relative"
                    style={{ color: isActive ? tab.color : "rgba(255,255,255,0.35)", background: isActive ? tab.bg : "transparent" }}
                  >
                    <tab.icon size={14} />
                    <span>{tab.label}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: isActive ? `${tab.color}22` : "rgba(255,255,255,0.06)", color: isActive ? tab.color : "rgba(255,255,255,0.3)" }}>
                      {tab.count}
                    </span>
                    {isActive && (
                      <motion.div layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                        style={{ background: tab.color }}
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="p-5">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                >
                  <FeedbackTab
                    items={items}
                    color={activeTabData.color}
                    icon={activeTabData.icon}
                    bg={activeTabData.bg}
                    border={activeTabData.border}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Recommended Next Steps ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl p-5 border"
            style={{ background: "rgba(168,85,247,0.06)", borderColor: "rgba(168,85,247,0.18)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg" style={{ background: "rgba(168,85,247,0.2)" }}>
                <Zap size={14} className="text-purple-400" />
              </div>
              <h3 className="text-white font-bold text-sm">Recommended Next Steps</h3>
            </div>
            <div className="flex flex-col gap-2">
              {[
                "Schedule your next mock interview in 3 days",
                "Review your weak areas using the Tips above",
                "Track your progress with daily coding challenges",
              ].map((step, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3 text-sm text-white/60 hover:text-white/90 transition-colors cursor-pointer group"
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 group-hover:scale-110 transition-transform"
                    style={{ background: "rgba(168,85,247,0.25)", color: "#a855f7" }}>
                    {i + 1}
                  </div>
                  <span>{step}</span>
                  <ChevronRight size={13} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Action Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-3 pb-10"
          >
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/interview")}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white/60 border border-white/10 hover:border-white/20 hover:text-white transition-all"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <RotateCcw size={14} />
              Retake Interview
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/interview-history")}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
            >
              <TrendingUp size={14} />
              View Progress
            </motion.button>
          </motion.div>

        </div>
      </div>
    </MainLayout>
  );
};

export default InterviewDetails;