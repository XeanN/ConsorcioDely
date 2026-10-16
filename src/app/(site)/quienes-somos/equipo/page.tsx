import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Nuestro Equipo - Consorcio Dely" };

type Row = { email: string | null };

const TEAM_MEMBERS = [
  {
    title: "Administrador",
    tag: "Liderazgo & Gestión",
    src: "/images/equipo/administrador.png",
    description: "Gestión estratégica y supervisión integral de las operaciones de Consorcio Dely.",
  },
  {
    title: "Área de Contabilidad",
    tag: "Finanzas & Control",
    src: "/images/equipo/contabilidad.png",
    description: "Gestión financiera, tributaria y aseguramiento de cumplimiento normativo.",
  },
  {
    title: "Marketing y Comercial",
    tag: "Ventas & Expansión",
    src: "/images/equipo/marketing-comercial.png",
    description: "Relación con clientes mayoristas, desarrollo de marcas y posicionamiento.",
  },
  {
    title: "Equipo de Oficina",
    tag: "Operaciones & Soporte",
    src: "/images/equipo/oficina.png",
    description: "Coordinación administrativa, compras y logística de distribución nacional.",
  },
  {
    title: "Área de Envasadora",
    tag: "Producción & Planta",
    src: "/images/equipo/area-envasadora.png",
    description: "Equipo especializado en procesamiento, control de higiene y rendimiento de envasado.",
  },
  {
    title: "Línea de Envasado y Embalaje",
    tag: "Proceso Productivo",
    src: "/images/equipo/envasadora-planta.png",
    description: "Supervisión directa del sellado, empaque y empaquetado seguro para transporte.",
  },
  {
    title: "Línea de Envasadora 2",
    tag: "Tecnología de Planta",
    src: "/images/equipo/envasadora-linea-2.png",
    description: "Operación de maquinaria de alta precisión para el flujo continuo de productos.",
  },
  {
    title: "Línea de Envasadora 3",
    tag: "Calidad & Rendimiento",
    src: "/images/equipo/envasadora-linea-3.png",
    description: "Estándares rigurosos de inocuidad y preparación de pedidos a gran escala.",
  },
  {
    title: "Graciela — Asesora de Ventas",
    tag: "Atención & Ventas",
    src: "/images/equipo/graciela-ventas.png",
    description: "Atención personalizada a comerciantes y bodegueros, cotizaciones ágiles y seguimiento de pedidos.",
  },
  {
    title: "Gabriela — Asesora Comercial",
    tag: "Fuerza de Ventas",
    src: "/images/equipo/gabriela-ventas.png",
    description: "Asesoramiento especializado en compras por mayor, volumen y despacho oportuno para negocios.",
  },
  {
    title: "Anita — Asesora en Tienda",
    tag: "Atención & Mostrador",
    src: "/images/equipo/anita-ventas.png",
    description: "Orientación en punto de venta, despacho directo de abarrotes y atención cercana a cada cliente.",
  },
];

export default async function EquipoPage() {
  const [s] = (await sql()`SELECT email FROM site_settings WHERE id = 1 LIMIT 1`) as Row[];

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative h-72 overflow-hidden sm:h-96" style={{ background: "var(--brand-dark)" }}>
        <Image
          src="/images/equipo/oficina.png"
          alt="Equipo Consorcio Dely"
          fill
          priority
          className="object-cover opacity-35 object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red-light">Quiénes somos</p>
          <h1 className="mt-2 text-4xl font-black uppercase sm:text-5xl md:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
            Nuestro Equipo
          </h1>
          <p className="mt-3 max-w-xl text-sm sm:text-base text-white/80">
            El talento humano, compromiso y dedicación que impulsan cada producto de Consorcio Dely.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {/* Intro */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Nuestros colaboradores</span>
            <h2 className="section-title mt-2 text-2xl font-black text-neutral-900 sm:text-4xl">
              Personas que hacen la diferencia
            </h2>
            <p className="mt-5 leading-relaxed text-neutral-600">
              Detrás de cada producto hay personas apasionadas. Desde la administración y marketing comercial hasta las líneas de envasado en planta y nuestro equipo de asesoras de ventas y mostrador, cada colaborador es parte esencial de nuestra cadena de valor.
            </p>
            <p className="mt-4 leading-relaxed text-neutral-600">
              Fomentamos un ambiente de trabajo inclusivo, seguro y de constante superación donde cada miembro del equipo crece profesionalmente mientras aporta al desarrollo y abastecimiento del Perú.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { n: "20+", t: "Años de trayectoria" },
                { n: "11+", t: "Áreas y colaboradores clave" },
                { n: "100%", t: "Compromiso humano" },
              ].map((st) => (
                <div key={st.t} className="rounded-2xl border border-neutral-100 bg-neutral-50/70 p-4 text-center">
                  <p className="text-2xl font-black text-brand-red sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                    {st.n}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-neutral-500">{st.t}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Collage de fotos reales destacadas */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative col-span-2 h-60 overflow-hidden rounded-2xl shadow-md border border-neutral-200/70 sm:h-72">
              <Image
                src="/images/equipo/area-envasadora.png"
                alt="Equipo Área de Envasadora"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-4 text-xs font-bold uppercase tracking-wider text-white">
                Área de Envasadora en Planta
              </span>
            </div>
            <div className="relative h-44 overflow-hidden rounded-2xl shadow-sm border border-neutral-200/70">
              <Image
                src="/images/equipo/administrador.png"
                alt="Administrador Consorcio Dely"
                fill
                className="object-cover"
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-3 text-[10px] font-bold uppercase tracking-wider text-white">
                Administración
              </span>
            </div>
            <div className="relative h-44 overflow-hidden rounded-2xl shadow-sm border border-neutral-200/70">
              <Image
                src="/images/equipo/marketing-comercial.png"
                alt="Marketing y Comercial"
                fill
                className="object-cover"
                sizes="25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-2 left-3 text-[10px] font-bold uppercase tracking-wider text-white">
                Marketing - Comercial
              </span>
            </div>
          </div>
        </div>

        {/* Galería Completa de Áreas de Consorcio Dely */}
        <div className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Nuestras Áreas</span>
            <h2 className="mt-2 text-3xl font-black text-neutral-900 sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
              Conoce las áreas de nuestro equipo
            </h2>
            <p className="mt-3 text-sm text-neutral-500">
              Cada equipo desempeña un rol crucial para entregar productos inocuos, confiables y con los mejores estándares del mercado.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_MEMBERS.map((m) => (
              <div
                key={m.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand-red/30"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={m.src}
                    alt={m.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white backdrop-blur-sm">
                      {m.tag}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-black text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>
                      {m.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                      {m.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trabaja con nosotros */}
        <div
          className="mt-20 overflow-hidden rounded-3xl shadow-xl"
          style={{ background: "linear-gradient(135deg, var(--brand-red-dark) 0%, var(--brand-red) 100%)" }}
        >
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-12 text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Oportunidades</span>
              <h3 className="mt-2 text-2xl font-black sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                Trabaja con nosotros
              </h3>
              <p className="mt-3 leading-relaxed text-white/85 text-sm sm:text-base">
                Nuestro equipo es tan valioso como cada persona que lo conforma. Si quieres ser parte de la familia de Consorcio Dely y crecer junto a nosotros, queremos conocerte.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-white/90">
                {[
                  "Oportunidades de crecimiento y capacitación continua",
                  "Ambiente colaborativo, seguro y de respeto mutuo",
                  "Beneficios de ley y estabilidad laboral",
                ].map((i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                      <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    {i}
                  </li>
                ))}
              </ul>
              {s?.email && (
                <a
                  href={`mailto:${s.email}?subject=Postulación a Consorcio Dely`}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-brand-red shadow-lg transition-all hover:bg-neutral-100 hover:shadow-xl active:scale-[0.98]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Postula aquí
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              )}
            </div>
            <div className="relative min-h-[260px] lg:min-h-full">
              <Image
                src="/images/equipo/envasadora-planta.png"
                alt="Planta Consorcio Dely"
                fill
                className="object-cover opacity-85"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-brand-red-dark via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* Navegación inferior */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200/80 pt-8">
          <Link href="/quienes-somos" className="btn-outline">
            ← Ver todo Quiénes somos
          </Link>
          <div className="flex flex-wrap gap-3">
            <Link href="/quienes-somos/presencia" className="btn-outline">
              Ver Nuestra Tienda →
            </Link>
            <Link href="/contacto" className="btn-primary">
              Contactar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}