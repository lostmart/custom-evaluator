import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  const events = db.prepare("SELECT * FROM events ORDER BY id DESC").all()
  return NextResponse.json(events)
}
