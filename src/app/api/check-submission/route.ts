import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const email = searchParams.get("email")
  const sheetName = searchParams.get("sheetName")

  if (!email || !sheetName) {
    return NextResponse.json({ error: "Missing email or sheetName" }, { status: 400 })
  }

  const url = sheetName.startsWith("frontends-")
    ? process.env.FRONTEND_SUBMISSIONS_URL
    : process.env.ROSTER_URL
  if (!url) {
    return NextResponse.json({ error: "Submission URL not configured" }, { status: 500 })
  }

  // Graded assessments (frontends-*) fail closed; other sets fail open.
  const failClosed = sheetName.startsWith("frontends-")

  try {
    const res = await fetch(url, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ sheetName, email, checkOnly: true }),
    })
    const data = await res.json()

    if (data.closed) {
      return NextResponse.json({ submitted: false, closed: true })
    }

    const submitted =
      data.submitted === true ||
      (data.ok === false && data.error === "Already submitted")

    return NextResponse.json({ submitted })
  } catch {
    if (failClosed) {
      return NextResponse.json({ submitted: false, error: true })
    }
    return NextResponse.json({ submitted: false })
  }
}
