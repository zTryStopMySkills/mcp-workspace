import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "El Rincón de Salteras — Carnes a la brasa",
  description:
    "Las mejores carnes a la brasa de Salteras. Picaña, chuletón, cachopo artesano y mucho más. Reserva tu mesa hoy.",
  keywords: [
    "restaurante Salteras",
    "carnes a la brasa Sevilla",
    "picaña",
    "chuletón Salteras",
    "El Rincón de Salteras",
    "reservar mesa Salteras",
    "cachopo artesano",
    "croquetas caseras Salteras",
  ],
  openGraph: {
    title: "El Rincón de Salteras — A fuego lento, desde el corazón",
    description:
      "Las mejores carnes a la brasa de Salteras. 15 años de fuego y tradición.",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "El Rincón de Salteras",
    address: {
      "@type": "PostalAddress",
      streetAddress: "C/ Juan Ramón Jiménez, 29",
      addressLocality: "Salteras",
      postalCode: "41909",
      addressRegion: "Sevilla",
    },
    telephone: "+34954966184",
    servesCuisine: ["Spanish", "Grilled meats", "Tapas"],
    priceRange: "€€",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.4",
      reviewCount: "736",
    },
  };

  return (
    <html lang="es" className={`${playfair.variable} ${lato.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className="bg-humo text-crema font-body antialiased">
        {children}
      </body>
    </html>
  );
}
