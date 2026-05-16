import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PROJECT_ID = "69f6e881d8bf4ff14739bca3";
const RATE_PER_CREDIT = 0.00403;

export async function GET() {
  const apiKey = process.env.VOICEFLOW_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "VOICEFLOW_API_KEY is not set in .env.local" },
      { status: 500 }
    );
  }

  const limit = process.env.CREDIT_SOFT_LIMIT_USD ? Number(process.env.CREDIT_SOFT_LIMIT_USD) : null;

  try {
    const res = await fetch("https://analytics-api.voiceflow.com/v2/query/usage", {
      method: "POST",
      headers: {
        authorization: apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        data: {
          name: "credit_usage",
          filter: { projectID: PROJECT_ID },
        },
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Voiceflow returned ${res.status} — check your API key and project ID` },
        { status: 200 }
      );
    }

    const data = await res.json();
    const items: { count: number }[] = data.result?.items ?? [];
    const totalCredits = items.reduce((s, i) => s + i.count, 0);
    const spent = totalCredits * RATE_PER_CREDIT;

    return NextResponse.json({ ...data, spent, limit });
  } catch {
    return NextResponse.json({ error: "Failed to reach Voiceflow API" }, { status: 500 });
  }
}
