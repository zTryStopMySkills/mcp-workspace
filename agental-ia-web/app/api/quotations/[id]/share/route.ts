import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { randomUUID } from "crypto";

// POST /api/quotations/:id/share — generate or return existing share token
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Only owner or admin can share
  let ownerQuery = supabaseAdmin.from("quotations").select("id, share_token, agent_id").eq("id", id);
  if (session.user.role !== "admin") ownerQuery = ownerQuery.eq("agent_id", session.user.id);

  const { data: quotation, error } = await ownerQuery.single();
  if (error || !quotation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Return existing token or generate new one
  if (quotation.share_token) {
    return NextResponse.json({ token: quotation.share_token });
  }

  const token = randomUUID();
  const { error: updateError } = await supabaseAdmin
    .from("quotations")
    .update({ share_token: token })
    .eq("id", id);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ token });
}

// DELETE /api/quotations/:id/share — revoke share link
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  let query = supabaseAdmin.from("quotations").update({ share_token: null }).eq("id", id);
  if (session.user.role !== "admin") query = query.eq("agent_id", session.user.id);

  const { error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
