"use client";

import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const safeImages = images.length > 0 ? images : ["https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80"];
  const currentImage = safeImages[selectedIndex] ?? safeImages[0];
  const total = safeImages.length;

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % total);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + total) % total);
  };

  return (
    <div className="space-y-4">
      {/* ══ IMAGEN PRINCIPAL ══ */}
      <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50 shadow-inner">
        {/* Badges superiores */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5">
          <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
            Producto Peruano
          </span>
          <span className="rounded-full bg-brand-red px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
            Calidad Dely
          </span>
        </div>

        {/* Contador de fotos (si hay más de 1) */}
        {total > 1 && (
          <div className="absolute right-4 top-4 z-10 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md shadow">
            {selectedIndex + 1} / {total} fotos
          </div>
        )}

        {/* Imagen actual */}
        <img
          key={currentImage}
          src={currentImage}
          alt={`${productName} — foto ${selectedIndex + 1}`}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
        />

        {/* Flechas de navegación (si hay más de 1 foto) */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-110 opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={nextImage}
              aria-label="Siguiente imagen"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-110 opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* ══ TIRA DE MINIATURAS (THUMBNAILS) ══ */}
      {total > 1 && (
        <div className="flex flex-wrap items-center gap-3">
          {safeImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={img + idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                onMouseEnter={() => setSelectedIndex(idx)}
                aria-label={`Ver foto ${idx + 1}`}
                className={`group relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-brand-red shadow-md scale-105 ring-2 ring-brand-red/25"
                    : "border-neutral-200 opacity-70 hover:opacity-100 hover:border-neutral-400"
                }`}
              >
                <img
                  src={img}
                  alt={`${productName} miniatura ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-brand-red/10 pointer-events-none" />
                )}
                <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 py-0.2 text-[9px] font-bold text-white">
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Beneficios al pie de foto */}
      <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-neutral-600 pt-2">
        <div className="rounded-xl bg-neutral-50 p-2.5">
          <span className="block text-brand-red font-black">100%</span>
          Garantía de calidad
        </div>
        <div className="rounded-xl bg-neutral-50 p-2.5">
          <span className="block text-brand-red font-black">WhatsApp</span>
          Consulta y pedido
        </div>
        <div className="rounded-xl bg-neutral-50 p-2.5">
          <span className="block text-brand-red font-black">Mayorista</span>
          Precios por volumen
        </div>
      </div>
    </div>
  );
}
