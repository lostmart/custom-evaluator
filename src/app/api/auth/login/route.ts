import { NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"

export async function POST(req: NextRequest) {
  const { user, pass } = await req.json()

  if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("8h")
    .sign(secret)

  const res = NextResponse.json({ ok: true })
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  })
  return res
}
