import { NextResponse } from "next/server"
import db, { ready } from "@/lib/db"

export async function GET() {
  await ready
  const result = await db.execute("SELECT * FROM events ORDER BY id DESC")
  return NextResponse.json(result.rows)
}
