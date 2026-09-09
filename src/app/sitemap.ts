import type { MetadataRoute } from "next";

import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

type CategoryRow = { slug: string; updatedAt: Date };
type ProductRow = { slug: string; updatedAt: Date };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL ?? "https://consorciodely-web.angel-xp-pb.workers.dev";

  const categories = (await sql()`
    SELECT slug, "updatedAt" FROM categories
  `) as CategoryRow[];

  const products = (await sql()`
    SELECT slug, "updatedAt" FROM products WHERE active = true
  `) as ProductRow[];

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/catalogo`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/quienes-somos`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/legal`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/contacto`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/catalogo/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/producto/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
