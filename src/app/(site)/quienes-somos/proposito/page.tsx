import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Nuestro Propósito - Consorcio Dely",
  description: "Conoce el propósito, misión y valores de Consorcio Dely: calidad, cercanía y crecimiento junto a los comerciantes del Perú.",
  alternates: { canonical: "/quienes-somos/proposito" },
};

type Row = { key: string; value: string };

export default async function PropositoPage() {
  const rows = (await sql()`SELECT key, value FROM content_blocks WHERE key = 'responsabilidad_social' LIMIT 1`) as Row[];
  const texto = rows[0]?.value ?? "Creemos que el crecimiento de cada bodeguero, mayorista y minorista del Perú es también nuestro crecimiento.";

  return (
    <div>
      {/* Hero Banner con foto real de Tienda San Francisco */}
      <div className="relative h-72 overflow-hidden sm:h-96" style={{ background: "var(--brand-dark)" }}>
        <Image
          src="/images/tienda/tienda-san-francisco.png"
          alt="Fachada Tienda San Francisco - Propósito Consorcio Dely"
          fill
          priority
          className="object-cover opacity-30 object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <span className="rounded-full bg-brand-red px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
            Quiénes somos · Misión y Valores
          </span>
          <h1 className="mt-3 text-4xl font-black uppercase sm:text-5xl md:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
            Nuestro Propósito
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/80">
            Impulsar el crecimiento de los hogares, negocios y bodegas del Perú con productos de calidad y precios accesibles.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {/* Misión y Valores Principales */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Nuestra Misión</span>
            <h2 className="section-title mt-2 text-2xl font-black text-neutral-900 sm:text-4xl">
              Calidad accesible para todas las familias y negocios
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-neutral-600">
              <p className="whitespace-pre-line">{texto}</p>
              <p>
                No nos conformamos con ser intermediarios: fabricamos y envasamos con estrictos estándares sanitarios, y establecemos canales directos a través de nuestras tiendas físicas y vendedoras para escuchar qué necesita el mercado todos los días.
              </p>
              <p>
                Construimos alianzas duraderas basadas en la honestidad de precios, la consistencia de inventario y la calidez en cada atención.
              </p>
            </div>
          </div>

          {/* Tarjetas de Valores */}
          <div className="space-y-4 lg:col-span-5">
            {[
              {
                t: "Calidad",
                d: "Estándares rigurosos en cada producto que elaboramos en planta y entregamos en tienda.",
                ico: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
              },
              {
                t: "Compromiso",
                d: "Acompañamos a nuestros clientes bodegueros y mayoristas en cada etapa de su abastecimiento.",
                ico: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
              },
              {
                t: "Crecimiento",
                d: "Juntos llegamos más lejos: el progreso del comerciante peruano es el verdadero motor de nuestro éxito.",
                ico: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
              },
            ].map((v) => (
              <div key={v.t} className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm transition-all hover:border-brand-red/30">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-red-ultra">
                    <svg className="h-6 w-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.ico} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-black text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>{v.t}</p>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-neutral-600">{v.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección Destacada: El Rostro Humano de Nuestro Propósito */}
        <div className="mt-20 border-t border-neutral-200/60 pt-16">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">El Rostro Humano</span>
            <h2 className="section-title mt-2 text-2xl font-black text-neutral-900 sm:text-3xl">
              Nuestro Propósito en Cada Tienda y Vendedora
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Detrás de cada caja entregada hay personas con vocación de servicio, listos para asesorarte con honestidad y cariño.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {/* Vendedoras Anita y Clara */}
            <div className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="relative h-56 w-full">
                <Image
                  src="/images/tienda/anita-y-clara.png"
                  alt="Vendedoras Anita y Clara en Mostrador"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-3 left-3 rounded-full bg-brand-red px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  Asesoría en Tienda
                </span>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-sm font-bold text-white">Anita y Clara</p>
                  <p className="text-xs text-white/80">Atención cordial en mostrador</p>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold text-neutral-900">Orientación al Bodeguero</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                  Ayudan a seleccionar los mejores productos para que cada comerciante aproveche las promociones y maximice su margen.
                </p>
              </div>
            </div>

            {/* Mostrador de Ventas San Francisco */}
            <div className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="relative h-56 w-full">
                <Image
                  src="/images/tienda/ventas-tienda-san-francisco.png"
                  alt="Mostrador de Ventas Tienda San Francisco"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-3 left-3 rounded-full bg-neutral-900 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  Agilidad Comercial
                </span>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-sm font-bold text-white">Mostrador San Francisco</p>
                  <p className="text-xs text-white/80">Cobro y facturación rápida</p>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold text-neutral-900">Transparencia y Eficiencia</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                  Emisión inmediata de comprobantes, pedidos listos para carga y atención sin demoras para que vuelvas rápido a tu negocio.
                </p>
              </div>
            </div>

            {/* Equipo Tienda A-41 */}
            <div className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md">
              <div className="relative h-56 w-full">
                <Image
                  src="/images/tienda/equipo-tienda-a41.png"
                  alt="Equipo Tienda Mayorista A-41"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-3 left-3 rounded-full bg-brand-red px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  Fuerza Mayorista
                </span>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-sm font-bold text-white">Equipo Tienda A - 41</p>
                  <p className="text-xs text-white/80">Distribución masiva</p>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold text-neutral-900">Compromiso de Abastecimiento</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                  Trabajo coordinado entre vendedores y operarios para que los clientes mayoristas tengan stock asegurado en todo momento.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Banner Visión 2030 con foto real del equipo y tienda */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-neutral-800 shadow-xl">
          <div className="relative h-64 sm:h-72">
            <Image
              src="/images/tienda/equipo-tienda-san-francisco.png"
              alt="Equipo Tienda San Francisco - Visión 2030"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(90deg, rgba(26,0,0,0.92) 0%, rgba(180,20,14,0.75) 60%, rgba(0,0,0,0.4) 100%)" }}
            />
            <div className="relative flex h-full items-center px-6 sm:px-12">
              <div className="text-white max-w-xl">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  Mirando al futuro
                </span>
                <p className="mt-3 text-2xl sm:text-3xl font-black uppercase" style={{ fontFamily: "var(--font-display)" }}>
                  Visión 2030
                </p>
                <p className="mt-2 text-sm sm:text-base text-white/90 leading-relaxed">
                  Ser la empresa peruana de abarrotes y alimentos más confiable, querida y accesible del país, presente en cada hogar y negocio mediante nuestras marcas propias y tiendas de cercanía.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enlaces de Navegación */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-neutral-50 p-6 border border-neutral-200/60">
          <div>
            <p className="text-sm font-bold text-neutral-900">¿Quieres conocer la historia y sedes de Consorcio Dely?</p>
            <p className="text-xs text-neutral-500">Explora nuestra evolución o visítanos en Lima.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/quienes-somos/historia" className="btn-outline text-xs">
              Ver Nuestra Historia →
            </Link>
            <Link href="/quienes-somos/presencia" className="btn-primary text-xs">
              Ver Nuestras Tiendas →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
