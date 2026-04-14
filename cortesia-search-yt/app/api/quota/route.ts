import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabaseAdmin
    .from("csy_quota_usage")
    .select("units_used")
    .eq("date", today)
    .single();

  const used = data?.units_used ?? 0;
  const limit = 10000;
  return NextResponse.json({ used, limit, pct: Math.round((used / limit) * 100) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const units = Number(body?.units);
  if (!units || units < 0) {
    return NextResponse.json({ error: "units debe ser un número positivo" }, { status: 400 });
  }
  const today = new Date().toISOString().split("T")[0];

  // Try to insert; if date exists, increment
  const { error: insertError } = await supabaseAdmin
    .from("csy_quota_usage")
    .insert({ date: today, units_used: units });

  if (insertError) {
    // Row exists for today — fetch current and update
    const { data: current } = await supabaseAdmin
      .from("csy_quota_usage")
      .select("units_used")
      .eq("date", today)
      .single();

    await supabaseAdmin
      .from("csy_quota_usage")
      .update({ units_used: (current?.units_used ?? 0) + units })
      .eq("date", today);
  }

  return NextResponse.json({ ok: true });
}
