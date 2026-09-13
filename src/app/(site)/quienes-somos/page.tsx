import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quienes somos",
  description: "Empresa peruana dedicada a la fabricacion, envasado y comercializacion de abarrotes a nivel nacional.",
  alternates: { canonical: "/quienes-somos" },
};

type ContentBlockRow = { key: string; value: string };
type SiteSettingRow = {
  email: string | null;
  address: string | null;
  legalName: string | null;
  ruc: string | null;
};

const IMGS = {
  hero:    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
  factory: "https://images.unsplash.com/photo-1565793979734-8cb12b33a6a1?w=800&q=80",
  team:    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  map:     "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&q=80",
  values1: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80",
  values2: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80",
  values3: "https://images.unsplash.com/photo-1588329261990-72541f5f4ad5?w=500&q=80",
};

export default async function AboutPage() {
  const rows = (await sql()`
    SELECT key, value FROM content_blocks
    WHERE key IN ('quienes_somos', 'responsabilidad_social')
  `) as ContentBlockRow[];

  const [settings] = (await sql()`
    SELECT email, address, "legalName", ruc FROM site_settings WHERE id = 1 LIMIT 1
  `) as SiteSettingRow[];

  const quienesSomos = rows.find((r) => r.key === "quienes_somos")?.value;
  const responsabilidadSocial = rows.find((r) => r.key === "responsabilidad_social")?.value;

  return (
    <div>

      {/* HERO BANNER */}
      <section className="relative h-72 overflow-hidden sm:h-96">
        <Image src={IMGS.hero} alt="Consorcio Dely" fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,rgba(0,0,0,.8) 0%,rgba(180,20,14,.5) 50%,rgba(0,0,0,.3) 100%)" }} />
        <div className="relative flex h-full flex-col items-start justify-center px-8 text-white sm:px-16">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red-light" />
            Empresa peruana
          </span>
          <h1 className="text-4xl font-black uppercase tracking-tight sm:text-6xl" style={{ fontFamily: "var(--font-display)", textShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
            Quienes Somos
          </h1>
          <p className="mt-3 max-w-lg text-sm text-white/80 sm:text-base">
            Mas de 20 anos creciendo junto al Peru — fabricando, envasando y distribuyendo calidad.
          </p>
        </div>
      </section>

      {/* TABS anchors for header dropdown */}
      <div id="proposito" />
      <div id="presencia" />
      <div id="equipo" />

      {/* NUESTRA HISTORIA – split */}
      <section className="overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="relative h-72 lg:h-auto lg:min-h-[500px]">
            <Image src={IMGS.factory} alt="Planta Dely" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 rounded-2xl bg-white/90 px-5 py-3 shadow-lg backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-red">Fundada en</p>
              <p className="text-2xl font-black text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>2004</p>
            </div>
          </div>
          <div className="flex items-center bg-white px-8 py-14 lg:px-16">
            <div className="max-w-lg">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Nuestra Historia</span>
              <h2 className="section-title mt-2 text-3xl font-black text-neutral-900 sm:text-4xl">
                De Lima al Peru entero
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-neutral-600">
                <p>
                  {quienesSomos ?? "Consorcio Dely S.A.C. es una empresa peruana dedicada a la fabricacion, envasado y comercializacion de abarrotes a nivel nacional. A diferencia de un simple revendedor, elaboramos y envasamos directamente nuestras propias lineas de aceite, conservas, mermeladas y mas."}
                </p>
                <p>
                  Complementamos nuestro catalogo con marcas aliadas como P&G, Alicorp, Nestle, Gloria y Molitalia. Trabajamos con mayoristas, bodegueros y minoristas, siempre bajo un mismo principio: crecemos junto a cada cliente que confia en nosotros.
                </p>
              </div>
              {/* Timeline */}
              <div className="mt-8 space-y-4 border-l-2 border-neutral-100 pl-6">
                {[
                  { year: "2004", text: "Fundacion de Consorcio Dely en Lima" },
                  { year: "2010", text: "Expansion a regiones del interior del pais" },
                  { year: "2018", text: "Lanzamiento de lineas propias de aceites y mermeladas" },
                  { year: "2024", text: "Mas de 1,000 clientes a nivel nacional" },
                ].map((t) => (
                  <div key={t.year} className="relative">
                    <span className="absolute -left-7 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    <p className="text-xs font-black text-brand-red" style={{ fontFamily: "var(--font-display)" }}>{t.year}</p>
                    <p className="text-sm text-neutral-600">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NUESTRO PROPOSITO – dark bg */}
      <section id="proposito-section" className="py-20" style={{ background: "#0f0f0f" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red-light">Nuestro Proposito</span>
              <h2 className="section-title mt-2 text-3xl font-black text-white sm:text-4xl">
                Por que hacemos lo que hacemos
              </h2>
              <p className="mt-5 leading-relaxed text-neutral-400">
                {responsabilidadSocial ?? "Creemos que el crecimiento de cada bodeguero, mayorista y minorista del Peru es tambien nuestro crecimiento. Por eso fabricamos productos de calidad accesibles, distribuimos con responsabilidad y construimos relaciones de largo plazo."}
              </p>

              {/* Values */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: "star", title: "Calidad", desc: "Estandares internacionales en cada producto" },
                  { icon: "heart", title: "Compromiso", desc: "Con nuestros clientes y el Peru" },
                  { icon: "grow", title: "Crecimiento", desc: "Juntos llegamos mas lejos" },
                ].map((v) => (
                  <div key={v.title} className="rounded-xl border border-neutral-800 p-4 text-center">
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "rgba(228,35,27,0.15)" }}>
                      <svg className="h-5 w-5 text-brand-red-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {v.icon === "star" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />}
                        {v.icon === "heart" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />}
                        {v.icon === "grow" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />}
                      </svg>
                    </div>
                    <p className="text-sm font-black text-white" style={{ fontFamily: "var(--font-display)" }}>{v.title}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image collage */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative col-span-2 h-48 overflow-hidden rounded-2xl">
                <Image src={IMGS.values1} alt="Calidad" fill className="object-cover" sizes="50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="relative h-32 overflow-hidden rounded-xl">
                <Image src={IMGS.values2} alt="Compromiso" fill className="object-cover" sizes="25vw" />
              </div>
              <div className="relative h-32 overflow-hidden rounded-xl">
                <Image src={IMGS.values3} alt="Crecimiento" fill className="object-cover" sizes="25vw" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRESENCIA NACIONAL */}
      <section className="overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="flex items-center bg-white px-8 py-14 lg:px-16">
            <div className="max-w-lg">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Presencia Nacional</span>
              <h2 className="section-title mt-2 text-3xl font-black text-neutral-900 sm:text-4xl">
                Llegamos a todo el Peru
              </h2>
              <p className="mt-5 leading-relaxed text-neutral-500">
                Distribuimos a nivel nacional a mayoristas, bodegueros y minoristas desde nuestra sede en Lima. Nuestra red logistica garantiza entregas completas y a tiempo en todas las regiones.
              </p>

              {settings && (
                <div className="mt-6 space-y-3">
                  {settings.legalName && (
                    <div className="flex items-start gap-3 rounded-xl border border-neutral-100 p-4">
                      <svg className="h-5 w-5 shrink-0 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div>
                        <p className="text-xs font-bold text-neutral-400">Razon Social</p>
                        <p className="text-sm font-semibold text-neutral-800">{settings.legalName}</p>
                      </div>
                    </div>
                  )}
                  {settings.ruc && (
                    <div className="flex items-start gap-3 rounded-xl border border-neutral-100 p-4">
                      <svg className="h-5 w-5 shrink-0 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-xs font-bold text-neutral-400">RUC</p>
                        <p className="text-sm font-semibold text-neutral-800">{settings.ruc}</p>
                      </div>
                    </div>
                  )}
                  {settings.address && (
                    <div className="flex items-start gap-3 rounded-xl border border-neutral-100 p-4">
                      <svg className="h-5 w-5 shrink-0 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-xs font-bold text-neutral-400">Direccion</p>
                        <p className="text-sm font-semibold text-neutral-800">{settings.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Link href="/contacto" className="btn-primary mt-8">
                Contactar ahora
              </Link>
            </div>
          </div>

          <div className="relative h-72 lg:h-auto lg:min-h-[500px]">
            <Image src={IMGS.map} alt="Presencia nacional" fill className="object-cover object-center" sizes="(max-width:1024px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-brand-red/20" />
            {/* Stats overlay */}
            <div className="absolute bottom-6 right-6 grid grid-cols-2 gap-3">
              {[
                { n: "25+", t: "Regiones" },
                { n: "24h", t: "Lima" },
              ].map((s) => (
                <div key={s.t} className="rounded-xl bg-white/90 px-4 py-3 text-center backdrop-blur-sm shadow">
                  <p className="text-xl font-black text-brand-red" style={{ fontFamily: "var(--font-display)" }}>{s.n}</p>
                  <p className="text-xs text-neutral-500">{s.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NUESTRO EQUIPO */}
      <section className="py-20" style={{ background: "var(--neutral-50)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Image collage */}
            <div className="relative h-96 overflow-hidden rounded-2xl">
              <Image src={IMGS.team} alt="Equipo Dely" fill className="object-cover object-top" sizes="(max-width:1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>200+ colaboradores</p>
                <p className="text-sm text-white/75">comprometidos con tu exito</p>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Nuestro Equipo</span>
              <h2 className="section-title mt-2 text-3xl font-black text-neutral-900 sm:text-4xl">
                Personas que hacen la diferencia
              </h2>
              <p className="mt-5 leading-relaxed text-neutral-500">
                Detras de cada producto hay mas de 200 personas apasionadas. Desde el area de produccion hasta la distribucion, cada colaborador es parte esencial de Consorcio Dely.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { n: "200+", t: "Colaboradores" },
                  { n: "20+", t: "Anos de experiencia" },
                  { n: "5", t: "Areas de trabajo" },
                  { n: "100%", t: "Comprometidos" },
                ].map((s) => (
                  <div key={s.t} className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="text-2xl font-black text-brand-red" style={{ fontFamily: "var(--font-display)" }}>{s.n}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">{s.t}</p>
                  </div>
                ))}
              </div>

              {/* Work with us */}
              <div className="mt-8 rounded-2xl p-6 text-white" style={{ background: "linear-gradient(135deg, var(--brand-red-dark), var(--brand-red))" }}>
                <h3 className="text-base font-black" style={{ fontFamily: "var(--font-display)" }}>Trabaja con nosotros</h3>
                <p className="mt-2 text-sm text-white/85">
                  Nuestro equipo es tan valioso como cada persona que lo conforma. Si quieres ser parte de Consorcio Dely, escribenos.
                </p>
                {settings?.email && (
                  <a
                    href={`mailto:${settings.email}?subject=Postulacion`}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-brand-red transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Postula haciendo clic aqui
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}