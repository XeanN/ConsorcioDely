import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las imágenes ya se optimizan (WebP, redimensionadas) en el navegador
    // antes de subirse a R2, así que no dependemos del optimizador de
    // next/image (no corre en el runtime de Cloudflare Workers).
    unoptimized: true,
  },
};

export default nextConfig;

// Habilita el acceso a los bindings de Cloudflare (Hyperdrive, R2) durante
// `next dev`, simulando el entorno de Workers en local. Debe correr solo en
// dev: en `next build` valida de inmediato el binding de Hyperdrive y falla
// si no hay una connection string local configurada todavía.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}
