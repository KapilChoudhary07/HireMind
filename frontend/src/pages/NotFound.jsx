

import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => (
  <>
    <style>{`
      @keyframes slideUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      @keyframes floatNum  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      @keyframes floatGlow { 0%,100%{opacity:0.15;transform:scale(1)} 50%{opacity:0.35;transform:scale(1.1)} }
      .btn-home { transition:all .18s ease; }
      .btn-home:hover { transform:translateY(-2px); box-shadow:0 6px 24px rgba(59,130,246,0.35); }
    `}</style>
    <MainLayout>
      <div className="relative flex min-h-[80vh] flex-col items-center justify-center py-20 pt-20 lg:pt-4">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/6 blur-3xl" style={{animation:"floatGlow 6s ease-in-out infinite"}} />
        </div>

        <div className="relative text-center">
          {/* 404 big number */}
          <div style={{animation:"floatNum 3s ease-in-out infinite"}}>
            <h1 className="bg-gradient-to-b from-slate-200 via-slate-400 to-slate-700 bg-clip-text text-[8rem] font-black leading-none text-transparent sm:text-[12rem]">
              404
            </h1>
          </div>

          {/* Divider */}
          <div className="mx-auto my-6 h-px w-32 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

          <h2 className="mb-2 text-2xl font-bold text-white" style={{animation:"slideUp 0.4s ease-out 0.1s both"}}>
            Page Not Found
          </h2>
          <p className="mb-8 text-sm text-slate-500 max-w-sm mx-auto" style={{animation:"slideUp 0.4s ease-out 0.18s both"}}>
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center" style={{animation:"slideUp 0.4s ease-out 0.26s both"}}>
            <Link to="/dashboard"
              className="btn-home flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20">
              <Home className="h-4 w-4" /> Go to Dashboard
            </Link>
            <button onClick={() => window.history.back()}
              className="flex items-center gap-2 rounded-2xl border border-slate-700/60 bg-slate-800/60 px-6 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700/60">
              <ArrowLeft className="h-4 w-4" /> Go Back
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  </>
);

export default NotFound;