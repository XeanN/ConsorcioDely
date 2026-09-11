import type { Metadata } from "next";

import { AboutTabs, type AboutTab } from "@/components/site/AboutTabs";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Empresa peruana dedicada a la fabricación, envasado y comercialización de abarrotes a nivel nacional.",
  alternates: { canonical: "/quienes-somos" },
};

type ContentBlockRow = { key: string; value: string };
type SiteSettingRow = {
  email: string | null;
  address: string | null;
  legalName: string | null;
  ruc: string | null;
};

export default async function AboutPage() {
  const rows = (await sql()`
    SELECT key, value FROM content_blocks WHERE key IN ('quienes_somos', 'responsabilidad_social')
  `) as ContentBlockRow[];

  const [settings] = (await sql()`
    SELECT email, address, "legalName", ruc FROM site_settings WHERE id = 1 LIMIT 1
  `) as SiteSettingRow[];

  const quienesSomos = rows.find((r) => r.key === "quienes_somos")?.value;
  const responsabilidadSocial = rows.find((r) => r.key === "responsabilidad_social")?.value;

  const textClass = "whitespace-pre-line text-sm leading-relaxed text-neutral-600";

  const tabs: AboutTab[] = [
    {
      key: "historia",
      label: "Nuestra Historia",
      content: quienesSomos && <p className={textClass}>{quienesSomos}</p>,
    },
    {
      key: "proposito",
      label: "Nuestro Propósito",
      content: responsabilidadSocial && <p className={textClass}>{responsabilidadSocial}</p>,
    },
    {
      key: "presencia",
      label: "Presencia Nacional",
      content: (
        <div className={textClass}>
          <p>
            Distribuimos a nivel nacional a mayoristas, bodegueros y minoristas desde nuestra sede
            en Lima.
          </p>
          {(settings?.legalName || settings?.address || settings?.ruc) && (
            <dl className="mt-4 space-y-1 text-neutral-700">
              {settings?.legalName && (
                <div>
                  <dt className="inline font-medium">Razón social: </dt>
                  <dd className="inline">{settings.legalName}</dd>
                </div>
              )}
              {settings?.ruc && (
                <div>
                  <dt className="inline font-medium">RUC: </dt>
                  <dd className="inline">{settings.ruc}</dd>
                </div>
              )}
              {settings?.address && (
                <div>
                  <dt className="inline font-medium">Dirección: </dt>
                  <dd className="inline">{settings.address}</dd>
                </div>
              )}
            </dl>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Quiénes somos</h1>

      <AboutTabs tabs={tabs} />

      <div className="mt-10 rounded-xl bg-brand-red p-6 text-white">
        <h2 className="text-lg font-bold">Trabaja con nosotros</h2>
        <p className="mt-2 text-sm text-white/90">
          Nuestro equipo es tan valioso como cada persona que lo conforma. Si quieres ser parte de
          Consorcio Dely, escríbenos.
        </p>
        {settings?.email && (
          <a
            href={`mailto:${settings.email}?subject=Postulaci%C3%B3n`}
            className="mt-3 inline-block text-sm font-semibold underline underline-offset-2"
          >
            Postula haciendo clic aquí →
          </a>
        )}
      </div>
    </div>
  );
}
