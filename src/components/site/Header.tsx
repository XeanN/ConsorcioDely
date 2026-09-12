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
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(228,35,27,0.10)",
        boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src="/dely.pe.png"
            alt="Consorcio Dely"
            width={800}
            height={334}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        {/* Nav + CTA */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Nav links – hidden on mobile */}
          <nav className="hidden items-center gap-0 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-sm font-semibold text-neutral-700 transition-colors duration-200 hover:text-brand-red group"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-brand-red origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100"
                />
              </Link>
            ))}
          </nav>

          {/* CTA pill */}
          <a
            href={INVOICE_LOOKUP_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-primary text-xs sm:text-sm"
            style={{ padding: "0.5rem 1.1rem" }}
          >
            Consultar Factura
          </a>

          {/* Mobile hamburger – placeholder */}
          <button
            aria-label="Abrir menú"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 transition hover:border-brand-red hover:text-brand-red md:hidden"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

