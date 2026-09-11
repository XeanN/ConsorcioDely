import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { sql } from "@/lib/db";
import { publicUrlFor } from "@/lib/media";
import { getRandomQuoteLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

type NutritionRow = { label: string; value: string; dailyValue?: string };

type ProductDetail = {
  id: string;
  name: string;
  description: string | null;
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
  sku: string | null;
  r2Key: string | null;
};

// cache(): React memoiza esto por request, así generateMetadata y la
// página no duplican la misma consulta a la base.
const getProduct = cache(async (slug: string) => {
  const [product] = (await sql()`
    SELECT p.id, p.name, p.description, c.name as "categoryName", c.slug as "categorySlug", b.name as "brandName", m."r2Key" as "r2Key",
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
    product.description ?? `${product.name} (${product.brandName}) — ${product.categoryName}.`;
  const imageUrl = product.r2Key ? publicUrlFor(product.r2Key) : undefined;

  return {
    title: product.name,
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
    SELECT v.id, v.presentation, v.weight, v.sku, m."r2Key" as "r2Key"
    FROM variants v
    LEFT JOIN media m ON m.id = v."mediaId"
    WHERE v."productId" = ${product.id} AND v.active = true
    ORDER BY v.position ASC
  `) as VariantRow[];

  const quoteLink = await getRandomQuoteLink(
    `Hola, quisiera cotizar: ${product.name} (${product.brandName})`
  );

  const imageUrl = product.r2Key
    ? publicUrlFor(product.r2Key)
    : variants.find((v) => v.r2Key)?.r2Key
      ? publicUrlFor(variants.find((v) => v.r2Key)!.r2Key!)
      : null;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: imageUrl ?? undefined,
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
    <div className="mx-auto max-w-4xl px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav aria-label="Ruta de navegación" className="flex flex-wrap gap-1 text-sm text-neutral-500">
        <Link href="/catalogo" className="hover:underline">
          Catálogo
        </Link>
        <span>/</span>
        <Link href={`/catalogo/${product.categorySlug}`} className="hover:underline">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-neutral-700">{product.name}</span>
      </nav>

      <div className="mt-4 grid gap-8 sm:grid-cols-2">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-neutral-100">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              Sin foto
            </div>
          )}
        </div>

        <div>
          <p className="text-xs text-neutral-400">
            {product.categoryName} · {product.brandName}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-neutral-900">{product.name}</h1>
          {product.description && (
            <p className="mt-3 text-sm text-neutral-600">{product.description}</p>
          )}

          {variants.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-neutral-700">Presentaciones</p>
              <ul className="mt-2 space-y-1 text-sm text-neutral-600">
                {variants.map((v) => (
                  <li key={v.id}>
                    {v.presentation ? `${v.presentation} — ` : ""}
                    {v.weight}
                    {v.sku && <span className="text-neutral-400"> · SKU {v.sku}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {product.nutritionFacts && product.nutritionFacts.length > 0 && (
            <details className="mt-6 rounded-md border border-neutral-200">
              <summary className="cursor-pointer select-none px-4 py-3 text-sm font-medium text-brand-green">
                Tabla nutricional
              </summary>
              <div className="border-t border-neutral-200 px-4 py-3 text-sm text-neutral-600">
                {product.nutritionServingSize && <p>Porción: {product.nutritionServingSize}</p>}
                {product.nutritionServingsPerContainer && (
                  <p>Porciones por envase: {product.nutritionServingsPerContainer}</p>
                )}
                <table className="mt-2 w-full text-left text-sm">
                  <tbody className="divide-y divide-neutral-100">
                    {product.nutritionFacts.map((row, i) => (
                      <tr key={i}>
                        <td className="py-1 pr-3 text-neutral-700">{row.label}</td>
                        <td className="py-1 pr-3">{row.value}</td>
                        {row.dailyValue && <td className="py-1 text-neutral-400">{row.dailyValue}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}

          {quoteLink && (
            <a
              href={quoteLink}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block rounded-md bg-brand-green px-6 py-3 text-sm font-medium text-white hover:brightness-95"
            >
              Cotizar por WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
