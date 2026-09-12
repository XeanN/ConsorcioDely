import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SocialLinksForm } from "@/components/admin/SocialLinksForm";
import { sql } from "@/lib/db";

type SiteSettingRow = {
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
};

export default async function SocialLinksPage() {
  const [settings] = (await sql()`
    SELECT "facebookUrl", "instagramUrl", "twitterUrl" FROM site_settings WHERE id = 1 LIMIT 1
  `) as SiteSettingRow[];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <AdminPageHeader title="Redes sociales" />
      <p className="mt-2 text-sm text-neutral-500">
        Estos enlaces se muestran como íconos en el pie de página del sitio.
      </p>

      <div className="mt-6">
        <SocialLinksForm
          defaultValues={{
            facebookUrl: settings?.facebookUrl ?? null,
            instagramUrl: settings?.instagramUrl ?? null,
            twitterUrl: settings?.twitterUrl ?? null,
          }}
        />
      </div>
    </div>
  );
}
