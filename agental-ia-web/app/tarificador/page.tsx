import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { TarificadorClient } from "@/components/tarificador/TarificadorClient";

export const metadata = { title: "Tarificador — Agental.IA" };

export default async function TarificadorPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <DashboardLayout>
      <TarificadorClient agentName={session.user.name ?? session.user.nick} />
    </DashboardLayout>
  );
}
