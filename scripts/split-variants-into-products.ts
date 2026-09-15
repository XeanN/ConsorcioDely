import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Migración pedida por el cliente: cada tamaño/presentación deja de ser
// una "variante" agrupada dentro de un solo producto, y pasa a ser su
// propio producto independiente (propia card, propia ficha/URL,
// activable/editable por separado en el admin). Ej.: "Aceite Vegetal
// Lenysol" (10 variantes) se divide en 10 productos, uno por tamaño.
//
// Por cada producto con variantes: crea un producto nuevo por variante
// (nombre = nombre original + presentación + peso, hereda categoría,
// marca, descripción y tabla nutricional del padre) y borra el producto
// padre (la cascada de la FK borra sus variantes). Se corre una sola vez:
// `pnpm exec tsx scripts/split-variants-into-products.ts`.

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const LOWERCASE_WORDS = new Set(["de", "del", "la", "el", "los", "las", "y"]);

function titleCase(value: string): string {
  return value
    .split(" ")
    .map((word, i) => {
      if (word.length === 0) return word;
      if (word === word.toUpperCase() && word.length > 1) return word; // preserva siglas (ej. "PET")
      if (i > 0 && LOWERCASE_WORDS.has(word.toLowerCase())) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const db = new PrismaClient({ adapter });

  const products = await db.product.findMany({
    where: { variants: { some: {} } },
    include: { variants: { orderBy: { position: "asc" } } },
  });

  let created = 0;
  let deleted = 0;

  for (const product of products) {
    if (product.variants.length === 0) continue;

    for (const [index, variant] of product.variants.entries()) {
      const presentation = variant.presentation ? titleCase(variant.presentation) : null;
      const name = `${product.name}${presentation ? ` ${presentation}` : ""} ${variant.weight}`;
      let slug = slugify(name);

      const clash = await db.product.findUnique({ where: { slug } });
      if (clash) slug = `${slug}-${index + 1}`;

      await db.product.create({
        data: {
          categoryId: product.categoryId,
          brandId: product.brandId,
          name,
          slug,
          description: product.description,
          mediaId: variant.mediaId ?? product.mediaId,
          nutritionServingSize: product.nutritionServingSize,
          nutritionServingsPerContainer: product.nutritionServingsPerContainer,
          nutritionFacts: product.nutritionFacts as never,
          active: true,
          position: 0,
        },
      });
      created++;
    }

    // onDelete: Cascade en Variant.product borra las variantes del padre.
    await db.product.delete({ where: { id: product.id } });
    deleted++;
  }

  console.log(`Listo: ${created} productos nuevos (uno por tamaño/presentación), ${deleted} productos padre eliminados.`);
  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
