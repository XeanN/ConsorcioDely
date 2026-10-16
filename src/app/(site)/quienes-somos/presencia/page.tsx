import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Nuestra Tienda - Consorcio Dely" };

type Row = { email: string | null; address: string | null; legalName: string | null; ruc: string | null };

const TIENDAS = [
  {
    title: "Tienda A - 41",
    tag: "Sede Mayorista & Distribución",
    src: "/images/tienda/tienda-a41.png",
    teamSrc: "/images/tienda/equipo-tienda-a41.png",
    teamLabel: "Equipo de Tienda A - 41",
    description:
      "Punto de abastecimiento con stock completo de aceites Lenysol, conservas Delytun y abarrotes de primera necesidad con precios competitivos por mayor y menor.",
    highlights: ["Venta por mayor y menor", "Variedad completa de marcas aliadas", "Atención rápida y stock garantizado"],
  },
  {
    title: "Tienda San Francisco",
    tag: "Sede Comercial & Despacho",
    src: "/images/tienda/tienda-san-francisco.png",
    teamSrc: "/images/tienda/equipo-tienda-san-francisco.png",
    teamLabel: "Equipo de Tienda San Francisco",
    description:
      "Atención personalizada directa y coordinación de despachos locales. Ideal para comerciantes, bodegas, restaurantes e instituciones.",
    highlights: ["Despacho ágil en Lima", "Atención y asesoría comercial", "Punto de recojo de pedidos coordinados"],
  },
];

const STORE_STAFF = [
  {
    name: "Anita y Clara",
    role: "Asesoras de Ventas y Atención",
    src: "/images/tienda/anita-y-clara.png",
    description: "Atención cálida, asesoramiento sobre productos y cotizaciones directas en tienda.",
  },
  {
    name: "Gianmarco y Jairo",
    role: "Despacho, Almacén y Logística",
    src: "/images/tienda/gianmarco-y-jairo.png",
    description: "Verificación de pedidos, control de carga pesada y entrega segura a vehículos y clientes.",
  },
  {
    name: "Ventas y Caja San Francisco",
    role: "Mostrador Comercial",
    src: "/images/tienda/ventas-tienda-san-francisco.png",
    description: "Facturación electrónica inmediata, cobro ágil y despacho directo en mostrador.",
  },
  {
    name: "Almacén Central de Tiendas",
    role: "Capacidad Mayorista",
    src: "/images/almacen/almacen-1.png",
    description: "Racks con stock permanente de aceites, conservas y abarrotes listos para entrega.",
  },
];

export default async function PresenciaPage() {
  const [s] = (await sql()`SELECT email, address, "legalName", ruc FROM site_settings WHERE id = 1 LIMIT 1`) as Row[];

  return (
    <div>
      {/* Hero Banner con foto real de Tienda A - 41 */}
      <div className="relative h-72 overflow-hidden sm:h-96" style={{ background: "linear-gradient(135deg, #1a0000, #e4231b)" }}>
        <Image
          src="/images/tienda/tienda-a41.png"
          alt="Tienda Consorcio Dely"
          fill
          priority
          className="object-cover opacity-35 object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red-light">Quiénes somos</p>
          <h1 className="mt-2 text-4xl font-black uppercase sm:text-5xl md:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
            Nuestra Tienda
          </h1>
          <p className="mt-3 max-w-xl text-sm sm:text-base text-white/80">
            Conoce nuestras sedes comerciales y puntos de distribución directa en Lima.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {/* Intro y Canales de Atención */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Visítanos</span>
            <h2 className="section-title mt-2 text-2xl font-black text-neutral-900 sm:text-4xl">
              Atención directa, mayorista y personalizada
            </h2>
            <p className="mt-5 leading-relaxed text-neutral-600">
              Puedes acercarte a cualquiera de nuestras tiendas físicas en Lima para verificar la calidad de nuestros productos, o coordinar tu pedido previamente por WhatsApp y llamada telefónica.
            </p>
            <p className="mt-3 leading-relaxed text-neutral-600">
              Garantizamos atención oportuna, abastecimiento continuo para tu negocio y la transparencia que nos caracteriza en cada entrega.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { n: "Tiendas físicas", t: "Atención presencial en Lima" },
                { n: "WhatsApp", t: "Pedidos y cotizaciones al instante" },
                { n: "Llamada directa", t: "Asesoría comercial inmediata" },
                { n: "100%", t: "Compromiso y puntualidad" },
              ].map((item) => (
                <div key={item.t} className="rounded-2xl border border-neutral-100 bg-neutral-50/60 p-4 text-center shadow-sm">
                  <p className="text-2xl font-black text-brand-red sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                    {item.n}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">{item.t}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            {s && (
              <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
                <h3 className="text-lg font-black text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>
                  Información Institucional
                </h3>
                <p className="mt-1 text-xs text-neutral-400">Datos oficiales de Consorcio Dely</p>

                <div className="mt-6 space-y-3.5">
                  {s.legalName && (
                    <div className="flex gap-3.5 rounded-2xl bg-neutral-50 p-4">
                      <svg className="h-5 w-5 shrink-0 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Razón Social</p>
                        <p className="text-sm font-bold text-neutral-800">{s.legalName}</p>
                      </div>
                    </div>
                  )}

                  {s.ruc && (
                    <div className="flex gap-3.5 rounded-2xl bg-neutral-50 p-4">
                      <svg className="h-5 w-5 shrink-0 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">RUC</p>
                        <p className="text-sm font-bold text-neutral-800">{s.ruc}</p>
                      </div>
                    </div>
                  )}

                  {s.address && (
                    <div className="flex gap-3.5 rounded-2xl bg-neutral-50 p-4">
                      <svg className="h-5 w-5 shrink-0 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Ubicación Principal</p>
                        <p className="text-sm font-semibold text-neutral-800">{s.address}</p>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/contacto"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-red py-3 text-sm font-bold text-white shadow-md transition-all hover:brightness-95"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Contactar por WhatsApp
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Tiendas Físicas con fotos reales */}
        <div className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Sedes Físicas</span>
            <h2 className="mt-2 text-3xl font-black text-neutral-900 sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
              Nuestras Tiendas en Lima
            </h2>
            <p className="mt-3 text-sm text-neutral-500">
              Puntos de venta directos donde puedes comprar al por mayor y menor, recoger tus pedidos y conocer nuestro catálogo completo.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {TIENDAS.map((tienda) => (
              <div
                key={tienda.title}
                className="group overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-brand-red/30 flex flex-col"
              >
                {/* Doble imagen: Fachada y Equipo de Tienda */}
                <div className="grid grid-cols-2 aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                  <div className="relative h-full w-full overflow-hidden border-r border-white/20">
                    <Image
                      src={tienda.src}
                      alt={`${tienda.title} - Fachada`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Fachada
                    </span>
                  </div>
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      src={tienda.teamSrc}
                      alt={tienda.teamLabel}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      {tienda.teamLabel}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-brand-red px-3 py-1 text-xs font-bold text-white shadow">
                        {tienda.tag}
                      </span>
                    </div>
                    <h3 className="mt-3 text-2xl font-black text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>
                      {tienda.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                      {tienda.description}
                    </p>

                    <div className="mt-5 space-y-2">
                      {tienda.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-2 text-xs font-medium text-neutral-700">
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-green/20 text-brand-green font-bold">
                            ✓
                          </span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-brand-green flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-brand-green animate-pulse" />
                      Abierto para atención
                    </span>
                    <Link
                      href="/contacto"
                      className="text-xs font-bold text-brand-red hover:underline inline-flex items-center gap-1"
                    >
                      Coordinar visita / pedido →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ EQUIPO DE ATENCIÓN EN TIENDA, VENDEDORAS Y ALMACÉN ══ */}
        <div className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Atención Personalizada</span>
            <h2 className="mt-2 text-3xl font-black text-neutral-900 sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
              Nuestras Vendedoras y Equipo de Tienda
            </h2>
            <p className="mt-3 text-sm text-neutral-500">
              Conoce al equipo que te recibe con amabilidad, gestiona tus pedidos mayoristas y despacha tu mercadería de manera inmediata.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STORE_STAFF.map((staff) => (
              <div
                key={staff.name}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand-red/30"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={staff.src}
                    alt={staff.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white backdrop-blur-sm">
                      {staff.role}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-black text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>
                      {staff.name}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
                      {staff.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navegación inferior */}
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200/80 pt-8">
          <Link href="/quienes-somos" className="btn-outline">
            ← Ver todo Quiénes somos
          </Link>
          <div className="flex flex-wrap gap-3">
            <Link href="/quienes-somos/equipo" className="btn-outline">
              Ver Nuestro Equipo →
            </Link>
            <Link href="/contacto" className="btn-primary">
              Contactar ahora
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}