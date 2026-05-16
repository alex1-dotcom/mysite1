"use client";

import { useState, useEffect } from "react";
import { Lesson } from "@/data/course";

interface SyllabusEntry {
  id: number;
  url: string;
  description: string;
  title?: string;
  duration?: string;
}

interface SyllabusFile {
  course: { title: string; logo?: string };
  lessons: SyllabusEntry[];
}

function extractVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.replace("/embed/", "");
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1);
    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
}

function toEmbedUrl(url: string): string {
  const videoId = extractVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

async function fetchYouTubeTitle(url: string): Promise<string | null> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(oembedUrl);
    if (!res.ok) return null;
    const data = await res.json();
    return data.title ?? null;
  } catch {
    return null;
  }
}

export function useSyllabus() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseLogo, setCourseLogo] = useState("UI");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/syllabus.txt");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const file: SyllabusFile = await res.json();

        setCourseTitle(file.course?.title ?? "Course");
        setCourseLogo(file.course?.logo ?? "UI");

        const titles = await Promise.all(
          file.lessons.map((e) =>
            e.title ? Promise.resolve(e.title) : fetchYouTubeTitle(e.url)
          )
        );

        setLessons(
          file.lessons.map((e, i) => ({
            id: `part-${e.id}`,
            part: e.id,
            title: titles[i] ?? `Part ${e.id}`,
            description: e.description,
            youtubeUrl: toEmbedUrl(e.url),
            duration: e.duration ?? "",
          }))
        );
      } catch {
        setError("Could not load syllabus.txt — check the file exists in /public and is valid JSON.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { lessons, courseTitle, courseLogo, loading, error };
}
