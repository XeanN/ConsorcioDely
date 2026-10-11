import { sql } from "@/lib/db";

type SalesRepRow = { whatsapp: string };

// Mensaje base pedido explícitamente por el cliente para todos los botones
// de "Cotizar por WhatsApp". Cuando se pasa un producto, se señala por su
// nombre dentro de la misma frase en vez de listarlo aparte.
export function buildQuoteMessage(productName?: string): string {
  const interest = productName ? `en su producto ${productName}` : "en sus productos";
  return `Hola, estoy interesado(a) ${interest}. Quisiera solicitar una cotización, por favor.`;
}

// Números de las ejecutivas activas (reparto de cotizaciones), solo
// dígitos. Se usa junto con <WhatsAppCta> para elegir al azar en CADA
// clic del lado del cliente, en vez de una sola vez al renderizar la
// página en el servidor (con solo 2 activas, recargar un par de veces
// y ver "siempre el mismo número" se siente roto aunque no lo esté).
export async function getActiveQuotePhones(): Promise<string[]> {
  const reps = (await sql()`
    SELECT whatsapp FROM sales_reps WHERE active = true
  `) as SalesRepRow[];
  return reps.map((r) => r.whatsapp.replace(/[^0-9]/g, ""));
}
