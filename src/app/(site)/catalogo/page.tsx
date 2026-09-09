import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/site/ProductCard";
import { sql } from "@/lib/db";
import { publicUrlFor } from "@/lib/media";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo — Consorcio Dely",
  description: "Aceites, conservas, mermeladas y más — todo nuestro catálogo de abarrotes.",
};

type CategoryRow = { id: string; name: string; slug: string };
type ProductRow = {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  r2Key: string | null;
};

export default async function CatalogPage() {
  const categories = (await sql()`
    SELECT id, name, slug FROM categories ORDER BY position ASC
  `) as CategoryRow[];

  const products = (await sql()`
    SELECT p.id, p.name, p.slug, c.name as "categoryName", m."r2Key" as "r2Key"
    FROM products p
    JOIN categories c ON c.id = p."categoryId"
    LEFT JOIN media m ON m.id = p."mediaId"
    WHERE p.active = true
    ORDER BY p.position ASC
  `) as ProductRow[];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">Catálogo</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/catalogo/${c.slug}`}
            className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-600 hover:border-neutral-500 hover:text-neutral-900"
          >
            {c.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">Todavía no hay productos publicados.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              href={`/producto/${p.slug}`}
              name={p.name}
              categoryName={p.categoryName}
              imageUrl={p.r2Key ? publicUrlFor(p.r2Key) : null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
