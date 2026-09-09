import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { sql } from "@/lib/db";
import { publicUrlFor } from "@/lib/media";
import { getRandomQuoteLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

type ProductDetail = {
  id: string;
  name: string;
  description: string | null;
  categoryName: string;
  brandName: string;
  r2Key: string | null;
};

type VariantRow = {
  id: string;
  presentation: string | null;
  weight: string;
  r2Key: string | null;
};

// cache(): React memoiza esto por request, así generateMetadata y la
// página no duplican la misma consulta a la base.
const getProduct = cache(async (slug: string) => {
  const [product] = (await sql()`
    SELECT p.id, p.name, p.description, c.name as "categoryName", b.name as "brandName", m."r2Key" as "r2Key"
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

  const title = `${product.name} — Consorcio Dely`;
  const description =
    product.description ?? `${product.name} (${product.brandName}) — ${product.categoryName}.`;
  const imageUrl = product.r2Key ? publicUrlFor(product.r2Key) : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
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
    SELECT v.id, v.presentation, v.weight, m."r2Key" as "r2Key"
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

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <Link href="/catalogo" className="text-sm text-neutral-500 hover:underline">
        ← Catálogo
      </Link>

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
                  </li>
                ))}
              </ul>
            </div>
          )}

          {quoteLink && (
            <a
              href={quoteLink}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700"
            >
              Cotizar por WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
