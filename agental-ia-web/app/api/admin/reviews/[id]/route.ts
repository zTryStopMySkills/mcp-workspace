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
  const { approved } = body;

  if (typeof approved !== "boolean") {
    return NextResponse.json({ error: "Campo approved inválido" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("public_reviews")
    .update({ approved })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("public_reviews")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
