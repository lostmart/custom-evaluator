import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const ADMIN_PROTECTED = ["/admin", "/api/events"]
const LOGIN_PAGE = "/admin/login"

function isAdminProtected(pathname: string) {
  return ADMIN_PROTECTED.some((path) => pathname === path || pathname.startsWith(path + "/"))
}


export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)

  // ── Admin routes ──────────────────────────────────────────────────────────
  if (isAdminProtected(pathname) && pathname !== LOGIN_PAGE) {
    const token = req.cookies.get("admin_token")?.value
    if (!token) {
      return NextResponse.redirect(new URL(LOGIN_PAGE, req.url))
    }
    try {
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch {
      const res = NextResponse.redirect(new URL(LOGIN_PAGE, req.url))
      res.cookies.delete("admin_token")
      return res
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/events/:path*"],
}
