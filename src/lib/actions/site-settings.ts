"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { sql } from "@/lib/db";
import { getSession } from "@/lib/session";

export type SocialLinksFormState = { error?: string };

const urlField = z
  .string()
  .trim()
  .optional()
  .refine((v) => !v || /^https?:\/\/.+/.test(v), "Debe ser una URL válida (http:// o https://)");

const socialLinksSchema = z.object({
  facebookUrl: urlField,
  instagramUrl: urlField,
  twitterUrl: urlField,
});

export async function updateSocialLinks(
  _prevState: SocialLinksFormState,
  formData: FormData
): Promise<SocialLinksFormState> {
  await getSession();

  const parsed = socialLinksSchema.safeParse({
    facebookUrl: formData.get("facebookUrl") ?? "",
    instagramUrl: formData.get("instagramUrl") ?? "",
    twitterUrl: formData.get("twitterUrl") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await sql()`
    INSERT INTO site_settings (id, "facebookUrl", "instagramUrl", "twitterUrl", "updatedAt")
    VALUES (1, ${parsed.data.facebookUrl || null}, ${parsed.data.instagramUrl || null}, ${parsed.data.twitterUrl || null}, now())
    ON CONFLICT (id) DO UPDATE SET
      "facebookUrl" = EXCLUDED."facebookUrl",
      "instagramUrl" = EXCLUDED."instagramUrl",
      "twitterUrl" = EXCLUDED."twitterUrl",
      "updatedAt" = now()
  `;

  revalidatePath("/admin/redes-sociales");
  revalidatePath("/", "layout");
  return {};
}
