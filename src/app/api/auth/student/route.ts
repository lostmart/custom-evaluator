import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const ROSTER_URL = process.env.ROSTER_URL!;

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email?.endsWith("@epita.fr")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const rosterRes = await fetch(ROSTER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const roster = await rosterRes.json();
  if (!roster.ok) {
    return NextResponse.json({ error: "Email not on the roster" }, { status: 403 });
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("12h")
    .sign(secret);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("student_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
