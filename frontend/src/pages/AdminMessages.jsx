
import MainLayout from "../layouts/MainLayout";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import {
  Trash2, Mail, User, Clock, MessageSquare,
  Search, AlertTriangle, CheckCheck, Inbox,
} from "lucide-react";

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────
function DeleteModal({ onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="rounded-2xl p-6 max-w-sm w-full border"
        style={{ background: "#111113", borderColor: "rgba(239,68,68,0.3)" }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl" style={{ background: "rgba(239,68,68,0.15)" }}>
            <AlertTriangle size={18} style={{ color: "#ef4444" }} />
          </div>
          <h3 className="text-white font-bold">Delete Message?</h3>
        </div>
        <p className="text-white/50 text-sm mb-5">
          Yeh message permanently delete ho jayega. Undo nahi hoga.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/60 border border-white/10 hover:border-white/20 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Message Card ─────────────────────────────────────────────────────────────
function MessageCard({ item, index, onDelete }) {
  const [confirmId, setConfirmId] = useState(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ delay: index * 0.06, duration: 0.35 }}
        layout
        className="rounded-2xl p-5 border group"
        style={{
          background: "rgba(255,255,255,0.03)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare size={14} style={{ color: "#6366f1" }} />
              <h2 className="text-white font-bold text-sm leading-snug">
                {item.subject}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/40">
              <span className="flex items-center gap-1">
                <User size={11} />
                {item.name}
              </span>
              <span className="flex items-center gap-1">
                <Mail size={11} />
                {item.email}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setConfirmId(item._id)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all"
            style={{
              background: "rgba(239,68,68,0.12)",
              color: "#ef4444",
              border: "1px solid rgba(239,68,68,0.25)",
            }}
          >
            <Trash2 size={12} />
            Delete
          </motion.button>
        </div>

        {/* Divider */}
        <div className="h-px mb-3" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* Message body */}
        <p className="text-white/65 text-sm leading-relaxed">{item.message}</p>
      </motion.div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmId === item._id && (
          <DeleteModal
            onConfirm={() => { onDelete(item._id); setConfirmId(null); }}
            onCancel={() => setConfirmId(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get("/contact/all");
        setMessages(data.contacts);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/contact/${id}`);
      setMessages((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const filtered = messages.filter(
    (m) =>
      m.subject?.toLowerCase().includes(search.toLowerCase()) ||
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <div
        className="min-h-screen p-6 pt-8"
        style={{
          background:
            "radial-gradient(ellipse at 10% 0%, rgba(99,102,241,0.1) 0%, transparent 50%), #09090b",
        }}
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-5">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-1">
                Admin Panel
              </p>
              <h1 className="text-2xl font-black text-white">User Complaints</h1>
            </div>

            {/* Stats badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border"
              style={{
                background: "rgba(99,102,241,0.1)",
                borderColor: "rgba(99,102,241,0.25)",
              }}
            >
              <Inbox size={14} style={{ color: "#6366f1" }} />
              <span className="text-white/80 text-sm font-bold">
                {messages.length} Total
              </span>
            </motion.div>
          </motion.div>

          {/* ── Search Bar ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "rgba(255,255,255,0.3)" }}
            />
            <input
              type="text"
              placeholder="Search by name, email, subject, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs transition-colors"
              >
                ✕
              </button>
            )}
          </motion.div>

          {/* ── Loading ── */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                <p className="text-white/30 text-sm">Loading messages...</p>
              </div>
            </div>
          )}

          {/* ── Empty State ── */}
          {!loading && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <div
                className="p-5 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <CheckCheck size={32} style={{ color: "rgba(255,255,255,0.2)" }} />
              </div>
              <p className="text-white/30 text-sm">
                {search ? "Koi message nahi mila" : "Abhi tak koi complaint nahi ayi"}
              </p>
            </motion.div>
          )}

          {/* ── Message List ── */}
          <AnimatePresence mode="popLayout">
            {!loading &&
              filtered.map((item, index) => (
                <MessageCard
                  key={item._id}
                  item={item}
                  index={index}
                  onDelete={handleDelete}
                />
              ))}
          </AnimatePresence>

          {/* ── Result count when searching ── */}
          {search && filtered.length > 0 && (
            <p className="text-center text-white/25 text-xs pb-6">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
            </p>
          )}

        </div>
      </div>
    </MainLayout>
  );
};

export default AdminMessages;
