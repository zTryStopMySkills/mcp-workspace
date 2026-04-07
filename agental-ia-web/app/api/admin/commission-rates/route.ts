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
    .from("commission_rates")
    .select("agent_id, rate_percent, updated_at");

  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { agent_id, rate_percent } = await req.json();
  if (!agent_id || rate_percent === undefined || rate_percent < 0 || rate_percent > 100) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("commission_rates")
    .upsert(
      { agent_id, rate_percent: Number(rate_percent), updated_at: new Date().toISOString() },
      { onConflict: "agent_id" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
