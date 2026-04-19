import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CortesIA Academy — Aprende IA en castellano",
  description:
    "Cursos prácticos de inteligencia artificial, videollamadas en directo con el equipo y comunidad privada. 20€/mes, cancela cuando quieras.",
  other: { "theme-color": "#0D1117" }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
