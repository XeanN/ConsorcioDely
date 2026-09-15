import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Segundo lote de categorías/marcas/productos, provisto por el cliente
// (lista de categoría -> marcas). Se corre una sola vez (o cuando haga
// falta re-sincronizar) con: `pnpm run seed:catalog-batch2`. Idempotente:
// - Categorías/marcas ya existentes (por slug) se reutilizan, no se duplican.
// - Si ya existe un producto para la misma categoría+marca (aunque tenga
//   otro nombre, ej. "Aceite Vegetal Lenysol" para Vegetal+Lenysol), se
//   deja tal cual: no se crea un duplicado.
// - Si ya existe un producto con el mismo slug calculado pero en OTRA
//   categoría (ej. "Avena Delyavena" estaba en la categoría genérica
//   AVENA y ahora se pide "Avena Cereal"), se reasigna a la categoría
//   nueva en vez de duplicar.
// No se cargan variantes (pesos/presentaciones) todavía -- el cliente no
// las especificó en este lote; se agregan luego desde el panel admin.

type CategoryDef = {
  name: string;
  // Nombre a usar al armar el nombre del producto (ej. "Avena Cereal" ->
  // "Avena" para que el producto se llame "Avena Delyavena" en vez de
  // "Avena Cereal Delyavena").
  productLabel?: string;
  brands: string[];
};

const DATA: CategoryDef[] = [
  { name: "Aromatizante", brands: ["Poet", "Sapolio"] },
  { name: "Avena Cereal", productLabel: "Avena", brands: ["3 Ositos", "Delyavena", "Santa Catalina"] },
  { name: "Avena de Maca", brands: ["3 Ositos"] },
  { name: "Avena de Quinua", brands: ["3 Ositos"] },
  { name: "Azúcar Rubia", brands: ["Dulfina"] },
  { name: "Café", brands: ["Ecco", "Nescafé"] },
  { name: "Chocolate en Polvo", brands: ["Milo"] },
  { name: "Chocolates", productLabel: "Chocolate", brands: ["Chocolisto", "Dely Cusco", "Oro del Cusco", "Winter"] },
  { name: "Leche Condensada", brands: ["Nestlé"] },
  { name: "Condimentos", brands: ["Ajinomoto"] },
  { name: "Conserva", brands: ["Gran Durazno"] },
  {
    name: "Conserva de Pescado",
    brands: ["Campomar", "Delys Filete", "Delytun", "Fanny", "Florida", "Lenysol", "Primor"],
  },
  { name: "Cubitos", brands: ["Maggi"] },
  { name: "Detergente", brands: ["Bolívar", "Lavazza", "Marsella", "Opal", "Patito", "Sapolio", "Trome"] },
  {
    name: "Fideos",
    brands: ["Don Vittorio", "San Jorge", "Grano de Oro", "Sayón", "Lavaggi", "Molitalia", "Nicolini"],
  },
  { name: "Filtrante", brands: ["Herbi"] },
  { name: "Galletas", brands: ["Anita"] },
  { name: "Gelatina", brands: ["Gelou", "Umsha"] },
  { name: "Harina", brands: ["Blanca Flor", "Favorita"] },
  { name: "Instantáneos", brands: ["Ajinomen", "Ajinomix"] },
  { name: "Jabón de Ropa", brands: ["Bolívar", "Marsella", "Trome"] },
  { name: "Lava Vajilla", brands: ["Ayudín", "Lavax", "Patito", "Sapolio"] },
  { name: "Leche en Polvo", brands: ["Anchor"] },
  { name: "Leche Evaporada", brands: ["Ideal"] },
  { name: "Lejía", brands: ["Clorox"] },
  { name: "Mantequilla", brands: ["Manty", "Sello de Oro"] },
  { name: "Mazamorra", brands: ["Don Bouffet", "Umsha"] },
  { name: "Mermelada", brands: ["Fanny", "Delyfresa", "Lenysol", "Montefrut"] },
  { name: "Pilas", brands: ["Display", "Panasonic"] },
  { name: "Refrescos", brands: ["Dloe", "Umsha"] },
  { name: "Salsa de Tomate", brands: ["Pomarola"] },
  { name: "Salsas", brands: ["Alacena"] },
  { name: "Suavizante", brands: ["Bolívar"] },
  { name: "Toallas Higiénicas", brands: ["Nosotras"] },
  { name: "Vegetal", brands: ["CIL", "Cocinero", "Lenysol", "Primor"] },
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

  let categoriesCreated = 0;
  let brandsCreated = 0;
  let productsCreated = 0;
  let productsMoved = 0;
  let productsSkipped = 0;

  const maxPosition = (await db.category.aggregate({ _max: { position: true } }))._max.position ?? -1;
  let nextPosition = maxPosition + 1;

  const brandCache = new Map<string, string>(); // name -> id

  for (const cat of DATA) {
    const slug = slugify(cat.name);
    let category = await db.category.findUnique({ where: { slug } });
    if (!category) {
      category = await db.category.create({
        data: { name: cat.name, slug, position: nextPosition++ },
      });
      categoriesCreated++;
    }

    for (const brandName of cat.brands) {
      let brandId = brandCache.get(brandName);
      if (!brandId) {
        const brandSlug = slugify(brandName);
        let brand = await db.brand.findUnique({ where: { slug: brandSlug } });
        if (!brand) {
          brand = await db.brand.create({ data: { name: brandName, slug: brandSlug } });
          brandsCreated++;
        }
        brandId = brand.id;
        brandCache.set(brandName, brandId);
      }

      // Ya existe un producto para esta categoría+marca (con cualquier
      // nombre) -> no duplicar.
      const existingPair = await db.product.findFirst({
        where: { categoryId: category.id, brandId },
      });
      if (existingPair) {
        productsSkipped++;
        continue;
      }

      const productName = `${cat.productLabel ?? cat.name} ${brandName}`;
      const productSlug = slugify(productName);

      const existingBySlug = await db.product.findUnique({ where: { slug: productSlug } });
      if (existingBySlug) {
        if (existingBySlug.categoryId !== category.id) {
          await db.product.update({
            where: { id: existingBySlug.id },
            data: { categoryId: category.id },
          });
          productsMoved++;
        } else {
          productsSkipped++;
        }
        continue;
      }

      await db.product.create({
        data: { categoryId: category.id, brandId, name: productName, slug: productSlug },
      });
      productsCreated++;
    }
  }

  console.log(
    `Listo: ${categoriesCreated} categorías nuevas, ${brandsCreated} marcas nuevas, ${productsCreated} productos nuevos, ${productsMoved} reasignados de categoría, ${productsSkipped} ya existentes (sin cambios).`
  );
  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
