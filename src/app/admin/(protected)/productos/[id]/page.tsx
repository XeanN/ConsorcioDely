import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm, type SelectOption } from "@/components/admin/ProductForm";
import { VariantManager, type VariantRow } from "@/components/admin/VariantManager";
import { updateProduct } from "@/lib/actions/products";
import { sql } from "@/lib/db";
import { publicUrlFor } from "@/lib/media";

type ProductDetail = {
  id: string;
  name: string;
  categoryId: string;
  brandId: string;
  description: string | null;
  active: boolean;
  r2Key: string | null;
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product] = (await sql()`
    SELECT p.id, p."categoryId", p."brandId", p.name, p.description, p.active, m."r2Key" as "r2Key"
    FROM products p
    LEFT JOIN media m ON m.id = p."mediaId"
    WHERE p.id = ${id} LIMIT 1
  `) as ProductDetail[];

  if (!product) {
    notFound();
  }

  const categories = (await sql()`SELECT id, name FROM categories ORDER BY position ASC`) as SelectOption[];
  const brands = (await sql()`SELECT id, name FROM brands ORDER BY name ASC`) as SelectOption[];

  const variantRows = (await sql()`
    SELECT v.id, v.presentation, v.weight, v.sku, v.active, m."r2Key" as "r2Key"
    FROM variants v
    LEFT JOIN media m ON m.id = v."mediaId"
    WHERE v."productId" = ${id}
    ORDER BY v.position ASC
  `) as Array<{
    id: string;
    presentation: string | null;
    weight: string;
    sku: string | null;
    active: boolean;
    r2Key: string | null;
  }>;

  const variants: VariantRow[] = variantRows.map((v) => ({
    id: v.id,
    presentation: v.presentation,
    weight: v.weight,
    sku: v.sku,
    active: v.active,
    imageUrl: v.r2Key ? publicUrlFor(v.r2Key) : null,
  }));

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <AdminPageHeader title={product.name} />

      <div className="mt-6">
        <ProductForm
          action={updateProduct.bind(null, id)}
          categories={categories}
          brands={brands}
          defaultValues={{
            ...product,
            imageUrl: product.r2Key ? publicUrlFor(product.r2Key) : null,
          }}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-sm font-medium text-neutral-700">Presentaciones</h2>
        <div className="mt-3">
          <VariantManager productId={id} variants={variants} />
        </div>
      </div>
    </div>
  );
}
