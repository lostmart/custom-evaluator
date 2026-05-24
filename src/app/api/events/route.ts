import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  const result = await db.execute("SELECT * FROM events ORDER BY id DESC")
  return NextResponse.json(result.rows)
}
