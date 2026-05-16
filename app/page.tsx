"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, ChevronRight, Loader2 } from "lucide-react";
import { messages } from "@/data/course";
import { truncate } from "@/lib/truncate";
import { useSyllabus } from "@/hooks/useSyllabus";
import Sidebar from "@/components/Sidebar";
import VideoPlayer from "@/components/VideoPlayer";
import QuestionModal from "@/components/QuestionModal";

export default function CoursePage() {
  const { lessons, courseTitle, courseLogo, loading, error } = useSyllabus();
  const [activeLessonId, setActiveLessonId] = useState<string>("");
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"lessons" | "inbox">("lessons");

  useEffect(() => {
    if (lessons.length > 0 && !activeLessonId) {
      setActiveLessonId(lessons[0].id);
    }
  }, [lessons, activeLessonId]);

  const activeLesson = lessons.find((l) => l.id === activeLessonId) ?? lessons[0];
  const repliedCount = messages.filter((m) => m.adminReply).length;

  const handleSelectLesson = (id: string) => {
    setActiveLessonId(id);
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (activeLessonId) next.add(activeLessonId);
      return next;
    });
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [activeLessonId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="text-accent-blue animate-spin" style={{ color: "#4f8ef7" }} />
          <p className="text-sm text-white/40">Loading syllabus…</p>
        </div>
      </div>
    );
  }

  if (error || !activeLesson) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-primary">
        <p className="text-sm text-red-400">{error ?? "No lessons found."}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      {/* ---- Sidebar ---- */}
      <Sidebar
        lessons={lessons}
        courseTitle={courseTitle}
        courseLogo={courseLogo}
        activeId={activeLessonId}
        completedIds={completedIds}
        onSelect={handleSelectLesson}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        inboxCount={repliedCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ---- Main content ---- */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-border-subtle flex-shrink-0 bg-bg-secondary/80 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <Menu size={18} />
          </button>
          <span className="text-sm font-semibold text-white/80 truncate max-w-[60%] text-center">
            {activeLesson.title}
          </span>
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
            style={{ background: "linear-gradient(135deg,#4f8ef7,#7c6af5)" }}
          >
            Ask
          </button>
        </header>

        {/* Desktop top bar */}
        <header className="hidden lg:flex items-center justify-between px-8 h-14 border-b border-border-subtle flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-white/35">
            <span>{truncate(courseTitle, 40)}</span>
            <ChevronRight size={12} />
            <span className="text-white/60">Part {activeLesson.part}</span>
            <ChevronRight size={12} />
            <span className="text-white/80 font-medium">{truncate(activeLesson.title, 40)}</span>
          </div>
        </header>

        {/* Scrollable stage */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 lg:py-8">
            <motion.div
              key={activeLessonId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            >
              <VideoPlayer
                lesson={activeLesson}
                onAskQuestion={() => setModalOpen(true)}
              />
            </motion.div>

            {/* Navigation chips */}
            {(() => {
              const hasPrev = activeLesson.part > 1;
              const hasNext = activeLesson.part < lessons.length;
              const prevLesson = lessons.find((l) => l.part === activeLesson.part - 1);
              const nextLesson = lessons.find((l) => l.part === activeLesson.part + 1);
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`mt-8 grid gap-3 ${hasPrev && hasNext ? "grid-cols-2" : "grid-cols-1"}`}
                >
                  {hasPrev && (
                    <button
                      onClick={() => prevLesson && handleSelectLesson(prevLesson.id)}
                      className="flex items-center gap-3 p-4 rounded-xl glass hover:bg-white/[0.07] transition-all text-left group"
                    >
                      <ChevronRight size={16} className="text-white/30 rotate-180 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] text-white/30 uppercase tracking-wider font-medium">Previous</p>
                        <p className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors truncate">
                          {prevLesson?.title}
                        </p>
                      </div>
                    </button>
                  )}
                  {hasNext && (
                    <button
                      onClick={() => nextLesson && handleSelectLesson(nextLesson.id)}
                      className="flex items-center justify-between gap-3 p-4 rounded-xl glass hover:bg-white/[0.07] transition-all text-left group"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] text-white/30 uppercase tracking-wider font-medium">Next Up</p>
                        <p className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors truncate">
                          {nextLesson?.title}
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-white/30 flex-shrink-0" />
                    </button>
                  )}
                </motion.div>
              );
            })()}
          </div>
        </main>
      </div>

      {/* ---- Question Modal ---- */}
      <QuestionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        lesson={activeLesson}
      />
    </div>
  );
}
