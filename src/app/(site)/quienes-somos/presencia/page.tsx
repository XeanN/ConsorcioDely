import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Presencia Nacional - Consorcio Dely" };

type Row = { email: string|null; address: string|null; legalName: string|null; ruc: string|null };

export default async function PresenciaPage() {
  const [s] = (await sql()`SELECT email, address, "legalName", ruc FROM site_settings WHERE id = 1 LIMIT 1`) as Row[];

  return (
    <div>
      <div className="relative h-64 overflow-hidden sm:h-80" style={{ background: "linear-gradient(135deg,#1a0000,#e4231b)" }}>
        <Image src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=1200&q=80" alt="" fill className="object-cover opacity-25" sizes="100vw" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-white/60">Quienes somos</p>
          <h1 className="mt-2 text-4xl font-black uppercase sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>Presencia Nacional</h1>
          <p className="mt-2 text-sm text-white/70">Distribuimos en todo el Peru</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Cobertura</span>
            <h2 className="section-title mt-2 text-2xl font-black text-neutral-900 sm:text-3xl">Llegamos a donde estas</h2>
            <p className="mt-5 leading-relaxed text-neutral-600">Nuestra red logistica cubre todas las regiones del Peru. Desde Lima hasta el interior del pais, garantizamos entregas completas, a tiempo y en perfectas condiciones para tu negocio.</p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[{ n:"25+", t:"Regiones" }, { n:"24h", t:"Entrega Lima" }, { n:"72h", t:"Provincias" }, { n:"100%", t:"Pedidos completos" }].map(s => (
                <div key={s.t} className="rounded-xl border border-neutral-100 bg-white p-4 text-center shadow-sm">
                  <p className="text-2xl font-black text-brand-red" style={{ fontFamily: "var(--font-display)" }}>{s.n}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">{s.t}</p>
                </div>
              ))}
            </div>

            {s && (
              <div className="mt-8 space-y-3">
                <h3 className="text-sm font-black text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>Datos de la empresa</h3>
                {s.legalName && <div className="flex gap-3 rounded-xl border border-neutral-100 p-4"><svg className="h-5 w-5 shrink-0 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg><div><p className="text-xs font-bold text-neutral-400">Razon Social</p><p className="text-sm font-semibold text-neutral-800">{s.legalName}</p></div></div>}
                {s.ruc && <div className="flex gap-3 rounded-xl border border-neutral-100 p-4"><svg className="h-5 w-5 shrink-0 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><div><p className="text-xs font-bold text-neutral-400">RUC</p><p className="text-sm font-semibold text-neutral-800">{s.ruc}</p></div></div>}
                {s.address && <div className="flex gap-3 rounded-xl border border-neutral-100 p-4"><svg className="h-5 w-5 shrink-0 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg><div><p className="text-xs font-bold text-neutral-400">Direccion</p><p className="text-sm font-semibold text-neutral-800">{s.address}</p></div></div>}
              </div>
            )}
          </div>

          <div className="relative h-80 overflow-hidden rounded-2xl lg:h-auto lg:min-h-[480px]">
            <Image src="https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=900&q=80" alt="Distribucion nacional" fill className="object-cover object-center" sizes="(max-width:1024px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-black text-white" style={{ fontFamily: "var(--font-display)" }}>Flota propia de distribucion</p>
              <p className="text-sm text-white/70">Garantizamos la cadena de frio y seguridad en cada entrega</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/contacto" className="btn-primary">Contactar ahora</Link>
          <Link href="/quienes-somos/equipo" className="btn-outline">Nuestro Equipo</Link>
        </div>
      </div>
    </div>
  );
}