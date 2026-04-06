import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

const currentMonth = () => new Date().toISOString().slice(0, 7);

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabaseAdmin
    .from("agent_monthly_targets")
    .select("target_amount")
    .eq("agent_id", session.user.id)
    .eq("month", currentMonth())
    .single();

  return NextResponse.json({ target: data?.target_amount ?? null });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { target_amount, agent_id } = await req.json();
  if (typeof target_amount !== "number" || target_amount < 0)
    return NextResponse.json({ error: "target_amount inválido" }, { status: 400 });

  // Admin puede poner objetivo a cualquier agente; agente solo al suyo
  const targetAgentId = session.user.role === "admin" && agent_id ? agent_id : session.user.id;

  const { data, error } = await supabaseAdmin
    .from("agent_monthly_targets")
    .upsert({ agent_id: targetAgentId, month: currentMonth(), target_amount }, { onConflict: "agent_id,month" })
    .select("target_amount")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ target: data.target_amount });
}
