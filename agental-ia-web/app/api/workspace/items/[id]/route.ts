import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("workspace_items")
    .delete()
    .eq("id", id)
    .eq("agent_id", session.user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const supabase = getSupabaseAdmin();

  const VALID_STATUSES = ["new", "reviewed", "pending", "completed"];
  const updates: Record<string, unknown> = {};
  if (body.seen_at !== undefined) updates.seen_at = body.seen_at;
  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status))
      return NextResponse.json({ error: "Estado no válido" }, { status: 400 });
    updates.status = body.status;
  }
  if (body.pinned !== undefined) updates.pinned = Boolean(body.pinned);
  if (body.folder_id !== undefined) {
    // Verify the target folder belongs to this agent
    const { data: targetFolder } = await supabase
      .from("workspace_folders")
      .select("id")
      .eq("id", body.folder_id)
      .eq("agent_id", session.user.id)
      .single();
    if (!targetFolder)
      return NextResponse.json({ error: "Carpeta destino no válida" }, { status: 400 });
    updates.folder_id = body.folder_id;
  }

  const { data, error } = await supabase
    .from("workspace_items")
    .update(updates)
    .eq("id", id)
    .eq("agent_id", session.user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
