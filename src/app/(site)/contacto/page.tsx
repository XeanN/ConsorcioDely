import type { Metadata } from "next";

import { sql } from "@/lib/db";
import { getRandomQuoteLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Teléfonos, dirección y WhatsApp para cotizar con Consorcio Dely.",
  alternates: { canonical: "/contacto" },
};

type SiteSettingRow = {
  phone: string | null;
  contactPhone: string | null;
  email: string | null;
  address: string | null;
};

export default async function ContactPage() {
  const [settings] = (await sql()`
    SELECT phone, "contactPhone", email, address FROM site_settings WHERE id = 1 LIMIT 1
  `) as SiteSettingRow[];

  const quoteLink = await getRandomQuoteLink("Hola, quisiera más información sobre sus productos");

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Contacto</h1>

      <dl className="mt-6 space-y-4 text-sm">
        {settings?.phone && (
          <div>
            <dt className="text-neutral-400">Teléfono</dt>
            <dd className="text-neutral-800">{settings.phone}</dd>
          </div>
        )}
        {settings?.contactPhone && (
          <div>
            <dt className="text-neutral-400">Contacto directo</dt>
            <dd className="text-neutral-800">{settings.contactPhone}</dd>
          </div>
        )}
        {settings?.address && (
          <div>
            <dt className="text-neutral-400">Dirección</dt>
            <dd className="text-neutral-800">{settings.address}</dd>
          </div>
        )}
        {settings?.email && (
          <div>
            <dt className="text-neutral-400">Correo</dt>
            <dd className="text-neutral-800">{settings.email}</dd>
          </div>
        )}
      </dl>

      {quoteLink && (
        <a
          href={quoteLink}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block rounded-md bg-brand-green px-6 py-3 text-sm font-medium text-white hover:brightness-95"
        >
          Escríbenos por WhatsApp
        </a>
      )}

      <div className="mt-10 overflow-hidden rounded-lg border border-neutral-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243.8778297525742!2d-76.94758141830853!3d-12.040404057467939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c7a1afa52c43%3A0xa769ca338d61b2ba!2sProducts%20and%20Services%20Irivarren%20SAC!5e0!3m2!1ses-419!2spe!4v1788964901310!5m2!1ses-419!2spe"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Ubicación de Consorcio Dely"
        />
      </div>
    </div>
  );
}
