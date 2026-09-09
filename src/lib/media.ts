// URL pública de una imagen subida a R2. MEDIA_PUBLIC_BASE_URL es el
// subdominio público del bucket (Cloudflare lo da al activar "Public
// Access" en R2 — dominio propio más adelante en la Fase 7).
export function publicUrlFor(r2Key: string): string {
  const base = process.env.MEDIA_PUBLIC_BASE_URL;
  if (!base) {
    throw new Error("MEDIA_PUBLIC_BASE_URL no está configurado");
  }
  return `${base.replace(/\/$/, "")}/${r2Key}`;
}
