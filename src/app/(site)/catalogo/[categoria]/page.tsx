import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

import { CatalogFilter } from "@/components/site/CatalogFilter";
import { categoryImageFor } from "@/lib/category-images";
import { sql } from "@/lib/db";
import { publicUrlFor } from "@/lib/media";

export const dynamic = "force-dynamic";

type CategoryRow = { id: string; name: string; slug: string; count: number };
type ProductRow = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  brandName: string | null;
  r2Key: string | null;
};

const getCategory = cache(async (slug: string) => {
  const [category] = (await sql()`
    SELECT id, name, slug FROM categories WHERE slug = ${slug} LIMIT 1
  `) as { id: string; name: string; slug: string }[];
  return category ?? null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  if (categoria === "pae") {
    return {
      title: "Programa de Alimentación Escolar (PAE) — Consorcio Dely",
    };
  }
  const category = await getCategory(categoria);
  if (!category) return {};

  return {
    title: `${category.name} — Catálogo Consorcio Dely`,
    description: `Productos de la categoría ${category.name} en Consorcio Dely. Fabricación y venta directa.`,
    alternates: { canonical: `/catalogo/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  if (categoria === "pae") {
    redirect("/pae");
  }
  const category = await getCategory(categoria);

  if (!category) {
    notFound();
  }

  // Solo categorías con al menos un producto activo para la barra lateral
  // (mismo criterio que /catalogo — evita links a páginas vacías).
  const allCategories = (await sql()`
    SELECT c.id, c.name, c.slug, count(p.id)::int as count
    FROM categories c
    JOIN products p ON p."categoryId" = c.id AND p.active = true
    GROUP BY c.id, c.name, c.slug, c.position
    ORDER BY c.position ASC
  `) as CategoryRow[];

  // Total de productos activos en la empresa para "Todas las categorías"
  const [totalRow] = (await sql()`
    SELECT count(id)::int as total FROM products WHERE active = true
  `) as { total: number }[];

  // Traer ÚNICAMENTE los productos que pertenecen a ESTA categoría
  const categoryProductsRaw = (await sql()`
    SELECT
      p.id, p.name, p.slug,
      p."categoryId",
      c.name as "categoryName",
      c.slug as "categorySlug",
      b.name as "brandName",
      m."r2Key" as "r2Key"
    FROM products p
    JOIN categories c ON c.id = p."categoryId"
    LEFT JOIN brands b ON b.id = p."brandId"
    LEFT JOIN media m ON m.id = p."mediaId"
    WHERE p.active = true AND p."categoryId" = ${category.id}
    ORDER BY p.position ASC
  `) as ProductRow[];

  const categoryProducts = categoryProductsRaw.map((p) => ({
    ...p,
    brandName: p.brandName ?? undefined,
    imageUrl: p.r2Key ? publicUrlFor(p.r2Key) : null,
  }));

  // Categoría sin productos activos todavía -> no indexar/mostrar página vacía.
  if (categoryProducts.length === 0) {
    notFound();
  }

  const bgImg = categoryImageFor(category.slug);

  return (
    <div>
      {/* ══ HERO BANNER CATEGORÍA ══ */}
      <div
        className="relative overflow-hidden py-16 sm:py-20"
        style={{ background: "linear-gradient(135deg, #1a0000 0%, #6b0000 50%, #e4231b 100%)" }}
      >
        <Image
          src={bgImg}
          alt=""
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="relative mx-auto max-w-6xl px-6 text-center text-white">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white transition mb-3"
          >
            ← Volver a todo el catálogo
          </Link>
          <h1
            className="text-4xl font-black uppercase tracking-tight sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}
          >
            {category.name}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
            {categoryProducts.length} producto{categoryProducts.length !== 1 ? "s" : ""} disponible{categoryProducts.length !== 1 ? "s" : ""} en tienda
          </p>
        </div>
      </div>

      {/* ══ CONTENIDO: Catálogo con barra lateral unificada y SOLO los productos de esta categoría ══ */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <CatalogFilter
          products={categoryProducts}
          categories={allCategories}
          currentCategorySlug={category.slug}
          totalProductCount={totalRow?.total ?? 0}
        />
      </div>
    </div>
  );
}