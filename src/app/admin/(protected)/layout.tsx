import { redirect } from "next/navigation";

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

  return <div className="min-h-screen bg-neutral-50">{children}</div>;
}
