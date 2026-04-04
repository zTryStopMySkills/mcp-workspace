import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Asegurar que el bucket existe — crearlo si no existe
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  const bucketExists = (buckets ?? []).some((b) => b.name === "documents");
  if (!bucketExists) {
    const { error: bucketErr } = await supabaseAdmin.storage.createBucket("documents", {
      public: true,
      fileSizeLimit: null
    });
    if (bucketErr) {
      return NextResponse.json(
        { error: "No se pudo crear el almacenamiento. Crea el bucket 'documents' en Supabase Storage." },
        { status: 500 }
      );
    }
  }

  const { data, error } = await supabaseAdmin.storage
    .from("documents")
    .upload(fileName, buffer, { contentType: file.type, upsert: false });

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
