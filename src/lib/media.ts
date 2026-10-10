// URL pública de una imagen subida a R2. MEDIA_PUBLIC_BASE_URL es el
// subdominio público del bucket (Cloudflare lo da al activar "Public
// Access" en R2 — dominio propio más adelante en la Fase 7).
export function publicUrlFor(r2Key: string): string {
  if (r2Key.startsWith("/") || r2Key.startsWith("http://") || r2Key.startsWith("https://")) {
    return r2Key;
  }
  const base = process.env.MEDIA_PUBLIC_BASE_URL;
  if (!base) {
    return `/${r2Key}`;
  }
  return `${base.replace(/\/$/, "")}/${r2Key}`;
}
