"use client";

import { useState, useRef, useEffect } from "react";
import { X, Mail, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Lesson, currentUser } from "@/data/course";

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson;
}

export default function QuestionModal({ isOpen, onClose, lesson }: QuestionModalProps) {
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 200);
    }
    if (!isOpen) {
      setSubmitted(false);
      setQuestion("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-lg rounded-2xl shadow-modal overflow-hidden"
              style={{
                background: "rgba(20,20,23,0.92)",
                backdropFilter: "blur(32px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4 flex items-start justify-between border-b border-white/[0.07]">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(79,142,247,0.15)" }}
                  >
                    <Mail size={16} className="text-accent-blue" style={{ color: "#4f8ef7" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Ask a Question</h3>
                    <p className="text-xs text-white/40 mt-0.5">
                      Part {lesson.part} — {lesson.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-8 text-center"
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                        style={{ background: "rgba(79,142,247,0.15)" }}
                      >
                        <CheckCircle2 size={28} style={{ color: "#4f8ef7" }} />
                      </div>
                      <h4 className="text-base font-semibold text-white mb-1">Question Sent!</h4>
                      <p className="text-sm text-white/45 max-w-xs">
                        The instructor will reply in your inbox. You'll see it in the <strong className="text-white/60">My Inbox</strong> tab.
                      </p>
                      <button
                        onClick={onClose}
                        className="mt-6 btn-primary px-6"
                        style={{ background: "linear-gradient(135deg,#4f8ef7,#7c6af5)" }}
                      >
                        Done
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      {/* User info (read-only) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-white/40 font-medium mb-1.5">Name</label>
                          <input
                            type="text"
                            value={currentUser.name}
                            readOnly
                            className="input-field opacity-60 cursor-default"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-white/40 font-medium mb-1.5">Email</label>
                          <input
                            type="email"
                            value={currentUser.email}
                            readOnly
                            className="input-field opacity-60 cursor-default"
                          />
                        </div>
                      </div>

                      {/* Question */}
                      <div>
                        <label className="block text-xs text-white/40 font-medium mb-1.5">
                          Your Question <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          ref={textareaRef}
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="What would you like to know about this lesson?"
                          rows={4}
                          className="input-field resize-none"
                          required
                        />
                      </div>

                      {/* Submit */}
                      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                        <p className="text-[11px] text-white/25">
                          Instructor typically replies within 24h
                        </p>
                        <button
                          type="submit"
                          disabled={!question.trim() || loading}
                          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          style={{ background: "linear-gradient(135deg,#4f8ef7,#7c6af5)" }}
                        >
                          {loading ? (
                            <>
                              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                              Sending…
                            </>
                          ) : (
                            <>
                              <Send size={13} />
                              Send Question
                            </>
                          )}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
