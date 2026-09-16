// Imágenes de referencia por categoría (placeholders, mientras no haya
// fotos reales por categoría). Mapeadas por slug para que cada categoría
// muestre siempre la misma imagen sin importar en qué página aparezca —
// antes cada página tenía su propio arreglo y una de ellas ciclaba
// imágenes genéricas por posición (índice % 5), lo que hacía que
// categorías como "Panetón" mostraran fotos sin relación (una laptop).
export const CATEGORY_IMAGES: Record<string, string> = {
  vegetal: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&q=80",
  "conserva-de-atun": "https://images.unsplash.com/photo-1602253057119-44d745d9b860?w=1200&q=80",
  "conserva-de-pescado": "https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=1200&q=80",
  mermelada: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=1200&q=80",
  avena: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=1200&q=80",
  "avena-cereal": "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=1200&q=80",
  paneton: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80",
  "chocolate-de-taza": "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=1200&q=80",
  chocolates: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=1200&q=80",
  detergente: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=1200&q=80",
  fideos: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=1200&q=80",
  harina: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&q=80",
  cafe: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&q=80",
  galletas: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1200&q=80",
  "leche-evaporada": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1200&q=80",
  "lava-vajilla": "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1200&q=80",
  "jabon-de-ropa": "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1200&q=80",
  lejia: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=1200&q=80",
  salsas: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=1200&q=80",
  "azucar-rubia": "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=1200&q=80",
  suavizante: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1200&q=80",
  pae: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
};

export const CATEGORY_IMAGE_PLACEHOLDER =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80";

export function categoryImageFor(slug: string): string {
  return CATEGORY_IMAGES[slug] ?? CATEGORY_IMAGE_PLACEHOLDER;
}
