import type { Metadata } from "next";
import { Anton, Cinzel, Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

/* Anton — matches the bold condensed style of the logo exactly */
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",   /* keep same CSS var so all components work */
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  weight: ["400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const BASE_URL = "https://shisha-vaper-web.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Shisha Vaper Sevilla | Tienda de Shishas y Vapers Premium",
    template: "%s | Shisha Vaper Sevilla",
  },
  description:
    "La tienda especializada en shishas, cachimbas y vapers premium de Sevilla. Selección exclusiva, accesorios y líquidos. Visítanos o pídenos por WhatsApp.",
  keywords: [
    "shisha sevilla",
    "vaper sevilla",
    "cachimba sevilla",
    "hookah sevilla",
    "tienda shisha sevilla",
    "tienda vaper sevilla",
    "accesorios shisha",
    "mazas shisha sevilla",
    "líquidos vaper sevilla",
    "comprar shisha sevilla",
    "shisha premium",
    "hookah premium",
  ],
  authors: [{ name: "Shisha Vaper Sevilla" }],
  creator: "Shisha Vaper Sevilla",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: BASE_URL,
    siteName: "Shisha Vaper Sevilla",
    title: "Shisha Vaper Sevilla | Tienda de Shishas y Vapers Premium",
    description:
      "Descubre la mejor selección de shishas, vapers y accesorios premium en Sevilla. Since 2025.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1080,
        height: 1080,
        alt: "Shisha Vaper Sevilla — Tienda premium de shishas y vapers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shisha Vaper Sevilla | Shishas y Vapers Premium",
    description:
      "La tienda especializada en shishas y vapers premium de Sevilla. Since 2025.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE_URL,
    languages: { "es-ES": BASE_URL },
  },
  other: {
    "geo.region": "ES-SE",
    "geo.placename": "Sevilla",
    "geo.position": "37.3891;-5.9845",
    ICBM: "37.3891, -5.9845",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${anton.variable} ${cinzel.variable} ${inter.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "Shisha Vaper Sevilla",
              description:
                "Tienda especializada en shishas, cachimbas, vapers y accesorios premium en Sevilla.",
              url: BASE_URL,
              logo: `${BASE_URL}/logo.jpg`,
              image: `${BASE_URL}/og-image.jpg`,
              telephone: "",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Sevilla",
                addressRegion: "Andalucía",
                addressCountry: "ES",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 37.3891,
                longitude: -5.9845,
              },
              openingHoursSpecification: [],
              sameAs: ["https://www.instagram.com/shisha_vaper_sevilla/"],
              priceRange: "€€",
              currenciesAccepted: "EUR",
              paymentAccepted: "Cash, Credit Card",
              foundingDate: "2025",
            }),
          }}
        />
      </head>
      <body className="min-h-screen antialiased bg-[#0D0D0D] text-[#F5F0E8]">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
