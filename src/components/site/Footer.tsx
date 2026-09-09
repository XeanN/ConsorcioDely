import Link from "next/link";

import { sql } from "@/lib/db";

type SiteSettingRow = {
  legalName: string | null;
  ruc: string | null;
  fiscalAddress: string | null;
  phone: string | null;
  email: string | null;
};

export async function Footer() {
  const [settings] = (await sql()`
    SELECT "legalName", ruc, "fiscalAddress", phone, email FROM site_settings WHERE id = 1 LIMIT 1
  `) as SiteSettingRow[];

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-neutral-500">
        <p className="font-medium text-neutral-700">Consorcio Dely</p>
        <p className="mt-1">
          Contigo construimos negocios que crecen — crecemos junto a cada cliente que confía en
          nosotros.
        </p>

        {(settings?.phone || settings?.email) && (
          <div className="mt-4 space-y-0.5 text-xs">
            {settings.phone && <p>WhatsApp / Tel: {settings.phone}</p>}
            {settings.email && (
              <p>
                <a href={`mailto:${settings.email}`} className="hover:text-brand-red">
                  {settings.email}
                </a>
              </p>
            )}
          </div>
        )}

        {settings && (
          <div className="mt-4 space-y-0.5 text-xs text-neutral-400">
            {settings.legalName && <p>{settings.legalName}</p>}
            {settings.ruc && <p>RUC {settings.ruc}</p>}
            {settings.fiscalAddress && <p>{settings.fiscalAddress}</p>}
          </div>
        )}

        <div className="mt-4 flex gap-4 text-xs">
          <Link href="/legal" className="underline hover:text-brand-red">
            Legales
          </Link>
          <Link href="/contacto" className="underline hover:text-brand-red">
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  );
}
