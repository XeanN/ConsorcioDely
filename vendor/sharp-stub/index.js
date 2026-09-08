// Stub que reemplaza a `sharp` en el árbol de dependencias (ver
// pnpm.overrides en package.json). No usamos el optimizador de imágenes de
// next/image (images.unoptimized: true en next.config.ts) — las imágenes se
// comprimen/redimensionan en el navegador antes de subirse a R2 — así que
// Next.js nunca debería llamar a esto en runtime; existe solo para que el
// bundler de OpenNext no tropiece con el binario nativo real de sharp al
// generar el Worker de Cloudflare.
module.exports = function sharpStub() {
  throw new Error(
    "sharp está deshabilitado a propósito en este proyecto (ver vendor/sharp-stub). " +
      "Las imágenes se procesan en el cliente, no en el servidor."
  );
};
