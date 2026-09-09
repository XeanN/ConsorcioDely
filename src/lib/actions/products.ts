"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";
import { newId } from "@/lib/id";
import { slugify } from "@/lib/slug";

export type ProductFormState = { error?: string };

const productSchema = z.object({
  name: z.string().trim().min(2, "El nombre es muy corto"),
  categoryId: z.string().trim().min(1, "Elige una categoría"),
  brandId: z.string().trim().min(1, "Elige una marca"),
  description: z.string().trim().optional(),
  active: z.boolean(),
});

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    brandId: formData.get("brandId"),
    description: formData.get("description") ?? "",
    active: formData.get("active") === "on",
  });
}

function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "23505";
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await getSession();
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const slug = slugify(parsed.data.name);
  if (!slug) {
    return { error: "El nombre debe tener al menos una letra o número" };
  }

  const id = newId();
  try {
    await sql()`
      INSERT INTO products
        (id, "categoryId", "brandId", name, slug, description, active, position, "createdAt", "updatedAt")
      VALUES (
        ${id},
        ${parsed.data.categoryId},
        ${parsed.data.brandId},
        ${parsed.data.name},
        ${slug},
        ${parsed.data.description || null},
        ${parsed.data.active},
        (SELECT COUNT(*)::int FROM products),
        now(),
        now()
      )
    `;
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { error: "Ya existe un producto con ese nombre" };
    }
    throw err;
  }

  revalidatePath("/admin/productos");
  redirect(`/admin/productos/${id}`);
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await getSession();
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const slug = slugify(parsed.data.name);
  if (!slug) {
    return { error: "El nombre debe tener al menos una letra o número" };
  }

  try {
    await sql()`
      UPDATE products
      SET
        "categoryId" = ${parsed.data.categoryId},
        "brandId" = ${parsed.data.brandId},
        name = ${parsed.data.name},
        slug = ${slug},
        description = ${parsed.data.description || null},
        active = ${parsed.data.active},
        "updatedAt" = now()
      WHERE id = ${id}
    `;
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { error: "Ya existe un producto con ese nombre" };
    }
    throw err;
  }

  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${id}`);
  redirect("/admin/productos");
}

export async function deleteProduct(id: string) {
  await getSession();
  await sql()`DELETE FROM products WHERE id = ${id}`;
  revalidatePath("/admin/productos");
}

export async function toggleProductActive(id: string, active: boolean) {
  await getSession();
  await sql()`UPDATE products SET active = ${active}, "updatedAt" = now() WHERE id = ${id}`;
  revalidatePath("/admin/productos");
}
