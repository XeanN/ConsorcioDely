import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Nuestra Historia - Consorcio Dely" };

type Row = { key: string; value: string };

export default async function HistoriaPage() {
  const rows = (await sql()`SELECT key, value FROM content_blocks WHERE key = 'quienes_somos' LIMIT 1`) as Row[];
  const texto = rows[0]?.value ?? "Consorcio Dely S.A.C. es una empresa peruana dedicada a la fabricacion, envasado y comercializacion de abarrotes a nivel nacional desde el 2004.";

  return (
    <div>
      <div className="relative h-64 overflow-hidden sm:h-80" style={{ background: "linear-gradient(135deg,#1a0000,#b01a14)" }}>
        <Image src="https://images.unsplash.com/photo-1565793979734-8cb12b33a6a1?w=1200&q=80" alt="" fill className="object-cover opacity-40" sizes="100vw" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-white/60">Quienes somos</p>
          <h1 className="mt-2 text-4xl font-black uppercase sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>Nuestra Historia</h1>
          <p className="mt-2 text-sm text-white/70">Mas de 20 anos creciendo junto al Peru</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Desde 2004</span>
            <h2 className="section-title mt-2 text-2xl font-black text-neutral-900 sm:text-3xl">De Lima al Peru entero</h2>
            <p className="mt-5 whitespace-pre-line leading-relaxed text-neutral-600">{texto}</p>
            <p className="mt-4 leading-relaxed text-neutral-600">Complementamos nuestro catalogo con marcas aliadas como P&G, Alicorp, Nestle, Gloria y Molitalia. Trabajamos con mayoristas, bodegueros y minoristas bajo un mismo principio: crecemos junto a cada cliente que confia en nosotros.</p>
          </div>

          <div className="space-y-6">
            <div className="relative h-56 overflow-hidden rounded-2xl">
              <Image src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80" alt="Productos Dely" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
            </div>
            <div className="border-l-2 border-brand-red pl-6 space-y-6">
              {[{ y:"2004", t:"Fundacion de Consorcio Dely en Lima" }, { y:"2010", t:"Expansion a regiones del interior del pais" }, { y:"2018", t:"Lanzamiento de lineas propias de aceites y mermeladas" }, { y:"2024", t:"Mas de 1,000 clientes a nivel nacional" }].map(e => (
                <div key={e.y} className="relative">
                  <span className="absolute -left-7 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red"><span className="h-1.5 w-1.5 rounded-full bg-white" /></span>
                  <p className="text-xs font-black text-brand-red">{e.y}</p>
                  <p className="text-sm text-neutral-600">{e.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/quienes-somos/proposito" className="btn-primary">Nuestro Proposito</Link>
          <Link href="/quienes-somos/presencia" className="btn-outline">Presencia Nacional</Link>
        </div>
      </div>
    </div>
  );
}