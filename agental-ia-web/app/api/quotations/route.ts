import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "1" && session.user.role === "admin";

  let query = supabaseAdmin
    .from("quotations")
    .select("*, agent:agent_id(nick, name)")
    .order("created_at", { ascending: false })
    .limit(200);

  if (!all) query = query.eq("agent_id", session.user.id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    client_name, client_email, client_phone, client_sector,
    has_web, client_web_url, plan_id, plan_name, plan_price,
    extras, services, total_once, total_monthly, status, notes
  } = body;

  if (!client_name?.trim() || !plan_id || plan_price == null)
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("quotations")
    .insert({
      agent_id: session.user.id,
      client_name: client_name.trim(),
      client_email: client_email || null,
      client_phone: client_phone || null,
      client_sector: client_sector || null,
      has_web: has_web ?? false,
      client_web_url: client_web_url || null,
      plan_id, plan_name, plan_price,
      extras: extras ?? [],
      services: services ?? [],
      total_once, total_monthly: total_monthly ?? 0,
      status: status ?? "draft",
      notes: notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
