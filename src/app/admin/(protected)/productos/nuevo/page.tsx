import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm, type SelectOption } from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/actions/products";
import { sql } from "@/lib/db";

export default async function NewProductPage() {
  const categories = (await sql()`SELECT id, name FROM categories ORDER BY position ASC`) as SelectOption[];
  const brands = (await sql()`SELECT id, name FROM brands ORDER BY name ASC`) as SelectOption[];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <AdminPageHeader title="Nuevo producto" />
      <div className="mt-6">
        <ProductForm action={createProduct} categories={categories} brands={brands} />
      </div>
    </div>
  );
}
