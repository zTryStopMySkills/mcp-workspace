import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id: documentId } = await params;
  const agentId = session.user.id;
  const now = new Date().toISOString();

  // Comprobar si ya existe la asignación
  const { data: existing } = await supabaseAdmin
    .from("document_assignments")
    .select("id, seen_at")
    .eq("document_id", documentId)
    .eq("agent_id", agentId)
    .maybeSingle();

  if (existing) {
    // Solo actualizar si no había sido visto antes
    if (!existing.seen_at) {
      await supabaseAdmin
        .from("document_assignments")
        .update({ seen_at: now })
        .eq("id", existing.id);
    }
  } else {
    // Crear nueva asignación marcada como vista
    await supabaseAdmin
      .from("document_assignments")
      .insert({ document_id: documentId, agent_id: agentId, seen_at: now });
  }

  return NextResponse.json({ ok: true });
}
