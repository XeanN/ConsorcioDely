"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type BrandItem = {
  id: string;
  name: string;
  slug: string;
  count: number;
};

/* Colores por marca */
const PALETTE: Record<string, string> = {
  lenysol: "#e4231b",
  delytun: "#2563eb",
  "delytun-premium": "#1e40af",
  "dely-cusco": "#d97706",
  delyavena: "#ca8a04",
  delys: "#dc2626",
  primor: "#dc2626",
  molitalia: "#b91c1c",
  "don-vittorio": "#b45309",
  nestle: "#0284c7",
  maggi: "#d97706",
  sapolio: "#059669",
  bolivar: "#1d4ed8",
  ayudin: "#16a34a",
  clorox: "#0284c7",
  florida: "#0369a1",
  fanny: "#dc2626",
  "3-ositos": "#d97706",
  alacena: "#dc2626",
  "blanca-flor": "#e11d48",
  nicolini: "#dc2626",
  "san-jorge": "#c2410c",
  lavazza: "#1e3a5f",
  marsella: "#0d9488",
  trome: "#ea580c",
  umsha: "#7c3aed",
  opal: "#2563eb",
};

const FALLBACK_COLORS = [
  "#e4231b", "#2563eb", "#059669", "#d97706", "#7c3aed",
  "#0284c7", "#dc2626", "#0d9488", "#b45309", "#e11d48",
  "#16a34a", "#1e40af", "#ea580c", "#c2410c", "#0369a1",
];

/* Imágenes de referencia por tipo de producto — dan contexto visual a cada tile */
const BRAND_IMAGES: Record<string, string> = {
  lenysol: "/images/products/aceite-vegetal-lenysol-botella-amarilla-5-l.png",
  delytun: "/images/products/conserva-delytun-filete-de-atun-170-g.png",
  "delytun-premium": "/images/products/conserva-de-atun-delytun-premium-filete-de-atun-140-g.png",
  "dely-cusco": "/images/products/chocolate-de-taza-dely-cusco-80-g.png",
  delyavena: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=300&q=70",
  delys: "/images/products/conserva-de-atun-delys-filete-de-atun-170-g.png",
  primor: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=70",
  molitalia: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=300&q=70",
  "don-vittorio": "https://images.unsplash.com/photo-1556761223-4c4282c73f77?w=300&q=70",
  nestle: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=70",
  maggi: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=70",
  sapolio: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=300&q=70",
  bolivar: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&q=70",
  ayudin: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&q=70",
  clorox: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=300&q=70",
  florida: "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=300&q=70",
  fanny: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&q=70",
  "3-ositos": "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=300&q=70",
  alacena: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=300&q=70",
  "blanca-flor": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&q=70",
  nicolini: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=300&q=70",
  "san-jorge": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&q=70",
  lavazza: "/images/products/detergente-lavazza-limon-1-kg.png",
  marsella: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&q=70",
  trome: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&q=70",
  umsha: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&q=70",
  opal: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&q=70",
};

/* Pool de imágenes genéricas para marcas sin imagen asignada */
const GENERIC_IMAGES = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=70",
  "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=300&q=70",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=70",
  "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=300&q=70",
  "https://images.unsplash.com/photo-1601598851547-4302969d0614?w=300&q=70",
  "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=300&q=70",
  "https://images.unsplash.com/photo-1543168256-418811576931?w=300&q=70",
  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&q=70",
];

function colorFor(slug: string, i: number) {
  return PALETTE[slug] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length];
}

function imageFor(slug: string, i: number) {
  return BRAND_IMAGES[slug] ?? GENERIC_IMAGES[i % GENERIC_IMAGES.length];
}

/* Hook para detectar si el muro está en viewport y animar la entrada */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

export function BrandWall({ brands }: { brands: BrandItem[] }) {
  const { ref, visible } = useScrollReveal();

  return (
    <section id="marcas-aliadas" className="py-16 overflow-hidden" style={{ background: "var(--neutral-50)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Título */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
            Alianzas Estratégicas
          </span>
          <h2
            className="mt-2 text-3xl font-black text-neutral-900 sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Nuestras Marcas Aliadas
          </h2>
          <p className="mt-3 text-sm text-neutral-500 max-w-xl mx-auto">
            Elaboramos y comercializamos las marcas más reconocidas del mercado peruano.
          </p>
        </div>
      </div>

      {/* ══ MURO FULL-WIDTH CON SCROLL REVEAL ══ */}
      <div ref={ref} className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-11">
        {brands.map((b, i) => {
          const color = colorFor(b.slug, i);
          const img = imageFor(b.slug, i);
          /* Delay escalonado para la animación de entrada */
          const delay = Math.min(i * 40, 1200);

          return (
            <Link
              key={b.id}
              href={`/catalogo?q=${encodeURIComponent(b.name)}`}
              title={`${b.name} — ${b.count} producto${b.count !== 1 ? "s" : ""}`}
              className="brand-tile group relative aspect-square overflow-hidden"
              style={{
                transitionDelay: visible ? `${delay}ms` : "0ms",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
                transitionProperty: "opacity, transform",
                transitionDuration: "0.6s",
                transitionTimingFunction: "ease",
              }}
            >
              {/* Imagen de fondo */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${img})` }}
              />

              {/* Overlay de color — muy fuerte por defecto, se aclara al hover */}
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${color}ee 0%, ${color}cc 50%, ${color}99 100%)`,
                }}
              />
              {/* Capa extra de opacidad — casi todo tapado por defecto */}
              <div className="absolute inset-0 bg-white/40 transition-all duration-500 group-hover:bg-transparent" />

              {/* Nombre de la marca — casi invisible, se revela al hover */}
              <div className="absolute inset-0 flex items-center justify-center p-1.5">
                <span
                  className="text-[8px] sm:text-[10px] md:text-xs font-black text-white text-center leading-tight uppercase tracking-wide select-none opacity-30 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110 drop-shadow-lg"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {b.name}
                </span>
              </div>

              {/* Efecto de brillo al hover */}
              <div className="absolute inset-0 opacity-0 transition-all duration-500 group-hover:opacity-100"
                style={{ boxShadow: `inset 0 0 30px ${color}66` }}
              />

              {/* Borde sutil que aparece al hover */}
              <div className="absolute inset-0 border-2 border-white/0 transition-all duration-300 group-hover:border-white/50" />
            </Link>
          );
        })}
      </div>

      {/* CSS para el efecto hover exagerado */}
      <style>{`
        .brand-tile {
          cursor: pointer;
        }
        .brand-tile:hover {
          z-index: 10;
          transform: scale(1.15) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
      `}</style>
    </section>
  );
}
