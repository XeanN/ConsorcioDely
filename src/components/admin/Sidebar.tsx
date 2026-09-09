import Link from "next/link";

import { logout } from "@/lib/actions/auth";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/productos", label: "Productos" },
];

export function Sidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-4 py-4">
        <p className="text-sm font-semibold text-neutral-900">Consorcio Dely</p>
        <p className="text-xs text-neutral-500">Panel administrativo</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <form action={logout} className="border-t border-neutral-200 p-2">
        <button
          type="submit"
          className="w-full rounded-md px-3 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
        >
          Cerrar sesión
        </button>
      </form>
    </aside>
  );
}
