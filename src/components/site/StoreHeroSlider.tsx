"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface StoreSlide {
  src: string;
  alt: string;
  title: string;
  tag: string;
  city: string;
}

const STORES: StoreSlide[] = [
  {
    src: "/images/tienda/tienda-a41.png",
    alt: "Fachada de Tienda A-41 de Consorcio Dely en Lima",
    title: "Tienda A - 41",
    tag: "Sede Mayorista & Distribución",
    city: "Lima, Perú",
  },
  {
    src: "/images/tienda/tienda-san-francisco.png",
    alt: "Fachada de Tienda San Francisco de Consorcio Dely en Lima",
    title: "Tienda San Francisco",
    tag: "Sede Comercial & Despacho",
    city: "Lima, Perú",
  },
];

export function StoreHeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % STORES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % STORES.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + STORES.length) % STORES.length);
  };

  const activeStore = STORES[current];

  return (
    <section
      className="relative h-80 sm:h-96 md:h-[420px] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Galería de Fachadas de Tiendas Consorcio Dely"
    >
      {/* Background Slides con transición suave y efecto ken burns */}
      {STORES.map((store, index) => {
        const isActive = index === current;
        return (
          <div
            key={store.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-0" : "opacity-0 pointer-events-none -z-10"
            }`}
          >
            <Image
              src={store.src}
              alt={store.alt}
              fill
              priority={index === 0}
              className={`object-cover object-center transition-transform duration-[6000ms] ease-out ${
                isActive ? "scale-105" : "scale-100"
              }`}
              sizes="100vw"
            />
          </div>
        );
      })}

      {/* Degradados oscuros y tono rojo corporativo para legibilidad perfecta */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 45%, rgba(180,20,14,0.35) 75%, rgba(0,0,0,0.4) 100%)",
        }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      {/* Contenido principal del Hero (Izquierda) */}
      <div className="relative z-20 mx-auto flex h-full max-w-6xl flex-col items-start justify-center px-6 sm:px-8">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm shadow-sm">
          <span className="h-2 w-2 rounded-full bg-brand-red-light animate-pulse" />
          Empresa peruana
        </span>

        <h1
          className="text-4xl font-black uppercase tracking-tight sm:text-6xl text-white"
          style={{ fontFamily: "var(--font-display)", textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}
        >
          Quiénes Somos
        </h1>

        <p className="mt-3 max-w-xl text-sm sm:text-base text-white/90 leading-relaxed font-normal">
          Más de 20 años creciendo junto al Perú — fabricando, envasando y abasteciendo con calidad a mayoristas, bodegueros y familias peruanas.
        </p>

        {/* Botones de acción directa */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            href="/quienes-somos/presencia"
            className="inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:bg-brand-red-dark hover:scale-105"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span>🏪</span>
            <span>Ver Nuestras Tiendas</span>
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            href="/quienes-somos/equipo"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-4 py-2 text-xs font-semibold text-white/90 backdrop-blur-md transition-all hover:bg-white/20 hover:text-white"
          >
            <span>Nuestro Equipo →</span>
          </Link>
        </div>
      </div>

      {/* Pill indicador de Tienda activa y controles rotatorios (Abajo derecha) */}
      <div className="absolute bottom-4 right-4 z-20 sm:bottom-6 sm:right-8 flex flex-col items-end gap-2">
        <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-black/60 px-3.5 py-2 backdrop-blur-md shadow-lg text-white">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
                {activeStore.title}
              </span>
            </div>
            <p className="text-[10px] text-white/70 font-medium">{activeStore.tag}</p>
          </div>

          {/* Flechas y puntos de navegación */}
          <div className="flex items-center gap-1.5 border-l border-white/20 pl-2.5">
            <button
              onClick={prevSlide}
              aria-label="Ver tienda anterior"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition active:scale-95"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Indicadores / Dots */}
            <div className="flex items-center gap-1">
              {STORES.map((s, idx) => (
                <button
                  key={s.src}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Ver ${s.title}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    current === idx ? "w-6 bg-brand-red" : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              aria-label="Ver siguiente tienda"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition active:scale-95"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
