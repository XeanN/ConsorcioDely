import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const siteUrl = process.env.SITE_URL ?? "https://consorciodely-web.angel-xp-pb.workers.dev";
const title = "Consorcio Dely — Crecemos Juntos";
const description =
  "Fabricamos y envasamos abarrotes de calidad: aceites, conservas, mermeladas y más. Atención directa en tienda, por WhatsApp y llamada.";

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
  // Código de verificación de Google Search Console (Configuración ->
  // Verificación de la propiedad -> etiqueta HTML). No es secreto, se
  // declara en wrangler.jsonc ("vars" -> GOOGLE_SITE_VERIFICATION).
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
      {/* Google Analytics 4 — no se activa hasta que GA_MEASUREMENT_ID
          tenga un valor real en wrangler.jsonc ("vars"). */}
      {process.env.GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID} />
      )}
    </html>
  );
}
