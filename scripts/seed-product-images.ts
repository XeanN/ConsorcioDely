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

// Mapeo de slugs a imágenes
const PRODUCT_IMAGE_MAP: { slug: string; image: string; alt: string }[] = [
  // Aceites
  {
    slug: "aceite-vegetal-lenysol-botella-blanca-5-l",
    image: "/images/products/aceite-vegetal-lenysol-botella-blanca-5-l.png",
    alt: "Aceite Vegetal Lenysol Botella Blanca 5 L",
  },
  {
    slug: "aceite-vegetal-lenysol-botella-amarilla-5-l",
    image: "/images/products/aceite-vegetal-lenysol-botella-amarilla-5-l.png",
    alt: "Aceite Vegetal Lenysol Botella Amarilla 5 L",
  },
  {
    slug: "aceite-vegetal-lenysol-18-l",
    image: "/images/products/aceite-vegetal-lenysol-18-l.png",
    alt: "Aceite Vegetal Lenysol Cubo 18 L",
  },
  {
    slug: "aceite-vegetal-lenysol-20-l",
    image: "/images/products/aceite-vegetal-lenysol-20-l.png",
    alt: "Aceite Vegetal Lenysol Cubo 20 L",
  },
  {
    slug: "aceite-vegetal-lenysol-900-ml",
    image: "/images/products/aceite-vegetal-lenysol-900-ml.png",
    alt: "Aceite Vegetal Lenysol 900 ml",
  },
  {
    slug: "aceite-vegetal-lenysol-800-ml",
    image: "/images/products/aceite-vegetal-lenysol-800-ml.png",
    alt: "Aceite Vegetal Lenysol 800 ml",
  },
  {
    slug: "aceite-vegetal-lenysol-450-ml",
    image: "/images/products/aceite-vegetal-lenysol-450-ml.png",
    alt: "Aceite Vegetal Lenysol 450 ml",
  },
  {
    slug: "aceite-vegetal-lenysol-pet-2-l",
    image: "/images/products/aceite-vegetal-lenysol-2-l.png",
    alt: "Aceite Vegetal Lenysol PET 2 L",
  },
  {
    slug: "aceite-vegetal-lenysol-2-l",
    image: "/images/products/aceite-vegetal-lenysol-2-l.png",
    alt: "Aceite Vegetal Lenysol 2 L",
  },
  {
    slug: "aceite-vegetal-lenysol-5-l",
    image: "/images/products/aceite-vegetal-lenysol-5-l.png",
    alt: "Aceite Vegetal Lenysol 5 L",
  },
  
  // PAE aceite
  {
    slug: "pae-lenysol-1-l",
    image: "/images/products/aceite-vegetal-lenysol-1-l.png",
    alt: "PAE Lenysol 1 L",
  },
  {
    slug: "pae-lenysol-200-ml",
    image: "/images/products/aceite-vegetal-lenysol-200-ml.png",
    alt: "PAE Lenysol 200 ml",
  },

  // Fideos Canuto
  {
    slug: "fideos-canuto-chico-lenysol",
    image: "/images/products/fideos-canuto-chico-lenysol.png",
    alt: "Fideos Canuto Chico Lenysol",
  },
  {
    slug: "fideos-canuto-grande-lenysol",
    image: "/images/products/fideos-canuto-grande-lenysol.png",
    alt: "Fideos Canuto Grande Lenysol",
  },

  // Chocolate
  {
    slug: "chocolate-de-taza-dely-cusco-80-g",
    image: "/images/products/chocolate-de-taza-dely-cusco-80-g.png",
    alt: "Chocolate de Taza Dely Cusco 80 g",
  },
  {
    slug: "chocolate-dely-cusco",
    image: "/images/products/chocolate-dely-cusco.png",
    alt: "Chocolate Dely Cusco",
  },

  // Conservas
  {
    slug: "conserva-delytun-filete-de-atun-170-g",
    image: "/images/products/conserva-delytun-filete-de-atun-170-g.png",
    alt: "Conserva Delytun Filete de Atún 170 g",
  },
  {
    slug: "conserva-de-pescado-delytun",
    image: "/images/products/conserva-de-pescado-delytun.png",
    alt: "Conserva de Pescado Delytun",
  },
  {
    slug: "conserva-delytun-filete-de-bonito-170-g",
    image: "/images/products/conserva-delytun-filete-de-bonito-170-g.png",
    alt: "Conserva Delytun Filete de Bonito 170 g",
  },
  {
    slug: "conserva-de-atun-delytun-premium-filete-de-atun-140-g",
    image: "/images/products/conserva-de-atun-delytun-premium-filete-de-atun-140-g.png",
    alt: "Conserva de Atún Delytun Premium Filete de Atún 140 g",
  },
  {
    slug: "conserva-de-atun-delys-filete-de-atun-170-g",
    image: "/images/products/conserva-de-atun-delys-filete-de-atun-170-g.png",
    alt: "Conserva de Atún Delys Filete de Atún 170 g",
  },
  {
    slug: "conserva-de-pescado-delys-filete",
    image: "/images/products/conserva-de-pescado-delys-filete.png",
    alt: "Conserva de Pescado Delys Filete",
  },
  {
    slug: "conserva-de-atun-lenysol",
    image: "/images/products/conserva-de-atun-lenysol.png",
    alt: "Conserva de Atún Lenysol",
  },
  {
    slug: "conserva-de-pescado-lenysol",
    image: "/images/products/conserva-de-pescado-lenysol.png",
    alt: "Conserva de Pescado Lenysol",
  },

  // Detergente Lavazza
  {
    slug: "detergente-lavazza-limon-1-kg",
    image: "/images/products/detergente-lavazza-limon-1-kg.png",
    alt: "Detergente Lavazza Limón 1 Kg",
  },
  {
    slug: "detergente-lavazza-limon-140-g",
    image: "/images/products/detergente-lavazza-limon-140-g.png",
    alt: "Detergente Lavazza Limón 140 g",
  },
  {
    slug: "detergente-lavazza-limon-13-5-kg",
    image: "/images/products/detergente-lavazza-limon-1-kg.png",
    alt: "Detergente Lavazza Limón 13.5 Kg",
  },
  {
    slug: "detergente-lavazza-floral-1-kg",
    image: "/images/products/detergente-lavazza-floral-1-kg.png",
    alt: "Detergente Lavazza Floral Quitamanchas 1 Kg",
  },
  {
    slug: "detergente-lavazza-floral-140-g",
    image: "/images/products/detergente-lavazza-floral-1-kg.png",
    alt: "Detergente Lavazza Floral 140 g",
  },
  {
    slug: "detergente-lavazza-floral-13-5-kg",
    image: "/images/products/detergente-lavazza-floral-1-kg.png",
    alt: "Detergente Lavazza Floral 13.5 Kg",
  },

  // Mermeladas
  {
    slug: "mermelada-lenysol-barril-1-kg",
    image: "/images/products/mermelada-lenysol-barril-1-kg.png",
    alt: "Mermelada Lenysol Barril 1 Kg",
  },
  {
    slug: "mermelada-lenysol-pote-320-g",
    image: "/images/products/mermelada-lenysol-pote-320-g.png",
    alt: "Mermelada Lenysol Pote 320 g",
  },
  {
    slug: "mermelada-lenysol-vaso-290-g",
    image: "/images/products/mermelada-lenysol-vaso-290-g.png",
    alt: "Mermelada Lenysol Vaso 290 g",
  },
  {
    slug: "mermelada-delyfresa",
    image: "/images/products/mermelada-delyfresa.png",
    alt: "Mermelada Delyfresa",
  },

  // Panetón
  {
    slug: "paneton-lenysol-casita-750-g",
    image: "/images/products/paneton-lenysol-casita-750-g.png",
    alt: "Panetón Lenysol Casita 750 g",
  },
  {
    slug: "paneton-lenysol-bolsa-mono-800-g",
    image: "/images/products/paneton-lenysol-bolsa-mono-800-g.png",
    alt: "Panetón Lenysol Bolsa Moño 800 g",
  },
  {
    slug: "paneton-lenysol-bolsa-ziplop-800-g",
    image: "/images/products/paneton-lenysol-bolsa-ziplop-800-g.png",
    alt: "Panetón Lenysol Bolsa Ziplop 800 g",
  },
];

async function main() {
  console.log("--- 1. Actualizando imágenes de productos existentes ---");
  let updatedCount = 0;
  for (const item of PRODUCT_IMAGE_MAP) {
    const mediaId = await getOrCreateMedia(item.image, item.alt);
    const res = await sql`
      UPDATE products
      SET "mediaId" = ${mediaId}, "updatedAt" = now()
      WHERE slug = ${item.slug}
      RETURNING id, name
    `;
    if (res.length > 0) {
      console.log(`✓ Actualizado: ${res[0].name} -> ${item.image}`);
      updatedCount++;
    } else {
      console.log(`? No encontrado (o aún no creado): slug "${item.slug}"`);
    }
  }
  console.log(`Total productos actualizados: ${updatedCount}`);

  console.log("\n--- 2. Verificando / Creando productos Lenysol adicionales con fotos ---");

  // Obtener IDs de categorías y marca Lenysol
  const [lenysolBrand] = await sql`SELECT id FROM brands WHERE slug = 'lenysol' LIMIT 1`;
  const [fideosCat] = await sql`SELECT id FROM categories WHERE slug = 'fideos' LIMIT 1`;
  const [conservasCat] = await sql`SELECT id FROM categories WHERE slug = 'conserva-de-pescado' LIMIT 1`;

  if (!lenysolBrand) {
    console.warn("Marca Lenysol no encontrada");
    return;
  }

  // Nuevos productos a asegurar
  const newProducts = [
    {
      name: "Fideos Espagueti Lenysol",
      slug: "fideos-espagueti-lenysol",
      categoryId: fideosCat?.id,
      brandId: lenysolBrand.id,
      packSize: "Bolsa x 500 g",
      description: "Fideos de espagueti elaborados con sémola de trigo de la mejor calidad. Rinden más, no se pegan y tienen la consistencia al dente perfecta.",
      image: "/images/products/fideos-espagueti-lenysol.png",
      alt: "Fideos Espagueti Lenysol",
    },
    {
      name: "Fideos Tornillo Lenysol",
      slug: "fideos-tornillo-lenysol",
      categoryId: fideosCat?.id,
      brandId: lenysolBrand.id,
      packSize: "Bolsa x 250 g",
      description: "Fideos tornillo de sémola de trigo seleccionada. Ideales para ensaladas frías, sopas y pastas en salsa.",
      image: "/images/products/fideos-tornillo-lenysol.png",
      alt: "Fideos Tornillo Lenysol",
    },
    {
      name: "Fideos Canuto Chico Lenysol",
      slug: "fideos-canuto-chico-lenysol",
      categoryId: fideosCat?.id,
      brandId: lenysolBrand.id,
      packSize: "Bolsa x 250 g",
      description: "Fideos canuto chico elaborados con sémola de trigo seleccionada. Ideales para sopas, caldos y preparaciones tradicionales.",
      image: "/images/products/fideos-canuto-chico-lenysol.png",
      alt: "Fideos Canuto Chico Lenysol",
    },
    {
      name: "Fideos Canuto Grande Lenysol",
      slug: "fideos-canuto-grande-lenysol",
      categoryId: fideosCat?.id,
      brandId: lenysolBrand.id,
      packSize: "Bolsa x 250 g",
      description: "Fideos canuto grande seleccionados de sémola de trigo. Perfectos para pastas gratinadas, ensaladas y platos al horno.",
      image: "/images/products/fideos-canuto-grande-lenysol.png",
      alt: "Fideos Canuto Grande Lenysol",
    },
    {
      name: "Anchoveta Lenysol en Salsa de Tomate",
      slug: "anchoveta-lenysol-en-salsa-de-tomate",
      categoryId: conservasCat?.id,
      brandId: lenysolBrand.id,
      packSize: "Lata x 170 g",
      description: "Anchoveta entera seleccionada en deliciosa salsa de tomate. Fuente natural de Omega 3, hierro y proteínas de alto valor biológico.",
      image: "/images/products/anchoveta-lenysol-en-salsa-de-tomate.png",
      alt: "Anchoveta Lenysol en Salsa de Tomate",
    },
    {
      name: "Grated de Sardinas Lenysol",
      slug: "grated-de-sardinas-lenysol",
      categoryId: conservasCat?.id,
      brandId: lenysolBrand.id,
      packSize: "Lata x 170 g",
      description: "Grated de sardinas de excelente sabor y textura. Perfecto para entradas marinas, causas rellenas y preparaciones caseras.",
      image: "/images/products/grated-de-sardinas-lenysol.png",
      alt: "Grated de Sardinas Lenysol",
    },
  ];

  for (const p of newProducts) {
    if (!p.categoryId) {
      console.warn(`Categoría para ${p.name} no encontrada, omitiendo.`);
      continue;
    }
    const mediaId = await getOrCreateMedia(p.image, p.alt);
    const existing = await sql`SELECT id FROM products WHERE slug = ${p.slug} LIMIT 1`;
    if (existing.length > 0) {
      await sql`
        UPDATE products
        SET "mediaId" = ${mediaId}, "packSize" = ${p.packSize}, description = ${p.description}, active = true, "updatedAt" = now()
        WHERE slug = ${p.slug}
      `;
      console.log(`✓ Producto existente actualizado: ${p.name}`);
    } else {
      const prodId = newId();
      await sql`
        INSERT INTO products (id, name, slug, "categoryId", "brandId", "mediaId", "packSize", description, active, position, "createdAt", "updatedAt")
        VALUES (${prodId}, ${p.name}, ${p.slug}, ${p.categoryId}, ${p.brandId}, ${mediaId}, ${p.packSize}, ${p.description}, true, 0, now(), now())
      `;
      console.log(`+ Creado nuevo producto: ${p.name}`);
    }
  }

  console.log("\n¡Proceso de sincronización completado con éxito!");
}

main().catch(console.error);
