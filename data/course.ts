export interface Lesson {
  id: string;
  part: number;
  title: string;
  description: string;
  youtubeUrl: string;
  duration: string;
}

export interface Message {
  id: string;
  userId: string;
  lessonId: string;
  question: string;
  timestamp: string;
  adminReply?: string;
  adminReplyTimestamp?: string;
}

export const courseInfo = {
  title: "Mastering Modern UI/UX Design",
  subtitle: "From principles to polished products",
  instructor: "Alex Rivera",
  totalLessons: 8,
};

export const lessons: Lesson[] = [
  {
    id: "part-1",
    part: 1,
    title: "Design Philosophy & Mindset",
    description: "Learn the core principles behind great digital products — restraint, hierarchy, and intentional whitespace.",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "18:42",
  },
  {
    id: "part-2",
    part: 2,
    title: "Color Theory for Digital Interfaces",
    description: "Master dark-mode palettes, accent color psychology, and semantic color systems that scale.",
    youtubeUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
    duration: "24:10",
  },
  {
    id: "part-3",
    part: 3,
    title: "Typography at Scale",
    description: "Fluid type scales, variable fonts, and why Inter/Geist became the industry standard.",
    youtubeUrl: "https://www.youtube.com/embed/O5aH-8RLqgg",
    duration: "21:35",
  },
  {
    id: "part-4",
    part: 4,
    title: "Glassmorphism & Depth",
    description: "Implement frosted glass, layered shadows, and blur effects that feel native — not gimmicky.",
    youtubeUrl: "https://www.youtube.com/embed/2lXh2n0aPyw",
    duration: "19:55",
  },
  {
    id: "part-5",
    part: 5,
    title: "Micro-Interactions with Framer Motion",
    description: "Spring physics, gesture-driven animations, and the subtle cues that make interfaces feel alive.",
    youtubeUrl: "https://www.youtube.com/embed/KnO_UDRX5hs",
    duration: "32:08",
  },
  {
    id: "part-6",
    part: 6,
    title: "Responsive Layout Systems",
    description: "CSS Grid, container queries, and designing a layout that adapts gracefully from 320px to 4K.",
    youtubeUrl: "https://www.youtube.com/embed/68O6eOGAGqA",
    duration: "27:44",
  },
  {
    id: "part-7",
    part: 7,
    title: "Accessibility as Design Quality",
    description: "WCAG 2.2 in practice — contrast ratios, focus states, and ARIA patterns that don't break aesthetics.",
    youtubeUrl: "https://www.youtube.com/embed/jH5hRqMkLMk",
    duration: "23:19",
  },
  {
    id: "part-8",
    part: 8,
    title: "Shipping: From Figma to Production",
    description: "Handoff workflows, design tokens in Tailwind, and the final polish before you hit deploy.",
    youtubeUrl: "https://www.youtube.com/embed/8aGhZQkoFbQ",
    duration: "38:02",
  },
];

export const currentUser = {
  id: "user-001",
  name: "Jordan Kim",
  email: "jordan.kim@example.com",
  avatarInitials: "JK",
};

export const messages: Message[] = [
  {
    id: "msg-1",
    userId: "user-001",
    lessonId: "part-2",
    question: "What's the best way to choose a base hue for a dark-mode primary color?",
    timestamp: "2026-05-10T09:14:00Z",
    adminReply:
      "Great question! Start with a hue in the 210–260° range (blues/violets) — they read as 'cool and confident' without straining eyes on dark backgrounds. Adjust saturation to roughly 60–80% and pick a lightness that gives you at least 4.5:1 contrast against your darkest background.",
    adminReplyTimestamp: "2026-05-10T14:30:00Z",
  },
  {
    id: "msg-2",
    userId: "user-001",
    lessonId: "part-5",
    question: "Is there a performance difference between CSS transitions and Framer Motion animations?",
    timestamp: "2026-05-11T17:02:00Z",
  },
];
