import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// El CLI de Prisma (migrate, studio) usa DIRECT_URL: conexión directa a Neon
// (sin -pooler), necesaria porque los advisory locks de `migrate` no
// sobreviven bien al pooling. El runtime de la app usa DATABASE_URL vía
// src/lib/db.ts — en local es Neon directo, en producción es el binding de
// Cloudflare Hyperdrive.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL"),
  },
});
