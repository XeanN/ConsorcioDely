import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.SITE_URL ?? "https://consorciodely-web.angel-xp-pb.workers.dev";
const title = "Consorcio Dely — Crecemos Juntos";
const description =
  "Fabricamos, envasamos y distribuimos abarrotes a nivel nacional: aceites, conservas, mermeladas y más.";

export const metadata: Metadata = {
  // Resuelve URLs relativas (canonical, OG images) contra el dominio real
  // en vez de asumir uno — clave para que Google no confunda el dominio
  // propio con el *.workers.dev una vez conectado (Fase 7).
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    // Páginas hijas ponen su propio título (ej. "Aceite Vegetal Lenysol —
    // Consorcio Dely") vía este patrón, sin repetir el sufijo a mano.
    template: "%s — Consorcio Dely",
  },
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Consorcio Dely",
    locale: "es_PE",
    title,
    description,
    images: ["/dely.pe.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
