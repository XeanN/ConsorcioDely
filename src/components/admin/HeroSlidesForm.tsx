"use client";

import { useActionState, useState } from "react";

import { ImageUploader, type UploadedImage } from "@/components/admin/ImageUploader";
import { updateHeroSlides, type HeroSlidesFormState } from "@/lib/actions/hero-slides";
import { HERO_SLIDE_POSITIONS, type HeroSlide, type HeroSlidePosition } from "@/lib/hero-slides";

const initialState: HeroSlidesFormState = {};

const POSITION_LABELS: Record<HeroSlidePosition, string> = {
  center: "Centro",
  top: "Arriba",
  bottom: "Abajo",
  left: "Izquierda",
  right: "Derecha",
};

export function HeroSlidesForm({ defaultSlides }: { defaultSlides: HeroSlide[] }) {
  const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides);
  const [state, formAction, pending] = useActionState(updateHeroSlides, initialState);

  function updateSlide(index: number, patch: Partial<HeroSlide>) {
    setSlides((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function moveSlide(index: number, direction: -1 | 1) {
    setSlides((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeSlide(index: number) {
    setSlides((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  }

  function addSlide(image: UploadedImage) {
    setSlides((prev) => [...prev, { src: image.url, alt: "Imagen del hero", position: "center" }]);
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="slides" value={JSON.stringify(slides)} />

      <ul className="space-y-4">
        {slides.map((slide, index) => (
          <li
            key={`${slide.src}-${index}`}
            className="flex gap-4 rounded-md border border-neutral-200 bg-white p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt={slide.alt}
              className="h-20 w-32 shrink-0 rounded-md object-cover"
            />

            <div className="flex-1 space-y-2">
              <div className="space-y-1">
                <label htmlFor={`alt-${index}`} className="text-xs font-medium text-neutral-700">
                  Texto alternativo
                </label>
                <input
                  id={`alt-${index}`}
                  type="text"
                  value={slide.alt}
                  maxLength={200}
                  onChange={(e) => updateSlide(index, { alt: e.target.value })}
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-900 outline-none focus:border-neutral-500"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-700">
                  Posición
                  <select
                    value={slide.position ?? "center"}
                    onChange={(e) => updateSlide(index, { position: e.target.value as HeroSlidePosition })}
                    className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-900 outline-none focus:border-neutral-500"
                  >
                    {HERO_SLIDE_POSITIONS.map((pos) => (
                      <option key={pos} value={pos}>
                        {POSITION_LABELS[pos]}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveSlide(index, -1)}
                    disabled={index === 0}
                    aria-label="Mover arriba"
                    className="rounded-md border border-neutral-300 px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-50 disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSlide(index, 1)}
                    disabled={index === slides.length - 1}
                    aria-label="Mover abajo"
                    className="rounded-md border border-neutral-300 px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-50 disabled:opacity-40"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSlide(index)}
                    disabled={slides.length <= 1}
                    className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-40"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {slides.length >= 10 ? (
        <p className="text-xs text-neutral-400">Máximo 10 imágenes — elimina alguna para agregar otra.</p>
      ) : (
        <div className="max-w-sm">
          <p className="mb-1.5 text-xs font-medium text-neutral-700">Agregar imagen</p>
          <ImageUploader onUploaded={addSlide} />
        </div>
      )}

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-600">Guardado.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
