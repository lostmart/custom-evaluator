import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const url = process.env.ROSTER_URL;
  if (!url) {
    console.error("[study-submit] ROSTER_URL is not set");
    return NextResponse.json(
      { ok: false, error: "ROSTER_URL not configured" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    console.log("[study-submit] GAS response:", res.status, text);
  } catch (err) {
    console.error("[study-submit] fetch to GAS failed:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
