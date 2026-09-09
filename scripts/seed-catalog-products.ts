import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Catálogo real de Extras/Ideas Web.pdf. Se corre una sola vez (o cuando
// haga falta re-sincronizar) con: `pnpm run seed:products`. Es idempotente:
// no duplica productos (upsert por slug) ni presentaciones ya existentes.

type VariantDef = { presentation?: string; weight: string };
type ProductDef = {
  category: string;
  brand: string;
  name: string;
  variants: VariantDef[];
};

const PRODUCTS: ProductDef[] = [
  {
    category: "VEGETAL",
    brand: "Lenysol",
    name: "Aceite Vegetal Lenysol",
    variants: [
      { weight: "200 ml" },
      { weight: "450 ml" },
      { weight: "800 ml" },
      { weight: "900 ml" },
      { weight: "1 L" },
      { presentation: "PET", weight: "2 L" },
      { presentation: "Botella amarilla", weight: "5 L" },
      { presentation: "Botella blanca", weight: "5 L" },
      { weight: "18 L" },
      { weight: "20 L" },
    ],
  },
  {
    category: "PAE",
    brand: "Lenysol",
    name: "PAE Lenysol",
    variants: [{ weight: "200 ml" }, { weight: "1 L" }],
  },
  {
    category: "MERMELADA",
    brand: "Lenysol",
    name: "Mermelada Lenysol",
    variants: [
      { presentation: "Vaso", weight: "290 g" },
      { presentation: "Pote", weight: "320 g" },
      { presentation: "Barril", weight: "1 Kg" },
    ],
  },
  {
    category: "AVENA",
    brand: "Delyavena",
    name: "Avena Delyavena",
    variants: [{ weight: "5 Kg" }, { weight: "10 Kg" }],
  },
  {
    category: "PANETON",
    brand: "Lenysol",
    name: "Panetón Lenysol",
    variants: [
      { presentation: "Casita", weight: "750 g" },
      { presentation: "Bolsa moño", weight: "800 g" },
      { presentation: "Bolsa ziplop", weight: "800 g" },
    ],
  },
  {
    category: "CHOCOLATE DE TAZA",
    brand: "Dely Cusco",
    name: "Chocolate de Taza Dely Cusco",
    variants: [{ weight: "80 g" }],
  },
  {
    // El PDF no especifica el peso de esta presentación -- queda sin
    // variantes, el cliente la completa desde el panel cuando la tenga.
    category: "CONSERVA DE ATUN",
    brand: "Lenysol",
    name: "Conserva de Atún Lenysol",
    variants: [],
  },
  {
    category: "CONSERVA DE ATUN",
    brand: "Delytun",
    name: "Conserva Delytun",
    variants: [
      { presentation: "Filete de atún", weight: "170 g" },
      { presentation: "Filete de bonito", weight: "170 g" },
    ],
  },
  {
    category: "CONSERVA DE ATUN",
    brand: "Delytun Premium",
    name: "Conserva de Atún Delytun Premium",
    variants: [{ presentation: "Filete de atún", weight: "140 g" }],
  },
  {
    category: "CONSERVA DE ATUN",
    brand: "Delys",
    name: "Conserva de Atún Delys",
    variants: [{ presentation: "Filete de atún", weight: "170 g" }],
  },
  {
    category: "DETERGENTE",
    brand: "Lavazza",
    name: "Detergente Lavazza",
    variants: [
      { presentation: "Limón", weight: "140 g" },
      { presentation: "Floral", weight: "140 g" },
      { presentation: "Limón", weight: "13.5 Kg" },
      { presentation: "Floral", weight: "13.5 Kg" },
      { presentation: "Limón", weight: "1 Kg" },
      { presentation: "Floral", weight: "1 Kg" },
    ],
  },
];

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const db = new PrismaClient({ adapter });

  let productsCreated = 0;
  let variantsCreated = 0;

  for (const def of PRODUCTS) {
    const category = await db.category.findUnique({ where: { slug: slugify(def.category) } });
    const brand = await db.brand.findUnique({ where: { slug: slugify(def.brand) } });
    if (!category || !brand) {
      console.warn(`Saltado "${def.name}": falta categoría o marca (corre seed:taxonomy primero)`);
      continue;
    }

    const slug = slugify(def.name);
    let product = await db.product.findUnique({ where: { slug } });
    if (!product) {
      product = await db.product.create({
        data: { categoryId: category.id, brandId: brand.id, name: def.name, slug },
      });
      productsCreated++;
    }

    for (const v of def.variants) {
      const exists = await db.variant.findFirst({
        where: { productId: product.id, presentation: v.presentation ?? null, weight: v.weight },
      });
      if (exists) continue;

      await db.variant.create({
        data: {
          productId: product.id,
          presentation: v.presentation ?? null,
          weight: v.weight,
        },
      });
      variantsCreated++;
    }
  }

  console.log(`Listo: ${productsCreated} productos nuevos, ${variantsCreated} presentaciones nuevas.`);
  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
