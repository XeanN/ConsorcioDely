import { redirect } from "next/navigation";

import { Sidebar } from "@/components/admin/Sidebar";
import { getSession } from "@/lib/session";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
