import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { WorkspaceClient } from "@/components/workspace/WorkspaceClient";

export const metadata = { title: "Mi Escritorio — Agental.IA" };

export default async function WorkspacePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <DashboardLayout>
      <WorkspaceClient />
    </DashboardLayout>
  );
}
