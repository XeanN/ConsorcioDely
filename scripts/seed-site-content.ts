import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Contenido, configuración y ejecutivas — datos reales de
// Extras/Ideas Web.pdf. Interno: el cliente no edita esto desde el panel
// (solo Productos), se carga/actualiza por acá cuando haga falta.
// `pnpm run seed:content`. Idempotente.

const CONTENT_BLOCKS = [
  {
    key: "hero_title",
    type: "text",
    value: "Crecemos Juntos",
  },
  {
    key: "quienes_somos",
    type: "richtext",
    value:
      "Consorcio Dely S.A.C. es una empresa peruana dedicada a la fabricación, envasado y comercialización de abarrotes a nivel nacional. A diferencia de un simple revendedor, elaboramos y envasamos directamente nuestras propias líneas de aceite, conservas, mermeladas y más — y complementamos nuestro catálogo con marcas aliadas como P&G, Alicorp, Nestlé, Gloria y Molitalia. Trabajamos con mayoristas, bodegueros y minoristas, siempre bajo un mismo principio: crecemos junto a cada cliente que confía en nosotros.",
  },
  {
    key: "responsabilidad_social",
    type: "richtext",
    value:
      "En Consorcio Dely, nuestro equipo es tan valioso como cada persona que lo conforma. Crecemos juntos gracias a la confianza, el talento y el compromiso de quienes lo integran, en un ambiente donde las diferencias suman y cada idea impulsa nuestras metas. Así seguimos avanzando, junto a nuestro equipo y junto a quienes hoy son nuestros aliados.",
  },
];

const SITE_SETTING = {
  phone: "970 835 166",
  contactPhone: "970 792 078",
  email: null,
  address: "Av. La Cultura 701, Mercado Productores, Pasaje Productores, Puesto 40",
  legalName: "Consorcio Dely S.A.C.",
  ruc: "20601228492",
  fiscalAddress: "AV. LA CULTURA NRO. 701 INT. 41 OTR. MERCADO DE PRODUCTORES SANTA ANITA",
  facebookUrl: null,
  instagramUrl: null,
  twitterUrl: null,
  complaintsBookUrl: null, // pendiente, por consultar
};

// Números de prueba -- reemplazar por los reales de las ejecutivas cuando
// se tengan.
const SALES_REPS = [
  { name: "Ejecutiva de prueba 1", whatsapp: "999999999" },
  { name: "Ejecutiva de prueba 2", whatsapp: "988888888" },
  { name: "Ejecutiva de prueba 3", whatsapp: "977777777" },
];

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const db = new PrismaClient({ adapter });

  for (const block of CONTENT_BLOCKS) {
    await db.contentBlock.upsert({
      where: { key: block.key },
      update: { type: block.type, value: block.value },
      create: block,
    });
  }

  await db.siteSetting.upsert({
    where: { id: 1 },
    update: SITE_SETTING,
    create: { id: 1, ...SITE_SETTING },
  });

  let salesRepsCreated = 0;
  for (const [index, rep] of SALES_REPS.entries()) {
    const exists = await db.salesRep.findFirst({ where: { whatsapp: rep.whatsapp } });
    if (exists) continue;
    await db.salesRep.create({ data: { ...rep, position: index } });
    salesRepsCreated++;
  }

  console.log(
    `Listo: ${CONTENT_BLOCKS.length} bloques de contenido, configuración del sitio, ${salesRepsCreated} ejecutivas nuevas.`
  );
  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
