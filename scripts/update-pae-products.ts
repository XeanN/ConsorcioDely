import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

const sql = neon(process.env.DATABASE_URL!);

function newId(): string {
  return crypto.randomUUID();
}

async function getOrCreateMedia(r2Key: string, altText: string): Promise<string> {
  const existing = await sql`
    SELECT id FROM media WHERE "r2Key" = ${r2Key} LIMIT 1
  `;
  if (existing.length > 0) {
    return existing[0].id as string;
  }
  const id = newId();
  await sql`
    INSERT INTO media (id, "r2Key", "altText", "createdAt")
    VALUES (${id}, ${r2Key}, ${altText}, now())
  `;
  return id;
}

const PAE_NUTRITION_FACTS = [
  { label: "Calorías", value: "126 kcal", dailyValue: "7%" },
  { label: "Grasa total", value: "14 g", dailyValue: "18%" },
  { label: "Grasa saturada", value: "2.5 g", dailyValue: "13%" },
  { label: "Grasa trans*", value: "0 g", dailyValue: "ND" },
  { label: "Grasa monoinsaturada", value: "3.5 g", dailyValue: "ND" },
  { label: "Grasa poliinsaturada", value: "8 g", dailyValue: "ND" },
  { label: "Colesterol", value: "0 mg", dailyValue: "0%" },
  { label: "Sodio", value: "0 mg", dailyValue: "0%" },
  { label: "Carbohidratos totales", value: "0 g", dailyValue: "0%" },
  { label: "Fibra dietética", value: "0 g", dailyValue: "0%" },
  { label: "Azúcares totales", value: "0 g", dailyValue: "0%" },
  { label: "Proteína", value: "0 g", dailyValue: "0%" },
];

async function main() {
  console.log("--- 1. Eliminando 1L y 200ml de categoría aceites (VEGETAL) ---");
  const deleted = await sql`
    DELETE FROM products
    WHERE slug IN ('aceite-vegetal-lenysol-1-l', 'aceite-vegetal-lenysol-200-ml')
    RETURNING id, name, slug
  `;
  console.log("Eliminados de VEGETAL:", deleted);

  console.log("\n--- 2. Asegurando media para PAE (Frente y Reverso) ---");
  const media1LFront = await getOrCreateMedia(
    "/images/products/aceite-vegetal-lenysol-1-l.png",
    "Aceite Vegetal Lenysol 1 L PAE"
  );
  const media1LBack = await getOrCreateMedia(
    "/images/products/pae-lenysol-1-l-reverso.png",
    "Información Nutricional Aceite Vegetal Lenysol 1 L PAE"
  );
  const media200mlFront = await getOrCreateMedia(
    "/images/products/aceite-vegetal-lenysol-200-ml.png",
    "Aceite Vegetal Lenysol 200 ml PAE"
  );
  const media200mlBack = await getOrCreateMedia(
    "/images/products/pae-lenysol-200-ml-reverso.png",
    "Información Nutricional Aceite Vegetal Lenysol 200 ml PAE"
  );

  console.log("\n--- 3. Actualizando productos en categoría PAE ---");
  await sql`
    UPDATE products
    SET
      name = 'Aceite Vegetal Lenysol 1 L',
      "packSize" = 'Caja x 12 Unidades',
      description = 'Aceite vegetal 100% vegetal con menos grasas saturadas, formulado especialmente para raciones y programas institucionales de alimentación escolar (PAE).\n\nContiene 1 L\nAceite vegetal\n100% vegetal\nCon menos grasas saturadas\nCertificación HACCP',
      "mediaId" = ${media1LFront},
      "nutritionServingSize" = '1 cucharada (14g)',
      "nutritionServingsPerContainer" = '66 aprox.',
      "nutritionFacts" = ${JSON.stringify(PAE_NUTRITION_FACTS)}::jsonb,
      active = true,
      "updatedAt" = now()
    WHERE slug = 'pae-lenysol-1-l'
  `;
  console.log("✓ Actualizado: pae-lenysol-1-l");

  await sql`
    UPDATE products
    SET
      name = 'Aceite Vegetal Lenysol 200 ml',
      "packSize" = 'Caja x 24 Unidades',
      description = 'Presentación individual de aceite 100% vegetal para raciones de programas de alimentación escolar (PAE).\n\nContiene 200 ml\nAceite vegetal\n100% vegetal\nCon menos grasas saturadas\nCertificación HACCP',
      "mediaId" = ${media200mlFront},
      "nutritionServingSize" = '1 cucharada (14g)',
      "nutritionServingsPerContainer" = '13 aprox.',
      "nutritionFacts" = ${JSON.stringify(PAE_NUTRITION_FACTS)}::jsonb,
      active = true,
      "updatedAt" = now()
    WHERE slug = 'pae-lenysol-200-ml'
  `;
  console.log("✓ Actualizado: pae-lenysol-200-ml");

  console.log("\n¡Sincronización de PAE completada con éxito!");
}

main().catch(console.error);
