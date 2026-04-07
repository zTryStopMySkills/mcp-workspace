import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agentalia-webs | Webs profesionales para negocios locales",
  description: "Creamos webs profesionales para negocios locales en toda España. Restaurantes, bares, tiendas, clínicas. Desde 399€. Entrega en 10 días.",
  keywords: "diseño web negocios locales España, web restaurante, web bar, web tienda, agencia web affordable",
  openGraph: {
    title: "Agentalia-webs | Tu negocio, en internet. Sin complicaciones.",
    description: "Webs profesionales para negocios locales desde 399€. Entrega en 10 días. Toda España.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Cursor />
        {children}
      </body>
    </html>
  );
}
