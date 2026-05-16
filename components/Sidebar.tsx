"use client";

import { Lesson, Message, currentUser, messages } from "@/data/course";
import { CheckCircle2, PlayCircle, BookOpen, Inbox } from "lucide-react";
import { motion } from "framer-motion";
import { truncate, clip } from "@/lib/truncate";

interface SidebarProps {
  lessons: Lesson[];
  courseTitle: string;
  courseLogo: string;
  activeId: string;
  completedIds: Set<string>;
  onSelect: (id: string) => void;
  activeTab: "lessons" | "inbox";
  onTabChange: (tab: "lessons" | "inbox") => void;
  inboxCount: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  lessons,
  courseTitle,
  courseLogo,
  activeId,
  completedIds,
  onSelect,
  activeTab,
  onTabChange,
  inboxCount,
  isOpen,
  onClose,
}: SidebarProps) {
  const progress = lessons.length
    ? Math.round((completedIds.size / lessons.length) * 100)
    : 0;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 z-40 flex flex-col
          bg-bg-secondary border-r border-border-subtle
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:z-auto
        `}
      >
        {/* Logo / Course title */}
        <div className="px-5 pt-6 pb-4 border-b border-border-subtle flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#4f8ef7,#7c6af5)" }}
            >
              {clip(courseLogo, 3)}
            </div>
            <div>
              <p className="text-xs text-white/40 font-medium tracking-widest uppercase">Course</p>
              <h2 className="text-sm font-semibold text-white leading-tight">{truncate(courseTitle, 28)}</h2>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-white/40">
              <span>{completedIds.size}/{lessons.length} lessons</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg,#4f8ef7,#7c6af5)" }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-subtle flex-shrink-0">
          {(["lessons", "inbox"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex-1 py-3 text-xs font-semibold tracking-wide uppercase transition-colors relative ${
                activeTab === tab ? "text-accent-blue" : "text-white/35 hover:text-white/60"
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                {tab === "lessons" ? (
                  <BookOpen size={12} />
                ) : (
                  <span className="relative">
                    <Inbox size={12} />
                    {inboxCount > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 w-3.5 h-3.5 rounded-full bg-accent-blue text-white text-[8px] flex items-center justify-center font-bold">
                        {inboxCount}
                      </span>
                    )}
                  </span>
                )}
                {tab}
              </span>
              {activeTab === tab && (
                <motion.div
                  layoutId="sidebar-tab-indicator"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-accent-blue rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-3">
          {activeTab === "lessons" ? (
            <ul className="space-y-0.5 px-2">
              {lessons.map((lesson, idx) => {
                const isActive = lesson.id === activeId;
                const isDone = completedIds.has(lesson.id);
                return (
                  <motion.li
                    key={lesson.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <button
                      onClick={() => { onSelect(lesson.id); onClose(); }}
                      className={`w-full text-left rounded-xl px-3 py-2.5 flex items-start gap-3 transition-all duration-200 group relative ${
                        isActive
                          ? "bg-accent-glow border border-border-active"
                          : "hover:bg-white/[0.04]"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-accent-blue animate-pulse_glow" />
                      )}
                      <span className="mt-0.5 flex-shrink-0">
                        {isDone ? (
                          <CheckCircle2 size={16} className="text-accent-blue" />
                        ) : isActive ? (
                          <PlayCircle size={16} className="text-accent-blue" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[9px] text-white/40 font-bold">
                            {lesson.part}
                          </span>
                        )}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span
                          className={`block text-xs font-semibold leading-snug truncate ${
                            isActive ? "text-white" : isDone ? "text-white/60" : "text-white/70 group-hover:text-white/90"
                          }`}
                        >
                          {lesson.title}
                        </span>
                        <span className="block text-[10px] text-white/30 mt-0.5">{lesson.duration}</span>
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          ) : (
            <InboxTab lessons={lessons} />
          )}
        </div>

        {/* User chip */}
        <div className="pl-[80px] pr-4 py-4 border-t border-border-subtle flex-shrink-0 safe-bottom">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-white/35 truncate">{currentUser.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function InboxTab({ lessons }: { lessons: Lesson[] }) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center px-6">
        <Inbox size={28} className="text-white/20 mb-3" />
        <p className="text-xs text-white/35">No questions yet.</p>
        <p className="text-[10px] text-white/25 mt-1">Ask a question while watching a lesson.</p>
      </div>
    );
  }

  return (
    <div className="px-3 py-2 space-y-3">
      {messages.map((msg: Message) => {
        const lesson = lessons.find((l) => l.id === msg.lessonId);
        return (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-3 glass space-y-2"
          >
            <p className="text-[10px] text-white/35 font-medium">
              Part {lesson?.part} — {lesson?.title}
            </p>
            <div className="flex justify-end">
              <div
                className="rounded-xl rounded-tr-sm px-3 py-2 text-xs text-white/85 max-w-[85%]"
                style={{ background: "rgba(79,142,247,0.18)" }}
              >
                {msg.question}
              </div>
            </div>
            {msg.adminReply ? (
              <div className="flex justify-start">
                <div className="rounded-xl rounded-tl-sm px-3 py-2 text-xs text-white/80 max-w-[85%] bg-white/[0.06] border border-white/10">
                  <p className="text-[9px] text-accent-violet font-semibold mb-1 uppercase tracking-widest">Instructor</p>
                  {msg.adminReply}
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-white/25 italic">Awaiting reply…</p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
