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
    <header className="bg-neutral-50 px-4 py-4">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 rounded-full bg-white p-2 shadow-sm">
        <Link href="/" className="shrink-0 pl-2">
          <Image
            src="/dely.pe.png"
            alt="Consorcio Dely"
            width={800}
            height={334}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav className="flex flex-wrap items-center gap-1.5 rounded-full bg-brand-red p-1.5 sm:gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-white/50 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white hover:text-brand-red sm:px-4 sm:text-sm"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={INVOICE_LOOKUP_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-red transition-colors hover:bg-neutral-100 sm:px-4"
          >
            Consultar Factura
          </a>
        </nav>
      </div>
    </header>
  );
}
