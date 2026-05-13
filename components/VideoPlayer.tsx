"use client";

import { useState } from "react";
import { Maximize2, Minimize2, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Lesson } from "@/data/course";

interface VideoPlayerProps {
  lesson: Lesson;
  onAskQuestion: () => void;
}

export default function VideoPlayer({ lesson, onAskQuestion }: VideoPlayerProps) {
  const [cinemaMode, setCinemaMode] = useState(false);

  const embedUrl = lesson.youtubeUrl.includes("embed")
    ? lesson.youtubeUrl
    : lesson.youtubeUrl.replace("watch?v=", "embed/");

  return (
    <AnimatePresence mode="wait">
      {cinemaMode ? (
        <motion.div
          key="cinema"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex flex-col"
        >
          {/* Cinema top bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 sm:px-6 py-3 bg-gradient-to-b from-black/90 to-transparent absolute top-0 inset-x-0 z-10">
            <div className="min-w-0">
              <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Now Playing</p>
              <h2 className="text-sm font-semibold text-white truncate">{lesson.title}</h2>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onAskQuestion}
                className="btn-primary text-xs px-3 py-2"
              >
                <Mail size={13} />
                <span className="hidden xs:inline">Ask a Question</span>
                <span className="xs:hidden">Ask</span>
              </button>
              <button
                onClick={() => setCinemaMode(false)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
              >
                <Minimize2 size={14} />
                <span className="hidden sm:inline">Exit Cinema</span>
              </button>
            </div>
          </div>

          {/* Full-screen video */}
          <iframe
            src={`${embedUrl}?autoplay=1&modestbranding=1&rel=0`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
      ) : (
        <motion.div
          key="normal"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="w-full"
        >
          {/* Lesson meta */}
          <div className="mb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(79,142,247,0.15)", color: "#4f8ef7" }}
                  >
                    Part {lesson.part}
                  </span>
                  <span className="text-xs text-white/30">{lesson.duration}</span>
                </div>
                <h1 className="text-xl font-bold text-white leading-snug">{lesson.title}</h1>
                <p className="text-sm text-white/50 mt-1 leading-relaxed">{lesson.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 self-start">
                <button
                  onClick={onAskQuestion}
                  className="btn-primary"
                >
                  <Mail size={14} />
                  Ask
                </button>
                <button
                  onClick={() => setCinemaMode(true)}
                  title="Cinema Mode"
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-white/60 hover:text-white hover:bg-white/[0.06] border border-white/10 transition-all"
                >
                  <Maximize2 size={14} />
                  <span className="hidden sm:inline">Cinema</span>
                </button>
              </div>
            </div>
          </div>

          {/* Video embed */}
          <div className="video-container shadow-card ring-1 ring-white/[0.06]">
            <iframe
              key={lesson.id}
              src={`${embedUrl}?modestbranding=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
