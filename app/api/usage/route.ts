import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PROJECT_ID = "69f6e881d8bf4ff14739bca3";

export async function GET() {
  const apiKey = process.env.VOICEFLOW_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "VOICEFLOW_API_KEY is not set in .env.local" },
      { status: 500 }
    );
  }

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
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to reach Voiceflow API" }, { status: 500 });
  }
}
