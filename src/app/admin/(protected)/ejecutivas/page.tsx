import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { deleteSalesRep, toggleSalesRepActive } from "@/lib/actions/sales-reps";
import { sql } from "@/lib/db";

type SalesRepRow = { id: string; name: string; whatsapp: string; active: boolean };

export default async function SalesRepsPage() {
  const reps = (await sql()`
    SELECT id, name, whatsapp, active FROM sales_reps ORDER BY position ASC
  `) as SalesRepRow[];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <AdminPageHeader
        title="Ejecutivas de venta"
        action={
          <Link
            href="/admin/ejecutivas/nueva"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Agregar ejecutiva
          </Link>
        }
      />
      <p className="mt-2 text-sm text-neutral-500">
        Cuando un cliente cotiza por WhatsApp (desde un producto o el botón flotante), se elige al
        azar una de las ejecutivas activas.
      </p>

      {reps.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Todavía no hay ejecutivas"
            description="Agrega al menos una para que funcione el botón de cotizar."
            action={
              <Link
                href="/admin/ejecutivas/nueva"
                className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Agregar ejecutiva
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white">
          {reps.map((r) => (
            <div key={r.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1">
                <Link
                  href={`/admin/ejecutivas/${r.id}`}
                  className="text-sm font-medium text-neutral-900 hover:underline"
                >
                  {r.name}
                </Link>
                <p className="text-xs text-neutral-500">
                  {r.whatsapp}
                  {!r.active && " · inactiva"}
                </p>
              </div>
              <form action={toggleSalesRepActive.bind(null, r.id, !r.active)}>
                <button
                  type="submit"
                  className="text-xs text-neutral-500 underline hover:text-neutral-800"
                >
                  {r.active ? "Desactivar" : "Activar"}
                </button>
              </form>
              <form action={deleteSalesRep.bind(null, r.id)}>
                <button
                  type="submit"
                  className="text-xs text-red-600 underline hover:text-red-800"
                >
                  Eliminar
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
