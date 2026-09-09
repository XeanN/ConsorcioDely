import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

type ContentBlockRow = { key: string; value: string };

export default async function AboutPage() {
  const rows = (await sql()`
    SELECT key, value FROM content_blocks WHERE key IN ('quienes_somos', 'responsabilidad_social')
  `) as ContentBlockRow[];

  const quienesSomos = rows.find((r) => r.key === "quienes_somos")?.value;
  const responsabilidadSocial = rows.find((r) => r.key === "responsabilidad_social")?.value;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Quiénes somos</h1>
      {quienesSomos && (
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
          {quienesSomos}
        </p>
      )}

      {responsabilidadSocial && (
        <>
          <h2 className="mt-10 text-lg font-semibold text-neutral-900">Responsabilidad social</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
            {responsabilidadSocial}
          </p>
        </>
      )}
    </div>
  );
}
