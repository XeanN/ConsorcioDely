"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { categoryImageFor } from "@/lib/category-images";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
};

export function CategoryCarousel({ categories }: { categories: CategoryItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Check scroll boundary
  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  // Scroll by card width
  const scroll = (direction: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    if (direction === "left") {
      el.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 20) {
        // Loop back to start
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  // Autoplay (gently advances every 4 seconds when not hovered)
  useEffect(() => {
    if (isPaused || isDragging) return;
    const timer = setInterval(() => {
      scroll("right");
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, isDragging]);

  // Mouse drag support
  const onMouseDown = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftState(el.scrollLeft);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = containerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeftState - walk;
  };

  const onMouseUp = () => setIsDragging(false);

  return (
    <section className="py-16 overflow-hidden bg-white">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header con títulos y botones del carrusel */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
              Explora Nuestro Catálogo
            </span>
            <h2
              className="section-title mt-2 text-3xl font-black text-neutral-900 sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Nuestras Categorías
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-500">
              Más de {categories.length} categorías de abarrotes de primera necesidad
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Link
              href="/catalogo"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-brand-red transition mr-2"
            >
              Ver todas ({categories.length}) →
            </Link>

            {/* Botones de navegación del carrusel */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Anterior categoría"
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
                  canScrollLeft
                    ? "border-neutral-300 bg-white text-neutral-800 shadow-sm hover:border-brand-red hover:bg-brand-red hover:text-white hover:shadow-md"
                    : "border-neutral-200 bg-neutral-50 text-neutral-300 cursor-not-allowed"
                }`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Siguiente categoría"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-800 shadow-sm transition-all duration-200 hover:border-brand-red hover:bg-brand-red hover:text-white hover:shadow-md"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ══ CONTENEDOR DEL CARRUSEL ══ */}
        <div
          className="relative -mx-6 px-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            setIsDragging(false);
          }}
        >
          <div
            ref={containerRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            className={`flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory select-none ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {categories.map((c) => {
              const img = categoryImageFor(c.slug);
              return (
                <Link
                  key={c.id}
                  href={`/catalogo/${c.slug}`}
                  draggable={false}
                  className="group relative flex-none w-52 sm:w-60 snap-start overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-red/30 hover:shadow-xl flex flex-col justify-between"
                >
                  {/* Imagen de la categoría */}
                  <div className="relative h-36 w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={img}
                      alt={c.name}
                      fill
                      draggable={false}
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="240px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <span className="absolute bottom-2.5 left-3 rounded-full bg-brand-red/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                      Categoría
                    </span>
                  </div>

                  {/* Detalle */}
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm font-black text-neutral-900 group-hover:text-brand-red transition truncate leading-tight"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {c.name}
                      </p>
                      <p className="mt-0.5 text-[11px] font-medium text-neutral-400 group-hover:text-brand-red/70 transition">
                        Ver productos disponibles
                      </p>
                    </div>

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-50 text-neutral-400 transition-all duration-300 group-hover:bg-brand-red group-hover:text-white group-hover:translate-x-1">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Sombra de desvanecimiento en bordes para sugerir continuidad */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-white to-transparent" />
          )}
          {canScrollRight && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white to-transparent" />
          )}
        </div>

        {/* Link móvil */}
        <div className="mt-4 text-center sm:hidden">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:underline"
          >
            Ver todas las categorías ({categories.length}) →
          </Link>
        </div>
      </div>
    </section>
  );
}
