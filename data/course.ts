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
