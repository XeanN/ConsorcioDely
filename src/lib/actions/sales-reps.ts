"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";
import { newId } from "@/lib/id";

export type SalesRepFormState = { error?: string };

const salesRepSchema = z.object({
  name: z.string().trim().min(2, "El nombre es muy corto"),
  whatsapp: z
    .string()
    .trim()
    .regex(/^9\d{8}$/, "Debe ser un celular peruano de 9 dígitos (ej. 999999999)"),
  active: z.boolean(),
});

function parseSalesRepForm(formData: FormData) {
  return salesRepSchema.safeParse({
    name: formData.get("name"),
    whatsapp: formData.get("whatsapp"),
    active: formData.get("active") === "on",
  });
}

function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "23505";
}

export async function createSalesRep(
  _prevState: SalesRepFormState,
  formData: FormData
): Promise<SalesRepFormState> {
  await getSession();
  const parsed = parseSalesRepForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  try {
    await sql()`
      INSERT INTO sales_reps (id, name, whatsapp, active, position, "createdAt")
      VALUES (
        ${newId()},
        ${parsed.data.name},
        ${parsed.data.whatsapp},
        ${parsed.data.active},
        (SELECT COUNT(*)::int FROM sales_reps),
        now()
      )
    `;
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { error: "Ese número ya está registrado" };
    }
    throw err;
  }

  revalidatePath("/admin/ejecutivas");
  redirect("/admin/ejecutivas");
}

export async function updateSalesRep(
  id: string,
  _prevState: SalesRepFormState,
  formData: FormData
): Promise<SalesRepFormState> {
  await getSession();
  const parsed = parseSalesRepForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  try {
    await sql()`
      UPDATE sales_reps
      SET name = ${parsed.data.name}, whatsapp = ${parsed.data.whatsapp}, active = ${parsed.data.active}
      WHERE id = ${id}
    `;
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { error: "Ese número ya está registrado" };
    }
    throw err;
  }

  revalidatePath("/admin/ejecutivas");
  redirect("/admin/ejecutivas");
}

export async function deleteSalesRep(id: string) {
  await getSession();
  await sql()`DELETE FROM sales_reps WHERE id = ${id}`;
  revalidatePath("/admin/ejecutivas");
}

export async function toggleSalesRepActive(id: string, active: boolean) {
  await getSession();
  await sql()`UPDATE sales_reps SET active = ${active} WHERE id = ${id}`;
  revalidatePath("/admin/ejecutivas");
}
