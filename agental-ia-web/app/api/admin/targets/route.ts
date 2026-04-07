import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

const currentMonth = () => new Date().toISOString().slice(0, 7); // "2026-04"

// GET /api/admin/targets — devuelve objetivo del mes actual (cualquier agente autenticado)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabaseAdmin
    .from("team_monthly_targets")
    .select("target_closed, target_amount, month")
    .eq("month", currentMonth())
    .maybeSingle();

  return NextResponse.json(data ?? null);
}

// POST /api/admin/targets — upsert objetivo (solo admin)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { target_closed, target_amount } = await req.json();

  if (
    typeof target_closed !== "number" || target_closed < 0 ||
    typeof target_amount !== "number" || target_amount < 0
  ) {
    return NextResponse.json({ error: "Valores inválidos" }, { status: 400 });
  }

  const month = currentMonth();

  const { data, error } = await supabaseAdmin
    .from("team_monthly_targets")
    .upsert({ month, target_closed, target_amount, updated_at: new Date().toISOString() }, { onConflict: "month" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
