import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimitAsync } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Rate limit: 10 uploads per minute per user
  const rl = await rateLimitAsync({ key: `upload:${session.user.id}`, limit: 10, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiadas subidas. Espera un momento." }, { status: 429 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });

  // Block dangerous extensions (admin can upload any safe document type)
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const blockedExts = ["exe", "bat", "sh", "cmd", "msi", "ps1", "php", "rb", "jar", "com", "scr", "vbs", "pif"];
  if (blockedExts.includes(ext)) {
    return NextResponse.json({ error: "Extensión de archivo no permitida" }, { status: 400 });
  }

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Determine content type — fallback for unknown types
  const mimeType = file.type || "application/octet-stream";

  const { data, error } = await supabaseAdmin.storage
    .from("documents")
    .upload(fileName, buffer, { contentType: mimeType, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: urlData } = supabaseAdmin.storage.from("documents").getPublicUrl(data.path);

  return NextResponse.json({
    url: urlData.publicUrl,
    path: data.path,
    name: file.name,
    size: file.size,
    type: file.type
  });
}
