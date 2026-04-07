import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

const ALLOWED_EMOJIS = ["👍", "❤️", "🔥", "😂", "😮", "✅"];

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: message_id } = await params;
  const { emoji } = await req.json();

  if (!ALLOWED_EMOJIS.includes(emoji)) {
    return NextResponse.json({ error: "Invalid emoji" }, { status: 400 });
  }

  // Toggle: remove if already exists, add if not
  const { data: existing } = await supabaseAdmin
    .from("message_reactions")
    .select("id")
    .eq("message_id", message_id)
    .eq("agent_id", session.user.id)
    .eq("emoji", emoji)
    .single();

  if (existing) {
    await supabaseAdmin.from("message_reactions").delete().eq("id", existing.id);
    return NextResponse.json({ action: "removed" });
  }

  const { error } = await supabaseAdmin.from("message_reactions").insert({
    message_id,
    agent_id: session.user.id,
    emoji,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ action: "added" });
}
