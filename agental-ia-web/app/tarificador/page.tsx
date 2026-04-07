import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { TarificadorClient } from "@/components/tarificador/TarificadorClient";

export const metadata = { title: "Tarificador — Agental.IA" };

export default async function TarificadorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const params = await searchParams;

  const initialCliente = (params.empresa || params.email || params.telefono) ? {
    empresa: params.empresa ?? "",
    sector: params.sector ?? "",
    tieneWeb: false,
    urlWeb: "",
    email: params.email ?? "",
    telefono: params.telefono ?? "",
  } : undefined;

  return (
    <DashboardLayout>
      <TarificadorClient
        agentName={session.user.name ?? session.user.nick}
        initialCliente={initialCliente}
      />
    </DashboardLayout>
  );
}
