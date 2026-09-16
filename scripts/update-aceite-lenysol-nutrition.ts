import "dotenv/config";
import { neon } from "@neondatabase/serverless";

// Tabla nutricional real de Aceite Vegetal Lenysol, dada por el cliente.
// La composición (por 1 cucharadita/14g) es igual para los 10 tamaños;
// solo cambian las "porciones por botella" (y esas no siempre se dieron:
// "por validar" en 1 L, sin dato en 2 L/5 L/18 L/20 L -> se deja null).
//
// Nota: la fila de 200 ml decía "Grasa total 18%" y "Grasa Saturada 13%",
// pero los otros 7 bloques idénticos (450 ml, 800/900 ml, 1 L, 2L/5L,
// 18 L, 20 L) dicen "21,5%" y "12,5%" -- se usó el valor repetido en la
// mayoría, asumiendo error de tipeo en la fila de 200 ml.
//
// Se corre una sola vez: `pnpm exec tsx scripts/update-aceite-lenysol-nutrition.ts`.
// Idempotente (UPDATE por slug).

const sql = neon(process.env.DATABASE_URL!);

const NUTRITION_FACTS = [
  { label: "Calorías", value: "126 kcal", dailyValue: "7%" },
  { label: "Grasa total", value: "14 g", dailyValue: "21.5%" },
  { label: "Grasa Saturada", value: "2.5 g", dailyValue: "12.5%" },
  { label: "Grasa Trans", value: "0 g", dailyValue: "*ND" },
  { label: "Grasa Monoinsaturada", value: "3.5 g", dailyValue: "*ND" },
  { label: "Grasa Polinsaturada", value: "8 g", dailyValue: "*ND" },
  { label: "Colesterol", value: "0 mg", dailyValue: "0%" },
  { label: "Sodio", value: "0 mg", dailyValue: "0%" },
  { label: "Carbohidratos totales", value: "0 g", dailyValue: "0%" },
  { label: "Azúcares totales", value: "0 g", dailyValue: "0%" },
  { label: "Fibra dietética", value: "0 g", dailyValue: "0%" },
  { label: "Proteínas", value: "0 g", dailyValue: "0%" },
];

const SERVING_SIZE = "1 cucharadita (14 g)";

const SERVINGS_PER_CONTAINER: Record<string, string | null> = {
  "aceite-vegetal-lenysol-200-ml": "13 aprox.",
  "aceite-vegetal-lenysol-450-ml": "29",
  "aceite-vegetal-lenysol-800-ml": "52",
  "aceite-vegetal-lenysol-900-ml": "59",
  "aceite-vegetal-lenysol-1-l": null, // "por validar" en la tabla del cliente
  "aceite-vegetal-lenysol-pet-2-l": null,
  "aceite-vegetal-lenysol-botella-amarilla-5-l": null,
  "aceite-vegetal-lenysol-botella-blanca-5-l": null,
  "aceite-vegetal-lenysol-18-l": null,
  "aceite-vegetal-lenysol-20-l": null,
};

async function main() {
  let updated = 0;
  for (const [slug, servingsPerContainer] of Object.entries(SERVINGS_PER_CONTAINER)) {
    const result = await sql`
      UPDATE products
      SET
        "nutritionServingSize" = ${SERVING_SIZE},
        "nutritionServingsPerContainer" = ${servingsPerContainer},
        "nutritionFacts" = ${JSON.stringify(NUTRITION_FACTS)}::jsonb,
        "updatedAt" = now()
      WHERE slug = ${slug}
      RETURNING name
    `;
    if (result.length === 0) {
      console.warn(`No se encontró producto con slug "${slug}"`);
      continue;
    }
    updated++;
  }
  console.log(`Listo: ${updated} de ${Object.keys(SERVINGS_PER_CONTAINER).length} productos actualizados.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
