"use client";

import { useActionState } from "react";

import type { SalesRepFormState } from "@/lib/actions/sales-reps";

const initialState: SalesRepFormState = {};

export function SalesRepForm({
  action,
  defaultValues,
}: {
  action: (prevState: SalesRepFormState, formData: FormData) => Promise<SalesRepFormState>;
  defaultValues?: { name: string; whatsapp: string; active: boolean };
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-sm space-y-4">
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-neutral-700">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultValues?.name}
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="whatsapp" className="text-sm font-medium text-neutral-700">
          WhatsApp
        </label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="text"
          inputMode="numeric"
          placeholder="999999999"
          required
          defaultValue={defaultValues?.whatsapp}
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-500"
        />
        <p className="text-xs text-neutral-400">9 dígitos, sin +51 ni espacios.</p>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          name="active"
          defaultChecked={defaultValues?.active ?? true}
          className="h-4 w-4 rounded border-neutral-300"
        />
        Activa (recibe cotizaciones)
      </label>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
