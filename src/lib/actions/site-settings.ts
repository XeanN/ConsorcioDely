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
  tiktokUrl: urlField,
  youtubeUrl: urlField,
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
    tiktokUrl: formData.get("tiktokUrl") ?? "",
    youtubeUrl: formData.get("youtubeUrl") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await sql()`
    INSERT INTO site_settings (id, "facebookUrl", "instagramUrl", "twitterUrl", "tiktokUrl", "youtubeUrl", "updatedAt")
    VALUES (
      1,
      ${parsed.data.facebookUrl || null},
      ${parsed.data.instagramUrl || null},
      ${parsed.data.twitterUrl || null},
      ${parsed.data.tiktokUrl || null},
      ${parsed.data.youtubeUrl || null},
      now()
    )
    ON CONFLICT (id) DO UPDATE SET
      "facebookUrl" = EXCLUDED."facebookUrl",
      "instagramUrl" = EXCLUDED."instagramUrl",
      "twitterUrl" = EXCLUDED."twitterUrl",
      "tiktokUrl" = EXCLUDED."tiktokUrl",
      "youtubeUrl" = EXCLUDED."youtubeUrl",
      "updatedAt" = now()
  `;

  revalidatePath("/admin/redes-sociales");
  revalidatePath("/", "layout");
  return {};
}
