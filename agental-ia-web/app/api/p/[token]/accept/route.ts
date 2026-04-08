import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// POST /api/p/[token]/accept — public endpoint, no auth required
export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const { data: q, error } = await supabaseAdmin
    .from("quotations")
    .select("id, status")
    .eq("share_token", token)
    .single();

  if (error || !q) return NextResponse.json({ error: "Propuesta no encontrada" }, { status: 404 });
  if (q.status === "closed") return NextResponse.json({ error: "already_accepted" }, { status: 409 });
  if (q.status === "lost") return NextResponse.json({ error: "Propuesta no disponible" }, { status: 410 });

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { error: updateError } = await supabaseAdmin
    .from("quotations")
    .update({
      status: "closed",
      accepted_at: new Date().toISOString(),
      accepted_ip: ip,
      updated_at: new Date().toISOString(),
    })
    .eq("id", q.id);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
