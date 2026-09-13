import type { Metadata } from "next";
import Link from "next/link";

import { CatalogFilter } from "@/components/site/CatalogFilter";
import { sql } from "@/lib/db";
import { publicUrlFor } from "@/lib/media";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo de Productos",
  description: "Aceites, conservas, mermeladas y abarrotes al por mayor. Consorcio Dely.",
  alternates: { canonical: "/catalogo" },
};

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

export default async function CatalogPage() {
  const categories = (await sql()`
    SELECT id, name, slug FROM categories ORDER BY position ASC
  `) as CategoryRow[];

  const products = (await sql()`
    SELECT
      p.id, p.name, p.slug,
      p."categoryId",
      c.name as "categoryName",
      c.slug as "categorySlug",
      m."r2Key" as "r2Key"
    FROM products p
    JOIN categories c ON c.id = p."categoryId"
    LEFT JOIN media m ON m.id = p."mediaId"
    WHERE p.active = true
    ORDER BY c.position ASC, p.position ASC
  `) as ProductRow[];

  const mapped = products.map((p) => ({
    ...p,
    imageUrl: p.r2Key ? publicUrlFor(p.r2Key) : null,
  }));

  return (
    <div>
      {/* Hero banner */}
      <div
        className="relative overflow-hidden py-16 sm:py-20"
        style={{ background: "linear-gradient(135deg, #1a0000 0%, #6b0000 50%, #e4231b 100%)" }}
      >
        <div aria-hidden className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white opacity-5" />
        <div aria-hidden className="absolute -bottom-10 left-8 h-40 w-40 rounded-full bg-white opacity-5" />
        
        <div className="relative mx-auto max-w-6xl px-6 text-center text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Más de 500 productos
          </span>
          <h1
            className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}
          >
            Catálogo de Productos
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            Aceites, conservas, mermeladas y abarrotes — todo lo que tu negocio necesita en un solo lugar.
          </p>

          {/* Category quick links in Hero banner: each link navigates to its own dedicated page */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Link
              href="/catalogo"
              className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-brand-red shadow-md transition-all hover:scale-105"
            >
              Todos
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/catalogo/${c.slug}`}
                className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm transition-all hover:bg-white hover:text-brand-red hover:border-white"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and products container */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <CatalogFilter products={mapped} categories={categories} />
      </div>
    </div>
  );
}