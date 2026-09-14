import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Nuestro Equipo - Consorcio Dely" };

type Row = { email: string|null };

export default async function EquipoPage() {
  const [s] = (await sql()`SELECT email FROM site_settings WHERE id = 1 LIMIT 1`) as Row[];

  return (
    <div>
      <div className="relative h-64 overflow-hidden sm:h-80" style={{ background: "var(--brand-dark)" }}>
        <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80" alt="" fill className="object-cover opacity-50" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-white/50">Quienes somos</p>
          <h1 className="mt-2 text-4xl font-black uppercase sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>Nuestro Equipo</h1>
          <p className="mt-2 text-sm text-white/60">Las personas que hacen posible Consorcio Dely</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Nuestros colaboradores</span>
            <h2 className="section-title mt-2 text-2xl font-black text-neutral-900 sm:text-3xl">Personas que hacen la diferencia</h2>
            <p className="mt-5 leading-relaxed text-neutral-600">Detras de cada producto hay mas de 200 personas apasionadas. Desde el area de produccion hasta la distribucion, cada colaborador es parte esencial de nuestra cadena de valor.</p>
            <p className="mt-4 leading-relaxed text-neutral-600">Fomentamos un ambiente de trabajo inclusivo, seguro y motivador donde cada persona puede crecer profesionalmente mientras contribuye al crecimiento del Peru.</p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[{ n:"200+", t:"Colaboradores" }, { n:"20+", t:"Anos juntos" }, { n:"5", t:"Areas de trabajo" }, { n:"100%", t:"Comprometidos" }].map(s => (
                <div key={s.t} className="rounded-xl bg-neutral-50 p-4">
                  <p className="text-2xl font-black text-brand-red" style={{ fontFamily: "var(--font-display)" }}>{s.n}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">{s.t}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative col-span-2 h-48 overflow-hidden rounded-2xl">
              <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80" alt="Equipo Dely" fill className="object-cover object-top" sizes="(max-width:1024px) 100vw, 50vw" />
            </div>
            <div className="relative h-32 overflow-hidden rounded-xl">
              <Image src="https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=500&q=80" alt="" fill className="object-cover" sizes="25vw" />
            </div>
            <div className="relative h-32 overflow-hidden rounded-xl">
              <Image src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80" alt="" fill className="object-cover" sizes="25vw" />
            </div>
          </div>
        </div>

        {/* Trabaja con nosotros */}
        <div className="mt-14 overflow-hidden rounded-2xl" style={{ background: "linear-gradient(135deg,var(--brand-red-dark),var(--brand-red))" }}>
          <div className="grid lg:grid-cols-2">
            <div className="px-8 py-10 text-white">
              <h3 className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>Trabaja con nosotros</h3>
              <p className="mt-3 leading-relaxed text-white/85">Nuestro equipo es tan valioso como cada persona que lo conforma. Si quieres ser parte de Consorcio Dely, queremos conocerte.</p>
              <ul className="mt-5 space-y-2 text-sm text-white/80">
                {["Oportunidades de crecimiento profesional", "Ambiente colaborativo e inclusivo", "Beneficios y estabilidad laboral"].map(i => (
                  <li key={i} className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {i}
                  </li>
                ))}
              </ul>
              {s?.email && (
                <a href={`mailto:${s.email}?subject=Postulacion`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-brand-red transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  Postula aqui
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              )}
            </div>
            <div className="relative hidden h-48 lg:block lg:h-auto">
              <Image src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80" alt="" fill className="object-cover opacity-60" sizes="50vw" />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/quienes-somos" className="btn-outline">Ver todo Quienes somos</Link>
          <Link href="/contacto" className="btn-primary">Contactar</Link>
        </div>
      </div>
    </div>
  );
}