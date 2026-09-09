import { sql } from "@/lib/db";

type SalesRepRow = { whatsapp: string };

// Elige una ejecutiva activa al azar (reparto de cotizaciones) y arma el
// link wa.me con el mensaje prellenado. Devuelve null si no hay ninguna
// activa (no debería pasar en producción, pero evita romper la página).
export async function getRandomQuoteLink(message: string): Promise<string | null> {
  const reps = (await sql()`
    SELECT whatsapp FROM sales_reps WHERE active = true
  `) as SalesRepRow[];

  if (reps.length === 0) return null;

  const rep = reps[Math.floor(Math.random() * reps.length)];
  const phone = rep.whatsapp.replace(/[^0-9]/g, "");
  return `https://wa.me/51${phone}?text=${encodeURIComponent(message)}`;
}
