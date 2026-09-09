"use client";

import { useActionState, useState } from "react";

import { ImageUploader, type UploadedImage } from "@/components/admin/ImageUploader";
import {
  createVariant,
  deleteVariant,
  toggleVariantActive,
  type VariantFormState,
} from "@/lib/actions/variants";

export type VariantRow = {
  id: string;
  presentation: string | null;
  weight: string;
  sku: string | null;
  active: boolean;
  imageUrl: string | null;
};

const initialState: VariantFormState = {};
const inputClass =
  "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-500";

export function VariantManager({
  productId,
  variants,
}: {
  productId: string;
  variants: VariantRow[];
}) {
  const [state, formAction, pending] = useActionState(createVariant, initialState);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);

  return (
    <div className="space-y-4">
      <div className="divide-y divide-neutral-200 rounded-md border border-neutral-200">
        {variants.length === 0 && (
          <p className="px-4 py-3 text-sm text-neutral-500">Todavía no hay presentaciones.</p>
        )}
        {variants.map((v) => (
          <div key={v.id} className="flex items-center gap-3 px-4 py-3">
            {v.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={v.imageUrl} alt="" className="h-10 w-10 rounded object-cover" />
            ) : (
              <div className="h-10 w-10 rounded bg-neutral-100" />
            )}
            <div className="flex-1 text-sm text-neutral-900">
              {v.presentation ? `${v.presentation} — ` : ""}
              {v.weight}
              {v.sku && <span className="text-neutral-400"> · SKU {v.sku}</span>}
              {!v.active && <span className="text-neutral-400"> · oculta</span>}
            </div>
            <form action={toggleVariantActive.bind(null, v.id, productId, !v.active)}>
              <button
                type="submit"
                className="text-xs text-neutral-500 underline hover:text-neutral-800"
              >
                {v.active ? "Ocultar" : "Mostrar"}
              </button>
            </form>
            <form action={deleteVariant.bind(null, v.id, productId)}>
              <button type="submit" className="text-xs text-red-600 underline hover:text-red-800">
                Eliminar
              </button>
            </form>
          </div>
        ))}
      </div>

      <form action={formAction} className="space-y-3 rounded-md border border-dashed border-neutral-300 p-4">
        <p className="text-sm font-medium text-neutral-700">Agregar presentación</p>
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="mediaId" value={uploadedImage?.id ?? ""} />

        <div className="grid grid-cols-2 gap-3">
          <input name="presentation" placeholder="Presentación (ej. botella amarilla)" className={inputClass} />
          <input name="weight" placeholder="Peso (ej. 5 L)" required className={inputClass} />
        </div>
        <input name="sku" placeholder="SKU (opcional)" className={inputClass} />
        <ImageUploader onUploaded={setUploadedImage} />

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {pending ? "Agregando..." : "Agregar"}
        </button>
      </form>
    </div>
  );
}
