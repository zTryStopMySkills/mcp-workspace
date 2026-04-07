import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const allowed = ["status", "notes", "client_email", "client_phone", "follow_up_date"];
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  // Solo el propio agente o admin puede editar
  let query = supabaseAdmin.from("quotations").update(updates).eq("id", id);
  if (session.user.role !== "admin") query = query.eq("agent_id", session.user.id);

  const { data, error } = await query.select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  let query = supabaseAdmin.from("quotations").delete().eq("id", id);
  if (session.user.role !== "admin") query = query.eq("agent_id", session.user.id);

  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
