import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("public_reviews")
      .select("id, author_name, business_name, location, rating, content, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("Reviews GET error:", err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { author_name, business_name, location, rating, content } = body;

    // Validate
    if (!author_name?.trim()) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "La valoración debe ser entre 1 y 5" }, { status: 400 });
    }
    if (!content?.trim() || content.trim().length < 20) {
      return NextResponse.json({ error: "La reseña debe tener al menos 20 caracteres" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("public_reviews")
      .insert({
        author_name: author_name.trim(),
        business_name: business_name?.trim() || null,
        location: location?.trim() || null,
        rating: Number(rating),
        content: content.trim(),
        approved: false,
      });

    if (error) {
      console.error("Review insert error:", error);
      return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Reviews POST error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
