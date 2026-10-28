"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { HeroSlide } from "@/lib/hero-slides";

const INTERVAL_MS = 2000;

const OBJECT_POSITION_CLASS: Record<string, string> = {
  center: "object-center",
  top: "object-top",
  bottom: "object-bottom",
  left: "object-left",
  right: "object-right",
};

export function HomeHeroSlider({
  slides,
  children,
}: {
  slides: HeroSlide[];
  children: React.ReactNode;
}) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotionRef = useRef(false);
  const hasMultipleSlides = slides.length > 1;

  useEffect(() => {
    prefersReducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Autoplay cada 2s -- se detiene con el mouse encima, con la pestaña en
  // segundo plano, o si el usuario prefiere menos movimiento.
  useEffect(() => {
    if (!hasMultipleSlides || isPaused || prefersReducedMotionRef.current) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPaused, hasMultipleSlides, slides.length]);

  useEffect(() => {
    if (!hasMultipleSlides) return;
    const handleVisibility = () => setIsPaused(document.visibilityState !== "visible");
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [hasMultipleSlides]);

  return (
    <section
      // Fondo oscuro: a mitad del crossfade ambas imágenes son
      // semitransparentes y sin esto se ve un destello blanco.
      className="relative flex items-center justify-center overflow-hidden bg-neutral-950"
      // 100svh menos el header sticky (~61px), para que el hero completo
      // (con los indicadores) entre en la primera pantalla.
      style={{ minHeight: "max(560px, calc(100svh - 4rem))" }}
      // Solo el mouse pausa -- en táctil un toque dispara "enter" sin
      // "leave" y el carrusel quedaría pausado para siempre.
      onPointerEnter={(e) => e.pointerType === "mouse" && setIsPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setIsPaused(false)}
    >
      {/* Slides -- todas montadas desde el inicio (solo cambia opacity), así
          la siguiente ya está cargada en el navegador antes de mostrarse. */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <Image
            key={`${slide.src}-${index}`}
            src={slide.src}
            alt={slide.alt}
            fill
            preload={index === 0}
            loading={index === 0 ? undefined : "lazy"}
            sizes="100vw"
            className={`absolute inset-0 object-cover transition-opacity duration-1000 ease-in-out ${
              OBJECT_POSITION_CLASS[slide.position ?? "center"]
            } ${isActive ? "opacity-100" : "pointer-events-none opacity-0"}`}
          />
        );
      })}

      {/* Degradados -- idénticos a los del hero original */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg,rgba(0,0,0,.35) 0%,rgba(0,0,0,.15) 30%,rgba(0,0,0,.65) 80%,rgba(0,0,0,.8) 100%)" }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg,rgba(180,20,14,.5) 0%,transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full opacity-30"
        style={{ background: "var(--brand-red)", filter: "blur(120px)" }}
      />

      {children}

      {hasMultipleSlides && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-6">
          {slides.map((slide, index) => (
            <button
              key={`${slide.src}-${index}`}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Mostrar imagen ${index + 1} de ${slides.length}`}
              aria-current={current === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === index ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
