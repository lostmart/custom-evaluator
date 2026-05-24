import { NextRequest, NextResponse } from "next/server"
import db, { ready } from "@/lib/db"

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await ready
  await db.execute({ sql: "DELETE FROM events WHERE id = ?", args: [id] })
  return NextResponse.json({ ok: true })
}
