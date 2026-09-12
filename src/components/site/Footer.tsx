import Link from "next/link";

import { sql } from "@/lib/db";

type SiteSettingRow = {
  legalName: string | null;
  ruc: string | null;
  fiscalAddress: string | null;
  phone: string | null;
  email: string | null;
};

export async function Footer() {
  const [settings] = (await sql()`
    SELECT "legalName", ruc, "fiscalAddress", phone, email FROM site_settings WHERE id = 1 LIMIT 1
  `) as SiteSettingRow[];

  const currentYear = new Date().getFullYear();

  return (
    <footer>
      {/* Accent strip */}
      <div style={{ height: "5px", background: "linear-gradient(90deg, var(--brand-red-dark), var(--brand-red), var(--brand-red-light))" }} />

      {/* Main footer body */}
      <div style={{ background: "#0f0f0f" }} className="text-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">

            {/* Col 1 – Brand */}
            <div>
              <p
                className="text-xl font-extrabold tracking-tight"
                style={{ fontFamily: "var(--font-display)", color: "var(--brand-red-light)" }}
              >
                Consorcio Dely
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                Fabricamos, envasamos y distribuimos abarrotes a nivel nacional.
                Tu aliado estratégico para hacer crecer tu negocio.
              </p>
              {/* Social placeholder */}
              <div className="mt-5 flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-brand-red"
                >
                  <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-brand-red"
                >
                  <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="2"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="white"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2 – Links */}
            <div>
              <p
                className="mb-4 text-sm font-bold uppercase tracking-widest text-neutral-400"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Navegación
              </p>
              <ul className="space-y-2 text-sm text-neutral-300">
                {[
                  { href: "/", label: "Inicio" },
                  { href: "/catalogo", label: "Catálogo de productos" },
                  { href: "/quienes-somos", label: "Quiénes somos" },
                  { href: "/contacto", label: "Contacto" },
                  { href: "/legal", label: "Legales" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="group inline-flex items-center gap-1.5 transition-colors hover:text-brand-red-light"
                    >
                      <span className="h-px w-3 bg-brand-red opacity-0 transition-all group-hover:opacity-100" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 – Contact */}
            <div>
              <p
                className="mb-4 text-sm font-bold uppercase tracking-widest text-neutral-400"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Contacto
              </p>
              <ul className="space-y-3 text-sm text-neutral-300">
                {settings?.phone && (
                  <li className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{settings.phone}</span>
                  </li>
                )}
                {settings?.email && (
                  <li className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${settings.email}`} className="transition-colors hover:text-brand-red-light">
                      {settings.email}
                    </a>
                  </li>
                )}
                {settings?.fiscalAddress && (
                  <li className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="leading-snug">{settings.fiscalAddress}</span>
                  </li>
                )}
                {settings?.legalName && (
                  <li className="pt-2 text-xs text-neutral-500">
                    {settings.legalName}{settings?.ruc ? ` · RUC ${settings.ruc}` : ""}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4 text-xs text-neutral-500">
            <p>&copy; {currentYear} Consorcio Dely — Todos los derechos reservados.</p>
            <p>
              Hecho con ❤️ en Perú
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

