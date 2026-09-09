import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/site/ProductCard";
import { sql } from "@/lib/db";
import { publicUrlFor } from "@/lib/media";

export const dynamic = "force-dynamic";

type CategoryRow = { id: string; name: string; slug: string };
type ProductRow = {
  id: string;
  name: string;
  slug: string;
  r2Key: string | null;
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;

  const [category] = (await sql()`
    SELECT id, name, slug FROM categories WHERE slug = ${categoria} LIMIT 1
  `) as CategoryRow[];

  if (!category) {
    notFound();
  }

  const products = (await sql()`
    SELECT p.id, p.name, p.slug, m."r2Key" as "r2Key"
    FROM products p
    LEFT JOIN media m ON m.id = p."mediaId"
    WHERE p.active = true AND p."categoryId" = ${category.id}
    ORDER BY p.position ASC
  `) as ProductRow[];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/catalogo" className="text-sm text-neutral-500 hover:underline">
        ← Todo el catálogo
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-neutral-900">{category.name}</h1>

      {products.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">Todavía no hay productos en esta categoría.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              href={`/producto/${p.slug}`}
              name={p.name}
              categoryName={category.name}
              imageUrl={p.r2Key ? publicUrlFor(p.r2Key) : null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
