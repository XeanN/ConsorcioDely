import { PrismaNeon } from "@prisma/adapter-neon";
// Import por ruta relativa directa a edge.js (no el paquete "@prisma/client"
// ni su entrypoint por defecto): ese entrypoint decide entre la versión
// Node.js y la versión Workers vía "exports condicionales" del package.json,
// y esa resolución puede terminar eligiendo la ruta de Node igual (el
// query engine intenta compilar WASM en tiempo de ejecución — algo que
// Workers bloquea con "Wasm code generation disallowed by embedder").
// edge.js es la variante generada específicamente para runtime="workerd"
// (ver prisma/schema.prisma) que carga el WASM como import estático, sin
// ambigüedad de resolución posible al importarla por ruta de archivo.
import { PrismaClient } from "../generated/prisma-client-workerd/edge";

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
