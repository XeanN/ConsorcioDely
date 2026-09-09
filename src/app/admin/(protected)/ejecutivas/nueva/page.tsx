import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SalesRepForm } from "@/components/admin/SalesRepForm";
import { createSalesRep } from "@/lib/actions/sales-reps";

export default function NewSalesRepPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <AdminPageHeader title="Nueva ejecutiva" />
      <div className="mt-6">
        <SalesRepForm action={createSalesRep} />
      </div>
    </div>
  );
}
