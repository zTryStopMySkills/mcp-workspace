import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimitAsync } from "@/lib/rateLimit";
import { notifyMany } from "@/lib/notify";

// GET /api/messages?before=<ISO>&limit=40&channel_id=<uuid>
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const before = searchParams.get("before");
  const channelId = searchParams.get("channel_id");
  const limit = Math.min(Number(searchParams.get("limit") ?? "40"), 100);

  let query = supabaseAdmin
    .from("messages")
    .select("id, agent_id, content, created_at, channel_id, agent:agent_id(nick, name, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (before) query = query.lt("created_at", before);
  if (channelId) query = query.eq("channel_id", channelId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).reverse());
}

// POST /api/messages
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const rl = await rateLimitAsync({ key: `msg:${session.user.id}`, limit: 20, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Demasiados mensajes. Espera un momento antes de continuar." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
    );
  }

  const { content, channel_id } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
  if (content.length > 2000) return NextResponse.json({ error: "Mensaje demasiado largo" }, { status: 400 });

  // Resolve channel — use provided or default
  let resolvedChannelId = channel_id;
  if (!resolvedChannelId) {
    const { data: defaultCh } = await supabaseAdmin
      .from("channels").select("id").eq("is_default", true).single();
    resolvedChannelId = defaultCh?.id ?? null;
  }

  const { data, error } = await supabaseAdmin
    .from("messages")
    .insert({ agent_id: session.user.id, content: content.trim(), channel_id: resolvedChannelId })
    .select("id, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Detectar menciones y notificar
  const mentionNicks = [...content.matchAll(/\B@(\w+)/g)].map(m => m[1].toLowerCase());
  if (mentionNicks.length > 0) {
    const { data: mentioned } = await supabaseAdmin
      .from("agents")
      .select("id, nick")
      .in("nick", mentionNicks)
      .eq("is_active", true);

    const ids = (mentioned ?? []).filter(a => a.id !== session.user.id).map(a => a.id);
    if (ids.length > 0) {
      notifyMany(ids, {
        type: "message",
        title: `@${session.user.nick} te ha mencionado en el chat`,
        body: content.slice(0, 100),
        href: "/chat",
      });
    }
  }

  return NextResponse.json(data, { status: 201 });
}
