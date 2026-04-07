import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabaseAdmin
    .from("whatsapp_templates")
    .select("template_text")
    .eq("agent_id", session.user.id)
    .single();

  return NextResponse.json({ template: data?.template_text ?? null });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { template_text } = await req.json();
  if (!template_text?.trim()) {
    return NextResponse.json({ error: "La plantilla no puede estar vacía" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("whatsapp_templates")
    .upsert(
      { agent_id: session.user.id, template_text: template_text.trim(), updated_at: new Date().toISOString() },
      { onConflict: "agent_id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
