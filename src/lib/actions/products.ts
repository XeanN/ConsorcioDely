"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";
import { newId } from "@/lib/id";
import { slugify } from "@/lib/slug";

export type ProductFormState = { error?: string };

const nutritionRowSchema = z.object({
  label: z.string().trim(),
  value: z.string().trim(),
  dailyValue: z.string().trim().optional(),
});

const productSchema = z.object({
  name: z.string().trim().min(2, "El nombre es muy corto"),
  categoryId: z.string().trim().min(1, "Elige una categoría"),
  brandId: z.string().trim().min(1, "Elige una marca"),
  description: z.string().trim().optional(),
  active: z.boolean(),
  mediaId: z.string().trim().optional(),
  nutritionServingSize: z.string().trim().optional(),
  nutritionServingsPerContainer: z.string().trim().optional(),
  nutritionFacts: z.array(nutritionRowSchema).optional(),
});

function parseProductForm(formData: FormData) {
  let nutritionFacts: unknown = [];
  try {
    nutritionFacts = JSON.parse(String(formData.get("nutritionFacts") ?? "[]"));
  } catch {
    nutritionFacts = [];
  }

  return productSchema.safeParse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
    brandId: formData.get("brandId"),
    description: formData.get("description") ?? "",
    active: formData.get("active") === "on",
    mediaId: formData.get("mediaId") ?? "",
    nutritionServingSize: formData.get("nutritionServingSize") ?? "",
    nutritionServingsPerContainer: formData.get("nutritionServingsPerContainer") ?? "",
    nutritionFacts,
  });
}

function nutritionFactsJson(rows: z.infer<typeof nutritionRowSchema>[] | undefined) {
  const cleaned = (rows ?? []).filter((r) => r.label && r.value);
  return cleaned.length > 0 ? JSON.stringify(cleaned) : null;
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
        (id, "categoryId", "brandId", "mediaId", name, slug, description, active, position,
         "nutritionServingSize", "nutritionServingsPerContainer", "nutritionFacts",
         "createdAt", "updatedAt")
      VALUES (
        ${id},
        ${parsed.data.categoryId},
        ${parsed.data.brandId},
        ${parsed.data.mediaId || null},
        ${parsed.data.name},
        ${slug},
        ${parsed.data.description || null},
        ${parsed.data.active},
        (SELECT COUNT(*)::int FROM products),
        ${parsed.data.nutritionServingSize || null},
        ${parsed.data.nutritionServingsPerContainer || null},
        ${nutritionFactsJson(parsed.data.nutritionFacts)},
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
        "mediaId" = COALESCE(${parsed.data.mediaId || null}, "mediaId"),
        name = ${parsed.data.name},
        slug = ${slug},
        description = ${parsed.data.description || null},
        active = ${parsed.data.active},
        "nutritionServingSize" = ${parsed.data.nutritionServingSize || null},
        "nutritionServingsPerContainer" = ${parsed.data.nutritionServingsPerContainer || null},
        "nutritionFacts" = ${nutritionFactsJson(parsed.data.nutritionFacts)},
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
