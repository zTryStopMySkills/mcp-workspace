import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("agent_preferences")
    .select("*")
    .eq("agent_id", session.user.id)
    .single();

  return NextResponse.json(data ?? {
    workspace_view: "grid",
    workspace_sort: "date-desc",
    quick_notes: ""
  });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const supabase = getSupabaseAdmin();

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.workspace_view !== undefined) updates.workspace_view = body.workspace_view;
  if (body.workspace_sort !== undefined) updates.workspace_sort = body.workspace_sort;
  if (body.quick_notes !== undefined) updates.quick_notes = body.quick_notes;

  const { data, error } = await supabase
    .from("agent_preferences")
    .upsert({ agent_id: session.user.id, ...updates })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
