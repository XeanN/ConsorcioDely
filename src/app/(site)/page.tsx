import Link from "next/link";

import { sql } from "@/lib/db";
import { publicUrlFor } from "@/lib/media";
import { getRandomQuoteLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

type ContentBlockRow = { value: string };
type CategoryRow = { id: string; name: string; slug: string };
type HeroImageRow = { r2Key: string };
type SiteSettingRow = { address: string | null };

export default async function HomePage() {
  const [hero] = (await sql()`
    SELECT value FROM content_blocks WHERE key = 'hero_title' LIMIT 1
  `) as ContentBlockRow[];

  const categories = (await sql()`
    SELECT id, name, slug FROM categories ORDER BY position ASC
  `) as CategoryRow[];

  // Banner con una foto real ya subida al catálogo (la primera disponible).
  const [heroImage] = (await sql()`
    SELECT m."r2Key" as "r2Key"
    FROM products p
    JOIN media m ON m.id = p."mediaId"
    WHERE p.active = true
    ORDER BY p.position ASC
    LIMIT 1
  `) as HeroImageRow[];

  const [settings] = (await sql()`
    SELECT address FROM site_settings WHERE id = 1 LIMIT 1
  `) as SiteSettingRow[];

  const quoteLink = await getRandomQuoteLink("Hola, quisiera cotizar productos de Consorcio Dely");

  return (
    <div>
      <section
        className="relative border-b border-neutral-200 bg-neutral-900 bg-cover bg-center"
        style={heroImage ? { backgroundImage: `url(${publicUrlFor(heroImage.r2Key)})` } : undefined}
      >
        <div className="bg-black/55">
          <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
            <h1 className="text-3xl font-extrabold uppercase text-white sm:text-5xl">
              {hero?.value ?? "Crecemos Juntos"}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-neutral-200">
              Fabricamos, envasamos y distribuimos abarrotes a nivel nacional — tu aliado para
              hacer crecer tu negocio.
            </p>
            <Link
              href="/catalogo"
              className="mt-6 inline-block rounded-md bg-brand-red px-6 py-3 text-sm font-medium text-white hover:bg-brand-red-dark"
            >
              Conoce más
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-lg font-semibold text-neutral-900">Categorías</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/catalogo/${c.slug}`}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-6 text-center text-sm font-medium text-neutral-700 hover:border-brand-red hover:text-brand-red hover:shadow-sm"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-brand-red p-6 text-white">
            <p className="text-lg font-bold">PUNTOS DE VENTA</p>
            <p className="mt-2 text-sm text-white/90">
              {settings?.address ?? "Escríbenos para conocer nuestro punto de venta más cercano."}
            </p>
          </div>
          <div className="rounded-xl bg-brand-red p-6 text-white">
            <p className="text-lg font-bold">TIENDA ONLINE</p>
            {quoteLink ? (
              <a
                href={quoteLink}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-semibold underline underline-offset-2"
              >
                Cotiza por WhatsApp →
              </a>
            ) : (
              <p className="mt-2 text-sm text-white/90">Consulta nuestro catálogo completo.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
