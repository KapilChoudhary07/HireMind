
import MainLayout from "../layouts/MainLayout";
import { useState } from "react";
import api from "../services/api";
import { Mail, User, MessageSquare, FileText, Send, CheckCircle2, AlertCircle, Loader2, MapPin, Clock } from "lucide-react";

const Toast = ({ msg, type }) => (
  <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur
    ${type === "success" ? "border-emerald-500/30 bg-slate-900/95 text-emerald-400" : "border-rose-500/30 bg-slate-900/95 text-rose-400"}`}
    style={{animation:"slideUpToast 0.35s cubic-bezier(0.34,1.56,0.64,1) both"}}>
    {type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
    {msg}
  </div>
);

const inputCls = "w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition-all focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/15";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending,  setSending]  = useState(false);
  const [toast,    setToast]    = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast("Please fill in all required fields.", "error"); return;
    }
    setSending(true);
    try {
      await api.post("/contact", formData);
      showToast("Message sent! We'll get back to you soon 🎉");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      showToast("Failed to send. Please try again.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideUp      { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cardIn       { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes floatGlow    { 0%,100%{opacity:0.2;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.1)} }
        @keyframes slideUpToast { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .send-btn { transition:all .18s ease; }
        .send-btn:hover { transform:translateY(-1px); box-shadow:0 6px 24px rgba(59,130,246,0.35); }
        .send-btn:active { transform:scale(0.97); }
        .field-glow:focus { box-shadow:0 0 0 2px rgba(59,130,246,0.2); }
      `}</style>

      <MainLayout>
        <div className="relative min-h-screen">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-600/7 blur-3xl" style={{animation:"floatGlow 6s ease-in-out infinite"}} />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-purple-600/6 blur-3xl" style={{animation:"floatGlow 8s ease-in-out 2s infinite"}} />
          </div>

          <div className="relative pb-12 pt-16 lg:pt-0">

            {/* Header */}
            <div className="mb-8" style={{animation:"slideUp 0.4s ease-out both"}}>
              <div className="flex items-center gap-3 mb-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/15 text-blue-400">
                  <Mail className="h-5 w-5" />
                </div>
                <h1 className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                  Contact Us
                </h1>
              </div>
              <p className="pl-12 text-sm text-slate-500">We'd love to hear from you. Send us a message!</p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

              {/* Info cards */}
              <div className="space-y-4 lg:col-span-1" style={{animation:"cardIn 0.4s ease-out 0.06s both"}}>
                {[
                  { icon: <Mail className="h-5 w-5" />,    color: "bg-blue-500/15 text-blue-400",    title: "Email Us",          body: "support@hiremind.ai" },
                  { icon: <Clock className="h-5 w-5" />,   color: "bg-emerald-500/15 text-emerald-400", title: "Response Time",  body: "Within 24–48 hours" },
                  { icon: <MapPin className="h-5 w-5" />,  color: "bg-purple-500/15 text-purple-400", title: "Based In",          body: "India 🇮🇳" },
                ].map((item, i) => (
                  <div key={item.title}
                    className="flex items-start gap-3.5 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 backdrop-blur"
                    style={{animation:`cardIn 0.35s ease-out ${0.1+i*0.08}s both`}}>
                    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">{item.title}</p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-300">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form */}
              <div className="lg:col-span-2" style={{animation:"cardIn 0.4s ease-out 0.1s both"}}>
                <div className="rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-900/90 to-slate-950 p-5 backdrop-blur sm:p-7">
                  <h2 className="mb-5 font-bold text-white flex items-center gap-2.5">
                    <MessageSquare className="h-4 w-4 text-blue-400" /> Send a Message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs text-slate-500">Full Name *</label>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                          <input type="text" placeholder="John Doe"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className={`${inputCls} field-glow pl-10`} />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs text-slate-500">Email Address *</label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                          <input type="email" placeholder="you@example.com"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className={`${inputCls} field-glow pl-10`} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs text-slate-500">Subject</label>
                      <div className="relative">
                        <FileText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
                        <input type="text" placeholder="How can we help?"
                          value={formData.subject}
                          onChange={e => setFormData({...formData, subject: e.target.value})}
                          className={`${inputCls} field-glow pl-10`} />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs text-slate-500">Message *</label>
                      <textarea rows={5} placeholder="Write your message here…"
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        className={`${inputCls} field-glow resize-none`} />
                    </div>

                    <button type="submit" disabled={sending}
                      className="send-btn w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed">
                      {sending
                        ? <><Loader2 className="h-4 w-4" style={{animation:"spin 1s linear infinite"}} /> Sending…</>
                        : <><Send className="h-4 w-4" /> Send Message</>}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
};

export default Contact;