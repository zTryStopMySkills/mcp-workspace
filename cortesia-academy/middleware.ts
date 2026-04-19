import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "academy_session";

function parseSession(raw: string): { id: string; nick: string; tier: string; issued: number } | null {
  try {
    // Edge runtime has atob available globally
    const json = atob(raw);
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed.id !== "string" || typeof parsed.nick !== "string") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow auth and stripe API routes through
  if (
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/api/stripe/")
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value ?? null;
  const session = sessionCookie ? parseSession(sessionCookie) : null;

  // Protected: /app and any sub-path
  if (pathname.startsWith("/app")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Login page: redirect authenticated users to /app
  if (pathname === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/app", request.url));
    }
    return NextResponse.next();
  }

  // Everything else (landing, static assets, etc.) — allow through
  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login"],
};
