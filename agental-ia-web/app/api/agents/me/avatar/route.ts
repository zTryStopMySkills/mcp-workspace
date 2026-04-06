import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

// POST /api/agents/me/avatar — subir avatar del agente actual
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });

  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
  if (!allowedMimes.includes(file.type)) {
    return NextResponse.json({ error: "Solo se permiten imágenes (JPG, PNG, WebP, GIF)" }, { status: 400 });
  }

  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: "El avatar no puede superar los 2 MB" }, { status: 400 });
  }

  const ext = file.name.split(".").pop();
  const fileName = `avatars/${session.user.id}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Asegurar bucket
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const bucketExists = (buckets ?? []).some((b) => b.name === "documents");
  if (!bucketExists) {
    await supabaseAdmin.storage.createBucket("documents", { public: true, fileSizeLimit: null });
  }

  const { data, error } = await supabaseAdmin.storage
    .from("documents")
    .upload(fileName, buffer, { contentType: file.type, upsert: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: urlData } = supabaseAdmin.storage.from("documents").getPublicUrl(data.path);
  const avatarUrl = urlData.publicUrl;

  // Actualizar avatar_url en la DB
  await supabaseAdmin.from("agents").update({ avatar_url: avatarUrl }).eq("id", session.user.id);

  return NextResponse.json({ avatar_url: avatarUrl });
}
