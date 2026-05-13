import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mastering Modern UI/UX Design",
  description: "A premium online course on building high-end digital interfaces.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg-primary text-white antialiased">{children}</body>
    </html>
  );
}
