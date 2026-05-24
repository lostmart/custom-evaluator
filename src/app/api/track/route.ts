import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (body.event !== "question_answered") db.prepare(`
    INSERT INTO events (timestamp, email, name, event, detail)
    VALUES (@timestamp, @email, @name, @event, @detail)
  `).run({
    timestamp: body.timestamp ?? new Date().toISOString(),
    email: body.email ?? "",
    name: body.name ?? "",
    event: body.event ?? "",
    detail: body.detail ?? "",
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
