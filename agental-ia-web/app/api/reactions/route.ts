import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

// GET /api/reactions?message_ids=id1,id2,...
// Returns a map: { [message_id]: { emoji: string; count: number; agents: string[]; hasMe: boolean }[] }
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ids = req.nextUrl.searchParams.get("message_ids");
  if (!ids) return NextResponse.json({});

  const messageIds = ids.split(",").filter(Boolean).slice(0, 100);
  if (messageIds.length === 0) return NextResponse.json({});

  const { data, error } = await supabaseAdmin
    .from("message_reactions")
    .select("message_id, emoji, agent_id")
    .in("message_id", messageIds);

  if (error) return NextResponse.json({}, { status: 500 });

  // Group by message_id → emoji → agents
  const result: Record<string, { emoji: string; count: number; agents: string[]; hasMe: boolean }[]> = {};

  for (const row of data ?? []) {
    if (!result[row.message_id]) result[row.message_id] = [];
    const existing = result[row.message_id].find(r => r.emoji === row.emoji);
    if (existing) {
      existing.count++;
      existing.agents.push(row.agent_id);
      if (row.agent_id === session.user.id) existing.hasMe = true;
    } else {
      result[row.message_id].push({
        emoji: row.emoji,
        count: 1,
        agents: [row.agent_id],
        hasMe: row.agent_id === session.user.id,
      });
    }
  }

  return NextResponse.json(result);
}
