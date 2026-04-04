import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

// POST /api/messages — insertar mensaje (usa service_role para saltarse RLS)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
  if (content.length > 2000) return NextResponse.json({ error: "Mensaje demasiado largo" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("messages")
    .insert({ agent_id: session.user.id, content: content.trim() })
    .select("id, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
