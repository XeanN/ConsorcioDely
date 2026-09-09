import { sql } from "@/lib/db";
import { getRandomQuoteLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

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
          className="mt-8 inline-block rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700"
        >
          Escríbenos por WhatsApp
        </a>
      )}
    </div>
  );
}
