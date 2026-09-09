import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { deleteProduct, toggleProductActive } from "@/lib/actions/products";
import { sql } from "@/lib/db";
import { publicUrlFor } from "@/lib/media";

type ProductRow = {
  id: string;
  name: string;
  active: boolean;
  categoryName: string;
  brandName: string;
  r2Key: string | null;
};

export default async function ProductsPage() {
  const products = (await sql()`
    SELECT p.id, p.name, p.active, c.name as "categoryName", b.name as "brandName", m."r2Key" as "r2Key"
    FROM products p
    JOIN categories c ON c.id = p."categoryId"
    JOIN brands b ON b.id = p."brandId"
    LEFT JOIN media m ON m.id = p."mediaId"
    ORDER BY p.position ASC, p."createdAt" DESC
  `) as ProductRow[];

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <AdminPageHeader
        title="Productos"
        action={
          <Link
            href="/admin/productos/nuevo"
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Agregar producto
          </Link>
        }
      />

      {products.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Todavía no tienes productos"
            description="Agrega tu primer producto al catálogo."
            action={
              <Link
                href="/admin/productos/nuevo"
                className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Agregar producto
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-3 px-4 py-3">
              {p.r2Key ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={publicUrlFor(p.r2Key)}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded object-cover"
                />
              ) : (
                <div className="h-10 w-10 shrink-0 rounded bg-neutral-100" />
              )}
              <div className="flex-1">
                <Link
                  href={`/admin/productos/${p.id}`}
                  className="text-sm font-medium text-neutral-900 hover:underline"
                >
                  {p.name}
                </Link>
                <p className="text-xs text-neutral-500">
                  {p.categoryName} · {p.brandName}
                  {!p.active && " · oculto"}
                </p>
              </div>
              <form action={toggleProductActive.bind(null, p.id, !p.active)}>
                <button
                  type="submit"
                  className="text-xs text-neutral-500 underline hover:text-neutral-800"
                >
                  {p.active ? "Ocultar" : "Mostrar"}
                </button>
              </form>
              <form action={deleteProduct.bind(null, p.id)}>
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
