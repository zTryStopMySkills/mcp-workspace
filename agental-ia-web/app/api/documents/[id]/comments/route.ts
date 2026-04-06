import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimitAsync } from "@/lib/rateLimit";

// GET /api/documents/[id]/comments
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id: documentId } = await params;

  const { data, error } = await supabaseAdmin
    .from("document_comments")
    .select("id, content, created_at, agent:agent_id(id, nick, name, avatar_url)")
    .eq("document_id", documentId)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/documents/[id]/comments
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const rl = await rateLimitAsync({ key: `comment:${session.user.id}`, limit: 20, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiados comentarios. Espera un momento." }, { status: 429 });
  }

  const { id: documentId } = await params;
  const { content } = await req.json();

  if (!content?.trim()) return NextResponse.json({ error: "Comentario vacío" }, { status: 400 });
  if (content.length > 1000) return NextResponse.json({ error: "Comentario demasiado largo (máx. 1000 caracteres)" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("document_comments")
    .insert({ document_id: documentId, agent_id: session.user.id, content: content.trim() })
    .select("id, content, created_at, agent:agent_id(id, nick, name, avatar_url)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// DELETE /api/documents/[id]/comments (propio comentario o admin)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id: documentId } = await params;
  const { commentId } = await req.json();
  if (!commentId) return NextResponse.json({ error: "Falta commentId" }, { status: 400 });

  // Solo admin o el propio autor puede borrar
  const query = supabaseAdmin
    .from("document_comments")
    .delete()
    .eq("id", commentId)
    .eq("document_id", documentId);

  if (session.user.role !== "admin") {
    query.eq("agent_id", session.user.id);
  }

  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
