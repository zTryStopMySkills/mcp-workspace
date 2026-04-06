import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { audit } from "@/lib/audit";

// PATCH /api/agents/[id] — activar/desactivar o cambiar contraseña (solo admin)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
  if (body.name) updates.name = body.name;

  if (body.password) {
    const bcrypt = await import("bcryptjs");
    updates.password_hash = await bcrypt.hash(body.password, 12);
  }

  const { data, error } = await supabaseAdmin
    .from("agents")
    .update(updates)
    .eq("id", id)
    .select("id, nick, name, role, is_active")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Audit
  const action = typeof body.is_active === "boolean"
    ? (body.is_active ? "agent_activated" : "agent_deactivated")
    : body.password ? "agent_password_changed" : "agent_updated";
  audit({ actorId: session.user.id, action, targetType: "agent", targetId: id, details: { nick: data?.nick } });

  return NextResponse.json(data);
}
