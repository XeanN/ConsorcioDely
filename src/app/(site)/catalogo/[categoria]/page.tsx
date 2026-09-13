import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { CategoryProductGrid } from "@/components/site/CategoryProductGrid";
import { sql } from "@/lib/db";
import { publicUrlFor } from "@/lib/media";

export const dynamic = "force-dynamic";

type CategoryRow = { id: string; name: string; slug: string };
type ProductRow = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  r2Key: string | null;
};

const CATEGORY_IMAGES: Record<string, string> = {
  vegetal: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&q=80",
  "conserva-de-atun": "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=1200&q=80",
  mermelada: "https://images.unsplash.com/photo-1588329261990-72541f5f4ad5?w=1200&q=80",
  avena: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
  paneton: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80",
  "chocolate-de-taza": "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=1200&q=80",
  detergente: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=1200&q=80",
  pae: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
};

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80";

const getCategory = cache(async (slug: string) => {
  const [category] = (await sql()`
    SELECT id, name, slug FROM categories WHERE slug = ${slug} LIMIT 1
  `) as CategoryRow[];
  return category ?? null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const category = await getCategory(categoria);
  if (!category) return {};

  return {
    title: `${category.name} — Catálogo Consorcio Dely`,
    description: `Productos de la categoría ${category.name} en Consorcio Dely. Fabricación y distribución a nivel nacional.`,
    alternates: { canonical: `/catalogo/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const category = await getCategory(categoria);

  if (!category) {
    notFound();
  }

  const allCategories = (await sql()`
    SELECT id, name, slug FROM categories ORDER BY position ASC
  `) as CategoryRow[];

  // Traer ÚNICAMENTE los productos que corresponden a esta categoría
  const categoryProductsRaw = (await sql()`
    SELECT
      p.id, p.name, p.slug,
      p."categoryId",
      c.name as "categoryName",
      c.slug as "categorySlug",
      m."r2Key" as "r2Key"
    FROM products p
    JOIN categories c ON c.id = p."categoryId"
    LEFT JOIN media m ON m.id = p."mediaId"
    WHERE p.active = true AND p."categoryId" = ${category.id}
    ORDER BY p.position ASC
  `) as ProductRow[];

  const categoryProducts = categoryProductsRaw.map((p) => ({
    ...p,
    imageUrl: p.r2Key ? publicUrlFor(p.r2Key) : null,
  }));

  const bgImg = CATEGORY_IMAGES[category.slug] || PLACEHOLDER_IMG;

  return (
    <div>
      {/* ══ HERO BANNER CATEGORÍA ══ */}
      <div className="relative overflow-hidden py-16 sm:py-20" style={{ background: "linear-gradient(135deg, #1a0000 0%, #6b0000 50%, #e4231b 100%)" }}>
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
            {categoryProducts.length} producto{categoryProducts.length !== 1 ? "s" : ""} disponible{categoryProducts.length !== 1 ? "s" : ""} para distribución inmediata
          </p>

          {/* Menú del Hero: La navegación principal entre categorías */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Link
              href="/catalogo"
              className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-brand-red hover:border-white"
            >
              Todos
            </Link>
            {allCategories.map((c) => {
              const isCurrent = c.slug === category.slug;
              return (
                <Link
                  key={c.id}
                  href={`/catalogo/${c.slug}`}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold backdrop-blur-sm transition ${
                    isCurrent
                      ? "bg-white text-brand-red shadow-lg scale-105 ring-2 ring-white/50"
                      : "border border-white/30 bg-white/10 text-white/90 hover:bg-white hover:text-brand-red hover:border-white"
                  }`}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ CONTENIDO: PRODUCTOS DE ESTA CATEGORÍA CONECTADOS DIRECTAMENTE ══ */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <CategoryProductGrid
          products={categoryProducts}
          categoryName={category.name}
        />
      </div>
    </div>
  );
}