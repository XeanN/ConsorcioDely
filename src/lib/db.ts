import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// SQL crudo vía el driver HTTP/WebSocket de Neon, sin pasar por el motor de
// queries de Prisma. Ese motor necesita cargar un módulo WebAssembly, y ni
// Turbopack ni webpack producen un bundle que respete las restricciones de
// Cloudflare Workers para WASM (varios intentos documentados en el
// historial de commits, cada uno con un error distinto) — Neon expone SQL
// directo, sin motor que cargar, evitando el problema de raíz. Los scripts
// (seed, etc.) siguen usando Prisma con el driver `pg`; corren en Node
// puro y nunca se bundlean para Workers.
let cached: NeonQueryFunction<false, false> | undefined;

export function sql(): NeonQueryFunction<false, false> {
  if (!cached) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL no está configurado");
    }
    cached = neon(connectionString);
  }
  return cached;
}
