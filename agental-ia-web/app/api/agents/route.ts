import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { audit } from "@/lib/audit";
import bcrypt from "bcryptjs";

// GET /api/agents — lista todos los agentes (solo admin)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("agents")
    .select("id, nick, name, role, is_active, created_at, avatar_url")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/agents — crear agente (solo admin)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { nick, name, password, role } = await req.json();
  if (!nick || !name || !password) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const cleanNick = nick.toLowerCase().trim();
  if (!/^[a-z0-9_]{3,20}$/.test(cleanNick)) {
    return NextResponse.json(
      { error: "El nick debe tener entre 3 y 20 caracteres (letras, números y _)" },
      { status: 400 }
    );
  }
  if (typeof name !== "string" || name.trim().length < 1 || name.trim().length > 100) {
    return NextResponse.json({ error: "El nombre debe tener entre 1 y 100 caracteres" }, { status: 400 });
  }
  if (password.length < 6 || password.length > 128) {
    return NextResponse.json({ error: "La contraseña debe tener entre 6 y 128 caracteres" }, { status: 400 });
  }

  const password_hash = await bcrypt.hash(password, 12);

  const { data, error } = await supabaseAdmin
    .from("agents")
    .insert({ nick: cleanNick, name: name.trim(), password_hash, role: role ?? "agent" })
    .select("id, nick, name, role, is_active, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "El nick ya existe" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  audit({ actorId: session.user.id, action: "agent_created", targetType: "agent", targetId: data.id, details: { nick: cleanNick, role: role ?? "agent" } });

  return NextResponse.json(data, { status: 201 });
}
