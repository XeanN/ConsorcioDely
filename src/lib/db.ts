import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { getCloudflareContext } from "@opennextjs/cloudflare";

function createClient(connectionString: string) {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Fuera de una request de Next.js (scripts, seed, `next build`): conexión
// directa a Neon vía DATABASE_URL, cacheada en globalThis como singleton.
function getLocalDb() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient(process.env.DATABASE_URL!);
  }
  return globalForPrisma.prisma;
}

/**
 * Cliente de Prisma para usar dentro de Server Components / Route Handlers /
 * Server Actions. En Cloudflare Workers (producción, y en local con
 * `initOpenNextCloudflareForDev`) usa el binding de Hyperdrive; si no hay
 * contexto de Cloudflare disponible cae a la conexión directa de Neon.
 *
 * Se crea un cliente nuevo por request en vez de reusar un singleton global
 * porque los isolates de Workers no garantizan poder reusar una conexión TCP
 * de forma segura entre requests — Hyperdrive ya hace el pooling real del
 * lado de Cloudflare.
 */
export async function getDb(): Promise<PrismaClient> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const hyperdrive = (
      env as unknown as { HYPERDRIVE?: { connectionString: string } }
    ).HYPERDRIVE;
    if (hyperdrive) {
      return createClient(hyperdrive.connectionString);
    }
  } catch {
    // getCloudflareContext no disponible fuera del runtime de Workers.
  }
  return getLocalDb();
}
