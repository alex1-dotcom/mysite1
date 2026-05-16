import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PROJECT_ID = "69f6e881d8bf4ff14739bca3";
const RATE_PER_CREDIT = 0.00403;

export async function GET() {
  const softLimit = Number(process.env.CREDIT_SOFT_LIMIT_USD ?? Infinity);
  const apiKey = process.env.VOICEFLOW_API_KEY;

  // No limit set or no API key — always enable
  if (!isFinite(softLimit) || !apiKey) {
    return NextResponse.json({ enabled: true });
  }

  try {
    const res = await fetch("https://analytics-api.voiceflow.com/v2/query/usage", {
      method: "POST",
      headers: { authorization: apiKey, "content-type": "application/json" },
      body: JSON.stringify({
        data: { name: "credit_usage", filter: { projectID: PROJECT_ID } },
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      // Voiceflow API down — fail open so widget still works
      return NextResponse.json({ enabled: true });
    }

    const data = await res.json();
    const items: { count: number }[] = data.result?.items ?? [];
    const credits = items.reduce((s, i) => s + i.count, 0);
    const spent = credits * RATE_PER_CREDIT;

    return NextResponse.json({ enabled: spent < softLimit, spent, limit: softLimit });
  } catch {
    return NextResponse.json({ enabled: true });
  }
}
