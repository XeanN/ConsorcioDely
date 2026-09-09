import { logout } from "@/lib/actions/auth";
import { UploadTest } from "@/components/admin/UploadTest";

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">Panel administrativo</h1>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-neutral-500 underline hover:text-neutral-800"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
      <p className="mt-4 text-sm text-neutral-500">
        Sesión iniciada. El catálogo (categorías, marcas, productos) se
        construye en la siguiente fase.
      </p>

      <div className="mt-6">
        <UploadTest />
      </div>
    </div>
  );
}
