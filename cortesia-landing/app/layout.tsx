import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CortesIA — Agencia de IA para negocios",
  description: "Hacemos crecer negocios con inteligencia artificial. Webs profesionales, agentes IA y formación para equipos comerciales.",
  keywords: ["inteligencia artificial", "webs profesionales", "agencia IA", "CortesIA", "automatización"],
  openGraph: {
    title: "CortesIA — Agencia de IA para negocios",
    description: "Hacemos crecer negocios con inteligencia artificial.",
    type: "website",
    locale: "es_ES"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
