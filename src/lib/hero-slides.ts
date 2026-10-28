import { z } from "zod";

import { sql } from "@/lib/db";
import { publicUrlFor } from "@/lib/media";

// Carrusel del hero del home, editable desde /admin/hero. Se guarda en
// content_blocks (key = 'hero_slides', type = 'json') en vez de una tabla
// propia -- no hay suficiente volumen/estructura para justificar una
// migración de Prisma nueva.

export const HERO_SLIDE_POSITIONS = ["center", "top", "bottom", "left", "right"] as const;
export type HeroSlidePosition = (typeof HERO_SLIDE_POSITIONS)[number];

export type HeroSlide = {
  src: string;
  alt: string;
  position?: HeroSlidePosition;
};

export const heroSlideSchema = z.object({
  src: z.string().trim().min(1, "La imagen no puede estar vacía"),
  alt: z.string().trim().max(200, "El texto alternativo es muy largo (máx. 200 caracteres)"),
  position: z.enum(HERO_SLIDE_POSITIONS).optional(),
});

export const heroSlidesSchema = z.array(heroSlideSchema).min(1, "Debe haber al menos una imagen").max(10, "Máximo 10 imágenes");

export const HERO_SLIDES_CONTENT_KEY = "hero_slides";

// Imágenes iniciales -- se insertan la primera vez que se guarda algo desde
// /admin/hero, y son el fallback si la fila todavía no existe.
export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80",
    alt: "Abarrotes y productos de calidad Consorcio Dely",
  },
  {
    src: "/images/products/aceite-vegetal-lenysol-expositor.png",
    alt: "Expositor de aceites vegetales Lenysol",
  },
  {
    src: "/images/equipo/envasadora-linea-2.png",
    alt: "Línea de envasado de Consorcio Dely",
  },
  {
    src: "/images/tienda/tienda-a41.png",
    alt: "Fachada de la Tienda A-41 de Consorcio Dely",
  },
];

type ContentBlockRow = { value: string };

// Nunca lanza -- si la fila no existe, el JSON es inválido o el array
// queda vacío después de validar, el sitio sigue mostrando el hero por
// defecto en vez de romperse.
export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const [row] = (await sql()`
      SELECT value FROM content_blocks WHERE key = ${HERO_SLIDES_CONTENT_KEY} LIMIT 1
    `) as ContentBlockRow[];
    if (!row?.value) return DEFAULT_HERO_SLIDES;

    const parsed = heroSlidesSchema.safeParse(JSON.parse(row.value));
    if (!parsed.success || parsed.data.length === 0) return DEFAULT_HERO_SLIDES;

    return parsed.data.map((slide) => ({ ...slide, src: publicUrlFor(slide.src) }));
  } catch {
    return DEFAULT_HERO_SLIDES;
  }
}
