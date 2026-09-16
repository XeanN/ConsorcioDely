import "dotenv/config";
import { neon } from "@neondatabase/serverless";

// Datos reales (SKU, unidades por caja, descripción) para los 10 tamaños
// de Aceite Vegetal Lenysol, dados por el cliente. Se corre una sola vez:
// `pnpm exec tsx scripts/update-aceite-lenysol-details.ts`. Idempotente
// (UPDATE por slug, se puede re-correr sin duplicar nada).

const sql = neon(process.env.DATABASE_URL!);

type Row = { slug: string; sku: string; packSize: string | null; description: string };

const ROWS: Row[] = [
  {
    slug: "aceite-vegetal-lenysol-200-ml",
    sku: "781262",
    packSize: "Caja x 24 Unidades",
    description:
      "Ideal para: viajes, camping y probar el producto por primera vez.\n\nContiene 200 ml\nAceite vegetal\n100% vegetal\nCon menos grasas saturadas",
  },
  {
    slug: "aceite-vegetal-lenysol-450-ml",
    sku: "781177",
    packSize: "Caja x 12 Unidades",
    description:
      "Ideal para: la cocina del día a día en casa.\n\nContiene 450 ml\nAceite vegetal\n100% vegetal\nCon menos grasas saturadas",
  },
  {
    slug: "aceite-vegetal-lenysol-800-ml",
    sku: "781380",
    packSize: "Caja x 12 Unidades",
    description:
      "Ideal para: parrilladas, reuniones familiares y preparaciones especiales.\n\nContiene 800 ml\nAceite vegetal\n100% vegetal\nCon menos grasas saturadas",
  },
  {
    slug: "aceite-vegetal-lenysol-900-ml",
    sku: "781145",
    packSize: "Caja x 12 Unidades",
    description:
      "Ideal para: aderezos, marinados y la cocina de todos los días.\n\nContiene 900 ml\nAceite vegetal\n100% vegetal\nCon menos grasas saturadas",
  },
  {
    slug: "aceite-vegetal-lenysol-1-l",
    sku: "781200",
    packSize: "Caja x 12 Unidades",
    description:
      "Ideal para: aderezos, frituras y el uso diario del hogar.\n\nContiene 1 L\nAceite vegetal\n100% vegetal\nCon menos grasas saturadas",
  },
  {
    slug: "aceite-vegetal-lenysol-pet-2-l",
    sku: "781160",
    packSize: "Caja x 6 Unidades",
    description:
      "Ideal para: familias grandes y negocios con consumo frecuente.\n\nContiene 2 L\nAceite vegetal\n100% vegetal\nCon menos grasas saturadas",
  },
  {
    slug: "aceite-vegetal-lenysol-botella-amarilla-5-l",
    sku: "781162",
    packSize: "Caja x 4 Unidades",
    description:
      "Ideal para: restaurantes, pollerías y comedores.\n\nContiene 5 L\nAceite vegetal\n100% vegetal\nCon menos grasas saturadas",
  },
  {
    slug: "aceite-vegetal-lenysol-botella-blanca-5-l",
    sku: "781720",
    packSize: "Caja x 4 Unidades",
    description:
      "Ideal para: negocios e instituciones con alto consumo.\n\nContiene 5 L\nAceite vegetal\n100% vegetal\nCon menos grasas saturadas",
  },
  {
    slug: "aceite-vegetal-lenysol-18-l",
    sku: "781194",
    packSize: null,
    description:
      "Ideal para: panaderías, restaurantes grandes y comedores institucionales.\n\nContiene 18 L\nAceite vegetal\n100% vegetal\nCon menos grasas saturadas",
  },
  {
    slug: "aceite-vegetal-lenysol-20-l",
    sku: "781241",
    packSize: null,
    description:
      "Ideal para: negocios de alto volumen y catering.\n\nContiene 20 L\nAceite vegetal\n100% vegetal\nCon menos grasas saturadas",
  },
];

async function main() {
  let updated = 0;
  for (const row of ROWS) {
    const result = await sql`
      UPDATE products
      SET sku = ${row.sku}, "packSize" = ${row.packSize}, description = ${row.description}, "updatedAt" = now()
      WHERE slug = ${row.slug}
      RETURNING name
    `;
    if (result.length === 0) {
      console.warn(`No se encontró producto con slug "${row.slug}"`);
      continue;
    }
    updated++;
  }
  console.log(`Listo: ${updated} de ${ROWS.length} productos actualizados.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
