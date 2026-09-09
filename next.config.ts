import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Las imágenes ya se optimizan (WebP, redimensionadas) en el navegador
    // antes de subirse a R2, así que no dependemos del optimizador de
    // next/image (no corre en el runtime de Cloudflare Workers).
    unoptimized: true,
  },
  // `sharp` es dependencia opcional de Next (la usa next/image internamente),
  // pero no la usamos (unoptimized: true arriba). serverExternalPackages
  // evita que el build de Next la bundlee; outputFileTracingExcludes evita
  // que el output tracing la copie al standalone output — sin esto, el
  // bundler de OpenNext encuentra el binario nativo (.node) copiado ahí y
  // el build para Workers falla al no poder bundlearlo.
  serverExternalPackages: ["sharp"],
  outputFileTracingExcludes: {
    "*": ["node_modules/sharp/**", "node_modules/@img/**"],
  },
  // El cliente de Prisma para Workers (src/generated/prisma-client-workerd)
  // carga su motor de queries como un módulo .wasm importado de forma
  // estática — webpack necesita este flag explícito para tratar ese import
  // como WebAssembly real en vez de intentar parsearlo como JS.
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
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
