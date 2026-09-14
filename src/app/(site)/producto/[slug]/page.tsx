import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { sql } from "@/lib/db";
import { publicUrlFor } from "@/lib/media";
import { buildQuoteMessage, getRandomQuoteLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

type NutritionRow = { label: string; value: string; dailyValue?: string };

type ProductDetail = {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  brandName: string;
  r2Key: string | null;
  nutritionServingSize: string | null;
  nutritionServingsPerContainer: string | null;
  nutritionFacts: NutritionRow[] | null;
};

type VariantRow = {
  id: string;
  presentation: string | null;
  weight: string;
  packSize: string | null;
  sku: string | null;
  r2Key: string | null;
};

type RelatedProduct = {
  id: string;
  name: string;
  slug: string;
  r2Key: string | null;
};

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80";

const getProduct = cache(async (slug: string) => {
  const [product] = (await sql()`
    SELECT p.id, p.name, p.description, p."categoryId", c.name as "categoryName", c.slug as "categorySlug", b.name as "brandName", m."r2Key" as "r2Key",
      p."nutritionServingSize", p."nutritionServingsPerContainer", p."nutritionFacts"
    FROM products p
    JOIN categories c ON c.id = p."categoryId"
    JOIN brands b ON b.id = p."brandId"
    LEFT JOIN media m ON m.id = p."mediaId"
    WHERE p.slug = ${slug} AND p.active = true
    LIMIT 1
  `) as ProductDetail[];
  return product ?? null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  const description =
    product.description ?? `${product.name} (${product.brandName}) — ${product.categoryName}. Calidad garantizada Consorcio Dely.`;
  const imageUrl = product.r2Key ? publicUrlFor(product.r2Key) : undefined;

  return {
    title: `${product.name} - Consorcio Dely`,
    description,
    alternates: { canonical: `/producto/${slug}` },
    openGraph: {
      title: product.name,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const variants = (await sql()`
    SELECT v.id, v.presentation, v.weight, v."packSize", v.sku, m."r2Key" as "r2Key"
    FROM variants v
    LEFT JOIN media m ON m.id = v."mediaId"
    WHERE v."productId" = ${product.id} AND v.active = true
    ORDER BY v.position ASC
  `) as VariantRow[];

  const related = (await sql()`
    SELECT p.id, p.name, p.slug, m."r2Key" as "r2Key"
    FROM products p
    LEFT JOIN media m ON m.id = p."mediaId"
    WHERE p."categoryId" = ${product.categoryId} AND p.id != ${product.id} AND p.active = true
    ORDER BY p.position ASC
    LIMIT 4
  `) as RelatedProduct[];

  const quoteLink = await getRandomQuoteLink(buildQuoteMessage(product.name));

  const mainImageUrl = product.r2Key
    ? publicUrlFor(product.r2Key)
    : variants.find((v) => v.r2Key)?.r2Key
      ? publicUrlFor(variants.find((v) => v.r2Key)!.r2Key!)
      : PLACEHOLDER_IMG;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: product.r2Key ? publicUrlFor(product.r2Key) : undefined,
    brand: { "@type": "Brand", name: product.brandName },
    category: product.categoryName,
  };

  const baseUrl = process.env.SITE_URL ?? "https://consorciodely-web.angel-xp-pb.workers.dev";
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Catálogo", item: `${baseUrl}/catalogo` },
      {
        "@type": "ListItem",
        position: 2,
        name: product.categoryName,
        item: `${baseUrl}/catalogo/${product.categorySlug}`,
      },
      { "@type": "ListItem", position: 3, name: product.name, item: `${baseUrl}/producto/${slug}` },
    ],
  };

  return (
    <div className="bg-neutral-50/50 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* Breadcrumb */}
        <nav aria-label="Ruta de navegación" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-neutral-400">
          <Link href="/" className="hover:text-brand-red transition">Inicio</Link>
          <span>/</span>
          <Link href="/catalogo" className="hover:text-brand-red transition">Catálogo</Link>
          <span>/</span>
          <Link href={`/catalogo/${product.categorySlug}`} className="hover:text-brand-red transition font-medium text-neutral-600">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="font-bold text-neutral-900 truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </nav>

        {/* Product details main card */}
        <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-10">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            
            {/* Columna Izquierda: Imagen */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50">
                <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5">
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                    Producto Peruano
                  </span>
                  <span className="rounded-full bg-brand-red px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                    Calidad Dely
                  </span>
                </div>

                <img
                  src={mainImageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Beneficios al pie de foto */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-neutral-600">
                <div className="rounded-xl bg-neutral-50 p-2.5">
                  <span className="block text-brand-red font-black">100%</span>
                  Garantía de calidad
                </div>
                <div className="rounded-xl bg-neutral-50 p-2.5">
                  <span className="block text-brand-red font-black">Nacional</span>
                  Envío a provincias
                </div>
                <div className="rounded-xl bg-neutral-50 p-2.5">
                  <span className="block text-brand-red font-black">Mayorista</span>
                  Precios por volumen
                </div>
              </div>
            </div>

            {/* Columna Derecha: Información */}
            <div className="lg:col-span-6 flex flex-col">
              
              {/* Badges de marca y categoría */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-red-ultra px-3 py-1 text-xs font-bold text-brand-red">
                  {product.categoryName}
                </span>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600">
                  Marca: {product.brandName}
                </span>
              </div>

              {/* Título */}
              <h1 className="mt-3 text-2xl font-black text-neutral-900 sm:text-3xl lg:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
                {product.name}
              </h1>

              {/* Descripción */}
              <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                {product.description || "Elaborado bajo estrictos controles de calidad e higiene, ideal para abastecer bodegas, restaurantes, panaderías y comercios minoristas con el mejor rendimiento y sabor."}
              </p>

              {/* Presentaciones */}
              {variants.length > 0 && (
                <div className="mt-6 border-t border-neutral-100 pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Presentaciones Disponibles ({variants.length})
                  </h3>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {variants.map((v) => (
                      <div
                        key={v.id}
                        className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-3 transition hover:border-brand-red/40 hover:bg-white"
                      >
                        <p className="text-sm font-bold text-neutral-800">
                          {v.presentation ? v.presentation : v.weight}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-neutral-500">
                          <span>Peso: <strong className="text-neutral-700">{v.weight}</strong></span>
                          {v.packSize && <span>· Empaque: <strong className="text-neutral-700">{v.packSize}</strong></span>}
                          {v.sku && <span>· SKU: {v.sku}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Información Nutricional */}
              {product.nutritionFacts && product.nutritionFacts.length > 0 && (
                <div className="mt-6 border-t border-neutral-100 pt-6">
                  <details className="group rounded-2xl border border-neutral-200/80 bg-white">
                    <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-xs font-bold uppercase tracking-wider text-neutral-700">
                      <span>Información Nutricional</span>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition group-open:rotate-180">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </summary>
                    <div className="border-t border-neutral-100 p-4 pt-2 text-xs text-neutral-600">
                      {product.nutritionServingSize && (
                        <p className="font-semibold text-neutral-800">Porción: {product.nutritionServingSize}</p>
                      )}
                      {product.nutritionServingsPerContainer && (
                        <p className="text-neutral-500">Porciones por envase: {product.nutritionServingsPerContainer}</p>
                      )}
                      <table className="mt-3 w-full text-left">
                        <thead>
                          <tr className="border-b border-neutral-200 text-[10px] uppercase tracking-wider text-neutral-400">
                            <th className="py-1">Nutriente</th>
                            <th className="py-1">Cantidad</th>
                            <th className="py-1 text-right">% VD</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {product.nutritionFacts.map((row, i) => (
                            <tr key={i}>
                              <td className="py-1.5 font-medium text-neutral-800">{row.label}</td>
                              <td className="py-1.5 text-neutral-600">{row.value}</td>
                              <td className="py-1.5 text-right text-neutral-400">{row.dailyValue || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                </div>
              )}

              {/* Botones de acción */}
              <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col gap-3 sm:flex-row">
                {quoteLink && (
                  <a
                    href={quoteLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2.5 rounded-full bg-brand-green px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-green/20 transition-all hover:brightness-95 hover:shadow-xl active:scale-[0.98]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <svg viewBox="0 0 32 32" className="h-5 w-5 fill-white">
                      <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.36.696 4.56 1.89 6.406L4 29l7.79-1.85A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Z" />
                    </svg>
                    Cotizar por WhatsApp
                  </a>
                )}
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-6 py-3.5 text-sm font-bold text-neutral-700 transition hover:border-brand-red hover:text-brand-red hover:bg-white"
                >
                  Contactar Asesor
                </Link>
              </div>

            </div>
          </div>
        </div>

        {/* ══ PRODUCTOS RELACIONADOS ══ */}
        {related.length > 0 && (
          <div className="mt-14">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Misma categoría</span>
                <h2 className="mt-1 text-xl font-black text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>
                  Otros productos en {product.categoryName}
                </h2>
              </div>
              <Link
                href={`/catalogo/${product.categorySlug}`}
                className="text-xs font-bold text-brand-red hover:underline"
              >
                Ver todos ({product.categoryName}) →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {related.map((r) => {
                const img = r.r2Key ? publicUrlFor(r.r2Key) : PLACEHOLDER_IMG;
                return (
                  <Link
                    key={r.id}
                    href={`/producto/${r.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-brand-red/30 hover:shadow-md"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-50">
                      <img
                        src={img}
                        alt={r.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-2 text-xs font-bold text-neutral-800 group-hover:text-brand-red transition truncate" style={{ fontFamily: "var(--font-display)" }}>
                      {r.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-neutral-400">Ver presentación →</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}