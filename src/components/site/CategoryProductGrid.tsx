"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  imageUrl: string | null;
};

const PLACEHOLDER = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80";

export function CategoryProductGrid({
  products,
  categoryName,
}: {
  products: Product[];
  categoryName: string;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, search]);

  return (
    <div>
      {/* Search & Info Bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <svg
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={`Buscar en ${categoryName}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-neutral-200 bg-white py-2.5 pl-10 pr-9 text-sm text-neutral-800 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <p className="text-xs sm:text-sm text-neutral-500 font-medium">
            Mostrando <span className="font-bold text-neutral-900">{filtered.length}</span> de {products.length} productos
          </p>
          <Link
            href="/catalogo"
            className="text-xs font-semibold text-brand-red hover:underline hidden sm:inline-block"
          >
            ← Todo el catálogo
          </Link>
        </div>
      </div>

      {/* Grid of products */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 py-20 text-center bg-white/50">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red-ultra text-brand-red">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="mt-4 font-bold text-neutral-800">No se encontraron productos para &quot;{search}&quot;</p>
          <button
            onClick={() => setSearch("")}
            className="mt-4 text-xs font-bold text-brand-red hover:underline"
          >
            Limpiar búsqueda
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/producto/${p.slug}`}
              className="group block overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/30 hover:shadow-lg"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-50">
                <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold tracking-wide text-white shadow">
                  PERUANO
                </span>
                <img
                  src={p.imageUrl || PLACEHOLDER}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-neutral-900 shadow">
                    Ver detalle →
                  </span>
                </div>
              </div>

              <div className="p-3.5">
                <span className="inline-block rounded-full bg-brand-red-ultra px-2 py-0.5 text-[10px] font-bold text-brand-red">
                  {p.categoryName}
                </span>
                <p className="mt-1.5 text-sm font-bold leading-tight text-neutral-800 group-hover:text-brand-red transition" style={{ fontFamily: "var(--font-display)" }}>
                  {p.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-xs font-bold text-neutral-700 hover:border-brand-red hover:text-brand-red shadow-sm transition"
        >
          ← Volver a ver todas las categorías
        </Link>
      </div>
    </div>
  );
}