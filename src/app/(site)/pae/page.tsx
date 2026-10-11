import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PaeProductCard, type PaeProductData } from "@/components/site/PaeProductCard";
import { getRandomQuoteLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Programa de Alimentación Escolar (PAE) — Consorcio Dely",
  description:
    "Línea especializada de productos acreditados para el Programa de Alimentación Escolar (PAE / Qali Warma). Calidad certificada HACCP, registro DIGESA y cumplimiento estricto de fichas técnicas para compras del Estado.",
  alternates: { canonical: "/pae" },
};

const PAE_NUTRITION_FACTS = [
  { label: "Calorías", value: "126 kcal", dailyValue: "7%" },
  { label: "Grasa total", value: "14 g", dailyValue: "18%" },
  { label: "Grasa saturada", value: "2.5 g", dailyValue: "13%" },
  { label: "Grasa trans*", value: "0 g", dailyValue: "ND" },
  { label: "Grasa monoinsaturada", value: "3.5 g", dailyValue: "ND" },
  { label: "Grasa poliinsaturada", value: "8 g", dailyValue: "ND" },
  { label: "Colesterol", value: "0 mg", dailyValue: "0%" },
  { label: "Sodio", value: "0 mg", dailyValue: "0%" },
  { label: "Carbohidratos totales", value: "0 g", dailyValue: "0%" },
  { label: "Fibra dietética", value: "0 g", dailyValue: "0%" },
  { label: "Azúcares totales", value: "0 g", dailyValue: "0%" },
  { label: "Proteína", value: "0 g", dailyValue: "0%" },
];

const PAE_PRODUCTS: PaeProductData[] = [
  {
    id: "pae-1l",
    name: "Aceite Vegetal Lenysol 1 L",
    slug: "pae-lenysol-1-l",
    packSize: "Caja x 12 Unidades",
    servingSize: "1 cucharada (14 g)",
    servingsPerBottle: "66 aprox.",
    description:
      "Formulado y envasado especialmente para cocinas, comedores escolares y preparación centralizada de raciones del programa de alimentación escolar. Aporte de ácidos grasos esenciales y 100% libre de grasas trans.",
    frontImage: "/images/products/aceite-vegetal-lenysol-1-l.png",
    backImage: "/images/products/pae-lenysol-1-l-reverso.png",
    nutritionFacts: PAE_NUTRITION_FACTS,
  },
  {
    id: "pae-200ml",
    name: "Aceite Vegetal Lenysol 200 ml",
    slug: "pae-lenysol-200-ml",
    packSize: "Caja x 24 Unidades",
    servingSize: "1 cucharada (14 g)",
    servingsPerBottle: "13 aprox.",
    description:
      "Presentación individual hermética diseñada para canastas escolares, kits de preparación familiar y distribución en instituciones educativas rurales y urbanas. Máxima durabilidad e inocuidad garantizada.",
    frontImage: "/images/products/aceite-vegetal-lenysol-200-ml.png",
    backImage: "/images/products/pae-lenysol-200-ml-reverso.png",
    nutritionFacts: PAE_NUTRITION_FACTS,
  },
];

const STATE_CERTIFICATIONS = [
  {
    title: "Certificación HACCP",
    desc: "Sistema de Análisis de Peligros y Puntos Críticos de Control auditado para garantizar cero contaminación en planta.",
    icon: "🛡️",
  },
  {
    title: "Registro Sanitario DIGESA",
    desc: "Autorización y vigilancia sanitaria oficial vigente para todos nuestros lotes de producción nacional.",
    icon: "📋",
  },
  {
    title: "Buenas Prácticas de Manufactura (BPM)",
    desc: "Protocolos estrictos de higiene, envasado automatizado y almacenamiento controlado.",
    icon: "✨",
  },
  {
    title: "Trazabilidad Total de Lote",
    desc: "Codificación visible y legible para supervisores de entrega en instituciones educativas y comités de compra.",
    icon: "🏷️",
  },
];

export default async function PaePortalPage() {
  const quoteLink =
    (await getRandomQuoteLink(
      "Hola, me comunico desde un comité de compra / proveedor del Estado interesado en la línea PAE de Consorcio Dely para el Programa de Alimentación Escolar."
    )) ?? "https://wa.me/51932598762";

  return (
    <div className="min-h-screen bg-neutral-50/40 text-neutral-800">
      
      {/* ══ BARRA DE CONTEXTO INSTITUCIONAL ══ */}
      <div className="border-b border-emerald-900/10 bg-emerald-900 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold tracking-wide text-emerald-200 uppercase">
              División Institucional & Alimentación Escolar
            </span>
            <span className="hidden sm:inline text-emerald-400">•</span>
            <span className="hidden sm:inline text-emerald-100">Atención a Licitaciones y Comités de Compra</span>
          </div>
          <Link
            href="/catalogo"
            className="group flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-semibold text-white transition hover:bg-white/20"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span>
            <span>Volver al Catálogo Comercial</span>
          </Link>
        </div>
      </div>

      {/* ══ HERO ESCOLAR E INSTITUCIONAL ══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-900 text-white">
        {/* Imagen de fondo ambiental (niños en escuela) con opacidad */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <Image
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1600&q=80"
            alt="Niños en escuela aprendiendo y comiendo sano"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* Gradiente radial decorativo */}
        <div
          aria-hidden
          className="absolute -top-24 -left-24 h-96 w-96 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ background: "#10b981" }}
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ background: "#0284c7" }}
        />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <div className="max-w-3xl">
            {/* Pill del Programa */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-4 py-1 text-xs font-bold text-emerald-200 backdrop-blur-md">
              <span className="text-base">🎒</span>
              <span>PROGRAMA NACIONAL DE ALIMENTACIÓN ESCOLAR (PAE)</span>
            </div>

            {/* Título */}
            <h1
              className="mt-6 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
            >
              Nutriendo el futuro de la niñez del Perú
            </h1>

            {/* Subtítulo */}
            <p className="mt-5 text-base leading-relaxed text-emerald-100 sm:text-lg">
              Desarrollamos y producimos alimentos e insumos bajo los más rigurosos estándares de inocuidad y
              cumplimiento de fichas técnicas para compras del Estado (PAE / Qali Warma). Calidad certificada
              que impulsa el bienestar, crecimiento y rendimiento escolar de millones de estudiantes.
            </p>

            {/* Métricas clave */}
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-emerald-800/80 pt-6 sm:grid-cols-4">
              <div>
                <strong className="block text-2xl font-black text-amber-300 sm:text-3xl">100%</strong>
                <span className="text-xs text-emerald-200">Vegetal e Inocuo</span>
              </div>
              <div>
                <strong className="block text-2xl font-black text-emerald-300 sm:text-3xl">0%</strong>
                <span className="text-xs text-emerald-200">Grasas Trans</span>
              </div>
              <div>
                <strong className="block text-2xl font-black text-sky-300 sm:text-3xl">HACCP</strong>
                <span className="text-xs text-emerald-200">Certificación Oficial</span>
              </div>
              <div>
                <strong className="block text-2xl font-black text-white sm:text-3xl">DIGESA</strong>
                <span className="text-xs text-emerald-200">Registro Sanitario</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#productos-pae"
                className="rounded-full bg-emerald-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-emerald-400 hover:shadow-emerald-500/30"
              >
                Ver Productos Acreditados
              </a>
              <a
                href={quoteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <span>💬</span> Atención a Proveedores del Estado
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ COMPROMISO CON LA NUTRICIÓN INFANTIL ══ */}
      <section className="border-b border-neutral-200/80 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            
            {/* Foto ilustrativa de niños/alimentación escolar */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-neutral-200 shadow-md lg:col-span-5">
              <Image
                src="https://images.unsplash.com/photo-1588072432836-e10032774350?w=1000&q=80"
                alt="Alimentación escolar de calidad en las escuelas del Perú"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 450px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                  Compromiso Social
                </span>
                <p className="mt-2 text-sm font-semibold leading-snug">
                  Energía saludable y nutrientes esenciales para el aprendizaje en las aulas.
                </p>
              </div>
            </div>

            {/* Texto de compromiso */}
            <div className="lg:col-span-7">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
                Alimentación para el Desarrollo
              </span>
              <h2
                className="mt-2 text-2xl font-black text-neutral-900 sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Por qué el Programa PAE requiere formulaciones especializadas
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                La alimentación escolar no es un producto genérico: responde a directivas nutricionales estrictas
                establecidas por el Estado peruano. Los aceites vegetales destinados al PAE deben garantizar una
                fuente limpia de energía, sin grasas trans, con porcentaje controlado de ácidos grasos saturados
                y un empaque hermético que preserve la frescura durante los traslados a zonas urbanas y rurales.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                    <span className="text-lg">🌿</span>
                    <span>100% Grasa Vegetal Pura</span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-600">
                    Mezcla balanceada de aceites vegetales comestibles con alto contenido de ácidos grasos mono y poliinsaturados.
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                    <span className="text-lg">📦</span>
                    <span>Empaques Institucionales</span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-600">
                    Cajas reforzadas y rotulado claro con indicación institucional conforme a la normativa vigente.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ CATÁLOGO EXCLUSIVO PAE ══ */}
      <section id="productos-pae" className="py-16 sm:py-20 bg-neutral-50/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <span className="inline-block rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-emerald-800">
              Línea Oficial Acreditada
            </span>
            <h2
              className="mt-3 text-3xl font-black text-neutral-900 sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Productos de la Línea PAE Lenysol
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-neutral-600 leading-relaxed">
              Haz clic en cada producto para alternar entre la toma frontal, la foto real del reverso con su etiqueta
              nutricional en alta definición y la tabla completa de especificaciones oficiales.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {PAE_PRODUCTS.map((product) => (
              <PaeProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ ESTÁNDARES Y CERTIFICACIONES ══ */}
      <section className="border-t border-neutral-200/80 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">
              Garantía de Inocuidad
            </span>
            <h2
              className="mt-2 text-2xl font-black text-neutral-900 sm:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Estándares de Calidad para Compras Públicas
            </h2>
            <p className="mt-3 text-sm text-neutral-600">
              Cumplimos con cada uno de los lineamientos exigidos por los comités de compra y entidades fiscalizadoras del Estado.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STATE_CERTIFICATIONS.map((cert, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 transition duration-200 hover:border-emerald-300 hover:bg-emerald-50/30 hover:shadow-sm"
              >
                <span className="text-3xl">{cert.icon}</span>
                <h3 className="mt-4 text-base font-bold text-neutral-900">{cert.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ATENCIÓN A LICITACIONES & PROVEEDORES ══ */}
      <section className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1 text-xs font-bold text-emerald-200">
            <span>🤝</span> Canal Especializado B2G / Licitaciones
          </span>
          <h2
            className="mt-4 text-3xl font-black sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ¿Representas a un Comité de Compra o Proveedor del Estado?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-emerald-100 sm:text-base">
            Contamos con capacidad de planta, cronogramas de despacho asegurados y documentación técnica completa
            (fichas técnicas, certificados de calidad de lote y protocolos de inocuidad) para abastecer convocatorias
            a nivel nacional.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={quoteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-neutral-900 shadow-lg transition hover:bg-emerald-300 hover:scale-105"
            >
              <span>💬</span> Contactar Vía WhatsApp
            </a>
            <Link
              href="/contacto"
              className="rounded-full border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Mesa de Partes / Contacto
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
