"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  imageUrl: string | null;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

const PLACEHOLDER = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80";

export function CatalogFilter({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const countByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of products) map[p.categoryId] = (map[p.categoryId] ?? 0) + 1;
    return map;
  }, [products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = !categoryId || p.categoryId === categoryId;
      const matchesSearch =
        !q || p.name.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, search, categoryId]);

  const activeCategoryName = categories.find((c) => c.id === categoryId)?.name;

  return (
    <div className="lg:grid lg:grid-cols-[230px_1fr] lg:items-start lg:gap-8">
      {/* Sidebar de categorías (desktop) */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm">
          <p className="mb-2 px-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
            Categorías
          </p>
          <nav className="space-y-0.5">
            <button
              type="button"
              onClick={() => setCategoryId(null)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                categoryId === null
                  ? "bg-brand-red-ultra text-brand-red"
                  : "text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <span>Todas</span>
              <span className="text-xs text-neutral-400">{products.length}</span>
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoryId(c.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                  categoryId === c.id
                    ? "bg-brand-red-ultra text-brand-red"
                    : "text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <span className="truncate">{c.name}</span>
                <span className="ml-2 shrink-0 text-xs text-neutral-400">
                  {countByCategory[c.id] ?? 0}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div>
        {/* Selector de categoría (mobile) + búsqueda */}
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full max-w-sm">
              <svg
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre o tipo de producto..."
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

            <select
              value={categoryId ?? ""}
              onChange={(e) => setCategoryId(e.target.value || null)}
              className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-800 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 shadow-sm lg:hidden"
            >
              <option value="">Todas las categorías ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({countByCategory[c.id] ?? 0})
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs sm:text-sm text-neutral-500 font-medium">
            Mostrando <span className="font-bold text-neutral-900">{filtered.length}</span> producto{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {activeCategoryName && (
          <div className="mb-6 flex items-center gap-3 border-b border-neutral-100 pb-3">
            <span className="h-5 w-1 rounded-full bg-brand-red" />
            <h2 className="text-lg font-black text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>
              {activeCategoryName}
            </h2>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 py-20 text-center bg-white/50">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red-ultra text-brand-red">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="mt-4 font-bold text-neutral-800">
              {search ? `No se encontraron productos para "${search}"` : "No hay productos en esta categoría"}
            </p>
            {(search || categoryId) && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategoryId(null);
                }}
                className="mt-4 text-xs font-bold text-brand-red hover:underline"
              >
                Quitar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCardItem key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCardItem({ product }: { product: Product }) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/30 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-50">
        <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold tracking-wide text-white shadow">
          PERUANO
        </span>
        <img
          src={product.imageUrl || PLACEHOLDER}
          alt={product.name}
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
          {product.categoryName}
        </span>
        <p className="mt-1.5 text-sm font-bold leading-tight text-neutral-800 group-hover:text-brand-red transition" style={{ fontFamily: "var(--font-display)" }}>
          {product.name}
        </p>
      </div>
    </Link>
  );
}
