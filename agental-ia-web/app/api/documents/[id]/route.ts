import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

// PATCH /api/documents/[id] — actualizar visibilidad, título o descripción (solo admin)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const updates: Record<string, unknown> = {};

  if (body.visibility !== undefined) {
    if (!["all", "specific"].includes(body.visibility))
      return NextResponse.json({ error: "Visibilidad no válida" }, { status: 400 });
    updates.visibility = body.visibility;
  }
  if (body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim().length === 0 || body.title.length > 200)
      return NextResponse.json({ error: "Título inválido (máx. 200 caracteres)" }, { status: 400 });
    updates.title = body.title.trim();
  }
  if (body.description !== undefined) {
    updates.description = body.description ? String(body.description).slice(0, 500) : null;
  }

  if (Object.keys(updates).length === 0)
    return NextResponse.json({ error: "Nada que actualizar" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("documents")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE /api/documents/[id] — eliminar documento (solo admin)
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("documents")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
