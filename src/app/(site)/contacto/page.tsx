import type { Metadata } from "next";
import Image from "next/image";

import { ContactForm } from "@/components/site/ContactForm";
import { sql } from "@/lib/db";
import { buildQuoteMessage, getRandomQuoteLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contacto y Cotizaciones",
  description: "Canales de atención, teléfonos de ventas, dirección y cotizaciones inmediatas por WhatsApp para mayoristas y bodegueros.",
  alternates: { canonical: "/contacto" },
};

type SiteSettingRow = {
  phone: string | null;
  contactPhone: string | null;
  email: string | null;
  address: string | null;
  legalName: string | null;
  ruc: string | null;
};

export default async function ContactPage() {
  const [settings] = (await sql()`
    SELECT phone, "contactPhone", email, address, "legalName", ruc FROM site_settings WHERE id = 1 LIMIT 1
  `) as SiteSettingRow[];

  const quoteLink = await getRandomQuoteLink(buildQuoteMessage());

  return (
    <div>
      {/* ══ HERO BANNER ══ */}
      <section className="relative overflow-hidden py-16 sm:py-20" style={{ background: "linear-gradient(135deg, #1a0000 0%, #6b0000 50%, #e4231b 100%)" }}>
        <Image
          src="https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1600&q=80"
          alt=""
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white opacity-5" />
        <div aria-hidden className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white opacity-5" />

        <div className="relative mx-auto max-w-6xl px-6 text-center text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red-light animate-ping" />
            Atención a nivel nacional
          </span>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-5xl md:text-6xl" style={{ fontFamily: "var(--font-display)", textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
            Contáctanos
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-200 sm:text-base">
            Estamos listos para abastecer tu negocio. Comunícate con nuestros asesores comerciales para cotizaciones, pedidos por mayor o consultas generales.
          </p>
        </div>
      </section>

      {/* ══ PRINCIPAL: FORM + CANALES ══ */}
      <section className="py-14 sm:py-20" style={{ background: "var(--neutral-50)" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            
            {/* Columna izquierda: Información y tarjetas */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Canales Directos</span>
                <h2 className="mt-1 text-2xl font-black text-neutral-900 sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                  Habla con nuestro equipo comercial
                </h2>
                <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                  Respondemos tus requerimientos de abastecimiento de manera ágil con precios competitivos y factura garantizada.
                </p>
              </div>

              {/* Cards de contacto */}
              <div className="grid gap-3.5 sm:grid-cols-2">
                {/* Teléfono */}
                <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm transition hover:border-brand-red/30 hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-red-ultra text-brand-red">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-neutral-800">Central Telefónica</h3>
                  <p className="mt-1 text-xs text-neutral-500">Lunes a Sábado: 8am - 6pm</p>
                  <p className="mt-2 text-sm font-black text-neutral-900">
                    {settings?.phone || "970 835 166"}
                  </p>
                </div>

                {/* WhatsApp */}
                <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm transition hover:border-brand-green/30 hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-brand-green">
                    <svg viewBox="0 0 32 32" className="h-5 w-5 fill-current">
                      <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.36.696 4.56 1.89 6.406L4 29l7.79-1.85A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Z" />
                    </svg>
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-neutral-800">WhatsApp Ventas</h3>
                  <p className="mt-1 text-xs text-neutral-500">Respuesta promedio: &lt; 5 min</p>
                  {quoteLink ? (
                    <a href={quoteLink} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-black text-brand-green hover:underline">
                      Iniciar chat directo →
                    </a>
                  ) : (
                    <p className="mt-2 text-sm font-black text-neutral-900">970 835 166</p>
                  )}
                </div>

                {/* Correo */}
                <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm transition hover:border-brand-red/30 hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-neutral-800">Correo Comercial</h3>
                  <p className="mt-1 text-xs text-neutral-500">Para cotizaciones formales</p>
                  <a href={`mailto:${settings?.email || "ventas@dely.pe"}`} className="mt-2 block text-xs font-black text-neutral-900 truncate hover:text-brand-red">
                    {settings?.email || "ventas@dely.pe"}
                  </a>
                </div>

                {/* Sede / Ubicación */}
                <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm transition hover:border-brand-red/30 hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-neutral-800">Sede Central</h3>
                  <p className="mt-1 text-xs text-neutral-500">Despachos a todo el país</p>
                  <p className="mt-2 text-xs font-semibold text-neutral-700 leading-tight">
                    {settings?.address || "Av. La Cultura Nro. 701, Santa Anita, Lima"}
                  </p>
                </div>
              </div>

              {/* Banner de confianza para empresas */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-red-ultra text-brand-red">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-neutral-900" style={{ fontFamily: "var(--font-display)" }}>
                      Facturación y Guías Inmediatas
                    </h4>
                    <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                      Emitimos Factura Electrónica, boletas y guías de remisión oficiales para todos tus pedidos empresariales.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-neutral-600">
                      <span className="rounded-md bg-neutral-100 px-2.5 py-1">RUC: {settings?.ruc || "20601228492"}</span>
                      <span className="rounded-md bg-neutral-100 px-2.5 py-1">Lima y Provincias</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha: Formulario interactivo */}
            <div className="lg:col-span-6">
              <ContactForm
                phone={settings?.phone ?? null}
                email={settings?.email ?? null}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ MAPA DE UBICACIÓN ══ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Ubicación Física</span>
              <h2 className="mt-1 text-2xl font-black text-neutral-900 sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                Encuéntranos en Santa Anita, Lima
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-neutral-500">
                {settings?.address || "AV. LA CULTURA NRO. 701 INT. 41 OTR. MERCADO DE PRODUCTORES SANTA ANITA"}
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Mercado+de+Productores+Santa+Anita+Lima"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-xs font-bold text-neutral-700 hover:border-brand-red hover:text-brand-red transition"
            >
              <svg className="h-4 w-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Abrir en Google Maps
            </a>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-neutral-200 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243.8778297525742!2d-76.94758141830853!3d-12.040404057467939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c7a1afa52c43%3A0xa769ca338d61b2ba!2sProducts%20and%20Services%20Irivarren%20SAC!5e0!3m2!1ses-419!2spe!4v1788964901310!5m2!1ses-419!2spe"
              width="100%"
              height="440"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Ubicación de Consorcio Dely"
            />
          </div>
        </div>
      </section>

      {/* ══ PREGUNTAS FRECUENTES (FAQ) ══ */}
      <section className="py-16" style={{ background: "var(--neutral-50)" }}>
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Resolviendo tus dudas</span>
            <h2 className="mt-1 text-2xl font-black text-neutral-900 sm:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
              Preguntas Frecuentes para Mayoristas
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {[
              {
                q: "¿Cómo realizo mi primer pedido al por mayor?",
                a: "Puedes contactar a una asesora comercial directamente por WhatsApp o mediante nuestro formulario. Indícanos las cantidades y productos que requieres y te emitiremos una cotización con escala de precios mayoristas.",
              },
              {
                q: "¿Realizan envíos a provincias de todo el Perú?",
                a: "Sí, despachamos diariamente a agencias de transporte reconocidas (Marvisur, Shalom, Molina, etc.) para llegar a todas las regiones del país en un plazo promedio de 48 a 72 horas.",
              },
              {
                q: "¿Cuáles son los métodos de pago aceptados?",
                a: "Aceptamos transferencias bancarias corporativas (BCP, BBVA, Interbank, Banco de la Nación), transferencias interbancarias y depósitos directos.",
              },
              {
                q: "¿Puedo consultar mis facturas electrónicas en línea?",
                a: "Sí, disponemos de nuestro portal de consulta de comprobantes accesible desde el botón superior 'Consultar Factura' disponible 24/7.",
              },
            ].map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-neutral-200/80 bg-white p-5 transition hover:border-neutral-300">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-neutral-800">
                  <span>{faq.q}</span>
                  <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition group-open:rotate-180">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}