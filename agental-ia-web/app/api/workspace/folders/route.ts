import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("workspace_folders")
    .select("*")
    .eq("agent_id", session.user.id)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Count items per folder
  const folderIds = (data ?? []).map((f) => f.id);
  let itemCounts: Record<string, number> = {};
  if (folderIds.length > 0) {
    const { data: counts } = await supabase
      .from("workspace_items")
      .select("folder_id")
      .in("folder_id", folderIds);
    if (counts) {
      for (const row of counts) {
        itemCounts[row.folder_id] = (itemCounts[row.folder_id] ?? 0) + 1;
      }
    }
  }

  const folders = (data ?? []).map((f) => ({ ...f, item_count: itemCounts[f.id] ?? 0 }));
  return NextResponse.json(folders);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, parent_id, color } = body;

  const trimmedName = name?.trim();
  if (!trimmedName || trimmedName.length > 100)
    return NextResponse.json({ error: "Nombre inválido (máx. 100 caracteres)" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("workspace_folders")
    .insert({
      agent_id: session.user.id,
      name: trimmedName,
      parent_id: parent_id ?? null,
      color: color ?? "#00D4AA",
      sort_order: 0
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...data, item_count: 0 });
}
