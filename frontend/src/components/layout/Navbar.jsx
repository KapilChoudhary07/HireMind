

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { clearToken } from "../../utils/auth";
import {
  LogOut, Bell, ChevronDown, Sparkles,
  LayoutDashboard, FileText, Brain, History,
  User, X, CheckCheck, Trophy, Upload, Inbox,
} from "lucide-react";

const PAGE_TITLES = {
  "/dashboard":         { label: "Dashboard",         icon: <LayoutDashboard className="h-4 w-4" /> },
  "/resume":            { label: "Resume Manager",    icon: <FileText className="h-4 w-4" /> },
  "/interview":         { label: "AI Interview",      icon: <Brain className="h-4 w-4" /> },
  "/interview-history": { label: "Interview History", icon: <History className="h-4 w-4" /> },
  "/profile":           { label: "My Profile",        icon: <User className="h-4 w-4" /> },
};

let cachedNavbarUser = null;

const Navbar = () => {
  const navigate     = useNavigate();
  const location     = useLocation();
  const [user,        setUser]        = useState(() => cachedNavbarUser);
  const [dropOpen,    setDropOpen]    = useState(false);
  const [bellOpen,    setBellOpen]    = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationClock] = useState(() => Date.now());

  useEffect(() => {
    Promise.all([
      api.get("/auth/me"),
      api.get("/dashboard/stats").catch(() => ({ data: { stats: {} } })),
    ])
      .then(([userResponse, statsResponse]) => {
        const currentUser = userResponse.data.user;
        const stats = statsResponse.data.stats || {};
        const storageKey = `hiremind-read-notifications-${currentUser._id}`;
        const readIds = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const items = [
          ...(stats.recentInterviews || []).slice(0, 3).map((interview) => ({
            id: `interview-${interview._id}`,
            title: "Interview completed",
            message: `${interview.interviewType || "AI"} interview score: ${interview.overallScore || 0}%`,
            href: `/interview/${interview._id}`,
            createdAt: interview.createdAt,
            type: "interview",
          })),
          ...(stats.recentResumes || []).slice(0, 2).map((resume) => ({
            id: `resume-${resume._id}`,
            title: "Resume uploaded",
            message: resume.fileName || "Your resume is ready for analysis.",
            href: "/resume",
            createdAt: resume.createdAt,
            type: "resume",
          })),
          {
            id: "practice-reminder",
            title: "Ready for practice?",
            message: "Try a voice or video interview to improve your confidence.",
            href: "/interview",
            createdAt: new Date().toISOString(),
            type: "practice",
          },
        ];

        cachedNavbarUser = currentUser;
        setUser(currentUser);
        setNotifications(items.map((item) => ({
          ...item,
          read: readIds.includes(item.id),
        })));
      })
      .catch(() => {});
  }, []);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const saveReadNotifications = (items) => {
    if (!user?._id) return;
    const readIds = items.filter((item) => item.read).map((item) => item.id);
    localStorage.setItem(
      `hiremind-read-notifications-${user._id}`,
      JSON.stringify(readIds)
    );
  };

  const markAllRead = () => {
    const updated = notifications.map((item) => ({ ...item, read: true }));
    setNotifications(updated);
    saveReadNotifications(updated);
  };

  const openNotification = (notification) => {
    const updated = notifications.map((item) => (
      item.id === notification.id ? { ...item, read: true } : item
    ));
    setNotifications(updated);
    saveReadNotifications(updated);
    setBellOpen(false);
    navigate(notification.href);
  };

  const getTimeAgo = (date) => {
    if (!date) return "Recently";
    const seconds = Math.max(1, Math.floor((notificationClock - new Date(date).getTime()) / 1000));
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const notificationIcon = (type) => {
    if (type === "interview") return <Trophy className="h-4 w-4" />;
    if (type === "resume") return <Upload className="h-4 w-4" />;
    return <Brain className="h-4 w-4" />;
  };

  const handleLogout = () => {
    cachedNavbarUser = null;
    clearToken();
    navigate("/login", { replace: true });
  };

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const page = PAGE_TITLES[location.pathname] || { label: "HireMind", icon: <Sparkles className="h-4 w-4" /> };

  return (
    <>
      <style>{`
        @keyframes fadeIn       { from{opacity:0} to{opacity:1} }
        @keyframes slideDown    { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn        { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }
        @keyframes slideUpModal { from{opacity:0;transform:translateY(16px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .nav-btn  { transition:all .15s ease; }
        .nav-btn:hover  { background:rgba(51,65,85,0.7); }
        .nav-btn:active { transform:scale(0.96); }
        .drop-item { transition:background .12s ease; }
        .drop-item:hover { background:rgba(30,41,59,0.9); }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl lg:relative lg:bg-slate-950/50">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">

          {/* Left */}
          <div className="flex items-center gap-2.5">
            {/* Mobile brand */}
            <div className="flex items-center gap-2 lg:hidden pl-12">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white text-base">HireMind</span>
            </div>
            {/* Desktop page title */}
            <div className="hidden items-center gap-2 lg:flex">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-800/80 text-slate-400">
                {page.icon}
              </div>
              <h1 className="text-base font-semibold text-white">{page.label}</h1>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setBellOpen((open) => !open);
                  setDropOpen(false);
                }}
                className="nav-btn relative grid h-9 w-9 place-items-center rounded-xl bg-slate-800/60 text-slate-400 hover:text-white"
                aria-label="Open notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span
                    className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white ring-2 ring-slate-950"
                    style={{animation:"popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both"}}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {bellOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setBellOpen(false)} />
                  <div
                    className="absolute right-0 top-12 z-20 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/95 shadow-2xl backdrop-blur"
                    style={{animation:"slideDown 0.2s ease-out both"}}
                  >
                    <div className="flex items-center justify-between border-b border-slate-800/70 px-4 py-3">
                      <div>
                        <p className="text-sm font-bold text-white">Notifications</p>
                        <p className="text-xs text-slate-500">{unreadCount} unread</p>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/10"
                        >
                          <CheckCheck className="h-3.5 w-3.5" />
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto py-1.5">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center px-5 py-10 text-center">
                          <Inbox className="mb-2 h-8 w-8 text-slate-700" />
                          <p className="text-sm font-medium text-slate-400">No notifications yet</p>
                        </div>
                      ) : notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => openNotification(notification)}
                          className={`flex w-full gap-3 border-l-2 px-4 py-3 text-left transition-colors hover:bg-slate-800/70 ${
                            notification.read
                              ? "border-transparent"
                              : "border-blue-500 bg-blue-500/5"
                          }`}
                        >
                          <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                            notification.type === "interview"
                              ? "bg-amber-500/15 text-amber-400"
                              : notification.type === "resume"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-blue-500/15 text-blue-400"
                          }`}>
                            {notificationIcon(notification.type)}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2">
                              <span className={`truncate text-sm ${notification.read ? "font-medium text-slate-300" : "font-semibold text-white"}`}>
                                {notification.title}
                              </span>
                              {!notification.read && <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
                            </span>
                            <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-slate-500">
                              {notification.message}
                            </span>
                            <span className="mt-1 block text-[10px] text-slate-600">
                              {getTimeAgo(notification.createdAt)}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Avatar dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setDropOpen((open) => !open);
                  setBellOpen(false);
                }}
                className="nav-btn flex items-center gap-2 rounded-xl border border-slate-800/60 bg-slate-800/50 px-2.5 py-1.5 hover:border-slate-700">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-md shadow-blue-500/25">
                  {initials}
                </div>
                <span className="hidden text-sm font-medium text-slate-300 sm:block max-w-[100px] truncate">
                  {user?.name?.split(" ")[0] || ""}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`} />
              </button>

              {dropOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
                  <div className="absolute right-0 top-12 z-20 w-52 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/95 shadow-2xl backdrop-blur"
                    style={{animation:"slideDown 0.2s ease-out both"}}>
                    <div className="border-b border-slate-800/60 px-4 py-3">
                      <p className="text-sm font-semibold text-white truncate">{user?.name || "User"}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email || ""}</p>
                    </div>
                    <div className="py-1.5">
                      {[
                        { label: "My Profile",  icon: <User className="h-3.5 w-3.5" />,            href: "/profile"   },
                        { label: "Dashboard",   icon: <LayoutDashboard className="h-3.5 w-3.5" />, href: "/dashboard" },
                        ...(user?.role === "admin" ? [{ label: "Complaints", icon: <Bell className="h-3.5 w-3.5" />, href: "/admin/messages" }] : [])
                      ].map(item => (
                        <button key={item.href}
                          onClick={() => { navigate(item.href); setDropOpen(false); }}
                          className="drop-item flex w-full items-center gap-2.5 px-4 py-2 text-sm text-slate-300">
                          <span className="text-slate-500">{item.icon}</span>
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-slate-800/60 p-1.5">
                      <button
                        onClick={() => { setDropOpen(false); setLogoutModal(true); }}
                        className="drop-item flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/10">
                        <LogOut className="h-3.5 w-3.5" />
                        Log Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Logout modal */}
      {logoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          style={{animation:"fadeIn 0.2s ease-out both"}}>
          <div className="relative w-full max-w-sm rounded-3xl border border-slate-800/80 bg-slate-900/95 p-6 shadow-2xl"
            style={{animation:"slideUpModal 0.3s cubic-bezier(0.34,1.56,0.64,1) both"}}>
            <button onClick={() => setLogoutModal(false)}
              className="absolute top-4 right-4 grid h-7 w-7 place-items-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-400 mx-auto">
              <LogOut className="h-6 w-6" />
            </div>
            <h3 className="text-center text-lg font-bold text-white mb-1">Log Out?</h3>
            <p className="text-center text-sm text-slate-500 mb-6">You'll need to log in again to access your account.</p>
            <div className="flex gap-3">
              <button onClick={() => setLogoutModal(false)}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800/60 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700/60">
                Cancel
              </button>
              <button onClick={handleLogout}
                className="flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:brightness-110">
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
