import type { Metadata } from "next";
import Link from "next/link";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Información Legal y Certificaciones",
  description: "Razón social, RUC, certificaciones de calidad y Libro de Reclamaciones de Consorcio Dely S.A.C.",
  alternates: { canonical: "/legal" },
};

type SiteSettingRow = {
  legalName: string | null;
  ruc: string | null;
  fiscalAddress: string | null;
  complaintsBookUrl: string | null;
};

export default async function LegalPage() {
  const [settings] = (await sql()`
    SELECT "legalName", ruc, "fiscalAddress", "complaintsBookUrl" FROM site_settings WHERE id = 1 LIMIT 1
  `) as SiteSettingRow[];

  return (
    <div className="bg-neutral-50/50 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Transparencia y Confianza</span>
          <h1 className="mt-2 text-3xl font-black text-neutral-900 sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            Información Legal y Certificaciones
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-neutral-500">
            Datos tributarios oficiales y acreditaciones de calidad de Consorcio Dely S.A.C.
          </p>
        </div>

        {/* Corporate data card */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-base font-black text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>
            Datos de la Empresa
          </h2>
          
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4">
              <span className="text-xs font-bold text-neutral-400">Razón Social</span>
              <p className="mt-1 text-sm font-bold text-neutral-800">
                {settings?.legalName || "CONSORCIO DELY S.A.C."}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4">
              <span className="text-xs font-bold text-neutral-400">RUC</span>
              <p className="mt-1 text-sm font-bold text-neutral-800">
                {settings?.ruc || "20608518663"}
              </p>
            </div>

            <div className="sm:col-span-2 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4">
              <span className="text-xs font-bold text-neutral-400">Dirección Fiscal y Operativa</span>
              <p className="mt-1 text-sm font-bold text-neutral-800">
                {settings?.fiscalAddress || "AV. LA CULTURA NRO. 701 INT. 41 OTR. MERCADO DE PRODUCTORES SANTA ANITA, LIMA, PERÚ"}
              </p>
            </div>
          </div>

          {/* Certificaciones */}
          <div className="mt-8 border-t border-neutral-100 pt-8">
            <h3 className="text-sm font-black text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>
              Certificaciones y Estándares
            </h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { title: "RNP Acreditado", desc: "Registro Nacional de Proveedores del Estado Peruano" },
                { title: "Normas HACCP", desc: "Sistema de inocuidad y control en alimentos procesados" },
                { title: "Fichas Técnicas", desc: "Certificados de análisis y control de lote vigentes" },
              ].map((cert) => (
                <div key={cert.title} className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="mt-3 text-xs font-bold text-neutral-900">{cert.title}</h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-neutral-500">{cert.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Libro de reclamaciones */}
          <div className="mt-8 border-t border-neutral-100 pt-8">
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-red-ultra text-brand-red">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </span>
                  <h3 className="text-sm font-bold text-neutral-900">Libro de Reclamaciones Virtual</h3>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  Conforme a lo establecido en el Código de Protección y Defensa del Consumidor (Ley N° 29571).
                </p>
              </div>

              {settings?.complaintsBookUrl ? (
                <a
                  href={settings.complaintsBookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-brand-red bg-white px-5 py-2.5 text-xs font-bold text-brand-red shadow-sm transition hover:bg-brand-red hover:text-white"
                >
                  Abrir Libro de Reclamaciones →
                </a>
              ) : (
                <Link
                  href="/contacto"
                  className="rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold text-neutral-700 hover:border-brand-red hover:text-brand-red transition"
                >
                  Contactar Atención al Cliente
                </Link>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}