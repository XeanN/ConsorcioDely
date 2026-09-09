// ID únicos para filas insertadas por SQL crudo (ver src/lib/db.ts) — sin
// Prisma de por medio no hay `@default(cuid())` automático.
export function newId(): string {
  return crypto.randomUUID();
}
