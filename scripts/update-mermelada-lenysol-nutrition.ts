import "dotenv/config";
import { neon } from "@neondatabase/serverless";

// Tabla nutricional real de Mermelada Lenysol, dada por el cliente. Misma
// composición (por 11 g / 1 cdta.) para los 3 tamaños; solo cambian las
// porciones aproximadas por envase. Se usa la columna "Porción" (no la de
// "100 g") como valor, igual que se hizo con Aceite Vegetal Lenysol.
// Se corre una sola vez: `pnpm exec tsx scripts/update-mermelada-lenysol-nutrition.ts`.
// Idempotente (UPDATE por slug).

const sql = neon(process.env.DATABASE_URL!);

const NUTRITION_FACTS = [
  { label: "Energía", value: "29.34 kcal", dailyValue: "1%" },
  { label: "Grasa total", value: "0.01 g", dailyValue: "0%" },
  { label: "Grasa Saturada", value: "0.00 g", dailyValue: "0%" },
  { label: "Grasa Trans", value: "0.00 g", dailyValue: "0%" },
  { label: "Carbohidratos totales", value: "7.25 g", dailyValue: "3%" },
  { label: "Fibra dietética total", value: "0.31 g", dailyValue: "0%" },
  { label: "Azúcares totales", value: "6.54 g", dailyValue: "7%" },
  { label: "Proteínas", value: "0.07 g", dailyValue: "0%" },
  { label: "Sodio", value: "2.00 mg", dailyValue: "0%" },
];

const SERVING_SIZE = "11 g (1 cdta.)";

const SERVINGS_PER_CONTAINER: Record<string, string> = {
  "mermelada-lenysol-vaso-290-g": "Aprox. 26",
  "mermelada-lenysol-pote-320-g": "Aprox. 29",
  "mermelada-lenysol-barril-1-kg": "Aprox. 86",
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
