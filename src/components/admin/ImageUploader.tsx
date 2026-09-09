"use client";

import { useState } from "react";

const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 0.82;

export type UploadedImage = { id: string; url: string };

type Props = {
  onUploaded: (image: UploadedImage) => void;
};

// Redimensiona y comprime a WebP en el navegador antes de subir — nunca
// procesamos imágenes en el servidor (sharp no corre en Cloudflare
// Workers, ver el historial de commits de la fase de infraestructura).
async function compressToWebp(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen en el navegador");
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY)
  );
  if (!blob) throw new Error("No se pudo comprimir la imagen");

  return { blob, width, height };
}

export function ImageUploader({ onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    setUploading(true);
    try {
      const { blob, width, height } = await compressToWebp(file);
      setPreview(URL.createObjectURL(blob));

      const formData = new FormData();
      formData.set("file", blob, "image.webp");
      formData.set("width", String(width));
      formData.set("height", String(height));

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "No se pudo subir la imagen");
      }

      const data = (await res.json()) as UploadedImage;
      onUploaded(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="text-sm text-neutral-700"
      />
      {uploading && <p className="text-sm text-neutral-500">Subiendo...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {preview && !uploading && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Vista previa" className="h-32 w-32 rounded-md object-cover" />
      )}
    </div>
  );
}
