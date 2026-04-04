import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

// GET /api/documents — documentos para el agente actual
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const agentId = session.user.id;

  // Documentos visibles para todos
  const { data: allDocs, error: e1 } = await supabaseAdmin
    .from("documents")
    .select("*, creator:created_by(nick, name)")
    .eq("visibility", "all")
    .order("created_at", { ascending: false });

  if (e1) return NextResponse.json({ error: e1.message }, { status: 500 });

  // Documentos asignados específicamente a este agente
  const { data: assigned, error: e2 } = await supabaseAdmin
    .from("document_assignments")
    .select("seen_at, document:document_id(*, creator:created_by(nick, name))")
    .eq("agent_id", agentId);

  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

  // Ids ya cubiertos por "all"
  const allDocIds = new Set((allDocs ?? []).map((d) => d.id));

  // Asignaciones específicas que no estén ya en "all"
  const specificDocs = (assigned ?? [])
    .filter((a) => a.document && !allDocIds.has((a.document as unknown as { id: string }).id))
    .map((a) => ({ ...(a.document as object), seen_at: a.seen_at }));

  // Combinar y enriquecer con seen_at
  const seenMap = new Map((assigned ?? []).map((a) => [(a.document as unknown as { id: string })?.id, a.seen_at]));
  const enrichedAll = (allDocs ?? []).map((d) => ({ ...d, seen_at: seenMap.get(d.id) ?? null }));

  const merged = [...enrichedAll, ...specificDocs];
  merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json(merged);
}

// POST /api/documents — crear documento con metadata (solo admin)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, file_url, file_name, file_type, file_size, visibility, agent_ids } = body;

  if (!title || !file_url || !file_name || !file_type) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const { data: doc, error } = await supabaseAdmin
    .from("documents")
    .insert({
      title,
      description: description ?? null,
      file_url,
      file_name,
      file_type,
      file_size: file_size ?? null,
      visibility: visibility ?? "all",
      created_by: session.user.id
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Si es específico, crear asignaciones
  if (visibility === "specific" && Array.isArray(agent_ids) && agent_ids.length > 0) {
    const assignments = agent_ids.map((aid: string) => ({
      document_id: doc.id,
      agent_id: aid
    }));
    await supabaseAdmin.from("document_assignments").insert(assignments);
  }

  return NextResponse.json(doc, { status: 201 });
}
