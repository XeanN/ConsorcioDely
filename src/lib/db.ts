import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

// Driver HTTP/WebSocket de Neon (@neondatabase/serverless) en vez del
// driver `pg` estándar: `pg` necesita `pg-cloudflare` para hablar TCP en el
// runtime de Workers, y ese require rompe el bundle de OpenNext (ver
// commits anteriores) — el driver de Neon evita el problema de raíz porque
// no usa sockets TCP, funciona igual en `next dev` (Node 22, WebSocket
// nativo) y en Workers en producción. Los scripts (seed, etc.) siguen
// usando `pg` directo — corren en Node puro, nunca se bundlean para Workers.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL no está configurado");
  }
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

export async function getDb(): Promise<PrismaClient> {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}
