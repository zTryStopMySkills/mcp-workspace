import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const { nick, password } = await req.json();
  if (!nick || !password) {
    return NextResponse.json({ error: "Credenciales requeridas" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: user, error } = await supabase
    .from("academy_users")
    .select("id, nick, email, name, password_hash, tier, is_active")
    .ilike("nick", nick.trim())
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });
  }
  if (!user.is_active) {
    return NextResponse.json({ error: "Cuenta inactiva — suscripción cancelada o suspendida" }, { status: 403 });
  }
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });
  }

  // Set simple cookie session — in F1 MVP, sin JWT firmado sofisticado aún
  const sessionPayload = Buffer.from(JSON.stringify({
    id: user.id,
    nick: user.nick,
    tier: user.tier,
    issued: Date.now()
  })).toString("base64");

  const c = await cookies();
  c.set("academy_session", sessionPayload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 días
    path: "/"
  });

  return NextResponse.json({
    ok: true,
    user: { nick: user.nick, name: user.name, tier: user.tier }
  });
}
