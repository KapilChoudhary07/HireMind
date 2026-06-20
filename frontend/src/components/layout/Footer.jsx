
import { Sparkles, Heart, GitBranch, Share2, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const LINKS = [
  {
    heading: "Product",
    items: [
      { label: "Dashboard",  href: "/dashboard" },
      { label: "Interviews", href: "/interview" },
      { label: "Resume",     href: "/resume" },
      { label: "History",    href: "/interview-history" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About",   href: "/about" },
      { label: "FAQ",     href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use",   href: "/terms" },
    ],
  },
];

const Footer = () => (
  <>
    <style>{`
      @keyframes floatGlow { 0%,100%{opacity:0.15;transform:scale(1)} 50%{opacity:0.3;transform:scale(1.1)} }
      @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.4} }
      .footer-link { transition:color .15s ease; }
      .footer-link:hover { color:rgb(148,163,184); }
      .social-btn { transition:all .15s ease; }
      .social-btn:hover { transform:translateY(-2px); background:rgba(51,65,85,0.8)!important; color:white!important; }
    `}</style>

    <footer className="relative mt-16 overflow-hidden border-t border-slate-800/60 bg-slate-950/80 backdrop-blur">

      {/* Gradient top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-40 w-96 rounded-full bg-blue-600/6 blur-3xl"
          style={{animation:"floatGlow 7s ease-in-out infinite"}} />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-12 pb-8">

        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 mb-10">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">HireMind</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-[200px]">
              AI-powered interview practice to land your dream job faster.
            </p>
            <div className="mt-4 flex gap-2">
              {[
                { icon: <GitBranch className="h-4 w-4" />, href: "#" },
                { icon: <Share2    className="h-4 w-4" />, href: "#" },
                { icon: <Globe     className="h-4 w-4" />, href: "#" },
              ].map((s, i) => (
                <a key={i} href={s.href}
                  className="social-btn grid h-8 w-8 place-items-center rounded-xl border border-slate-800/80 bg-slate-900/60 text-slate-500">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {LINKS.map((col) => (
            <div key={col.heading}>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                {col.heading}
              </p>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className="footer-link text-sm text-slate-500">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-6" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-slate-600">© 2026 HireMind. All Rights Reserved.</p>
          <p className="flex items-center gap-1.5 text-xs text-slate-700">
            Built with <Heart className="h-3 w-3 text-rose-500/70" fill="currentColor" /> for job seekers
          </p>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" style={{animation:"pulse 2s ease-in-out infinite"}} />
            <span className="text-xs text-slate-600">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;