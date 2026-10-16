import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PaeProductCard, type PaeProductData } from "@/components/site/PaeProductCard";
import { WhatsAppCta } from "@/components/site/WhatsAppCta";
import { PAE_QUOTE_PHONES } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Programa de Alimentación Escolar (PAE) — Consorcio Dely",
  description:
    "Línea especializada de productos acreditados para el Programa de Alimentación Escolar (PAE / Qali Warma / MIDIS). Calidad certificada HACCP, registro DIGESA y compromiso con la nutrición de los niños y poblaciones más vulnerables del Perú.",
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
    frontImage: "/images/products/pae-lenysol-1-l-frente.png",
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
    frontImage: "/images/products/pae-lenysol-200-ml-frente.png",
    backImage: "/images/products/pae-lenysol-200-ml-reverso.png",
    nutritionFacts: PAE_NUTRITION_FACTS,
  },
];

const VULNERABLE_POPULATIONS = [
  {
    title: "Comunidades Andinas y Rurales",
    badge: "Sierra & Zonas Altoandinas",
    src: "https://images.unsplash.com/photo-1519074598089-6436475c7f8f?w=800&q=80",
    desc: "Atención prioritaria a estudiantes en quintiles 1 y 2 de pobreza, caseríos alejados y escuelas multigrado donde el desayuno escolar asegura la permanencia en las aulas.",
  },
  {
    title: "Instituciones Educativas Públicas",
    badge: "Costa, Sierra y Selva",
    src: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
    desc: "Soporte directo a los Comités de Alimentación Escolar (CAE) integrados por docentes y padres que preparan diariamente raciones con inocuidad y amor.",
  },
  {
    title: "Ollas Comunes y Comedores",
    badge: "Sectores Vulnerables",
    src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    desc: "Suministro confiable para programas de complementación alimentaria, zonas urbano-marginales y contingencias sociales en coordinación con entidades del Estado.",
  },
];

const STATE_CERTIFICATIONS = [
  {
    title: "Certificación HACCP Oficial",
    desc: "Sistema de Análisis de Peligros y Puntos Críticos de Control auditado en planta para garantizar cero contaminación física, química o microbiológica.",
    icon: "🛡️",
  },
  {
    title: "Registro Sanitario DIGESA",
    desc: "Autorización y vigilancia sanitaria oficial vigente para todos nuestros lotes de producción nacional.",
    icon: "📋",
  },
  {
    title: "Buenas Prácticas de Manufactura (BPM)",
    desc: "Protocolos estrictos de higiene, envasado automatizado y almacenamiento controlado bajo normativa peruana.",
    icon: "✨",
  },
  {
    title: "Empaque y Trazabilidad para el Estado",
    desc: "Cajas reforzadas preparadas para transporte fluvial y trochas andinas, con rotulado claro y codificación visible por lote.",
    icon: "📦",
  },
];

const PAE_QUOTE_MESSAGE =
  "Hola, me comunico desde un comité de compra / proveedor del Estado interesado en la línea PAE de Consorcio Dely para el Programa de Alimentación Escolar.";

export default async function PaePortalPage() {
  const quotePhones = PAE_QUOTE_PHONES;

  return (
    <div className="min-h-screen bg-neutral-50/40 text-neutral-800">
      
      {/* ══ CINTILLO PATRIO PERUANO (ROJO Y BLANCO) ══ */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-white to-red-600" />

      {/* ══ BARRA DE CONTEXTO INSTITUCIONAL PERUANO ══ */}
      <div className="border-b border-red-950/20 bg-neutral-900 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-extrabold tracking-wider text-red-400 uppercase">
              🇵🇪 Programa Nacional de Alimentación Escolar (PAE)
            </span>
            <span className="hidden sm:inline text-neutral-500">•</span>
            <span className="hidden sm:inline text-neutral-300">Gobierno del Perú / MIDIS — Qali Warma</span>
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

      {/* ══ HERO ESCOLAR E INSTITUCIONAL PERUANO ══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1b2a26] via-[#163028] to-[#0f231e] text-white">
        {/* Imagen de fondo ambiental: niño andino peruano sonriente con chullo y poncho */}
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <Image
            src="https://images.unsplash.com/photo-1519074598089-6436475c7f8f?w=1600&q=85"
            alt="Niñez del Perú sonriente y alimentada con nutrición saludable"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* Gradientes decorativos con tonos rojo institucional y verde nutrición */}
        <div
          aria-hidden
          className="absolute -top-24 -left-24 h-96 w-96 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ background: "#dc2626" }}
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{ background: "#10b981" }}
        />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <div className="max-w-3xl">
            {/* Badge con Bandera Peruana y Enfoque Social */}
            <div className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-600/25 px-4 py-1.5 text-xs font-black text-red-200 backdrop-blur-md">
              <span className="text-base">🇵🇪</span>
              <span className="tracking-wide uppercase">Alimentación Escolar con Orgullo y Compromiso Nacional</span>
            </div>

            {/* Título Principal */}
            <h1
              className="mt-6 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
            >
              Nutriendo el futuro de los niños y poblaciones más vulnerables del Perú
            </h1>

            {/* Subtítulo enfocado en la niñez y el estado */}
            <p className="mt-5 text-base leading-relaxed text-emerald-100 sm:text-lg">
              Consorcio Dely formula y envasa insumos de máxima inocuidad conforme a las rigurosas especificaciones
              técnicas de compras públicas del Estado (PAE / Qali Warma). Llevamos energía saludable, 0% grasas trans
              y nutrientes esenciales a las instituciones educativas de Costa, Sierra y Selva, garantizando el bienestar
              y rendimiento escolar de los estudiantes peruanos.
            </p>

            {/* Métricas clave institucionales */}
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-emerald-800/80 pt-6 sm:grid-cols-4">
              <div>
                <strong className="block text-2xl font-black text-amber-300 sm:text-3xl">4.1M+</strong>
                <span className="text-xs text-emerald-200">Niños atendidos en Perú</span>
              </div>
              <div>
                <strong className="block text-2xl font-black text-emerald-300 sm:text-3xl">0%</strong>
                <span className="text-xs text-emerald-200">Grasas Trans</span>
              </div>
              <div>
                <strong className="block text-2xl font-black text-sky-300 sm:text-3xl">HACCP</strong>
                <span className="text-xs text-emerald-200">Planta Certificada</span>
              </div>
              <div>
                <strong className="block text-2xl font-black text-red-300 sm:text-3xl">DIGESA</strong>
                <span className="text-xs text-emerald-200">Registro Sanitario Oficial</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#productos-pae"
                className="rounded-full bg-red-600 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-red-500 hover:shadow-red-600/30"
              >
                Ver Productos Acreditados
              </a>
              <WhatsAppCta
                phones={quotePhones}
                message={PAE_QUOTE_MESSAGE}
                className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <span>💬</span> Atención a Proveedores del Estado
              </WhatsAppCta>
            </div>
          </div>
        </div>
      </section>

      {/* ══ COMPROMISO CON LA NIÑEZ Y POBLACIONES VULNERABLES DEL PERÚ ══ */}
      <section className="border-b border-neutral-200/80 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-red-600">
              <span>🇵🇪</span> Cobertura Social y Territorial
            </span>
            <h2
              className="mt-2 text-3xl font-black text-neutral-900 sm:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Compromiso con la Niñez y Poblaciones Vulnerables del Perú
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              El Programa de Alimentación Escolar no es solo un suministro logístico: es una política de Estado orientada a reducir brechas, combatir la pobreza extrema y asegurar que ningún escolar abandone las aulas por falta de nutrición.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {VULNERABLE_POPULATIONS.map((pop, i) => (
              <div
                key={i}
                className="group flex flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                  <Image
                    src={pop.src}
                    alt={pop.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute top-3 left-3 rounded-full bg-red-600/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                    {pop.badge}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className="text-lg font-black text-neutral-900"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {pop.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                      {pop.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Caja institucional explicativa */}
          <div className="mt-12 rounded-3xl border border-red-100 bg-gradient-to-br from-red-50/70 via-white to-neutral-50 p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <span className="text-xs font-bold uppercase tracking-wider text-red-700">
                  Rol de los Comités de Alimentación Escolar (CAE)
                </span>
                <h4
                  className="mt-1 text-xl font-black text-neutral-900 sm:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Trabajando mano a mano con docentes y madres de familia
                </h4>
                <p className="mt-3 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  En cada colegio del Perú existe un Comité de Alimentación Escolar (CAE) conformado por el director, docentes y madres y padres de familia. Ellos son quienes reciben, verifican y preparan las raciones para sus hijos. Nuestros productos cuentan con tapas herméticas de fácil apertura, dosificación controlada y empaque inviolable que facilita su labor cotidiana.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-2.5 sm:border-l sm:border-red-200/80 sm:pl-6">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-[10px]">✓</span>
                  <span>Quintil 1 y 2 de Pobreza Extrema</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-[10px]">✓</span>
                  <span>Escuelas Bilingües e Indígenas</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white text-[10px]">✓</span>
                  <span>Ollas Comunes y Albergues Oficiales</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ APORTE NUTRICIONAL Y LUCHA CONTRA LA ANEMIA INFANTIL ══ */}
      <section className="bg-neutral-50/70 py-16 sm:py-20 border-b border-neutral-200/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Foto del niño peruano en la sierra */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-neutral-200 shadow-md lg:col-span-5">
              <Image
                src="https://images.unsplash.com/photo-1519074598089-6436475c7f8f?w=1000&q=80"
                alt="Niño de Cusco Perú sonriente con buena nutrición escolar"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 450px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                  Nutrición Infantil Perú
                </span>
                <p className="mt-2 text-sm font-bold leading-snug">
                  Energía limpia para que los niños crezcan sanos, fuertes y con ganas de aprender.
                </p>
              </div>
            </div>

            {/* Aporte nutricional detallado */}
            <div className="lg:col-span-7">
              <span className="text-xs font-extrabold uppercase tracking-widest text-red-600">
                Aporte Nutricional Científico
              </span>
              <h2
                className="mt-2 text-2xl font-black text-neutral-900 sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Por qué el Aceite Vegetal es vital en la lucha contra la desnutrición
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                En las zonas de mayor vulnerabilidad del Perú, los niños requieren un balance calórico suficiente para sostener sus horas de clase y actividad física. El aceite vegetal puro es un pilar indispensable en la canasta de compras del Estado por tres razones fundamentales:
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span className="text-base">🥕</span>
                    <span>Vehículo Biológico de Vitaminas Liposolubles (A, D, E y K)</span>
                  </h4>
                  <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                    Las vitaminas esenciales como la Vitamina A (clave para la visión y el sistema inmunológico) no pueden ser asimiladas por el cuerpo sin la presencia de lípidos saludables. Nuestro aceite vegetal permite la absorción eficiente de los nutrientes de los alimentos escolares.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span className="text-base">⚡</span>
                    <span>Concentración y Energía Limpia sin Grasas Trans</span>
                  </h4>
                  <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                    Aporta 126 kcal por cucharada (14 g) con 0 g de grasas trans y 0 mg de colesterol, cumpliendo rigurosamente los parámetros de la Ley N° 30021 de Promoción de la Alimentación Saludable.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span className="text-base">🥣</span>
                    <span>Complemento Ideal para Granos y Menestras Andinas</span>
                  </h4>
                  <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                    Facilita la cocción homogénea y realza el sabor de la quinua, kiwicha, habas, lentejas y conservas de pescado distribuidas a los colegios en las tres regiones del país.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ CATÁLOGO EXCLUSIVO PAE ══ */}
      <section id="productos-pae" className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <span className="inline-block rounded-full bg-red-100 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-red-800">
              Línea Oficial Acreditada para Compras Públicas
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
              <PaeProductCard key={product.id} product={product} phones={quotePhones} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ ESTÁNDARES Y CERTIFICACIONES PARA EL ESTADO ══ */}
      <section className="border-t border-neutral-200/80 bg-neutral-50/50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-red-600">
              Garantía Institucional de Inocuidad
            </span>
            <h2
              className="mt-2 text-2xl font-black text-neutral-900 sm:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Estándares de Calidad para Compras del Estado Peruano
            </h2>
            <p className="mt-3 text-sm text-neutral-600">
              Cumplimos con cada uno de los lineamientos exigidos por los comités de compra, CENAN, DIGESA y entidades fiscalizadoras del Estado.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STATE_CERTIFICATIONS.map((cert, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm transition duration-200 hover:border-red-300 hover:shadow-md"
              >
                <span className="text-3xl">{cert.icon}</span>
                <h3 className="mt-4 text-base font-bold text-neutral-900">{cert.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ATENCIÓN A LICITACIONES & PROVEEDORES DEL ESTADO ══ */}
      <section className="bg-gradient-to-r from-red-950 via-neutral-900 to-red-950 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/30 border border-red-500/40 px-3.5 py-1 text-xs font-bold text-red-200">
            <span>🤝</span> Canal Especializado B2G / Comités de Compra
          </span>
          <h2
            className="mt-4 text-3xl font-black sm:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ¿Representas a un Comité de Compra o Proveedor del Estado?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-neutral-300 sm:text-base">
            Contamos con capacidad de envasado a gran escala, cronogramas de despacho asegurados y documentación técnica completa
            (fichas técnicas, certificados de lote y protocolos de inocuidad) para abastecer convocatorias
            a nivel nacional en Costa, Sierra y Selva.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <WhatsAppCta
              phones={quotePhones}
              message={PAE_QUOTE_MESSAGE}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-red-500 hover:scale-105"
            >
              <span>💬</span> Contactar Vía WhatsApp
            </WhatsAppCta>
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
