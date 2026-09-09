"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";
import { newId } from "@/lib/id";

export type VariantFormState = { error?: string };

const variantSchema = z.object({
  productId: z.string().trim().min(1),
  presentation: z.string().trim().optional(),
  weight: z.string().trim().min(1, "El peso/presentación es obligatorio"),
  sku: z.string().trim().optional(),
  mediaId: z.string().trim().optional(),
});

export async function createVariant(
  _prevState: VariantFormState,
  formData: FormData
): Promise<VariantFormState> {
  await getSession();
  const parsed = variantSchema.safeParse({
    productId: formData.get("productId"),
    presentation: formData.get("presentation") ?? "",
    weight: formData.get("weight"),
    sku: formData.get("sku") ?? "",
    mediaId: formData.get("mediaId") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await sql()`
    INSERT INTO variants
      (id, "productId", presentation, weight, sku, active, position, "mediaId", "createdAt", "updatedAt")
    VALUES (
      ${newId()},
      ${parsed.data.productId},
      ${parsed.data.presentation || null},
      ${parsed.data.weight},
      ${parsed.data.sku || null},
      true,
      (SELECT COUNT(*)::int FROM variants WHERE "productId" = ${parsed.data.productId}),
      ${parsed.data.mediaId || null},
      now(),
      now()
    )
  `;

  revalidatePath(`/admin/productos/${parsed.data.productId}`);
  return {};
}

export async function deleteVariant(id: string, productId: string) {
  await getSession();
  await sql()`DELETE FROM variants WHERE id = ${id}`;
  revalidatePath(`/admin/productos/${productId}`);
}

export async function toggleVariantActive(id: string, productId: string, active: boolean) {
  await getSession();
  await sql()`UPDATE variants SET active = ${active}, "updatedAt" = now() WHERE id = ${id}`;
  revalidatePath(`/admin/productos/${productId}`);
}
