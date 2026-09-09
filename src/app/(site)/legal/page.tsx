import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

type SiteSettingRow = {
  legalName: string | null;
  ruc: string | null;
  fiscalAddress: string | null;
  complaintsBookUrl: string | null;
};

export default async function LegalPage() {
  const [settings] = (await sql()`
    SELECT "legalName", ruc, "fiscalAddress", "complaintsBookUrl" FROM site_settings WHERE id = 1 LIMIT 1
  `) as SiteSettingRow[];

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Legales</h1>

      <dl className="mt-6 space-y-4 text-sm">
        {settings?.legalName && (
          <div>
            <dt className="text-neutral-400">Razón social</dt>
            <dd className="text-neutral-800">{settings.legalName}</dd>
          </div>
        )}
        {settings?.ruc && (
          <div>
            <dt className="text-neutral-400">RUC</dt>
            <dd className="text-neutral-800">{settings.ruc}</dd>
          </div>
        )}
        {settings?.fiscalAddress && (
          <div>
            <dt className="text-neutral-400">Dirección fiscal</dt>
            <dd className="text-neutral-800">{settings.fiscalAddress}</dd>
          </div>
        )}
        <div>
          <dt className="text-neutral-400">Certificaciones</dt>
          <dd className="text-neutral-800">RNP, Ficha Técnica, HACCP</dd>
        </div>
        {settings?.complaintsBookUrl && (
          <div>
            <dt className="text-neutral-400">Libro de reclamaciones</dt>
            <dd>
              <a href={settings.complaintsBookUrl} className="text-neutral-800 underline">
                Ir al libro de reclamaciones
              </a>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
