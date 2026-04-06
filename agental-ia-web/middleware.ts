import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Rutas de admin requieren rol admin
    if (path.startsWith("/admin")) {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/chat", "/docs/:path*", "/docs", "/documentos/:path*", "/workspace/:path*", "/workspace", "/admin/:path*", "/perfil", "/tarificador/:path*", "/tarificador"]
};
