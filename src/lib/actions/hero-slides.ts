"use server";

import { revalidatePath } from "next/cache";

import { sql } from "@/lib/db";
import { heroSlidesSchema, HERO_SLIDES_CONTENT_KEY } from "@/lib/hero-slides";
import { newId } from "@/lib/id";
import { getSession } from "@/lib/session";

export type HeroSlidesFormState = { error?: string; success?: boolean };

export async function updateHeroSlides(
  _prevState: HeroSlidesFormState,
  formData: FormData
): Promise<HeroSlidesFormState> {
  const session = await getSession();
  if (!session) {
    return { error: "No autorizado" };
  }

  const raw = formData.get("slides");
  if (typeof raw !== "string") {
    return { error: "Datos inválidos" };
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return { error: "Datos inválidos" };
  }

  const parsed = heroSlidesSchema.safeParse(json);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await sql()`
    INSERT INTO content_blocks (id, key, type, value, "updatedAt")
    VALUES (${newId()}, ${HERO_SLIDES_CONTENT_KEY}, 'json', ${JSON.stringify(parsed.data)}, now())
    ON CONFLICT (key) DO UPDATE SET
      type = EXCLUDED.type,
      value = EXCLUDED.value,
      "updatedAt" = now()
  `;

  revalidatePath("/");
  revalidatePath("/admin/hero");
  return { success: true };
}
