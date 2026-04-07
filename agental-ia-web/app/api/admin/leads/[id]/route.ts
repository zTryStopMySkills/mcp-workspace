import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, assigned_to } = body;

  const updates: Record<string, unknown> = {};

  if (status !== undefined) {
    const validStatuses = ["new", "contacted", "converted", "lost"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }
    updates.status = status;
  }

  if (assigned_to !== undefined) {
    updates.assigned_to = assigned_to; // null to unassign
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Sin campos válidos" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("public_leads")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
