import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Nuestro Proposito - Consorcio Dely" };

type Row = { key: string; value: string };

export default async function PropositoPage() {
  const rows = (await sql()`SELECT key, value FROM content_blocks WHERE key = 'responsabilidad_social' LIMIT 1`) as Row[];
  const texto = rows[0]?.value ?? "Creemos que el crecimiento de cada bodeguero, mayorista y minorista del Peru es tambien nuestro crecimiento.";

  return (
    <div>
      <div className="relative h-64 overflow-hidden sm:h-80" style={{ background: "var(--brand-dark)" }}>
        <Image src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80" alt="" fill className="object-cover opacity-30" sizes="100vw" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50">Quienes somos</p>
          <h1 className="mt-2 text-4xl font-black uppercase sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>Nuestro Proposito</h1>
          <p className="mt-2 text-sm text-white/60">Por que hacemos lo que hacemos</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Mision</span>
            <h2 className="section-title mt-2 text-2xl font-black text-neutral-900 sm:text-3xl">Calidad accesible para todos</h2>
            <p className="mt-5 whitespace-pre-line leading-relaxed text-neutral-600">{texto}</p>
          </div>
          <div className="space-y-4">
            {[{ t:"Calidad", d:"Estandares internacionales en cada producto que fabricamos y distribuimos.", ico:"M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" }, { t:"Compromiso", d:"Con nuestros clientes, colaboradores y el Peru.", ico:"M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" }, { t:"Crecimiento", d:"Juntos llegamos mas lejos. Tu exito es nuestro exito.", ico:"M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" }].map(v => (
              <div key={v.t} className="rounded-xl border border-neutral-100 p-4">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red-ultra">
                  <svg className="h-5 w-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.ico} /></svg>
                </div>
                <p className="font-black text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>{v.t}</p>
                <p className="mt-1 text-xs leading-relaxed text-neutral-500">{v.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl">
          <div className="relative h-48">
            <Image src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80" alt="Proposito Dely" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,rgba(180,20,14,.85) 0%,rgba(0,0,0,.3) 100%)" }} />
            <div className="relative flex h-full items-center px-8">
              <div className="text-white">
                <p className="text-lg font-black" style={{ fontFamily: "var(--font-display)" }}>Vision 2030</p>
                <p className="mt-1 max-w-lg text-sm text-white/80">Ser la empresa de abarrotes mas confiable y accesible del Peru, presente en cada hogar y negocio del pais.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/quienes-somos/historia" className="btn-outline">Nuestra Historia</Link>
          <Link href="/quienes-somos/presencia" className="btn-primary">Presencia Nacional</Link>
        </div>
      </div>
    </div>
  );
}