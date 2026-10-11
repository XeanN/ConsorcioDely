"use client";

import type { CSSProperties, ReactNode } from "react";

// Botón/link de WhatsApp que elige una ejecutiva al azar en CADA clic
// (no una vez al cargar la página) -- recibe la lista de números activos
// como prop desde el server component padre, nunca los expone en una URL.
export function WhatsAppCta({
  phones,
  message,
  fallbackHref,
  className,
  style,
  children,
}: {
  phones: string[];
  message: string;
  fallbackHref?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const handleClick = () => {
    const pool = phones.length > 0 ? phones : null;
    const url = pool
      ? `https://wa.me/51${pool[Math.floor(Math.random() * pool.length)]}?text=${encodeURIComponent(message)}`
      : fallbackHref;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  if (phones.length === 0 && !fallbackHref) return null;

  return (
    <button type="button" onClick={handleClick} className={className} style={style}>
      {children}
    </button>
  );
}
