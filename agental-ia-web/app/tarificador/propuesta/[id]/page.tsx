import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { redirect, notFound } from "next/navigation";
import { PrintView } from "@/components/tarificador/PrintView";
import type { Quotation } from "@/types";

export const metadata = { title: "Propuesta Comercial — Agentalia-webs" };

export default async function PropuestaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;

  const { data: quotation } = await supabaseAdmin
    .from("quotations")
    .select("*, agent:agent_id(id, nick, name)")
    .eq("id", id)
    .single();

  if (!quotation) notFound();

  // Solo el propio agente o admin puede ver
  if (session.user.role !== "admin" && quotation.agent_id !== session.user.id) {
    redirect("/tarificador/historial");
  }

  const agent = quotation.agent as unknown as { id: string; nick: string; name: string } | null;

  return (
    <PrintView
      quotation={quotation as unknown as Quotation}
      agentName={agent?.name ?? session.user.name ?? "Agente"}
      agentNick={agent?.nick ?? ""}
    />
  );
}
