import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const email = searchParams.get("email")
  const sheetName = searchParams.get("sheetName")

  if (!email || !sheetName) {
    return NextResponse.json({ error: "Missing email or sheetName" }, { status: 400 })
  }

  const url = process.env.ROSTER_URL
  if (!url) {
    return NextResponse.json({ error: "ROSTER_URL not configured" }, { status: 500 })
  }

  try {
    // POST to the same GAS endpoint used for submissions, but with checkOnly: true.
    // The GAS checks column B of the sheet for the email and returns without writing.
    const res = await fetch(url, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ sheetName, email, checkOnly: true }),
    })
    const data = await res.json()

    // Two possible GAS responses indicating the email already exists:
    // 1. After the checkOnly GAS update: { submitted: true }
    // 2. Current GAS (no checkOnly branch): { ok: false, error: "Already submitted" }
    const submitted =
      data.submitted === true ||
      (data.ok === false && data.error === "Already submitted")

    return NextResponse.json({ submitted })
  } catch {
    // If the check fails, fail open — don't block the student
    return NextResponse.json({ submitted: false })
  }
}
