import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

import type { SearchResult } from "@/types";

// GET /api/search?q=texto
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json([]);

  const agentId = session.user.id;
  const results: SearchResult[] = [];

  // Documentos visibles para este agente que coincidan
  const [{ data: allDocs }, { data: assignedDocs }] = await Promise.all([
    supabaseAdmin
      .from("documents")
      .select("id, title, description, file_type, created_at")
      .eq("visibility", "all")
      .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
      .order("created_at", { ascending: false })
      .limit(5),
    supabaseAdmin
      .from("document_assignments")
      .select("document:document_id(id, title, description, file_type, created_at)")
      .eq("agent_id", agentId)
      .limit(200)
  ]);

  // Filtrar docs asignados por query
  const allDocIds = new Set((allDocs ?? []).map(d => d.id));
  const specificDocs = (assignedDocs ?? [])
    .map(a => a.document as unknown as { id: string; title: string; description: string | null; file_type: string; created_at: string } | null)
    .filter(d => d && !allDocIds.has(d.id) && (
      d.title.toLowerCase().includes(q.toLowerCase()) ||
      (d.description ?? "").toLowerCase().includes(q.toLowerCase())
    ))
    .slice(0, 5);

  for (const doc of [...(allDocs ?? []), ...specificDocs].filter(Boolean).slice(0, 8)) {
    if (!doc) continue;
    results.push({
      type: "document",
      id: doc.id,
      title: doc.title,
      subtitle: doc.description ?? doc.file_type.toUpperCase(),
      href: `/documentos/${doc.id}`,
      created_at: doc.created_at
    });
  }

  // Mensajes recientes que coincidan
  const { data: msgs } = await supabaseAdmin
    .from("messages")
    .select("id, content, created_at, agent:agent_id(nick, name)")
    .ilike("content", `%${q}%`)
    .order("created_at", { ascending: false })
    .limit(4);

  for (const msg of msgs ?? []) {
    const agent = msg.agent as unknown as { nick: string; name: string } | null;
    results.push({
      type: "message",
      id: msg.id,
      title: msg.content.slice(0, 80) + (msg.content.length > 80 ? "…" : ""),
      subtitle: agent ? `@${agent.nick} · Chat` : "Chat",
      href: "/chat",
      created_at: msg.created_at
    });
  }

  // Workspace items de este agente
  const { data: items } = await supabaseAdmin
    .from("workspace_items")
    .select("id, created_at, document:document_id(id, title, description)")
    .eq("agent_id", agentId)
    .limit(200);

  const matchedItems = (items ?? [])
    .filter(item => {
      const doc = item.document as unknown as { title: string; description: string | null } | null;
      return doc && (
        doc.title.toLowerCase().includes(q.toLowerCase()) ||
        (doc.description ?? "").toLowerCase().includes(q.toLowerCase())
      );
    })
    .slice(0, 4);

  for (const item of matchedItems) {
    const doc = item.document as unknown as { id: string; title: string } | null;
    if (!doc) continue;
    results.push({
      type: "workspace_item",
      id: item.id,
      title: doc.title,
      subtitle: "Mi Escritorio",
      href: "/workspace",
      created_at: item.created_at
    });
  }

  // Ordenar por fecha y devolver máximo 12
  results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return NextResponse.json(results.slice(0, 12));
}
