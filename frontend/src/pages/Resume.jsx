
import MainLayout from "../layouts/MainLayout";
import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import {
  FileText, Upload, Trash2, BarChart2, X,
  CheckCircle2, AlertCircle, Lightbulb, Star,
  CloudUpload, Eye, Calendar, FileCheck,
  ChevronDown, ChevronUp, Loader2,
} from "lucide-react";

const scoreColor  = (s) => s >= 80 ? "text-emerald-400" : s >= 60 ? "text-amber-400" : "text-rose-400";
const scoreBg     = (s) => s >= 80 ? "from-emerald-500 to-teal-400" : s >= 60 ? "from-amber-400 to-yellow-300" : "from-rose-500 to-red-400";
const scoreBorder = (s) => s >= 80 ? "border-emerald-500/25 bg-emerald-500/8" : s >= 60 ? "border-amber-500/25 bg-amber-500/8" : "border-rose-500/25 bg-rose-500/8";
const scoreLabel  = (s) => s >= 80 ? "Excellent" : s >= 60 ? "Good" : "Needs Work";

const ScoreRing = ({ score }) => {
  const r = 40, circ = 2 * Math.PI * r;
  const dash = circ - (circ * score) / 100;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#f43f5e";
  return (
    <div className="relative grid h-24 w-24 place-items-center shrink-0">
      <svg className="-rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(30,41,59,0.9)" strokeWidth="7" />
        <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1) 0.3s" }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-xl font-bold ${scoreColor(score)}`}>{score}%</span>
        <span className="text-[9px] text-slate-500">{scoreLabel(score)}</span>
      </div>
    </div>
  );
};

const Toast = ({ msg, type }) => (
  <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur
    ${type === "success" ? "border-emerald-500/30 bg-slate-900/95 text-emerald-400" : "border-rose-500/30 bg-slate-900/95 text-rose-400"}`}
    style={{ animation: "slideUpToast 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}>
    {type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
    {msg}
  </div>
);

const ConfirmModal = ({ onConfirm, onCancel, name }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    style={{ animation: "fadeIn 0.2s ease-out both" }}>
    <div className="w-full max-w-sm rounded-3xl border border-rose-500/25 bg-slate-900/95 p-6 shadow-2xl"
      style={{ animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both" }}>
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-400 mx-auto">
        <Trash2 className="h-6 w-6" />
      </div>
      <h3 className="text-center text-lg font-bold text-white mb-1">Delete Resume?</h3>
      <p className="text-center text-sm text-slate-500 mb-6">
        <span className="text-slate-300 font-medium">"{name}"</span> will be permanently deleted.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel}
          className="flex-1 rounded-xl border border-slate-700 bg-slate-800/60 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700/60">
          Cancel
        </button>
        <button onClick={onConfirm}
          className="flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:brightness-110 active:scale-97">
          Delete
        </button>
      </div>
    </div>
  </div>
);

const AnalysisSection = ({ title, icon, iconBg, items, bullet, border, delay }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className={`overflow-hidden rounded-2xl border ${border} bg-slate-900/40 backdrop-blur`}
      style={{ animation: `cardIn 0.35s ease-out ${delay}s both` }}>
      <button onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-2.5 px-4 py-3 transition-all hover:bg-slate-800/30">
        <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${iconBg}`}>{icon}</div>
        <span className="flex-1 text-left text-sm font-semibold text-white">{title}</span>
        <span className="text-[11px] text-slate-600 mr-1">{items.length}</span>
        {open ? <ChevronUp className="h-4 w-4 text-slate-600" /> : <ChevronDown className="h-4 w-4 text-slate-600" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2">
          {items.map((item, i) => (
            <div key={i}
              className="flex items-start gap-2.5 rounded-xl bg-slate-900/60 px-3 py-2.5 text-sm text-slate-300"
              style={{ animation: `slideUp 0.25s ease-out ${i * 0.04}s both` }}>
              <span className="mt-0.5 shrink-0 text-base leading-none">{bullet}</span>
              <span className="leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Resume = () => {
  const [resumes,        setResumes]        = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [file,           setFile]           = useState(null);
  const [uploading,      setUploading]      = useState(false);
  const [loadingList,    setLoadingList]    = useState(true);
  const [dragging,       setDragging]       = useState(false);
  const [toast,          setToast]          = useState(null);
  const [confirmId,      setConfirmId]      = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchResumes = async () => {
    try {
      const { data } = await api.get("/resume/my-resumes");
      setResumes(data.resumes);
    } catch {
      showToast("Failed to load resumes.", "error");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    let active = true;

    api.get("/resume/my-resumes")
      .then(({ data }) => {
        if (active) setResumes(data.resumes);
      })
      .catch(() => {
        if (active) showToast("Failed to load resumes.", "error");
      })
      .finally(() => {
        if (active) setLoadingList(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleUpload = async () => {
    if (!file) { showToast("Please select a PDF file first.", "error"); return; }
    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);
    try {
      await api.post("/resume/upload", formData);
      showToast("Resume uploaded successfully! 🎉");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchResumes();
    } catch {
      showToast("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    setConfirmId(null);
    try {
      await api.delete(`/resume/${id}`);
      showToast("Resume deleted.");
      if (selectedResume?._id === id) setSelectedResume(null);
      fetchResumes();
    } catch {
      showToast("Delete failed. Try again.", "error");
    }
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === "application/pdf") setFile(f);
    else showToast("Only PDF files are allowed.", "error");
  };

  const confirmName = resumes.find(r => r._id === confirmId)
    ?.fileName?.split("-").slice(1).join("-") || "this resume";

  return (
    <>
      <style>{`
        @keyframes slideUp      { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn       { from{opacity:0} to{opacity:1} }
        @keyframes cardIn       { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes popIn        { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }
        @keyframes floatGlow    { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:0.45;transform:scale(1.1)} }
        @keyframes spin         { to{transform:rotate(360deg)} }
        @keyframes slideUpToast { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse        { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes shimmer      { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
        @keyframes dropBounce   { 0%{transform:scale(1)} 50%{transform:scale(1.03)} 100%{transform:scale(1)} }
        @keyframes progressFill { from{width:0%} to{width:var(--w)} }
        .upload-btn  { transition:all .18s ease; }
        .upload-btn:hover  { transform:translateY(-1px); box-shadow:0 6px 24px rgba(59,130,246,0.35); }
        .upload-btn:active { transform:scale(0.97); }
        .row-item  { transition:background .15s, border-color .15s; }
        .row-item:hover { border-color:rgba(71,85,105,0.7)!important; background:rgba(30,41,59,0.7)!important; }
        .del-btn:hover { background:rgba(239,68,68,0.2)!important; color:rgb(252,165,165)!important; }
      `}</style>

      <MainLayout>
        <div className="relative min-h-screen">

          {/* Glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-600/7 blur-3xl"  style={{animation:"floatGlow 6s ease-in-out infinite"}} />
            <div className="absolute top-1/2 -right-20 h-64 w-64 rounded-full bg-purple-600/6 blur-3xl" style={{animation:"floatGlow 8s ease-in-out 2s infinite"}} />
          </div>

          <div className="relative pb-12 pt-16 lg:pt-0">

            {/* Header */}
            <div className="mb-6" style={{animation:"slideUp 0.4s ease-out both"}}>
              <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                Resume Manager
              </h1>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">Upload your PDF and get instant AI-powered analysis</p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">

              {/* ── LEFT: Upload + List ── */}
              <div className="space-y-5 lg:col-span-2">

                {/* Upload card */}
                <div className="overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 to-slate-950 p-5 backdrop-blur"
                  style={{animation:"cardIn 0.4s ease-out 0.05s both"}}>
                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/15 text-blue-400">
                      <CloudUpload className="h-4 w-4" />
                    </div>
                    <h2 className="font-bold text-white">Upload Resume</h2>
                  </div>

                  {/* Drag & drop zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative mb-4 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 transition-all
                      ${dragging
                        ? "border-blue-400 bg-blue-500/10"
                        : file
                          ? "border-emerald-500/50 bg-emerald-500/5"
                          : "border-slate-700/80 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/60"}`}
                    style={dragging ? { animation: "dropBounce 0.3s ease-out" } : {}}>
                    <input ref={fileInputRef} type="file" accept=".pdf"
                      onChange={(e) => setFile(e.target.files[0])} className="hidden" />

                    {file ? (
                      <>
                        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                          <FileCheck className="h-7 w-7" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-emerald-400">{file.name}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB · PDF</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                          className="absolute top-3 right-3 grid h-7 w-7 place-items-center rounded-full bg-slate-800 text-slate-400 transition-all hover:bg-rose-500/20 hover:text-rose-400">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-800/80 text-slate-500">
                          <Upload className="h-7 w-7" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-slate-300">
                            {dragging ? "Drop it here! 🎯" : "Drag & drop or click to browse"}
                          </p>
                          <p className="mt-1 text-xs text-slate-600">PDF only · Max 10MB</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Upload progress bar (shown while uploading) */}
                  {uploading && (
                    <div className="mb-3 overflow-hidden rounded-full bg-slate-800/80 h-1.5">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={{ animation: "progressFill 2s ease-out forwards", "--w": "90%" }} />
                    </div>
                  )}

                  <button onClick={handleUpload} disabled={uploading || !file}
                    className="upload-btn w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                    {uploading
                      ? <><Loader2 className="h-4 w-4" style={{animation:"spin 1s linear infinite"}} /> Uploading…</>
                      : <><CloudUpload className="h-4 w-4" /> Upload Resume</>}
                  </button>
                </div>

                {/* Resume list */}
                <div className="overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 to-slate-950 p-5 backdrop-blur"
                  style={{animation:"cardIn 0.4s ease-out 0.1s both"}}>
                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-500/15 text-purple-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <h2 className="font-bold text-white">My Resumes</h2>
                    {resumes.length > 0 && (
                      <span className="ml-auto rounded-full border border-slate-700/60 bg-slate-800/60 px-2 py-0.5 text-[11px] text-slate-400">
                        {resumes.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {loadingList ? (
                      [0,1,2].map(i => (
                        <div key={i} className="relative overflow-hidden rounded-xl border border-slate-800/60 bg-slate-900/60 p-4"
                          style={{animation:`pulse 1.4s ease-in-out ${i*0.1}s infinite`}}>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-slate-800/80 shrink-0" />
                            <div className="flex-1 space-y-2">
                              <div className="h-3 w-3/4 rounded bg-slate-800/80" />
                              <div className="h-2.5 w-1/2 rounded bg-slate-800/60" />
                            </div>
                          </div>
                          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/3 to-transparent"
                            style={{animation:"shimmer 1.6s ease-in-out infinite"}} />
                        </div>
                      ))
                    ) : resumes.length === 0 ? (
                      <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-7 text-center">
                        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-slate-800/60 text-2xl">📄</div>
                        <p className="text-sm font-medium text-slate-400">No resumes yet</p>
                        <p className="mt-1 text-xs text-slate-600">Upload your first resume above</p>
                      </div>
                    ) : (
                      resumes.map((resume, idx) => {
                        const name = resume.fileName?.split("-").slice(1).join("-") || resume.fileName;
                        const score = resume.analysis?.score;
                        const isSelected = selectedResume?._id === resume._id;
                        return (
                          <div key={resume._id}
                            className={`row-item rounded-2xl border p-3.5 backdrop-blur cursor-pointer
                              ${isSelected ? "border-blue-500/40 bg-blue-500/8" : "border-slate-800/60 bg-slate-900/50"}`}
                            style={{animation:`cardIn 0.35s ease-out ${0.12+idx*0.06}s both`}}
                            onClick={() => setSelectedResume(isSelected ? null : resume)}>
                            <div className="flex items-center gap-3">
                              <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-all
                                ${isSelected ? "bg-blue-500/20 text-blue-400" : "bg-slate-800/80 text-slate-500"}`}>
                                <FileText className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-slate-200">{name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  {score != null && (
                                    <span className={`text-[11px] font-bold ${scoreColor(score)}`}>{score}%</span>
                                  )}
                                  <span className="text-[11px] text-slate-600 flex items-center gap-0.5">
                                    <Calendar className="h-2.5 w-2.5" />
                                    {new Date(resume.createdAt).toLocaleDateString("en-US",{day:"numeric",month:"short"})}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setSelectedResume(isSelected ? null : resume); }}
                                  className={`grid h-7 w-7 place-items-center rounded-lg transition-all
                                    ${isSelected ? "bg-blue-500/20 text-blue-400" : "bg-slate-800/60 text-slate-500 hover:text-blue-400 hover:bg-blue-500/15"}`}>
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setConfirmId(resume._id); }}
                                  className="del-btn grid h-7 w-7 place-items-center rounded-lg bg-slate-800/60 text-slate-500 transition-all">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Mini score bar inside row */}
                            {score != null && (
                              <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                                <div className={`h-full rounded-full bg-gradient-to-r ${scoreBg(score)}`}
                                  style={{width:`${score}%`,transition:"width 1s ease 0.3s"}} />
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Analysis Panel ── */}
              <div className="lg:col-span-3" style={{animation:"cardIn 0.4s ease-out 0.18s both"}}>
                {!selectedResume ? (
                  <div className="flex h-full min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800/70 bg-slate-900/30 p-10 text-center">
                    <div className="mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900 text-4xl shadow-inner">
                      📊
                    </div>
                    <p className="text-base font-semibold text-slate-400">Select a resume to view analysis</p>
                    <p className="mt-1.5 text-sm text-slate-600">Click any resume from the list to see AI-powered insights</p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3 text-xs text-slate-700">
                      {["✅ Strengths","⚠️ Weaknesses","💡 Suggestions","🎯 Score"].map(t => (
                        <span key={t} className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1">{t}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 to-slate-950 p-5 backdrop-blur sm:p-7"
                    style={{animation:"cardIn 0.35s ease-out both"}}>

                    {/* Analysis header */}
                    <div className="mb-5 flex flex-wrap items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-500/15 text-blue-400">
                            <BarChart2 className="h-4 w-4" />
                          </div>
                          <h2 className="font-bold text-white">Resume Analysis</h2>
                          <button onClick={() => setSelectedResume(null)}
                            className="ml-auto grid h-7 w-7 place-items-center rounded-lg bg-slate-800/60 text-slate-500 transition-all hover:bg-slate-700 hover:text-white">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 truncate pl-10">
                          {selectedResume.fileName?.split("-").slice(1).join("-") || selectedResume.fileName}
                        </p>
                      </div>
                      {selectedResume.analysis?.score != null && (
                        <ScoreRing score={selectedResume.analysis.score} />
                      )}
                    </div>

                    {/* Score summary banner */}
                    {selectedResume.analysis?.score != null && (
                      <div className={`mb-5 flex items-center gap-3 rounded-2xl border px-4 py-3 ${scoreBorder(selectedResume.analysis.score)}`}
                        style={{animation:"slideUp 0.4s ease-out 0.1s both"}}>
                        <Star className={`h-4 w-4 shrink-0 ${scoreColor(selectedResume.analysis.score)}`} />
                        <div>
                          <p className={`text-sm font-bold ${scoreColor(selectedResume.analysis.score)}`}>
                            {scoreLabel(selectedResume.analysis.score)} — {selectedResume.analysis.score}%
                          </p>
                          <p className="text-xs text-slate-500">
                            {selectedResume.analysis.score >= 80
                              ? "Your resume is well-optimized for most roles."
                              : selectedResume.analysis.score >= 60
                              ? "Good base — a few improvements will make a big impact."
                              : "Needs significant improvement to stand out to recruiters."}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Sections */}
                    <div className="space-y-3">
                      {selectedResume.analysis?.strengths?.length > 0 && (
                        <AnalysisSection title="Strengths" bullet="✅" delay={0.15}
                          icon={<CheckCircle2 className="h-4 w-4" />}
                          iconBg="bg-emerald-500/15 text-emerald-400"
                          border="border-emerald-500/20"
                          items={selectedResume.analysis.strengths} />
                      )}
                      {selectedResume.analysis?.weaknesses?.length > 0 && (
                        <AnalysisSection title="Areas to Improve" bullet="⚠️" delay={0.22}
                          icon={<AlertCircle className="h-4 w-4" />}
                          iconBg="bg-rose-500/15 text-rose-400"
                          border="border-rose-500/20"
                          items={selectedResume.analysis.weaknesses} />
                      )}
                      {selectedResume.analysis?.suggestions?.length > 0 && (
                        <AnalysisSection title="Suggestions" bullet="💡" delay={0.29}
                          icon={<Lightbulb className="h-4 w-4" />}
                          iconBg="bg-amber-500/15 text-amber-400"
                          border="border-amber-500/20"
                          items={selectedResume.analysis.suggestions} />
                      )}
                      {!selectedResume.analysis && (
                        <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-8 text-center">
                          <Loader2 className="mx-auto mb-3 h-8 w-8 text-blue-400" style={{animation:"spin 1s linear infinite"}} />
                          <p className="text-sm text-slate-400">Analysis processing…</p>
                          <p className="mt-1 text-xs text-slate-600">AI is reviewing your resume</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>

      {toast     && <Toast msg={toast.msg} type={toast.type} />}
      {confirmId && (
        <ConfirmModal
          name={confirmName}
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </>
  );
};

export default Resume;
