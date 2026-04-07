import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabaseAdmin
    .from("landing_config")
    .select("value")
    .eq("key", "slots_available")
    .single();

  const slots = data ? parseInt(data.value, 10) : 3;
  return NextResponse.json({ slots: isNaN(slots) ? 3 : slots });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const slots = parseInt(body.slots, 10);

  if (isNaN(slots) || slots < -1 || slots > 99) {
    return NextResponse.json({ error: "Valor inválido (0-99 o -1 para ocultar)" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("landing_config")
    .upsert({ key: "slots_available", value: String(slots), updated_at: new Date().toISOString() });

  if (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, slots });
}
