import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

import { sql } from "@/lib/db";
import { newId } from "@/lib/id";
import { publicUrlFor } from "@/lib/media";
import { getSession } from "@/lib/session";

// Recibe una imagen ya comprimida a WebP en el navegador (ver
// ImageUploader) — no procesamos imágenes en el servidor (sharp no corre
// en Workers, ver commits de la fase de infraestructura).
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  }

  const width = Number(formData.get("width")) || null;
  const height = Number(formData.get("height")) || null;

  const id = newId();
  const key = `uploads/${id}.webp`;

  const { env } = await getCloudflareContext({ async: true });
  const bucket = (env as unknown as CloudflareEnv).MEDIA_BUCKET;
  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || "image/webp" },
  });

  await sql()`
    INSERT INTO media (id, "r2Key", width, height, "createdAt")
    VALUES (${id}, ${key}, ${width}, ${height}, now())
  `;

  return NextResponse.json({ id, key, url: publicUrlFor(key) });
}
