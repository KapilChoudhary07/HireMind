


import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FileText, User, LogOut,
  Brain, History, Menu, X, ChevronRight, Sparkles,
  MessageSquare,
} from "lucide-react";
import api from "../../services/api";
import { clearToken } from "../../utils/auth";

const NAV_ITEMS = [
  { to: "/dashboard",         icon: LayoutDashboard, label: "Dashboard"         },
  { to: "/resume",            icon: FileText,        label: "Resume"            },
  { to: "/interview",         icon: Brain,           label: "AI Interview"      },
  { to: "/interview-history", icon: History,         label: "Interview History" },
  { to: "/profile",           icon: User,            label: "Profile"           },
];


const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  // prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Fetch user profile to check role
  useEffect(() => {
    api.get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  const isActive = (to) =>
    to === "/dashboard"
      ? location.pathname === to
      : location.pathname.startsWith(to);

  const navItems = [
    ...NAV_ITEMS,
    ...(user?.role === "admin"
      ? [{ to: "/admin/messages", icon: MessageSquare, label: "Complaints" }]
      : [])
  ];

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* ── Logo row ── */}
      <div className="flex items-center justify-between px-5 pt-6 pb-3">
        <Link to="/dashboard" className="group flex items-center gap-2" onClick={() => setOpen(false)}>
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/30 transition-transform group-hover:scale-110">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white">HireMind</span>
        </Link>
        {/* Close button — only on mobile */}
        <button
          onClick={() => setOpen(false)}
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-slate-800 hover:text-white lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Divider */}
      <div className="mx-5 mb-2 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />

      <p className="px-5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
        Navigation
      </p>

      {/* ── Nav links ── */}
      <nav className="flex flex-col gap-0.5 px-3">
        {navItems.map((item, idx) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150
                border-l-2
                ${active
                  ? "border-blue-500 bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-blue-400"
                  : "border-transparent text-slate-400 hover:border-slate-600 hover:bg-slate-800/70 hover:text-slate-100 hover:translate-x-0.5"
                }`}
              style={{ animationDelay: `${idx * 0.06}s` }}
            >
              <item.icon className={`h-5 w-5 shrink-0 transition-colors ${active ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5 text-blue-400/60" />}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      {/* ── Pro banner ── */}
      <div className="mx-3 mb-4 overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/60 to-indigo-950/40 p-4">
        <div className="mb-1.5 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-semibold text-blue-300">HireMind Pro</span>
        </div>
        <p className="mb-3 text-[11px] leading-relaxed text-slate-400">
          Unlock unlimited interviews, AI feedback & analytics.
        </p>
        <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:brightness-110 active:scale-[0.97]">
          Upgrade to Pro
        </button>
      </div>

      {/* Divider */}
      <div className="mx-5 mb-3 h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />

      {/* ── Logout ── */}
      <div className="px-3 pb-5">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-red-600/80 to-rose-600/80 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-900/30 transition-all hover:from-red-500 hover:to-rose-500 hover:-translate-y-0.5 hover:shadow-red-500/30 active:scale-[0.97]"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ══════════════════════════════════
          MOBILE — hamburger + drawer
      ══════════════════════════════════ */}

      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-xl border border-slate-700/80 bg-slate-900/95 text-slate-300 shadow-lg backdrop-blur transition-all hover:bg-slate-800 hover:text-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Dark backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />

      {/* Slide-in drawer (mobile) */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-slate-800/80 bg-slate-950 shadow-2xl
          transform transition-transform duration-300 ease-in-out
          lg:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {renderSidebarContent()}
      </aside>

      {/* ══════════════════════════════════
          DESKTOP — always-visible sidebar
      ══════════════════════════════════ */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-slate-800/80 bg-slate-950 shadow-xl lg:block">
        {renderSidebarContent()}
      </aside>

      {/* Desktop content spacer */}
      <div className="hidden lg:block lg:w-64 lg:shrink-0" />
    </>
  );
};

export default Sidebar;
