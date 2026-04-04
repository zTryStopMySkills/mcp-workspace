import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { agent_id, document_id, folder_name = "Recibidos" } = body;

  if (!agent_id || !document_id) {
    return NextResponse.json({ error: "agent_id and document_id required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Find or create the target folder for this agent
  let folderId: string;
  const { data: existing } = await supabase
    .from("workspace_folders")
    .select("id")
    .eq("agent_id", agent_id)
    .eq("name", folder_name)
    .is("parent_id", null)
    .single();

  if (existing) {
    folderId = existing.id;
  } else {
    const { data: newFolder, error: folderErr } = await supabase
      .from("workspace_folders")
      .insert({
        agent_id,
        name: folder_name,
        parent_id: null,
        color: "#C9A84C",
        sort_order: 0
      })
      .select()
      .single();

    if (folderErr || !newFolder) {
      return NextResponse.json({ error: folderErr?.message ?? "Failed to create folder" }, { status: 500 });
    }
    folderId = newFolder.id;
  }

  // Insert item (ignore duplicate)
  const { data: item, error: itemErr } = await supabase
    .from("workspace_items")
    .insert({
      folder_id: folderId,
      agent_id,
      document_id,
      sent_by: session.user.id
    })
    .select(`*, document:documents(*)`)
    .single();

  if (itemErr) {
    if (itemErr.code === "23505") return NextResponse.json({ error: "Ya enviado a este agente" }, { status: 409 });
    return NextResponse.json({ error: itemErr.message }, { status: 500 });
  }

  return NextResponse.json(item);
}
