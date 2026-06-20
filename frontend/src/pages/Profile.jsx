import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  GitBranch,
  Globe,
  GraduationCap,
  Briefcase,
  Edit3,
  Save,
  X,
  Plus,
  CheckCircle2,
  Sparkles,
  Code2,
  Building2,
  Calendar,
  ExternalLink,
  Shield,
  ChevronRight,
  Loader2,
} from "lucide-react";

const COMPLETION_ITEMS = [
  { key: "name", label: "Name", pts: 15, check: (u) => !!u?.name },
  { key: "bio", label: "Bio", pts: 15, check: (u) => !!u?.bio },
  {
    key: "skills",
    label: "Skills",
    pts: 15,
    check: (u) => u?.skills?.length > 0,
  },
  {
    key: "education",
    label: "Education",
    pts: 15,
    check: (u) => u?.education?.length > 0,
  },
  {
    key: "experience",
    label: "Experience",
    pts: 15,
    check: (u) => u?.experience?.length > 0,
  },
  { key: "github", label: "GitHub", pts: 12, check: (u) => !!u?.github },
  { key: "linkedin", label: "LinkedIn", pts: 13, check: (u) => !!u?.linkedin },
];

const CompletionRing = ({ pct }) => {
  const r = 44,
    circ = 2 * Math.PI * r;
  const dash = circ - (circ * pct) / 100;
  const color = pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#3b82f6";
  return (
    <div className="relative grid h-28 w-28 place-items-center sm:h-32 sm:w-32">
      <svg className="-rotate-90" width="128" height="128">
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="rgba(30,41,59,0.9)"
          strokeWidth="8"
        />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          strokeLinecap="round"
          style={{
            transition:
              "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s",
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-white sm:text-3xl">
          {pct}%
        </span>
        <span className="text-[10px] text-slate-500">complete</span>
      </div>
    </div>
  );
};

const Avatar = ({ name }) => {
  const initials =
    name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";
  return (
    <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white shadow-xl shadow-blue-500/30 sm:h-24 sm:w-24 sm:text-3xl">
      {initials}
    </div>
  );
};

const Toast = ({ msg, type }) => (
  <div
    className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur
    ${type === "success" ? "border-emerald-500/30 bg-slate-900/95 text-emerald-400" : "border-rose-500/30 bg-slate-900/95 text-rose-400"}`}
    style={{
      animation: "slideUpToast 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
    }}
  >
    {type === "success" ? (
      <CheckCircle2 className="h-4 w-4" />
    ) : (
      <X className="h-4 w-4" />
    )}
    {msg}
  </div>
);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    github: "",
    linkedin: "",
    skills: [],
    college: "",
    degree: "",
    year: "",
    company: "",
    role: "",
    duration: "",
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => {
        const u = data.user;
        setUser(u);
        setFormData({
          name: u.name || "",
          bio: u.bio || "",
          github: u.github || "",
          linkedin: u.linkedin || "",
          skills: u.skills || [],
          college: u.education?.[0]?.college || "",
          degree: u.education?.[0]?.degree || "",
          year: u.education?.[0]?.year || "",
          company: u.experience?.[0]?.company || "",
          role: u.experience?.[0]?.role || "",
          duration: u.experience?.[0]?.duration || "",
        });
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const education = formData.college && formData.degree && formData.year
        ? [
            {
              college: formData.college,
              degree: formData.degree,
              year: formData.year,
            },
          ]
        : [];
      const experience = formData.company && formData.role && formData.duration
        ? [
            {
              company: formData.company,
              role: formData.role,
              duration: formData.duration,
            },
          ]
        : [];

      await api.put("/auth/update-profile", {
        bio: formData.bio,
        github: formData.github,
        linkedin: formData.linkedin,
        skills: formData.skills,
        education,
        experience,
      });
      showToast("Profile updated successfully!");
      setEditMode(false);
      setUser((prev) => ({
        ...prev,
        ...formData,
        skills: formData.skills,
        education,
        experience,
      }));
    } catch {
      showToast("Failed to save. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !formData.skills.includes(s))
      setFormData((f) => ({ ...f, skills: [...f.skills, s] }));
    setSkillInput("");
  };
  const removeSkill = (sk) =>
    setFormData((f) => ({ ...f, skills: f.skills.filter((x) => x !== sk) }));

  const completion = COMPLETION_ITEMS.reduce(
    (acc, item) => acc + (item.check(user) ? item.pts : 0),
    0,
  );
  const completionColor =
    completion >= 80
      ? "text-emerald-400"
      : completion >= 50
        ? "text-amber-400"
        : "text-blue-400";

  const inputCls =
    "w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/15";

  if (!user)
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-16 lg:pt-0">
          <Loader2
            className="h-8 w-8 text-blue-400"
            style={{ animation: "spin 1s linear infinite" }}
          />
          <p className="text-sm text-slate-500">Loading profile…</p>
        </div>
      </MainLayout>
    );

  return (
    <>
      <style>{`
        @keyframes slideUp      { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn       { from{opacity:0} to{opacity:1} }
        @keyframes cardIn       { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes popIn        { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }
        @keyframes floatGlow    { 0%,100%{opacity:0.25;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.1)} }
        @keyframes spin         { to{transform:rotate(360deg)} }
        @keyframes slideUpToast { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .field-glow:focus { box-shadow:0 0 0 2px rgba(59,130,246,0.25); }
        .btn-save { transition:all .18s ease; }
        .btn-save:hover { transform:translateY(-1px); box-shadow:0 6px 24px rgba(16,185,129,0.35); }
        .btn-save:active { transform:scale(0.97); }
        .skill-chip { transition:all .15s ease; }
        .skill-chip:hover { transform:scale(1.04); }
        .section-card { transition:border-color .2s ease, box-shadow .2s ease; }
        .section-card:hover { border-color:rgba(71,85,105,0.8); }
      `}</style>

      <MainLayout>
        <div className="relative min-h-screen">
          {/* Ambient glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-600/8 blur-3xl"
              style={{ animation: "floatGlow 6s ease-in-out infinite" }}
            />
            <div
              className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-600/8 blur-3xl"
              style={{ animation: "floatGlow 7s ease-in-out 2s infinite" }}
            />
          </div>

          <div className="relative pb-12 pt-16 lg:pt-0">
            {/* Header */}
            <div
              className="mb-6 flex flex-wrap items-center justify-between gap-3"
              style={{ animation: "slideUp 0.4s ease-out both" }}
            >
              <div>
                <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                  My Profile
                </h1>
                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  Manage your personal information & career details
                </p>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all
                  ${
                    editMode
                      ? "border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60"
                      : "border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                  }`}
              >
                {editMode ? (
                  <>
                    <X className="h-4 w-4" /> Cancel
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" /> Edit Profile
                  </>
                )}
              </button>
            </div>

            {/* Hero card */}
            <div
              className="mb-5 overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 p-5 backdrop-blur sm:p-7"
              style={{ animation: "cardIn 0.4s ease-out 0.05s both" }}
            >
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                {/* Avatar */}
                <div className="relative">
                  <Avatar name={user?.name} />
                  <div
                    className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-slate-950 bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md"
                    style={{
                      animation:
                        "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.4s both",
                    }}
                  >
                    <Shield className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>

                {/* Name + bio + links */}
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    {user?.name || "Your Name"}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    {user?.bio || "No bio added yet."}
                  </p>

                  <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                    {user?.github && (
                      <a
                        href={user.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-slate-600 hover:text-white"
                      >
                        <GitBranch className="h-3.5 w-3.5" /> GitHub{""}
                        <ExternalLink className="h-3 w-3 text-slate-500" />
                      </a>
                    )}
                    {user?.linkedin && (
                      <a
                        href={user.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/25 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 transition-all hover:bg-blue-500/20"
                      >
                        <Globe className="h-3.5 w-3.5" /> LinkedIn{" "}
                        <ExternalLink className="h-3 w-3 text-blue-400/50" />
                      </a>
                    )}
                    {user?.email && (
                      <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-1.5 text-xs text-slate-500">
                        {user.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Completion ring */}
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <CompletionRing pct={Math.round(completion)} />
                  <span className={`text-xs font-semibold ${completionColor}`}>
                    {completion >= 80
                      ? "Profile Ready 🎯"
                      : completion >= 50
                        ? "Almost There 👍"
                        : "Keep Filling 📝"}
                  </span>
                </div>
              </div>

              {/* Checklist */}
              <div className="mt-5 grid grid-cols-2 gap-1.5 border-t border-slate-800/60 pt-5 sm:grid-cols-4">
                {COMPLETION_ITEMS.map((item) => {
                  const done = item.check(user);
                  return (
                    <div
                      key={item.key}
                      className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs
                        ${done ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800/40 text-slate-600"}`}
                    >
                      <div
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${done ? "bg-emerald-400" : "bg-slate-700"}`}
                      />
                      {item.label}
                      <span className="ml-auto font-medium">{item.pts}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ══ EDIT FORM ══ */}
            {editMode && (
              <div
                className="mb-5 overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/30 to-slate-950 p-5 backdrop-blur sm:p-7"
                style={{ animation: "slideUp 0.35s ease-out both" }}
              >
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/20 text-blue-400">
                    <Edit3 className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-bold text-white">
                    Edit Information
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Basic info */}
                  <div>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                      Basic Info
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs text-slate-500">
                          Bio
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Tell us about yourself…"
                          value={formData.bio}
                          onChange={(e) =>
                            setFormData((f) => ({ ...f, bio: e.target.value }))
                          }
                          className={`${inputCls} field-glow resize-none`}
                        />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="mb-1.5 block text-xs text-slate-500">
                            GitHub URL
                          </label>
                          <div className="relative">
                            <GitBranch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                            <input
                              type="text"
                              placeholder="https://github.com/username"
                              value={formData.github}
                              onChange={(e) =>
                                setFormData((f) => ({
                                  ...f,
                                  github: e.target.value,
                                }))
                              }
                              className={`${inputCls} field-glow pl-10`}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs text-slate-500">
                            LinkedIn URL
                          </label>
                          <div className="relative">
                            <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                            <input
                              type="text"
                              placeholder="https://linkedin.com/in/username"
                              value={formData.linkedin}
                              onChange={(e) =>
                                setFormData((f) => ({
                                  ...f,
                                  linkedin: e.target.value,
                                }))
                              }
                              className={`${inputCls} field-glow pl-10`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                      Skills
                    </p>
                    {formData.skills.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {formData.skills.map((sk) => (
                          <span
                            key={sk}
                            className="skill-chip inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300"
                          >
                            {sk}
                            <button
                              onClick={() => removeSkill(sk)}
                              className="text-blue-400/60 hover:text-rose-400"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a skill (e.g. React)"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        className={`${inputCls} field-glow flex-1`}
                      />
                      <button
                        onClick={addSkill}
                        className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-500 active:scale-95"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Add</span>
                      </button>
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-700">
                      Press Enter or click Add to add each skill
                    </p>
                  </div>

                  {/* Education */}
                  <div>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                      Education
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <label className="mb-1.5 block text-xs text-slate-500">
                          College / University
                        </label>
                        <input
                          type="text"
                          placeholder="MIT, IIT, etc."
                          value={formData.college}
                          onChange={(e) =>
                            setFormData((f) => ({
                              ...f,
                              college: e.target.value,
                            }))
                          }
                          className={`${inputCls} field-glow`}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs text-slate-500">
                          Degree
                        </label>
                        <input
                          type="text"
                          placeholder="B.Tech, MBA, etc."
                          value={formData.degree}
                          onChange={(e) =>
                            setFormData((f) => ({
                              ...f,
                              degree: e.target.value,
                            }))
                          }
                          className={`${inputCls} field-glow`}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs text-slate-500">
                          Graduation Year
                        </label>
                        <input
                          type="text"
                          placeholder="2025"
                          value={formData.year}
                          onChange={(e) =>
                            setFormData((f) => ({ ...f, year: e.target.value }))
                          }
                          className={`${inputCls} field-glow`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                      Experience
                    </p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <label className="mb-1.5 block text-xs text-slate-500">
                          Company
                        </label>
                        <input
                          type="text"
                          placeholder="Google, Startup, etc."
                          value={formData.company}
                          onChange={(e) =>
                            setFormData((f) => ({
                              ...f,
                              company: e.target.value,
                            }))
                          }
                          className={`${inputCls} field-glow`}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs text-slate-500">
                          Role
                        </label>
                        <input
                          type="text"
                          placeholder="Software Engineer"
                          value={formData.role}
                          onChange={(e) =>
                            setFormData((f) => ({ ...f, role: e.target.value }))
                          }
                          className={`${inputCls} field-glow`}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs text-slate-500">
                          Duration
                        </label>
                        <input
                          type="text"
                          placeholder="Jan 2023 – Present"
                          value={formData.duration}
                          onChange={(e) =>
                            setFormData((f) => ({
                              ...f,
                              duration: e.target.value,
                            }))
                          }
                          className={`${inputCls} field-glow`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save */}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-save w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 disabled:opacity-70"
                  >
                    {saving ? (
                      <>
                        <Loader2
                          className="h-5 w-5"
                          style={{ animation: "spin 1s linear infinite" }}
                        />{" "}
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* VIEW sections */}
            {!editMode && (
              <div className="space-y-4">
                {/* Skills */}
                <div
                  className="section-card rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/80 to-slate-950 p-5 backdrop-blur sm:p-6"
                  style={{ animation: "cardIn 0.4s ease-out 0.12s both" }}
                >
                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/15 text-blue-400">
                      <Code2 className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-white">Skills</h3>
                    <span className="ml-auto text-xs text-slate-600">
                      {user?.skills?.length || 0} skills
                    </span>
                  </div>
                  {user?.skills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((sk, i) => (
                        <span
                          key={sk}
                          className="skill-chip inline-flex items-center gap-1.5 rounded-full border border-blue-500/25 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-3 py-1 text-xs font-medium text-blue-300"
                          style={{
                            animation: `popIn 0.3s ease-out ${0.05 + i * 0.04}s both`,
                          }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                          {sk}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">
                      No skills added yet.{" "}
                      <button
                        onClick={() => setEditMode(true)}
                        className="text-blue-400 hover:underline"
                      >
                        Add skills →
                      </button>
                    </p>
                  )}
                </div>

                {/* Education */}
                <div
                  className="section-card rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/80 to-slate-950 p-5 backdrop-blur sm:p-6"
                  style={{ animation: "cardIn 0.4s ease-out 0.18s both" }}
                >
                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-purple-500/15 text-purple-400">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-white">Education</h3>
                  </div>
                  {user?.education?.[0]?.college ? (
                    <div className="flex items-start gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-2xl">
                        🎓
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {user.education[0].college}
                        </p>
                        <p className="text-sm text-slate-400">
                          {user.education[0].degree}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-600">
                          <Calendar className="h-3 w-3" />
                          {user.education[0].year}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">
                      No education added.{" "}
                      <button
                        onClick={() => setEditMode(true)}
                        className="text-blue-400 hover:underline"
                      >
                        Add education →
                      </button>
                    </p>
                  )}
                </div>

                {/* Experience */}
                <div
                  className="section-card rounded-2xl border border-slate-800/70 bg-gradient-to-br from-slate-900/80 to-slate-950 p-5 backdrop-blur sm:p-6"
                  style={{ animation: "cardIn 0.4s ease-out 0.24s both" }}
                >
                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/15 text-amber-400">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-white">Experience</h3>
                  </div>
                  {user?.experience?.[0]?.company ? (
                    <div className="flex items-start gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-2xl">
                        💼
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {user.experience[0].role}
                        </p>
                        <div className="flex items-center gap-1.5 text-sm text-slate-400">
                          <Building2 className="h-3.5 w-3.5" />
                          {user.experience[0].company}
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-600">
                          <Calendar className="h-3 w-3" />
                          {user.experience[0].duration}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">
                      No experience added.{" "}
                      <button
                        onClick={() => setEditMode(true)}
                        className="text-blue-400 hover:underline"
                      >
                        Add experience →
                      </button>
                    </p>
                  )}
                </div>

                {/* Quick actions */}
                <div
                  className="rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 p-4 sm:p-5"
                  style={{ animation: "cardIn 0.4s ease-out 0.3s both" }}
                >
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                    Quick Actions
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-3 text-sm text-slate-300 transition-all hover:border-blue-500/40 hover:bg-slate-800 hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <Edit3 className="h-4 w-4 text-blue-400" /> Edit Profile
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-600" />
                    </button>
                    <a
                      href="/interview"
                      className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-3 text-sm text-slate-300 transition-all hover:border-emerald-500/40 hover:bg-slate-800 hover:text-white"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-400" /> Start
                        Interview
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-600" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </MainLayout>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
};

export default Profile;


