import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const role = token?.role as string | undefined;

    // Rutas solo admin
    const adminOnly =
      path.startsWith("/admin") ||
      path.startsWith("/mando") ||
      path.startsWith("/legacy") ||
      path.startsWith("/roadmap");

    if (adminOnly && role !== "admin") {
      return NextResponse.redirect(new URL("/chat", req.url));
    }

    // Rutas admin + editor (producción de contenido)
    const editorRoutes =
      path.startsWith("/contenido") ||
      path.startsWith("/comunidad") ||
      path.startsWith("/proyectos") ||
      path.startsWith("/negocio") ||
      path.startsWith("/wiki");

    if (editorRoutes && role !== "admin" && role !== "editor") {
      return NextResponse.redirect(new URL("/chat", req.url));
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
  matcher: [
    "/dashboard/:path*",
    "/chat",
    "/docs/:path*",
    "/docs",
    "/documentos/:path*",
    "/workspace/:path*",
    "/workspace",
    "/admin/:path*",
    "/mando/:path*",
    "/mando",
    "/perfil",
    "/tarificador/:path*",
    "/tarificador",
    "/ranking",
    "/clientes/:path*",
    "/clientes",
    "/ia/:path*",
    "/ia",
    "/legacy/:path*",
    "/legacy",
    "/roadmap/:path*",
    "/roadmap",
    "/guia",
    "/guia/:path*",
    "/contenido/:path*",
    "/contenido",
    "/comunidad/:path*",
    "/comunidad",
    "/proyectos/:path*",
    "/proyectos",
    "/negocio/:path*",
    "/negocio",
    "/wiki/:path*",
    "/wiki"
  ]
};
