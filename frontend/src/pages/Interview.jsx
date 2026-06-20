
import MainLayout from "../layouts/MainLayout";
import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import {
  Sparkles, ChevronRight, Send, RotateCcw,
  CheckCircle2, XCircle, Lightbulb, Trophy,
  Brain, Code2, Server, Coffee, Layers,
  Loader2, ClipboardList, Mic, Volume2, VolumeX,
  Keyboard, AudioLines, ArrowLeft, ArrowRight,
  Camera, Video, VideoOff, Circle, Square, Download,
  Trash2, Gauge,
} from "lucide-react";

/* ─── Interview type config ─── */
const TYPES = [
  { value: "mern",       label: "MERN Stack",  icon: Layers,  color: "from-green-500  to-teal-500",  bg: "bg-green-500/10  border-green-500/25"  },
  { value: "react",      label: "React",        icon: Code2,   color: "from-cyan-500   to-blue-500",   bg: "bg-cyan-500/10   border-cyan-500/25"   },
  { value: "node",       label: "Node.js",      icon: Server,  color: "from-lime-500   to-green-600",  bg: "bg-lime-500/10   border-lime-500/25"   },
  { value: "java",       label: "Java",         icon: Coffee,  color: "from-orange-500 to-amber-500",  bg: "bg-orange-500/10 border-orange-500/25" },
  { value: "python",     label: "Python",       icon: Brain,   color: "from-blue-500   to-indigo-500", bg: "bg-blue-500/10   border-blue-500/25"   },
  { value: "fullstack",  label: "Full Stack",   icon: Layers,  color: "from-purple-500 to-pink-500",   bg: "bg-purple-500/10 border-purple-500/25" },
];

/* ─── Score helpers ─── */
const scoreColor  = (s) => s >= 80 ? "text-emerald-400" : s >= 60 ? "text-amber-400" : "text-rose-400";
const scoreStroke = (s) => s >= 80 ? "#10b981" : s >= 60 ? "#f59e0b" : "#f43f5e";
const scoreLabel  = (s) => s >= 80 ? "Excellent! 🎯" : s >= 60 ? "Good Job! 👍" : "Keep Practicing! 📈";
const scoreBgCard = (s) => s >= 80
  ? "from-emerald-950/70 via-slate-900 to-slate-950 border-emerald-500/25"
  : s >= 60
  ? "from-amber-950/60 via-slate-900 to-slate-950 border-amber-500/25"
  : "from-rose-950/60 via-slate-900 to-slate-950 border-rose-500/25";

/* ─── Score Ring SVG ─── */
const ScoreRing = ({ score }) => {
  const r = 54, circ = 2 * Math.PI * r;
  const dash = circ - (circ * score) / 100;
  return (
    <div className="relative grid h-36 w-36 place-items-center">
      <svg className="-rotate-90" width="144" height="144">
        <circle cx="72" cy="72" r={r} fill="none" stroke="rgba(30,41,59,0.9)" strokeWidth="10" />
        <circle cx="72" cy="72" r={r} fill="none" stroke={scoreStroke(score)} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1) 0.3s" }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-bold ${scoreColor(score)}`}>{score}%</span>
        <span className="text-[11px] text-slate-500 mt-0.5">score</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════ */
const Interview = () => {
  const [step,       setStep]      = useState("select");   // select | generating | questions | submitting | result
  const [type,       setType]      = useState("mern");
  const [questions,  setQuestions] = useState([]);
  const [answers,    setAnswers]   = useState([]);
  const [result,     setResult]    = useState(null);
  const [answered,   setAnswered]  = useState(0);
  const [mode, setMode] = useState("text");
  const [difficulty, setDifficulty] = useState("beginner");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [activeMic, setActiveMic] = useState(null);
  const [speakingQuestion, setSpeakingQuestion] = useState(null);
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const recordedVideoUrlRef = useRef("");
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState("");
  const [speechSupported, setSpeechSupported] = useState(
    () => Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
  const speechSynthesisSupported = "speechSynthesis" in window;

  const selectedType = TYPES.find(t => t.value === type) || TYPES[0];

  useEffect(() => () => {
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    clearInterval(recordingTimerRef.current);
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    if (recordedVideoUrlRef.current) URL.revokeObjectURL(recordedVideoUrlRef.current);
  }, []);

  const formatRecordingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  };

  const stopCamera = () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraReady(false);
  };

  const enableCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera recording is not supported in this browser.");
      return;
    }

    try {
      setCameraError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraReady(true);
    } catch {
      setCameraError("Camera or microphone permission was denied.");
    }
  };

  const startVideoRecording = () => {
    const stream = mediaStreamRef.current;
    if (!stream || typeof MediaRecorder === "undefined") return;

    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
      recordedVideoUrlRef.current = "";
      setRecordedVideoUrl("");
    }
    recordingChunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : "video/webm";
    const recorder = new MediaRecorder(stream, { mimeType });
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordingChunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(recordingChunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      recordedVideoUrlRef.current = url;
      setRecordedVideoUrl(url);
    };
    recorder.start(1000);
    mediaRecorderRef.current = recorder;
    setRecordingSeconds(0);
    setIsRecording(true);
    recordingTimerRef.current = setInterval(
      () => setRecordingSeconds((seconds) => seconds + 1),
      1000
    );
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    clearInterval(recordingTimerRef.current);
    setIsRecording(false);
  };

  const deleteRecording = () => {
    if (recordedVideoUrl) URL.revokeObjectURL(recordedVideoUrl);
    recordedVideoUrlRef.current = "";
    setRecordedVideoUrl("");
    setRecordingSeconds(0);
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeakingQuestion(null);
  };

  const speakQuestion = (question, index) => {
    if (!speechSynthesisSupported || !question) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `Question ${index + 1}. ${question}`
    );
    utterance.lang = "en-IN";
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.onstart = () => setSpeakingQuestion(index);
    utterance.onend = () => setSpeakingQuestion(null);
    utterance.onerror = () => setSpeakingQuestion(null);
    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeech = (index, question) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    if (activeMic === index) {
      recognitionRef.current?.stop();
      setActiveMic(null);
    } else {
      recognitionRef.current?.stop();
      stopSpeaking();
      
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = "en-US";

      rec.onstart = () => {
        setActiveMic(index);
      };

      rec.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setAnswers((previousAnswers) => {
          const updated = [...previousAnswers];
          const currentAnswer = updated[index]?.answer || "";
          const updatedAnswer = currentAnswer
            ? `${currentAnswer.trim()} ${transcript.trim()}`
            : transcript.trim();
          updated[index] = { question, answer: updatedAnswer };
          setAnswered(updated.filter((answer) => answer?.answer?.trim()).length);
          return updated;
        });
      };

      rec.onerror = (e) => {
        console.error("Speech recognition error:", e);
        setActiveMic(null);
      };

      rec.onend = () => {
        setActiveMic(null);
      };

      rec.start();
      recognitionRef.current = rec;
    }
  };

  /* Generate questions */
  const handleGenerate = async () => {
    setStep("generating");
    try {
      const { data } = await api.post("/interview/generate", {
        interviewType: type,
        difficulty,
      });
      setQuestions(data.questions.questions);
      setAnswers(new Array(data.questions.questions.length).fill({ question: "", answer: "" }));
      setAnswered(0);
      setCurrentQuestion(0);
      setStep("questions");
      if (mode === "voice" || mode === "video") {
        speakQuestion(data.questions.questions[0], 0);
      }
    } catch {
      setStep("select");
      alert("Failed to generate questions. Please try again.");
    }
  };

  /* Submit answers */
  const handleSubmit = async () => {
    recognitionRef.current?.stop();
    stopSpeaking();
    if (isRecording) stopVideoRecording();
    if (mode === "video") stopCamera();
    setStep("submitting");
    try {
      const { data } = await api.post("/interview/submit", {
        questions: answers,
        interviewType: type,
        difficulty,
      });
      setResult(data.result);
      setStep("result");
    } catch {
      setStep("questions");
      alert("Submission failed. Please try again.");
    }
  };

  /* Update a single answer */
  const updateAnswer = (index, question, value) => {
    const updated = [...answers];
    updated[index] = { question, answer: value };
    setAnswers(updated);
    const filled = updated.filter(a => a?.answer?.trim()).length;
    setAnswered(filled);
  };

  /* Reset everything */
  const handleReset = () => {
    recognitionRef.current?.stop();
    stopSpeaking();
    if (isRecording) stopVideoRecording();
    stopCamera();
    deleteRecording();
    setStep("select"); setQuestions([]); setAnswers([]); setResult(null); setAnswered(0);
    setCurrentQuestion(0);
  };

  const goToQuestion = (nextIndex) => {
    recognitionRef.current?.stop();
    stopSpeaking();
    setCurrentQuestion(nextIndex);
    if (mode === "voice" || mode === "video") {
      speakQuestion(questions[nextIndex], nextIndex);
    }
  };

  const progress = questions.length > 0 ? Math.round((answered / questions.length) * 100) : 0;

  return (
    <>
      <style>{`
        @keyframes slideUp   { from{opacity:0;transform:translateY(20px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn    { from{opacity:0}                             to{opacity:1} }
        @keyframes cardIn    { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes popIn     { from{opacity:0;transform:scale(0.7)}        to{opacity:1;transform:scale(1)} }
        @keyframes floatGlow { 0%,100%{opacity:0.25;transform:scale(1)}    50%{opacity:0.5;transform:scale(1.1)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes shimmer   { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
        @keyframes bounceIn  {
          0%  {opacity:0;transform:scale(0.3)}
          50% {opacity:1;transform:scale(1.05)}
          70% {transform:scale(0.9)}
          100%{opacity:1;transform:scale(1)}
        }
        .card-lift { transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease; }
        .card-lift:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(0,0,0,.45); }
        .type-card.selected { box-shadow: 0 0 0 2px rgba(59,130,246,0.6), 0 8px 30px rgba(59,130,246,0.2); }
        .textarea-glow:focus { box-shadow: 0 0 0 2px rgba(59,130,246,0.35), 0 0 20px rgba(59,130,246,0.1); }
        .progress-bar { transition: width 0.6s cubic-bezier(0.22,1,0.36,1); }
        .btn-primary { transition: all .18s ease; }
        .btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 24px rgba(59,130,246,0.4); }
        .btn-primary:active { transform:scale(0.97); }
      `}</style>

      <MainLayout>
        <div className="relative min-h-screen">

          {/* Ambient glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-600/8 blur-3xl"   style={{animation:"floatGlow 6s ease-in-out infinite"}} />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-600/8 blur-3xl" style={{animation:"floatGlow 7s ease-in-out 2s infinite"}} />
            <div className="absolute top-1/3 right-1/4 h-48 w-48 rounded-full bg-cyan-500/5 blur-3xl"  style={{animation:"floatGlow 8s ease-in-out 1s infinite"}} />
          </div>

          {/* pt-16 = space for mobile hamburger; lg:pt-0 = desktop no extra space */}
          <div className="relative pt-16 pb-10 lg:pt-0">

            {/* ══════════════════════════════════
                STEP 1 — Select interview type
            ══════════════════════════════════ */}
            {(step === "select" || step === "generating") && (
              <div style={{animation:"slideUp 0.4s ease-out both"}}>
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/30">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">AI Interview</span>
                  </div>
                  <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                    Start Your Interview
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">Choose a technology and get AI-generated questions</p>
                </div>

                {/* Type cards — 2 col mobile / 3 col sm+ */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                  {TYPES.map((t, i) => (
                    <button
                      key={t.value}
                      onClick={() => setType(t.value)}
                      className={`type-card card-lift relative overflow-hidden rounded-2xl border p-4 text-left transition-all sm:p-5
                        ${type === t.value
                          ? "selected border-blue-500/50 bg-gradient-to-br from-blue-950/60 to-slate-900"
                          : "border-slate-800/70 bg-gradient-to-br from-slate-900/80 to-slate-950 hover:border-slate-700"}`}
                      style={{animation:`cardIn 0.4s ease-out ${0.05+i*0.06}s both`}}
                    >
                      {/* Selected tick */}
                      {type === t.value && (
                        <div className="absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full bg-blue-500 text-white" style={{animation:"popIn 0.25s ease-out both"}}>
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      <div className={`mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${t.color} shadow-md`}>
                        <t.icon className="h-5 w-5 text-white" />
                      </div>
                      <p className="font-semibold text-white text-sm sm:text-base">{t.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 capitalize">{t.value} interview</p>
                    </button>
                  ))}
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-slate-500" />
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Difficulty
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "beginner", label: "Beginner", active: "border-emerald-500/60 bg-emerald-500/15 text-emerald-300" },
                      { value: "intermediate", label: "Intermediate", active: "border-amber-500/60 bg-amber-500/15 text-amber-300" },
                      { value: "advanced", label: "Advanced", active: "border-rose-500/60 bg-rose-500/15 text-rose-300" },
                    ].map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setDifficulty(level.value)}
                        className={`rounded-xl border px-2 py-3 text-xs font-semibold transition-all sm:text-sm ${
                          difficulty === level.value
                            ? level.active
                            : "border-slate-800 bg-slate-900/60 text-slate-500 hover:border-slate-700"
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Interview Mode
                  </p>
                  <div className="grid gap-3 md:grid-cols-3">
                    {[
                      { value: "text", title: "Text Interview", description: "See all questions and type your answers", icon: Keyboard },
                      { value: "voice", title: "Voice Interview", description: "Hear each question and answer using your mic", icon: AudioLines },
                      { value: "video", title: "Video Interview", description: "Record camera, audio and your responses", icon: Camera },
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          if (mode === "video" && item.value !== "video") {
                            if (isRecording) stopVideoRecording();
                            stopCamera();
                          }
                          setMode(item.value);
                        }}
                        className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                          mode === item.value
                            ? "border-blue-500/60 bg-blue-500/10 shadow-lg shadow-blue-500/10"
                            : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                        }`}
                      >
                        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                          mode === item.value ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400"
                        }`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{item.title}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {(mode === "voice" || mode === "video") && (!speechSupported || !speechSynthesisSupported) && (
                    <p className="mt-2 text-xs text-amber-400">
                      For full voice support, use the latest Chrome or Edge and allow microphone access.
                    </p>
                  )}
                </div>

                {/* Selected type info */}
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4 backdrop-blur"
                  style={{animation:"slideUp 0.4s ease-out 0.3s both"}}>
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${selectedType.color} shadow-md`}>
                    <selectedType.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">{selectedType.label} Interview</p>
                    <p className="text-xs text-slate-500 mt-0.5">~10 questions · AI evaluated · Instant feedback</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-xs font-medium text-blue-400">AI Powered</span>
                  </div>
                </div>

                {/* Generate button */}
                <div className="mt-5" style={{animation:"slideUp 0.4s ease-out 0.38s both"}}>
                  <button
                    onClick={handleGenerate}
                    disabled={step === "generating"}
                    className="btn-primary w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed sm:py-3.5"
                  >
                    {step === "generating" ? (
                      <>
                        <Loader2 className="h-5 w-5" style={{animation:"spin 1s linear infinite"}} />
                        Generating Questions…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Generate Questions
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Generating skeleton */}
                {step === "generating" && (
                  <div className="mt-6 space-y-3" style={{animation:"fadeIn 0.3s ease-out both"}}>
                    {[1,2,3].map(i => (
                      <div key={i} className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5">
                        <div className="h-4 w-3/4 rounded-lg bg-slate-800/80" style={{animation:`pulse 1.4s ease-in-out ${i*0.15}s infinite`}} />
                        <div className="mt-3 h-20 w-full rounded-xl bg-slate-800/50" style={{animation:`pulse 1.4s ease-in-out ${i*0.15+0.1}s infinite`}} />
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/3 to-transparent" style={{animation:"shimmer 1.8s ease-in-out infinite"}} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══════════════════════════════════
                STEP 2 — Questions & Answers
            ══════════════════════════════════ */}
            {step === "questions" && (
              <div style={{animation:"slideUp 0.4s ease-out both"}}>
                {/* Header */}
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br ${selectedType.color}`}>
                        <selectedType.icon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">{selectedType.label}</span>
                    </div>
                    <h1 className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                      Answer the Questions
                    </h1>
                  </div>
                  <button onClick={handleReset}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-400 transition-all hover:border-slate-600 hover:text-slate-200">
                    <RotateCcw className="h-3.5 w-3.5" /> Start Over
                  </button>
                </div>

                {mode === "video" && (
                  <div className={`mb-5 overflow-hidden rounded-2xl border border-cyan-500/25 bg-slate-950 shadow-2xl transition-all ${
                    cameraReady
                      ? "sticky top-20 z-30 md:fixed md:right-5 md:top-20 md:z-50 md:mb-0 md:w-80"
                      : ""
                  }`}>
                    <div className={`relative bg-slate-900 ${
                      cameraReady ? "h-44 md:h-48" : "h-40 sm:h-48"
                    }`}>
                      <video
                        ref={videoRef}
                        muted
                        playsInline
                        className={`h-full w-full object-cover ${cameraReady ? "block" : "hidden"}`}
                      />
                      {!cameraReady && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-cyan-500/15 text-cyan-300">
                            <VideoOff className="h-7 w-7" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">Camera is off</p>
                            <p className="mt-1 text-xs text-slate-500">Enable camera and microphone to record</p>
                          </div>
                          <button
                            type="button"
                            onClick={enableCamera}
                            className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
                          >
                            <Video className="h-4 w-4" />
                            Enable Camera
                          </button>
                        </div>
                      )}
                      {isRecording && (
                        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                          <Circle className="h-3 w-3 fill-red-500 text-red-500 animate-pulse" />
                          REC {formatRecordingTime(recordingSeconds)}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 p-2.5">
                      <div>
                        <p className="text-sm font-semibold text-white">Video Recording</p>
                        <p className={`text-xs text-slate-500 ${cameraReady ? "hidden md:block" : ""}`}>
                          Recording stays in your browser until you download it.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cameraReady && !isRecording && (
                          <button
                            type="button"
                            onClick={startVideoRecording}
                            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500"
                          >
                            <Circle className="h-3.5 w-3.5 fill-white" />
                            Start Recording
                          </button>
                        )}
                        {isRecording && (
                          <button
                            type="button"
                            onClick={stopVideoRecording}
                            className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-950"
                          >
                            <Square className="h-3.5 w-3.5 fill-current" />
                            Stop Recording
                          </button>
                        )}
                        {cameraReady && !isRecording && (
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="rounded-xl border border-slate-700 px-3 py-2 text-xs text-slate-400 hover:text-white"
                          >
                            Turn Off
                          </button>
                        )}
                      </div>
                    </div>
                    {cameraError && (
                      <p className="border-t border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                        {cameraError}
                      </p>
                    )}
                    {recordedVideoUrl && (
                      <div className="border-t border-slate-800 p-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Recorded Preview
                        </p>
                        <video src={recordedVideoUrl} controls className="max-h-36 w-full rounded-xl bg-black" />
                        <div className="mt-3 flex gap-2">
                          <a
                            href={recordedVideoUrl}
                            download={`hiremind-${type}-${difficulty}-interview.webm`}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500"
                          >
                            <Download className="h-4 w-4" />
                            Download Recording
                          </a>
                          <button
                            type="button"
                            onClick={deleteRecording}
                            className="grid h-10 w-10 place-items-center rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                            aria-label="Delete recording"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {mode === "voice" && (
                  <div className="mb-5 flex items-center gap-3 rounded-2xl border border-violet-500/25 bg-gradient-to-r from-violet-950/50 to-blue-950/40 p-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-500/20 text-violet-300">
                      <AudioLines className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white">Voice Interview Mode</p>
                      <p className="text-xs text-slate-400">
                        Question {currentQuestion + 1} of {questions.length}. Listen, then answer naturally.
                      </p>
                    </div>
                    <span className="rounded-lg bg-violet-500/15 px-2.5 py-1 text-xs font-semibold text-violet-300">
                      LIVE
                    </span>
                  </div>
                )}

                {/* Progress bar */}
                <div className="mb-5 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4 backdrop-blur"
                  style={{animation:"slideDown 0.35s ease-out both"}}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-400">Progress</span>
                    </div>
                    <span className={`text-sm font-bold ${answered === questions.length ? "text-emerald-400" : "text-blue-400"}`}>
                      {answered}/{questions.length} answered
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`progress-bar h-full rounded-full bg-gradient-to-r ${answered === questions.length ? "from-emerald-500 to-teal-400" : "from-blue-500 to-indigo-500"}`}
                      style={{width:`${progress}%`}}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-slate-600">
                    <span>0%</span>
                    <span className={progress === 100 ? "text-emerald-500 font-semibold" : ""}>{progress}% complete</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Question cards */}
                <div className="space-y-4">
                  {questions
                    .map((question, index) => ({ question, index }))
                    .filter(({ index }) => mode === "text" || index === currentQuestion)
                    .map(({ question, index }) => {
                    const hasAnswer = answers[index]?.answer?.trim();
                    return (
                      <div key={index}
                        className={`group relative rounded-2xl border bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-4 backdrop-blur transition-all duration-200 sm:p-5
                          ${hasAnswer
                            ? "border-emerald-500/30 shadow-md shadow-emerald-500/5"
                            : "border-slate-800/70 hover:border-slate-700/80"}`}
                        style={{animation:`cardIn 0.4s ease-out ${0.05+index*0.06}s both`}}>

                        {/* Question number + answered badge */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`shrink-0 grid h-8 w-8 place-items-center rounded-xl text-sm font-bold transition-all
                            ${hasAnswer
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-blue-500/15 text-blue-400"}`}>
                            {hasAnswer ? <CheckCircle2 className="h-4 w-4" /> : `Q${index+1}`}
                          </div>
                          <p className="flex-1 text-sm font-medium leading-relaxed text-slate-200 sm:text-base">
                            {question}
                          </p>
                          {mode !== "text" && speechSynthesisSupported && (
                            <button
                              type="button"
                              onClick={() => (
                                speakingQuestion === index
                                  ? stopSpeaking()
                                  : speakQuestion(question, index)
                              )}
                              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition-all ${
                                speakingQuestion === index
                                  ? "border-violet-400/40 bg-violet-500/20 text-violet-300"
                                  : "border-slate-700 bg-slate-900 text-slate-400 hover:text-white"
                              }`}
                              aria-label={speakingQuestion === index ? "Stop question audio" : "Play question audio"}
                            >
                              {speakingQuestion === index
                                ? <VolumeX className="h-4 w-4" />
                                : <Volume2 className="h-4 w-4" />}
                            </button>
                          )}
                        </div>

                        {/* Answer textarea */}
                        <textarea
                          placeholder={`Write your answer for Q${index+1}…`}
                          rows={4}
                          value={answers[index]?.answer || ""}
                          onChange={(e) => updateAnswer(index, question, e.target.value)}
                          className="textarea-glow w-full resize-none rounded-xl border border-slate-700/80 bg-slate-950/80 p-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none transition-all duration-200 focus:border-blue-500/60 sm:text-sm"
                        />

                        {/* Character count & Speech mic */}
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleSpeech(index, question)}
                              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer
                                ${activeMic === index
                                  ? "border-red-500/30 bg-red-500/10 text-red-400 animate-pulse"
                                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                                }`}
                            >
                              <Mic className={`h-3.5 w-3.5 ${activeMic === index ? "animate-bounce text-red-400" : "text-slate-400"}`} />
                              {activeMic === index ? "Listening (Click to stop)..." : "Speak Answer"}
                            </button>
                            {!speechSupported && (
                              <span className="text-[10px] text-slate-500">Speech not supported in browser</span>
                            )}
                          </div>
                          <div className="flex justify-between text-[11px] flex-1 sm:flex-initial">
                            <span className="text-slate-700 hidden sm:inline mr-2">Be detailed and specific</span>
                            <span className={`${(answers[index]?.answer?.length || 0) > 50 ? "text-emerald-600" : "text-slate-700"}`}>
                              {answers[index]?.answer?.length || 0} chars
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {mode !== "text" && (
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      disabled={currentQuestion === 0}
                      onClick={() => goToQuestion(currentQuestion - 1)}
                      className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </button>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {questions.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => goToQuestion(index)}
                          aria-label={`Go to question ${index + 1}`}
                          className={`h-2.5 rounded-full transition-all ${
                            index === currentQuestion
                              ? "w-7 bg-blue-500"
                              : answers[index]?.answer?.trim()
                              ? "w-2.5 bg-emerald-500"
                              : "w-2.5 bg-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      disabled={currentQuestion === questions.length - 1}
                      onClick={() => goToQuestion(currentQuestion + 1)}
                      className="flex items-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-300 transition-all hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Submit button */}
                <div className="mt-6 space-y-3">
                  {answered < questions.length && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-xs text-amber-400 text-center"
                      style={{animation:"fadeIn 0.3s ease-out both"}}>
                      ⚠️ {questions.length - answered} question{questions.length - answered !== 1 ? "s" : ""} unanswered — you can still submit
                    </div>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={step === "submitting"}
                    className="btn-primary w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 disabled:opacity-70 disabled:cursor-not-allowed sm:py-3.5"
                  >
                    <Send className="h-5 w-5" />
                    Submit Interview
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════
                STEP 2.5 — Submitting loader
            ══════════════════════════════════ */}
            {step === "submitting" && (
              <div className="flex flex-col items-center justify-center py-24 text-center"
                style={{animation:"fadeIn 0.4s ease-out both"}}>
                <div className="relative mb-6">
                  <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl shadow-blue-500/40"
                    style={{animation:"pulse 1.2s ease-in-out infinite"}}>
                    <Brain className="h-9 w-9 text-white" />
                  </div>
                  <div className="absolute -right-1 -top-1 h-5 w-5 rounded-full border-2 border-slate-950 bg-gradient-to-br from-blue-400 to-indigo-500"
                    style={{animation:"pulse 0.8s ease-in-out infinite"}} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Evaluating Your Answers</h2>
                <p className="text-sm text-slate-500 mb-6">AI is analyzing your responses…</p>
                <div className="flex items-center gap-1.5">
                  {[0,.15,.3].map((d,i) => (
                    <div key={i} className="h-2 w-2 rounded-full bg-blue-500" style={{animation:`pulse 0.9s ease-in-out ${d}s infinite`}} />
                  ))}
                </div>
              </div>
            )}

            {/* ══════════════════════════════════
                STEP 3 — Results
            ══════════════════════════════════ */}
            {step === "result" && result && (
              <div style={{animation:"slideUp 0.5s ease-out both"}}>
                {/* Header */}
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Trophy className="h-4 w-4 text-amber-400" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">Interview Complete</span>
                    </div>
                    <h1 className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                      Your Results
                    </h1>
                  </div>
                  <button onClick={handleReset}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs text-slate-400 transition-all hover:border-slate-600 hover:text-slate-200">
                    <RotateCcw className="h-3.5 w-3.5" /> New Interview
                  </button>
                </div>

                {/* Score hero card */}
                <div className={`card-lift relative overflow-hidden rounded-3xl border bg-gradient-to-br ${scoreBgCard(result.overallScore)} p-6 mb-5 sm:p-8`}
                  style={{animation:"bounceIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both"}}>
                  {/* bg glow */}
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-radial opacity-30`} />
                  <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                    <div style={{animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both"}}>
                      <ScoreRing score={result.overallScore} />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className={`text-3xl font-bold sm:text-4xl ${scoreColor(result.overallScore)}`}>
                        {scoreLabel(result.overallScore)}
                      </p>
                      <p className="mt-1.5 text-slate-400 text-sm sm:text-base">
                        {selectedType.label} Interview · {questions.length} Questions
                      </p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                        <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {result.strengths?.length || 0} Strengths
                        </div>
                        <div className="flex items-center gap-1.5 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-400">
                          <XCircle className="h-3.5 w-3.5" />
                          {result.weaknesses?.length || 0} Weaknesses
                        </div>
                        <div className="flex items-center gap-1.5 rounded-xl border border-blue-500/25 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
                          <Lightbulb className="h-3.5 w-3.5" />
                          {result.suggestions?.length || 0} Tips
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strengths */}
                {result.strengths?.length > 0 && (
                  <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 to-slate-950 p-4 sm:p-5"
                    style={{animation:"cardIn 0.4s ease-out 0.15s both"}}>
                    <div className="mb-3 flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <h3 className="font-bold text-emerald-400">Strengths</h3>
                    </div>
                    <div className="space-y-2">
                      {result.strengths.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-3 py-2.5"
                          style={{animation:`cardIn 0.35s ease-out ${0.2+i*0.06}s both`}}>
                          <span className="mt-0.5 shrink-0 text-emerald-400">✅</span>
                          <p className="text-sm text-slate-300 leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weaknesses */}
                {result.weaknesses?.length > 0 && (
                  <div className="mb-4 rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-950/40 to-slate-950 p-4 sm:p-5"
                    style={{animation:"cardIn 0.4s ease-out 0.25s both"}}>
                    <div className="mb-3 flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-xl bg-rose-500/20 text-rose-400">
                        <XCircle className="h-4 w-4" />
                      </div>
                      <h3 className="font-bold text-rose-400">Areas to Improve</h3>
                    </div>
                    <div className="space-y-2">
                      {result.weaknesses.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 rounded-xl border border-rose-500/10 bg-rose-500/5 px-3 py-2.5"
                          style={{animation:`cardIn 0.35s ease-out ${0.3+i*0.06}s both`}}>
                          <span className="mt-0.5 shrink-0 text-rose-400">❌</span>
                          <p className="text-sm text-slate-300 leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {result.suggestions?.length > 0 && (
                  <div className="mb-6 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-slate-950 p-4 sm:p-5"
                    style={{animation:"cardIn 0.4s ease-out 0.35s both"}}>
                    <div className="mb-3 flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-500/20 text-blue-400">
                        <Lightbulb className="h-4 w-4" />
                      </div>
                      <h3 className="font-bold text-blue-400">Suggestions</h3>
                    </div>
                    <div className="space-y-2">
                      {result.suggestions.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 rounded-xl border border-blue-500/10 bg-blue-500/5 px-3 py-2.5"
                          style={{animation:`cardIn 0.35s ease-out ${0.4+i*0.06}s both`}}>
                          <span className="mt-0.5 shrink-0 text-blue-400">💡</span>
                          <p className="text-sm text-slate-300 leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recordedVideoUrl && (
                  <div className="mb-6 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4 sm:p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Video className="h-4 w-4 text-cyan-400" />
                      <h3 className="font-bold text-cyan-300">Interview Recording</h3>
                    </div>
                    <video src={recordedVideoUrl} controls className="w-full rounded-xl bg-black" />
                    <a
                      href={recordedVideoUrl}
                      download={`hiremind-${type}-${difficulty}-interview.webm`}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500"
                    >
                      <Download className="h-4 w-4" />
                      Download Recording
                    </a>
                  </div>
                )}

                {/* Try again button */}
                <button onClick={handleReset}
                  className="btn-primary w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 sm:py-3.5"
                  style={{animation:"slideUp 0.4s ease-out 0.5s both"}}>
                  <RotateCcw className="h-5 w-5" />
                  Try Another Interview
                </button>
              </div>
            )}

          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Interview;
