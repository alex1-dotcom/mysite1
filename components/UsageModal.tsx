"use client";

import { useState, useEffect } from "react";
import { X, Zap, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RATE_PER_CREDIT = 0.00403;

interface UsageItem {
  period: string;
  projectID: string;
  environmentID: string;
  count: number;
}

interface UsageData {
  result: {
    cursor?: number;
    items: UsageItem[];
  };
  spent: number;
  limit: number | null;
}

interface UsageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function groupByDay(items: UsageItem[]): { date: string; count: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const day = item.period.slice(0, 10);
    map.set(day, (map.get(day) ?? 0) + item.count);
  }
  return Array.from(map.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);
}

export default function UsageModal({ isOpen, onClose }: UsageModalProps) {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    setData(null);

    fetch("/api/usage")
      .then((r) => r.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const items = data?.result?.items ?? [];
  const totalCredits = items.reduce((s, i) => s + i.count, 0);
  const moneySpent = data?.spent ?? totalCredits * RATE_PER_CREDIT;
  const limit = data?.limit ?? null;
  const creditsLeft = limit !== null ? limit - moneySpent : null;
  const pct = limit ? Math.min((moneySpent / limit) * 100, 100) : 0;
  const days = groupByDay(items);
  const maxCount = Math.max(...days.map((d) => d.count), 1);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="usage-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="usage-modal"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-md rounded-2xl shadow-modal overflow-hidden"
              style={{
                background: "rgba(20,20,23,0.95)",
                backdropFilter: "blur(32px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4 flex items-start justify-between border-b border-white/[0.07]">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(124,106,245,0.15)" }}
                  >
                    <Zap size={16} style={{ color: "#7c6af5" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Credit Usage</h3>
                    <p className="text-xs text-white/40 mt-0.5">Conversation usage</p>
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
                {loading && (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <Loader2 size={24} className="animate-spin" style={{ color: "#7c6af5" }} />
                    <p className="text-xs text-white/40">Fetching usage data…</p>
                  </div>
                )}

                {error && (
                  <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                    <AlertCircle size={24} className="text-red-400" />
                    <p className="text-xs text-red-400 max-w-xs">{error}</p>
                    {error.includes("VOICEFLOW_API_KEY") && (
                      <p className="text-[11px] text-white/30 max-w-xs">
                        Add <code className="text-white/50">VOICEFLOW_API_KEY=your_key</code> to{" "}
                        <code className="text-white/50">.env.local</code> and restart the server.
                      </p>
                    )}
                  </div>
                )}

                {!loading && !error && data && (
                  <div className="space-y-5">
                    {/* Money card */}
                    <div
                      className="rounded-xl p-4"
                      style={{ background: "rgba(124,106,245,0.1)", border: "1px solid rgba(124,106,245,0.2)" }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">
                            Budget Used
                          </p>
                          <p className="text-3xl font-bold text-white mt-0.5">
                            {pct.toFixed(1)}%
                          </p>
                          {creditsLeft !== null && (
                            <p className="text-xs mt-1" style={{ color: creditsLeft < 0 ? "#ef4444" : "#4ade80" }}>
                              {Math.max(0, 100 - pct).toFixed(1)}% remaining
                            </p>
                          )}
                        </div>
                        <span className="text-2xl font-bold" style={{ color: "#7c6af5", opacity: 0.5 }}>%</span>
                      </div>

                      {/* Budget progress bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] text-white/40">
                          <span>{totalCredits.toLocaleString()} credits used</span>
                          <span>{pct.toFixed(1)}% of budget</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background:
                                pct > 85
                                  ? "linear-gradient(90deg,#f97316,#ef4444)"
                                  : "linear-gradient(90deg,#4f8ef7,#7c6af5)",
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Daily breakdown */}
                    {days.length > 0 ? (
                      <div>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium mb-3">
                          Recent Activity
                        </p>
                        <div className="space-y-2">
                          {days.map(({ date, count }) => {
                            const daySpent = count * RATE_PER_CREDIT;
                            const dayPct = limit ? Math.min((daySpent / limit) * 100, 100) : 0;
                            return (
                              <div key={date} className="flex items-center gap-3">
                                <span className="text-[10px] text-white/40 w-20 flex-shrink-0">
                                  {formatDate(date)}
                                </span>
                                <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                  <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: "linear-gradient(90deg,#4f8ef7,#7c6af5)" }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(count / maxCount) * 100}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                  />
                                </div>
                                <span className="text-[10px] text-white/60 w-16 text-right flex-shrink-0">
                                  {limit ? `${dayPct.toFixed(2)}%` : `${count} cr`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-white/30 text-center py-4">No usage data found.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
