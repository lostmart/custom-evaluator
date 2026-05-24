import { NextRequest, NextResponse } from "next/server"
import db, { ready } from "@/lib/db"

export async function POST(req: NextRequest) {
  const body = await req.json()
  await ready

  if (body.event !== "question_answered") await db.execute({
    sql: `INSERT INTO events (timestamp, email, name, event, detail) VALUES (?, ?, ?, ?, ?)`,
    args: [
      body.timestamp ?? new Date().toLocaleString("sv-SE", { timeZone: "Europe/Paris" }),
      body.email ?? "",
      body.name ?? "",
      body.event ?? "",
      body.detail ?? "",
    ],
  })

  const url = process.env.PA_WEBHOOK_URL
  if (url) {
    fetch(url, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(body),
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
