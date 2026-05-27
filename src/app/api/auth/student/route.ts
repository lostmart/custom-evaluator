import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  if (!email?.endsWith("@epita.fr")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({ name, email })
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
