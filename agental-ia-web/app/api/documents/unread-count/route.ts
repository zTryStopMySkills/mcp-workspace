import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

// GET /api/documents/unread-count — docs no leídos para el agente actual
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agentId = session.user.id;

  // IDs de docs ya vistos por este agente (seen_at NOT NULL)
  const { data: seenData } = await supabaseAdmin
    .from("document_assignments")
    .select("document_id")
    .eq("agent_id", agentId)
    .not("seen_at", "is", null);

  const seenIds = (seenData ?? []).map((a) => a.document_id);

  // Docs "all" no vistos
  let allQuery = supabaseAdmin
    .from("documents")
    .select("id", { count: "exact", head: true })
    .eq("visibility", "all");

  if (seenIds.length > 0) {
    allQuery = allQuery.not("id", "in", `(${seenIds.join(",")})`);
  }

  const { count: unreadAll } = await allQuery;

  // Docs "specific" asignados a este agente sin ver
  const { count: unreadSpecific } = await supabaseAdmin
    .from("document_assignments")
    .select("id", { count: "exact", head: true })
    .eq("agent_id", agentId)
    .is("seen_at", null);

  const total = (unreadAll ?? 0) + (unreadSpecific ?? 0);

  return NextResponse.json({ count: total });
}
