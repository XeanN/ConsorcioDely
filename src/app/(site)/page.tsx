import Image from "next/image";
import Link from "next/link";

import { sql } from "@/lib/db";
import { publicUrlFor } from "@/lib/media";
import { getRandomQuoteLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

type ContentBlockRow = { value: string };
type CategoryRow = { id: string; name: string; slug: string };
type HeroImageRow = { r2Key: string };
type SiteSettingRow = { address: string | null };

const IMGS = {
  hero:     "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80",
  split1:   "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80",
  factory:  "https://images.unsplash.com/photo-1565793979734-8cb12b33a6a1?w=1600&q=80",
  mosaic1:  "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80",
  mosaic2:  "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=80",
  mosaic3:  "https://images.unsplash.com/photo-1588329261990-72541f5f4ad5?w=600&q=80",
  mosaic4:  "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80",
  mosaic5:  "https://images.unsplash.com/photo-1580522154071-c6ca47a859ad?w=600&q=80",
  team:     "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80",
  delivery: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=900&q=80",
};

export default async function HomePage() {
  const [hero] = (await sql()`
    SELECT value FROM content_blocks WHERE key = 'hero_title' LIMIT 1
  `) as ContentBlockRow[];

  const categories = (await sql()`
    SELECT id, name, slug FROM categories ORDER BY position ASC
  `) as CategoryRow[];

  const [heroImage] = (await sql()`
    SELECT m."r2Key" as "r2Key"
    FROM products p
    JOIN media m ON m.id = p."mediaId"
    WHERE p.active = true
    ORDER BY p.position ASC
    LIMIT 1
  `) as HeroImageRow[];

  const [settings] = (await sql()`
    SELECT address FROM site_settings WHERE id = 1 LIMIT 1
  `) as SiteSettingRow[];

  const quoteLink = await getRandomQuoteLink("Hola, quisiera cotizar productos de Consorcio Dely");
  const heroTitle = hero?.value ?? "Crecemos Juntos";
  const heroBg = heroImage ? publicUrlFor(heroImage.r2Key) : IMGS.hero;

  return (
    <div>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <Image src={heroBg} alt="Consorcio Dely" fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(0,0,0,.35) 0%,rgba(0,0,0,.15) 30%,rgba(0,0,0,.65) 80%,rgba(0,0,0,.8) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,rgba(180,20,14,.5) 0%,transparent 70%)" }} />
        <div aria-hidden className="absolute left-0 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full opacity-30" style={{ background: "var(--brand-red)", filter: "blur(120px)" }} />
        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-8 text-center">
          <span className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-md">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-red-light" />
            Aliados estrategicos para tu negocio
          </span>
          <h1 className="animate-fade-up delay-100 mt-6 text-6xl font-black uppercase leading-none tracking-tight text-white sm:text-7xl md:text-8xl" style={{ fontFamily: "var(--font-display)", textShadow: "0 4px 32px rgba(0,0,0,0.5)" }}>
            {heroTitle}
          </h1>
          <p className="animate-fade-up delay-200 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
            Fabricamos, envasamos y distribuimos abarrotes a nivel nacional.
            Tu socio para <strong className="text-white">hacer crecer tu negocio</strong>.
          </p>
          <div className="animate-fade-up delay-300 mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/catalogo" className="btn-primary text-base">
              Ver catalogo
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link href="/contacto" className="btn-outline text-base" style={{ borderColor: "rgba(255,255,255,0.6)", color: "white" }}>
              Contactanos
            </Link>
          </div>
          <div className="animate-fade-in delay-500 absolute bottom-10 left-1/2 -translate-x-1/2">
            <div className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-white/40 p-1.5" aria-hidden>
              <span className="block h-2 w-0.5 rounded-full bg-white" style={{ animation: "fade-up 1.4s ease infinite" }} />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "var(--brand-red)" }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 divide-x divide-white/20 sm:grid-cols-4">
            {[
              { value: "20+",   label: "Anos de experiencia" },
              { value: "500+",  label: "Productos en catalogo" },
              { value: "1000+", label: "Clientes satisfechos" },
              { value: "Peru",  label: "Cobertura nacional" },
            ].map((s) => (
              <div key={s.label} className="px-4 py-6 text-center text-white sm:px-8">
                <p className="text-2xl font-black sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>{s.value}</p>
                <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-white/75">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPLIT A */}
      <section className="overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="relative h-72 lg:h-auto lg:min-h-[520px]">
            <Image src={IMGS.split1} alt="Productos Consorcio Dely" fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute bottom-6 left-6 rounded-2xl bg-white/90 px-5 py-3 backdrop-blur-sm shadow-lg">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-red">Desde 2004</p>
              <p className="text-lg font-black text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>20+ anos</p>
            </div>
          </div>
          <div className="flex items-center bg-white px-8 py-14 lg:px-16">
            <div className="max-w-lg">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Quienes somos</span>
              <h2 className="section-title mt-2 text-3xl font-black text-neutral-900 sm:text-4xl">
                Mas que productos, somos tu aliado
              </h2>
              <p className="mt-5 leading-relaxed text-neutral-500">
                Somos una empresa peruana con mas de 20 anos fabricando, envasando y distribuyendo
                abarrotes de alta calidad a nivel nacional. Desde aceites y conservas hasta mermeladas
                y productos de primera necesidad, cubrimos todo lo que tu negocio necesita.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Produccion propia con estandares de calidad",
                  "Red de distribucion en todo el Peru",
                  "Comprobantes tributarios garantizados",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-neutral-600">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-red-ultra">
                      <svg className="h-3 w-3 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/quienes-somos" className="btn-primary mt-8">Conoce nuestra historia</Link>
            </div>
          </div>
        </div>
      </section>

      {/* MOSAICO */}
      <section className="py-16" style={{ background: "var(--neutral-50)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Nuestros productos</span>
            <h2 className="section-title centered mt-2 text-3xl font-black text-neutral-900 sm:text-4xl">Calidad en cada producto</h2>
            <p className="mt-3 text-neutral-500">Desde aceites y conservas hasta mermeladas — fabricado con los mas altos estandares</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
            <div className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl sm:col-span-1 sm:row-span-2">
              <div className="relative h-72 sm:h-full sm:min-h-[420px]">
                <Image src={IMGS.mosaic1} alt="Aceites Dely" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="rounded-full bg-brand-red px-3 py-1 text-xs font-bold text-white">Aceites</span>
                  <p className="mt-2 font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>Aceites Vegetales</p>
                </div>
              </div>
            </div>
            {[
              { src: IMGS.mosaic2, label: "Conservas",  tag: "Conservas" },
              { src: IMGS.mosaic3, label: "Mermeladas", tag: "Mermeladas" },
              { src: IMGS.mosaic4, label: "Abarrotes",  tag: "Abarrotes" },
              { src: IMGS.mosaic5, label: "Lacteos",    tag: "Lacteos" },
            ].map((item) => (
              <div key={item.label} className="group relative overflow-hidden rounded-2xl">
                <div className="relative h-48 sm:h-52">
                  <Image src={item.src} alt={item.label} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="rounded-full bg-brand-red/90 px-2.5 py-0.5 text-xs font-bold text-white">{item.tag}</span>
                    <p className="mt-1 text-xs font-semibold text-white">{item.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/catalogo" className="btn-outline">Ver catalogo completo</Link>
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-10 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Explora</span>
              <h2 className="section-title centered mt-2 text-3xl font-black text-neutral-900 sm:text-4xl">Nuestras Categorias</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
              {categories.map((c, i) => (
                <Link key={c.id} href={`/catalogo/${c.slug}`} className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-28 overflow-hidden bg-neutral-100">
                    <Image
                      src={[IMGS.mosaic1, IMGS.mosaic2, IMGS.mosaic3, IMGS.mosaic4, IMGS.mosaic5][i % 5]}
                      alt={c.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-brand-red/30 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm font-bold text-neutral-800 group-hover:text-brand-red" style={{ fontFamily: "var(--font-display)" }}>{c.name}</p>
                    <p className="mt-0.5 text-xs text-neutral-400 group-hover:text-brand-red/60">Ver productos</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FABRICA */}
      <section className="relative h-72 overflow-hidden sm:h-96">
        <Image src={IMGS.factory} alt="Planta de produccion Consorcio Dely" fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,rgba(0,0,0,.75) 0%,rgba(180,20,14,.6) 50%,rgba(0,0,0,.4) 100%)" }} />
        <div className="relative flex h-full items-center justify-center px-6 text-center text-white">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-white/70" style={{ fontFamily: "var(--font-display)" }}>Produccion peruana</p>
            <h2 className="mt-2 text-3xl font-black sm:text-5xl" style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}>Fabricado con orgullo en Peru</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/80 sm:text-base">Nuestra planta de produccion opera bajo estandares internacionales para garantizar la calidad que merece tu negocio.</p>
          </div>
        </div>
      </section>

      {/* SPLIT B dark */}
      <section className="overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="flex items-center bg-neutral-900 px-8 py-14 lg:px-16">
            <div className="max-w-lg">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red-light">Distribucion</span>
              <h2 className="section-title mt-2 text-3xl font-black text-white sm:text-4xl">Llegamos a todo el Peru</h2>
              <p className="mt-5 leading-relaxed text-neutral-400">Nuestra red de distribucion cubre todas las regiones del Peru. Desde Lima hasta el interior del pais, garantizamos que tus pedidos lleguen completos, a tiempo y en perfectas condiciones.</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  { n: "24h",  t: "Entrega en Lima" },
                  { n: "72h",  t: "Entrega en provincias" },
                  { n: "100%", t: "Pedidos completos" },
                  { n: "5 estrellas", t: "Calificacion clientes" },
                ].map((s) => (
                  <div key={s.t} className="rounded-xl border border-neutral-700 p-4">
                    <p className="text-2xl font-black text-brand-red-light" style={{ fontFamily: "var(--font-display)" }}>{s.n}</p>
                    <p className="mt-0.5 text-xs text-neutral-400">{s.t}</p>
                  </div>
                ))}
              </div>
              <Link href="/contacto" className="btn-primary mt-8">Solicitar cotizacion</Link>
            </div>
          </div>
          <div className="relative h-72 lg:h-auto lg:min-h-[520px]">
            <Image src={IMGS.delivery} alt="Distribucion Consorcio Dely" fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section className="py-20" style={{ background: "var(--neutral-50)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative col-span-2 h-56 overflow-hidden rounded-2xl">
                <Image src={IMGS.team} alt="Equipo Dely" fill className="object-cover object-top" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <div className="relative h-36 overflow-hidden rounded-xl">
                <Image src={IMGS.mosaic3} alt="Productos" fill className="object-cover" sizes="25vw" />
              </div>
              <div className="relative h-36 overflow-hidden rounded-xl">
                <Image src={IMGS.mosaic4} alt="Calidad" fill className="object-cover" sizes="25vw" />
              </div>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Nuestro equipo</span>
              <h2 className="section-title mt-2 text-3xl font-black text-neutral-900 sm:text-4xl">Personas comprometidas con tu exito</h2>
              <p className="mt-5 leading-relaxed text-neutral-500">Detras de cada producto hay un equipo apasionado que trabaja cada dia para asegurar la mejor calidad. Nuestros mas de 200 colaboradores son la columna vertebral de Consorcio Dely.</p>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[IMGS.mosaic1, IMGS.mosaic2, IMGS.mosaic3].map((src, i) => (
                    <div key={i} className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow">
                      <Image src={src} alt="Colaborador" fill className="object-cover" sizes="40px" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-neutral-500">
                  <strong className="text-neutral-900">200+</strong> colaboradores en todo el Peru
                </p>
              </div>
              <Link href="/quienes-somos" className="btn-outline mt-8">Conoce al equipo</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA WHATSAPP */}
      <section className="relative overflow-hidden py-20" style={{ background: "linear-gradient(135deg,var(--brand-red-dark) 0%,var(--brand-red) 60%,var(--brand-red-light) 100%)" }}>
        <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white opacity-5" />
        <div aria-hidden className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white opacity-5" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-10 sm:grid-cols-2">
            <div className="text-white">
              <p className="mb-1 text-sm font-bold uppercase tracking-widest text-white/70" style={{ fontFamily: "var(--font-display)" }}>Puntos de venta</p>
              <h2 className="text-3xl font-black sm:text-4xl">Encuentranos cerca de ti</h2>
              <p className="mt-4 leading-relaxed text-white/80">{settings?.address ?? "Escribenos para conocer nuestro punto de venta mas cercano a ti."}</p>
              <Link href="/contacto" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/90 underline-offset-4 hover:underline">Ver ubicaciones</Link>
            </div>
            <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
              <p className="mb-1 text-sm font-bold uppercase tracking-widest text-white/70" style={{ fontFamily: "var(--font-display)" }}>Tienda online</p>
              <h3 className="text-2xl font-black text-white">Cotiza ahora por WhatsApp</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">Recibe una cotizacion personalizada al instante. Nuestro equipo te atiende en minutos.</p>
              {quoteLink ? (
                <a href={quoteLink} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-3 rounded-full bg-brand-green px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl" style={{ fontFamily: "var(--font-display)" }}>
                  <svg viewBox="0 0 32 32" className="h-5 w-5 fill-white"><path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.36.696 4.56 1.89 6.406L4 29l7.79-1.85A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Z" /></svg>
                  Cotizar por WhatsApp
                </a>
              ) : (
                <p className="mt-4 text-sm text-white/70">Consulta nuestro catalogo completo en linea.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-black text-neutral-900 sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Listo para hacer crecer tu negocio?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-neutral-500">
            Unete a los mas de 1,000 clientes que confian en Consorcio Dely para abastecer
            sus negocios con los mejores productos del mercado peruano.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/catalogo" className="btn-primary text-base">Explorar catalogo</Link>
            <Link href="/quienes-somos" className="btn-outline text-base">Conoce nuestra historia</Link>
          </div>
        </div>
      </section>
    </div>
  );
}