// Imágenes de referencia por categoría (placeholders, mientras no haya
// fotos reales por categoría). Mapeadas por slug para que cada categoría
// muestre siempre la misma imagen sin importar en qué página aparezca —
// antes cada página tenía su propio arreglo y una de ellas ciclaba
// imágenes genéricas por posición (índice % 5), lo que hacía que
// categorías como "Panetón" mostraran fotos sin relación (una laptop).
export const CATEGORY_IMAGES: Record<string, string> = {
  vegetal: "/images/categories/vegetal.png",
  "conserva-de-atun": "/images/categories/conserva-de-atun.png",
  "conserva-de-pescado": "/images/categories/conserva-de-pescado.png",
  mermelada: "/images/categories/mermelada.png",
  avena: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=1200&q=80",
  "avena-cereal": "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=1200&q=80",
  paneton: "/images/categories/paneton.png",
  "chocolate-de-taza": "/images/categories/chocolate-de-taza.png",
  chocolates: "/images/categories/chocolates.png",
  detergente: "/images/categories/detergente.png",
  fideos: "/images/categories/fideos.png",
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
  pae: "/images/products/aceite-vegetal-lenysol-botella-amarilla-5-l.png",
};

export const CATEGORY_IMAGE_PLACEHOLDER =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80";

export function categoryImageFor(slug: string): string {
  return CATEGORY_IMAGES[slug] ?? CATEGORY_IMAGE_PLACEHOLDER;
}
