"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const INVOICE_URL = "http://209.45.53.224:9090/Delyconsorcio";

const NAV = [
  {
    href: "/",
    label: "Inicio",
    children: null,
  },
  {
    href: "/catalogo",
    label: "Catálogo",
    children: [
      {
        group: "Categorías",
        links: [
          { href: "/catalogo", label: "Ver todo el catálogo" },
          { href: "/catalogo/vegetal", label: "Aceites Vegetales" },
          { href: "/catalogo/conserva-de-atun", label: "Conservas de Atún" },
          { href: "/catalogo/mermelada", label: "Mermeladas" },
          { href: "/catalogo/avena", label: "Avena y Cereales" },
          { href: "/catalogo/paneton", label: "Panetón y Dulces" },
          { href: "/catalogo/chocolate-de-taza", label: "Chocolate de Taza" },
        ],
      },
    ],
  },
  {
    href: "/quienes-somos",
    label: "Quiénes somos",
    children: [
      {
        group: "La Empresa",
        links: [
          { href: "/quienes-somos", label: "Conócenos" },
          { href: "/quienes-somos/historia", label: "Nuestra Historia" },
          { href: "/quienes-somos/proposito", label: "Nuestro Propósito" },
          { href: "/quienes-somos/presencia", label: "Presencia Nacional" },
          { href: "/quienes-somos/equipo", label: "Nuestro Equipo" },
        ],
      },
    ],
  },
  {
    href: "/contacto",
    label: "Contacto",
    children: null,
  },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleClose = () => {
    timerRef.current = setTimeout(() => setOpenKey(null), 150);
  };
  const cancelClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    setMobileOpen(false);
    setOpenKey(null);
  }, [pathname]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[.06] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image src="/dely.pe.png" alt="Consorcio Dely" width={800} height={334} priority className="h-9 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center md:flex">
          {NAV.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${isActive ? "text-brand-red font-bold" : "text-neutral-600 hover:text-neutral-900"}`}
                >
                  {item.label}
                  {isActive && <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-brand-red" />}
                </Link>
              );
            }

            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => { cancelClose(); setOpenKey(item.href); }}
                onMouseLeave={scheduleClose}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${isActive || openKey === item.href ? "text-brand-red font-bold" : "text-neutral-600 hover:text-neutral-900"}`}
                >
                  {item.label}
                  <svg
                    className={`h-3 w-3 transition-transform duration-200 ${openKey === item.href ? "rotate-180 text-brand-red" : "text-neutral-400"}`}
                    fill="none" viewBox="0 0 10 6"
                  >
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M1 1l4 4 4-4" />
                  </svg>
                  {isActive && <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-brand-red" />}
                </Link>

                {openKey === item.href && (
                  <div
                    className="absolute left-0 top-full pt-1.5"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                  >
                    <div className="min-w-[220px] overflow-hidden rounded-2xl border border-black/[.08] bg-white p-1.5 shadow-xl shadow-black/10">
                      {item.children.map((grp) => (
                        <div key={grp.group} className="py-1">
                          <p className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                            {grp.group}
                          </p>
                          {grp.links.map((link) => {
                            const linkActive = link.href === pathname;
                            return (
                              <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${linkActive ? "bg-brand-red-ultra text-brand-red" : "text-neutral-700 hover:bg-neutral-50 hover:text-brand-red"}`}
                              >
                                <span>{link.label}</span>
                                {linkActive && <span className="h-1.5 w-1.5 rounded-full bg-brand-red" />}
                              </Link>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <a
            href={INVOICE_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full bg-brand-red px-4 py-2 text-xs font-bold text-white transition-all hover:bg-brand-red-dark hover:shadow-md sm:block"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Consultar Factura
          </a>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Menú"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-50 md:hidden"
          >
            {mobileOpen ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M1 1l12 12M13 1L1 13" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M1 2.5h12M1 7h12M1 11.5h12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-neutral-100 bg-white md:hidden">
          <div className="mx-auto max-w-6xl space-y-0.5 px-4 py-3">
            {NAV.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "bg-brand-red-ultra text-brand-red font-bold" : "text-neutral-700 hover:bg-neutral-50"}`}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 mt-0.5 space-y-0.5 border-l border-neutral-100 pl-3">
                    {item.children[0].links.slice(1).map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block rounded-md px-3 py-2 text-xs ${pathname === link.href ? "text-brand-red font-bold" : "text-neutral-500 hover:text-neutral-700"}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-2">
              <a href={INVOICE_URL} target="_blank" rel="noreferrer" className="block rounded-full bg-brand-red px-4 py-2.5 text-center text-sm font-bold text-white">
                Consultar Factura
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}