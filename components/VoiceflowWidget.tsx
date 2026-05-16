"use client";

import { useEffect } from "react";

// ─── POC: Credit-limit enforcement during voice call ────────────────────────
const POLL_INTERVAL_MS = 10_000;

function pocLog(msg: string, data?: unknown) {
  const t = new Date().toISOString().split("T")[1].replace("Z", "");
  const prefix = `[VF-POC ${t}]`;
  data !== undefined ? console.log(prefix, msg, data) : console.log(prefix, msg);
}

function tryStopCall(): boolean {
  const vf = (window as any).voiceflow?.chat;
  if (!vf) {
    pocLog("❌ window.voiceflow.chat not found — cannot stop call");
    return false;
  }

  pocLog("📋 Available widget methods:", Object.keys(vf));

  if (typeof vf.destroy === "function") {
    pocLog("🔴 Calling window.voiceflow.chat.destroy() ...");
    vf.destroy();
    pocLog("✅ destroy() called — widget torn down. Check mic indicator + WS tab.");
    return true;
  }

  if (typeof vf.close === "function") {
    pocLog("⚠️  destroy() not found. Falling back to close() ...");
    vf.close();
    pocLog("✅ close() called — widget closed (voice session may still be alive on server).");
    return true;
  }

  pocLog("❌ Neither destroy() nor close() exist — Voiceflow API cannot stop the call programmatically.");
  return false;
}

function startCreditMonitor() {
  pocLog("🟢 Credit monitor started — polling /api/widget-enabled every 10 s");
  pocLog("ℹ️  Start a voice call then watch this console for results");

  const interval = setInterval(async () => {
    pocLog("⏱  Polling /api/widget-enabled ...");
    try {
      const res = await fetch("/api/widget-enabled");
      const json = await res.json();
      pocLog("📊 API response:", json);

      const spent = json.spent ?? null;
      const limit = json.limit ?? null;
      const enabled = json.enabled;

      if (spent !== null && limit !== null) {
        pocLog(`💰 Spent: $${spent.toFixed(6)}  |  Limit: $${limit}  |  Remaining: $${(limit - spent).toFixed(6)}`);
      }

      if (!enabled) {
        pocLog("🚨 LIMIT EXCEEDED — attempting to stop the voice call...");
        const stopped = tryStopCall();
        if (stopped) {
          pocLog("✅ POC RESULT: Call interruption succeeded — Voiceflow supports programmatic termination.");
        } else {
          pocLog("❌ POC RESULT: Call interruption FAILED — no supported API found.");
        }
        clearInterval(interval);
        pocLog("🛑 Polling stopped.");
      } else {
        pocLog("✅ Within limit — no action needed.");
      }
    } catch (err) {
      pocLog("❌ Fetch error (will retry next tick):", err);
    }
  }, POLL_INTERVAL_MS);

  return interval;
}
// ────────────────────────────────────────────────────────────────────────────

function loadWidget() {
  const v = document.createElement("script");
  v.type = "text/javascript";
  v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
  v.onload = () => {
    (window as any).voiceflow.chat.load({
      verify: { projectID: "69f6e881d8bf4ff14739bca3" },
      url: "https://general-runtime.voiceflow.com",
      versionID: "production",
      voice: { url: "https://runtime-api.voiceflow.com" },
      assistant: {
        image: "",
        stylesheet: "/vf-custom.css",
        avatar: { hide: false },
        header: { hideImage: false },
        banner: { hide: false },
        launcher: { type: "icon" },
      },
    });

    // POC: start polling immediately after widget loads
    pocLog("🎙️  Widget loaded — starting credit monitor for POC");
    startCreditMonitor();
  };
  document.head.appendChild(v);
}

export default function VoiceflowWidget() {
  useEffect(() => {
    fetch("/api/widget-enabled")
      .then((r) => r.json())
      .then((json) => {
        if (json.enabled) loadWidget();
      })
      .catch(() => loadWidget()); // network failure — fail open
  }, []);

  return null;
}
