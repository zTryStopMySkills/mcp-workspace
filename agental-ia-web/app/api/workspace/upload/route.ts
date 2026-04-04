import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

function getFileType(name: string, mime: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["pdf"].includes(ext)) return "pdf";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "avif"].includes(ext)) return "image";
  if (["mp4", "mov", "avi", "webm", "mkv"].includes(ext)) return "video";
  if (["txt", "md", "csv", "json", "xml", "html", "css", "js", "ts", "log"].includes(ext)) return "text";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("text/")) return "text";
  return "other";
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folderId = formData.get("folder_id") as string | null;
  const title = formData.get("title") as string | null;

  if (!file) return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });

  const supabase = getSupabaseAdmin();

  // Sanitize filename
  const ext = file.name.split(".").pop() ?? "bin";
  const safeName = file.name
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `workspace/${session.user.id}/${Date.now()}-${safeName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  // Upload to storage
  const { data: uploaded, error: upErr } = await supabase.storage
    .from("documents")
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { data: urlData } = supabase.storage.from("documents").getPublicUrl(uploaded.path);

  // Create document record (visibility: specific, private to this agent)
  const { data: doc, error: docErr } = await supabase
    .from("documents")
    .insert({
      title: title?.trim() || file.name,
      description: null,
      file_url: urlData.publicUrl,
      file_name: file.name,
      file_type: getFileType(file.name, file.type),
      file_size: file.size,
      visibility: "specific",
      created_by: session.user.id
    })
    .select()
    .single();

  if (docErr) return NextResponse.json({ error: docErr.message }, { status: 500 });

  // Assign to self (so it shows in /documentos)
  await supabase.from("document_assignments").insert({
    document_id: doc.id,
    agent_id: session.user.id
  });

  // Add to workspace folder if provided
  if (folderId) {
    await supabase.from("workspace_items").insert({
      folder_id: folderId,
      agent_id: session.user.id,
      document_id: doc.id,
      sent_by: session.user.id,
      status: "reviewed"  // propio doc, ya está "visto"
    });
  }

  return NextResponse.json(doc, { status: 201 });
}
