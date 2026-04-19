import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // --- Parse session from cookie (inline, mirrors lib/session.ts) ---
  const cookieStore = await cookies();
  const raw = cookieStore.get("academy_session")?.value;
  if (!raw) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  let sessionId: string;
  try {
    const decoded = JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
    if (typeof decoded.id !== "string") throw new Error("invalid");
    if (Date.now() - decoded.issued > 7 * 24 * 60 * 60 * 1000) throw new Error("expired");
    sessionId = decoded.id;
  } catch {
    return NextResponse.json({ error: "Sesión inválida o expirada" }, { status: 401 });
  }

  // --- Parse body ---
  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { currentPassword, newPassword } = body;

  if (!currentPassword || typeof currentPassword !== "string") {
    return NextResponse.json({ error: "Contraseña actual requerida" }, { status: 400 });
  }
  if (!newPassword || typeof newPassword !== "string") {
    return NextResponse.json({ error: "Nueva contraseña requerida" }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "La nueva contraseña debe tener al menos 8 caracteres" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // --- Fetch user ---
  const { data: user, error: fetchError } = await supabase
    .from("academy_users")
    .select("id, password_hash")
    .eq("id", sessionId)
    .maybeSingle();

  if (fetchError || !user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 });
  }

  // --- Verify current password ---
  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Contraseña actual incorrecta" }, { status: 401 });
  }

  // --- Hash and update ---
  const newHash = await bcrypt.hash(newPassword, 12);
  const { error: updateError } = await supabase
    .from("academy_users")
    .update({ password_hash: newHash })
    .eq("id", sessionId);

  if (updateError) {
    console.error("[change-password] update error:", updateError);
    return NextResponse.json({ error: "Error al actualizar contraseña" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
