"use client";

import { useState } from "react";

import { ImageUploader, type UploadedImage } from "@/components/admin/ImageUploader";

// Prueba temporal de la Fase 2 (subida a R2) — se reemplaza por los
// formularios reales de producto/contenido en la Fase 3.
export function UploadTest() {
  const [uploaded, setUploaded] = useState<UploadedImage | null>(null);

  return (
    <div className="space-y-3 rounded-lg border border-dashed border-neutral-300 p-4">
      <p className="text-sm font-medium text-neutral-700">Prueba de subida (Fase 2)</p>
      <ImageUploader onUploaded={setUploaded} />
      {uploaded && (
        <p className="break-all text-xs text-neutral-500">
          Subida OK →{" "}
          <a href={uploaded.url} target="_blank" rel="noreferrer" className="underline">
            {uploaded.url}
          </a>
        </p>
      )}
    </div>
  );
}
