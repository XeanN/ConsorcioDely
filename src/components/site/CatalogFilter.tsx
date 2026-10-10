"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, Suspense } from "react";

import { getSecondaryImage, PRODUCT_GALLERIES } from "@/lib/product-gallery";

type Product = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  brandName?: string;
  imageUrl: string | null;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  count?: number;
};

const PLACEHOLDER = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80";

function CatalogFilterContent({
  products,
  categories,
  currentCategorySlug,
  totalProductCount,
}: {
  products: Product[];
  categories: Category[];
  currentCategorySlug?: string | null;
  totalProductCount?: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") || searchParams.get("marca") || "");

  // Re-sincroniza el buscador si cambian los query params (ej. al hacer clic
  // en otra marca del muro estando ya en /catalogo). Se ajusta durante el
  // render en vez de un useEffect, que dispararía un set-state-in-effect lint error.
  const searchParamsKey = searchParams.toString();
  const [prevParamsKey, setPrevParamsKey] = useState(searchParamsKey);
  if (searchParamsKey !== prevParamsKey) {
    setPrevParamsKey(searchParamsKey);
    const q = searchParams.get("q") || searchParams.get("marca");
    if (q) setSearch(q);
  }

  // Si las categorías ya traen count desde la DB, usamos ese count. Si no, calculamos.
  const countByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of categories) {
      if (typeof c.count === "number") {
        map[c.id] = c.count;
      }
    }
    // Si no venía count en categories, calculamos desde products
    if (Object.keys(map).length === 0) {
      for (const p of products) {
        map[p.categoryId] = (map[p.categoryId] ?? 0) + 1;
      }
    }
    return map;
  }, [categories, products]);

  const totalCount = totalProductCount ?? products.length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        (p.brandName && p.brandName.toLowerCase().includes(q))
      );
    });
  }, [products, search]);

  const activeCategory = categories.find((c) => c.slug === currentCategorySlug);

  return (
    <div className="lg:grid lg:grid-cols-[250px_1fr] lg:items-start lg:gap-8">
      {/* ══ SIDEBAR DE CATEGORÍAS (Desktop) ══ */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-neutral-200/80 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between px-2 mb-2 pb-2 border-b border-neutral-100">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              Categorías
            </p>
            <span className="text-[10px] font-bold text-brand-red bg-brand-red-ultra px-2 py-0.5 rounded-full">
              {categories.length}
            </span>
          </div>

          <nav className="space-y-1">
            {/* Opción "Todas las categorías" */}
            <Link
              href="/catalogo"
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-all duration-200 ${
                !currentCategorySlug
                  ? "bg-brand-red text-white font-bold shadow-md shadow-brand-red/20 scale-[1.02]"
                  : "text-neutral-700 hover:bg-neutral-50 hover:text-brand-red font-semibold"
              }`}
            >
              <span>Todas las categorías</span>
              <span
                className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                  !currentCategorySlug ? "bg-white/25 text-white" : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {totalCount}
              </span>
            </Link>

            {/* Lista de cada categoría individual como Link real */}
            {categories.map((c) => {
              const isSelected = currentCategorySlug === c.slug;
              const count = countByCategory[c.id] ?? c.count ?? 0;

              return (
                <Link
                  key={c.id}
                  href={`/catalogo/${c.slug}`}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-all duration-200 ${
                    isSelected
                      ? "bg-brand-red text-white font-bold shadow-md shadow-brand-red/20 scale-[1.02]"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-brand-red font-medium"
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span
                    className={`ml-2 shrink-0 text-[10px] font-bold rounded-full px-2 py-0.5 ${
                      isSelected ? "bg-white/25 text-white" : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {count}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ══ ZONA PRINCIPAL DE PRODUCTOS Y BUSCADOR ══ */}
      <div>
        {/* Selector de categoría (mobile) + Barra de búsqueda */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full max-w-xl">
            {/* Buscador */}
            <div className="relative w-full max-w-sm">
              <svg
                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={
                  activeCategory
                    ? `Buscar en ${activeCategory.name}...`
                    : "Buscar producto, categoría o marca..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-white py-2.5 pl-10 pr-9 text-sm text-neutral-800 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Selector desplegable en móvil que redirige */}
            <select
              value={currentCategorySlug ?? ""}
              onChange={(e) => {
                const slug = e.target.value;
                router.push(slug ? `/catalogo/${slug}` : "/catalogo");
              }}
              className="w-full max-w-xs rounded-2xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-800 outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 shadow-sm lg:hidden font-medium"
            >
              <option value="">Todas las categorías ({totalCount})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name} ({countByCategory[c.id] ?? c.count ?? 0})
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs sm:text-sm text-neutral-500 font-medium">
            Mostrando <span className="font-bold text-neutral-900">{filtered.length}</span> de {products.length} producto{products.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Banner de búsqueda activa */}
        {search && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium">Búsqueda activa:</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-700">
              <span>&ldquo;{search}&rdquo;</span>
              <button onClick={() => setSearch("")} className="hover:text-brand-red font-bold">×</button>
            </span>
            <button
              onClick={() => setSearch("")}
              className="text-xs font-semibold text-brand-red hover:underline ml-2"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        {/* Grilla de productos */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 py-20 text-center bg-white/50">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red-ultra text-brand-red">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="mt-4 font-bold text-neutral-800">No se encontraron productos</p>
            <p className="mt-1 text-xs text-neutral-500">
              {activeCategory
                ? `No hay productos que coincidan en la categoría ${activeCategory.name}.`
                : "Prueba con otra palabra clave o selecciona una categoría."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-xs font-bold text-brand-red hover:underline"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCardItem key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CatalogFilter(props: {
  products: Product[];
  categories: Category[];
  currentCategorySlug?: string | null;
  totalProductCount?: number;
}) {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-neutral-400">Cargando catálogo...</div>}>
      <CatalogFilterContent {...props} />
    </Suspense>
  );
}

function ProductCardItem({ product }: { product: Product }) {
  const secondaryImg = getSecondaryImage(product.slug);
  const galleryCount = PRODUCT_GALLERIES[product.slug]?.length ?? 1;

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/30 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-50">
        <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold tracking-wide text-white shadow">
          PERUANO
        </span>
        {galleryCount > 1 && (
          <span className="absolute right-2.5 top-2.5 z-10 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold text-white shadow backdrop-blur-sm">
            {galleryCount} fotos
          </span>
        )}
        <img
          src={product.imageUrl || PLACEHOLDER}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover transition-all duration-500 ${
            secondaryImg ? "group-hover:opacity-0" : "group-hover:scale-110"
          }`}
        />
        {secondaryImg && (
          <img
            src={secondaryImg}
            alt={`${product.name} — vista alternativa`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-neutral-900 shadow">
            Ver detalle →
          </span>
        </div>
      </div>

      <div className="p-3.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-block rounded-full bg-brand-red-ultra px-2 py-0.5 text-[10px] font-bold text-brand-red truncate max-w-[120px]">
            {product.categoryName}
          </span>
          {product.brandName && (
            <span className="inline-block rounded-full bg-neutral-100 px-1.5 py-0.5 text-[9px] font-bold text-neutral-500 truncate max-w-[90px]">
              {product.brandName}
            </span>
          )}
        </div>
        <p className="mt-1.5 text-sm font-bold leading-tight text-neutral-800 group-hover:text-brand-red transition line-clamp-2" style={{ fontFamily: "var(--font-display)" }}>
          {product.name}
        </p>
      </div>
    </Link>
  );
}
