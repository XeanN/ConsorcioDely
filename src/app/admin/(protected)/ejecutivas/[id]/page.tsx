import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SalesRepForm } from "@/components/admin/SalesRepForm";
import { updateSalesRep } from "@/lib/actions/sales-reps";
import { sql } from "@/lib/db";

type SalesRepDetail = { name: string; whatsapp: string; active: boolean };

export default async function EditSalesRepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [rep] = (await sql()`
    SELECT name, whatsapp, active FROM sales_reps WHERE id = ${id} LIMIT 1
  `) as SalesRepDetail[];

  if (!rep) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <AdminPageHeader title={rep.name} />
      <div className="mt-6">
        <SalesRepForm action={updateSalesRep.bind(null, id)} defaultValues={rep} />
      </div>
    </div>
  );
}
