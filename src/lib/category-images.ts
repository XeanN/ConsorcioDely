// Imágenes de referencia por categoría (placeholders, mientras no haya
// fotos reales por categoría). Mapeadas por slug para que cada categoría
// muestre siempre la misma imagen sin importar en qué página aparezca —
// antes cada página tenía su propio arreglo y una de ellas ciclaba
// imágenes genéricas por posición (índice % 5), lo que hacía que
// categorías como "Panetón" mostraran fotos sin relación (una laptop).
export const CATEGORY_IMAGES: Record<string, string> = {
  vegetal: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&q=80",
  "conserva-de-atun": "https://images.unsplash.com/photo-1602253057119-44d745d9b860?w=1200&q=80",
  mermelada: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=1200&q=80",
  avena: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
  paneton: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80",
  "chocolate-de-taza": "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=1200&q=80",
  detergente: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=1200&q=80",
  pae: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
};

export const CATEGORY_IMAGE_PLACEHOLDER =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80";

export function categoryImageFor(slug: string): string {
  return CATEGORY_IMAGES[slug] ?? CATEGORY_IMAGE_PLACEHOLDER;
}
