import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const PROTECTED = ["/admin", "/api/events"]
const LOGIN_PAGE = "/admin/login"

function isProtected(pathname: string) {
  return PROTECTED.some((path) => pathname === path || pathname.startsWith(path + "/"))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!isProtected(pathname) || pathname === LOGIN_PAGE) {
    return NextResponse.next()
  }

  const token = req.cookies.get("admin_token")?.value

  if (!token) {
    return NextResponse.redirect(new URL(LOGIN_PAGE, req.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    const res = NextResponse.redirect(new URL(LOGIN_PAGE, req.url))
    res.cookies.delete("admin_token")
    return res
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/events/:path*"],
}
