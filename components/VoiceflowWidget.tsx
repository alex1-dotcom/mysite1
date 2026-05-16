"use client";

import { useEffect } from "react";

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
