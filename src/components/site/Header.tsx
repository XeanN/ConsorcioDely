import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/contacto", label: "Contacto" },
];

const INVOICE_LOOKUP_URL = "http://209.45.53.224:9090/Delyconsorcio";

export function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/dely.pe.png"
            alt="Consorcio Dely"
            width={800}
            height={334}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-neutral-600">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-red">
              {link.label}
            </Link>
          ))}
          <a
            href={INVOICE_LOOKUP_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-brand-red px-4 py-2 text-xs font-semibold text-white hover:bg-brand-red-dark"
          >
            Consultar Factura / boleta electrónica
          </a>
        </nav>
      </div>
    </header>
  );
}
