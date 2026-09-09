"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

import { sql } from "@/lib/db";
import { createSession, destroySession } from "@/lib/session";

type AdminUserRow = { id: string; passwordHash: string };

export type LoginFormState = { error?: string };

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Correo inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export async function login(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const rows = (await sql()`
    SELECT id, "passwordHash" FROM admin_users WHERE email = ${parsed.data.email} LIMIT 1
  `) as AdminUserRow[];
  const user = rows[0];
  const validCredentials =
    user != null && (await bcrypt.compare(parsed.data.password, user.passwordHash));

  if (!validCredentials) {
    return { error: "Correo o contraseña incorrectos" };
  }

  await createSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
