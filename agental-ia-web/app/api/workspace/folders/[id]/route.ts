import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name || name.length > 100)
      return NextResponse.json({ error: "Nombre inválido (máx. 100 caracteres)" }, { status: 400 });
    updates.name = name;
  }
  if (body.color !== undefined) {
    if (!/^#[0-9A-Fa-f]{6}$/.test(body.color))
      return NextResponse.json({ error: "Color inválido (formato #RRGGBB)" }, { status: 400 });
    updates.color = body.color;
  }
  if (body.sort_order !== undefined) updates.sort_order = body.sort_order;
  if (body.parent_id !== undefined) updates.parent_id = body.parent_id;

  const supabase = getSupabaseAdmin();

  // Validate that parent_id belongs to this agent (prevent moving into foreign folders)
  if (body.parent_id) {
    const { data: parentFolder } = await supabase
      .from("workspace_folders")
      .select("id")
      .eq("id", body.parent_id)
      .eq("agent_id", session.user.id)
      .single();
    if (!parentFolder) {
      return NextResponse.json({ error: "Carpeta destino no válida" }, { status: 400 });
    }
  }
  const { data, error } = await supabase
    .from("workspace_folders")
    .update(updates)
    .eq("id", id)
    .eq("agent_id", session.user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("workspace_folders")
    .delete()
    .eq("id", id)
    .eq("agent_id", session.user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
