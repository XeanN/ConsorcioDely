import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Categorías y marcas base del catálogo (Extras/Ideas Web.pdf). Esto es
// "interno" — el cliente no las crea ni las edita desde el panel, solo
// elige entre ellas al crear un producto. Se corre a mano cuando haga
// falta agregar una categoría/marca nueva: `pnpm exec tsx scripts/seed-catalog-taxonomy.ts`.
const CATEGORIES = [
  "VEGETAL",
  "PAE",
  "MERMELADA",
  "AVENA",
  "PANETON",
  "CHOCOLATE DE TAZA",
  "CONSERVA DE ATUN",
  "DETERGENTE",
];

const BRANDS = ["Lenysol", "Delyavena", "Dely Cusco", "Delytun", "Delytun Premium", "Delys", "Lavazza"];

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

  for (const [index, name] of CATEGORIES.entries()) {
    await db.category.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name), position: index },
    });
  }

  for (const name of BRANDS) {
    await db.brand.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name) },
    });
  }

  console.log(`Listo: ${CATEGORIES.length} categorías, ${BRANDS.length} marcas.`);
  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
