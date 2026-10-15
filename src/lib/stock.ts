/**
 * Gestión centralizada de stock y disponibilidad de productos.
 * Permite marcar productos como "Agotado" mostrando un sticker / badge visual
 * en el catálogo y en la ficha del producto, sin ocultarlos de la tienda.
 */

// Lista de slugs o identificadores de productos agotados
export const OUT_OF_STOCK_SLUGS: string[] = [
  "detergente-lavazza-limon-1-kg",
  "detergente-lavazza-limon-140-g",
  "detergente-lavazza-limon-13-5-kg",
  "detergente-lavazza-limon-13.5-kg",
];

/**
 * Determina si un producto está agotado por su slug o nombre.
 */
export function isProductOutOfStock(slugOrName?: string | null): boolean {
  if (!slugOrName) return false;
  const s = slugOrName.toLowerCase().trim();
  
  if (OUT_OF_STOCK_SLUGS.includes(s)) return true;

  // Búsqueda flexible para la línea Detergente Lavazza Limón
  if (
    s.includes("detergente-lavazza-limon") ||
    (s.includes("lavazza") && s.includes("limon"))
  ) {
    return true;
  }

  return false;
}
