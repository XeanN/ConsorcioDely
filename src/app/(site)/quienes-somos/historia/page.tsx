import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Nuestra Historia - Consorcio Dely",
  description: "Conoce la historia, evolución y trayectoria de Consorcio Dely, desde nuestra primera tienda mayorista hasta hoy.",
  alternates: { canonical: "/quienes-somos/historia" },
};

type Row = { key: string; value: string };

export default async function HistoriaPage() {
  const rows = (await sql()`SELECT key, value FROM content_blocks WHERE key = 'quienes_somos' LIMIT 1`) as Row[];
  const texto = rows[0]?.value ?? "Consorcio Dely S.A.C. es una empresa peruana dedicada a la fabricación, envasado y comercialización de abarrotes desde el 2004.";

  return (
    <div>
      {/* Hero Banner con foto real de la Tienda Mayorista A-41 */}
      <div className="relative h-72 overflow-hidden sm:h-96" style={{ background: "linear-gradient(135deg, #1a0000 0%, #a8130d 100%)" }}>
        <Image
          src="/images/tienda/tienda-a41.png"
          alt="Fachada Tienda Mayorista A-41 - Historia Consorcio Dely"
          fill
          priority
          className="object-cover opacity-30 object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <span className="rounded-full bg-brand-red px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
            Quiénes somos · Trayectoria
          </span>
          <h1 className="mt-3 text-4xl font-black uppercase sm:text-5xl md:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
            Nuestra Historia
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/80">
            Más de 20 años forjando relaciones de confianza con bodegueros, comerciantes y familias de todo el Perú.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {/* Sección principal: Origen y Evolución */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Desde 2004</span>
            <h2 className="section-title mt-2 text-2xl font-black text-neutral-900 sm:text-4xl">
              De nuestra primera tienda al abastecimiento mayorista de Lima
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-neutral-600">
              <p className="whitespace-pre-line">{texto}</p>
              <p>
                Nacimos como un punto de venta mayorista donde el trato directo y la palabra de honor eran la base de cada trato. Con los años, entendimos que para ofrecer precios justos y calidad garantizada debíamos controlar el proceso de producción: así nacieron nuestras plantas de envasado de aceites y elaboración de conservas.
              </p>
              <p>
                Hoy, además de nuestras marcas propias como Lenysol y Delytun, distribuimos marcas líderes del mercado como Alicorp, Nestlé, Gloria, P&G y Molitalia.
              </p>
            </div>

            {/* Chips de métricas */}
            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50/60 p-4 text-center">
                <p className="text-2xl font-black text-brand-red" style={{ fontFamily: "var(--font-display)" }}>2004</p>
                <p className="mt-1 text-xs text-neutral-500 font-medium">Año de fundación</p>
              </div>
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50/60 p-4 text-center">
                <p className="text-2xl font-black text-brand-red" style={{ fontFamily: "var(--font-display)" }}>1,000+</p>
                <p className="mt-1 text-xs text-neutral-500 font-medium">Clientes mayoristas</p>
              </div>
              <div className="rounded-2xl border border-neutral-100 bg-neutral-50/60 p-4 text-center">
                <p className="text-2xl font-black text-brand-red" style={{ fontFamily: "var(--font-display)" }}>2</p>
                <p className="mt-1 text-xs text-neutral-500 font-medium">Tiendas en Lima</p>
              </div>
            </div>
          </div>

          {/* Columna derecha: Fotos reales de vendedoras y línea de tiempo */}
          <div className="space-y-6 lg:col-span-5">
            {/* Card de Anita y Clara en tienda */}
            <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 shadow-sm">
              <div className="relative h-60 w-full sm:h-64">
                <Image
                  src="/images/tienda/anita-y-clara.png"
                  alt="Vendedoras de Tienda - Anita y Clara"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width:1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="inline-block rounded-full bg-brand-red px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    El corazón del negocio
                  </span>
                  <p className="mt-1 text-base font-bold text-white">Nuestras Vendedoras en Tienda</p>
                  <p className="text-xs text-white/80">Anita y Clara brindando atención personalizada y asesoría a cada comerciante.</p>
                </div>
              </div>
            </div>

            {/* Línea de tiempo histórica */}
            <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>
                Hitos de nuestro crecimiento
              </h3>
              <div className="mt-5 space-y-5 border-l-2 border-brand-red pl-5">
                {[
                  { y: "2004", t: "Fundación de Consorcio Dely y apertura de Tienda Mayorista A-41 en Lima." },
                  { y: "2010", t: "Expansión logística para abastecer mercados y bodegas de provincias." },
                  { y: "2018", t: "Lanzamiento y envasado industrial de aceites Lenysol y conservas Delytun." },
                  { y: "2024", t: "Apertura de Tienda San Francisco y consolidación de más de 1,000 clientes activos." },
                ].map((e) => (
                  <div key={e.y} className="relative">
                    <span className="absolute -left-6 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-red ring-4 ring-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    <p className="text-xs font-black text-brand-red" style={{ fontFamily: "var(--font-display)" }}>{e.y}</p>
                    <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">{e.t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sección destacada: Nuestras Tiendas Físicas en la Historia */}
        <div className="mt-20 border-t border-neutral-200/60 pt-16">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Puntos de Venta</span>
            <h2 className="section-title mt-2 text-2xl font-black text-neutral-900 sm:text-3xl">
              Nuestras Tiendas a lo largo de la historia
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Cada tienda física representa un paso firme en nuestro compromiso por estar más cerca de cada comerciante.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Tienda A-41 */}
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="relative h-56 sm:h-64">
                <Image
                  src="/images/tienda/tienda-a41.png"
                  alt="Tienda Mayorista A-41"
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 rounded-full bg-brand-red px-3 py-1 text-xs font-bold text-white shadow">
                  Nuestra Primera Tienda
                </span>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
                    Tienda Mayorista A - 41
                  </h3>
                  <p className="text-xs text-white/80">Sede Central de Distribución y Ventas al por Mayor</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm leading-relaxed text-neutral-600">
                  Fue nuestro primer punto de contacto directo con los comerciantes peruanos. Aquí nació nuestra filosofía de abastecimiento continuo, precios competitivos y atención honesta.
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-neutral-700">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                  Atención continua para mayoristas y minoristas
                </div>
              </div>
            </div>

            {/* Tienda San Francisco */}
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="relative h-56 sm:h-64">
                <Image
                  src="/images/tienda/tienda-san-francisco.png"
                  alt="Tienda San Francisco"
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 rounded-full bg-neutral-900/90 px-3 py-1 text-xs font-bold text-white shadow">
                  Expansión Comercial
                </span>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
                    Tienda San Francisco
                  </h3>
                  <p className="text-xs text-white/80">Sede Comercial & Despacho Ágil</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm leading-relaxed text-neutral-600">
                  Inaugurada para agilizar las entregas locales, ofrecer recojo de pedidos programados y dar soporte comercial inmediato con nuestro equipo de atención y ventas.
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs font-semibold text-neutral-700">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                  Mostrador de ventas y coordinación de fletes
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de navegación interna */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-neutral-50 p-6 border border-neutral-200/60">
          <div>
            <p className="text-sm font-bold text-neutral-900">¿Quieres conocer nuestras tiendas en persona?</p>
            <p className="text-xs text-neutral-500">Visita nuestras sedes o coordina tus pedidos de inmediato.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/quienes-somos/presencia" className="btn-primary text-xs">
              Ver Nuestras Tiendas →
            </Link>
            <Link href="/quienes-somos/proposito" className="btn-outline text-xs">
              Ver Nuestro Propósito →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
