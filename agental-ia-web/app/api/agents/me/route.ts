import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import bcrypt from "bcryptjs";

// GET /api/agents/me — perfil del agente actual
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("agents")
    .select("id, nick, name, role, avatar_url, created_at")
    .eq("id", session.user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH /api/agents/me — actualizar nombre y/o contraseña
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { name, current_password, new_password } = body;

  const updates: Record<string, string> = {};

  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 1 || name.trim().length > 100) {
      return NextResponse.json({ error: "El nombre debe tener entre 1 y 100 caracteres" }, { status: 400 });
    }
    updates.name = name.trim();
  }

  if (new_password !== undefined) {
    if (!current_password) {
      return NextResponse.json({ error: "Introduce la contraseña actual" }, { status: 400 });
    }
    if (new_password.length < 6 || new_password.length > 128) {
      return NextResponse.json({ error: "La nueva contraseña debe tener entre 6 y 128 caracteres" }, { status: 400 });
    }

    // Verificar contraseña actual
    const { data: agent } = await supabaseAdmin
      .from("agents")
      .select("password_hash")
      .eq("id", session.user.id)
      .single();

    if (!agent) return NextResponse.json({ error: "Agente no encontrado" }, { status: 404 });

    const valid = await bcrypt.compare(current_password, agent.password_hash);
    if (!valid) return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 400 });

    updates.password_hash = await bcrypt.hash(new_password, 12);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nada que actualizar" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("agents")
    .update(updates)
    .eq("id", session.user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
