import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { sql } from "@/lib/db";

type SiteSettingRow = { legalName: string | null; phone: string | null };

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const baseUrl = process.env.SITE_URL ?? "https://consorciodely-web.angel-xp-pb.workers.dev";
  const [settings] = (await sql()`
    SELECT "legalName", phone FROM site_settings WHERE id = 1 LIMIT 1
  `) as SiteSettingRow[];

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings?.legalName ?? "Consorcio Dely",
    url: baseUrl,
    telephone: settings?.phone ?? undefined,
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
