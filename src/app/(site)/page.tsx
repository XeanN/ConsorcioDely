import Link from "next/link";

import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

type ContentBlockRow = { value: string };
type CategoryRow = { id: string; name: string; slug: string };

export default async function HomePage() {
  const [hero] = (await sql()`
    SELECT value FROM content_blocks WHERE key = 'hero_title' LIMIT 1
  `) as ContentBlockRow[];

  const categories = (await sql()`
    SELECT id, name, slug FROM categories ORDER BY position ASC
  `) as CategoryRow[];

  return (
    <div>
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            {hero?.value ?? "Crecemos Juntos"}
          </h1>
          <p className="mt-4 text-base text-neutral-500">
            Fabricamos, envasamos y distribuimos abarrotes a nivel nacional — tu aliado para hacer
            crecer tu negocio.
          </p>
          <Link
            href="/catalogo"
            className="mt-6 inline-block rounded-md bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Ver catálogo
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="text-lg font-semibold text-neutral-900">Categorías</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/catalogo/${c.slug}`}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-6 text-center text-sm font-medium text-neutral-700 hover:border-neutral-300 hover:shadow-sm"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
