import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { assembleAgentContext } from "@/lib/ia/assembleContext";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const full = req.nextUrl.searchParams.get("full") === "1";

  const context = await assembleAgentContext(
    session.user.id,
    session.user.name,
    session.user.nick
  );

  if (!full) {
    // Lightweight: only overdue count for the badge
    return NextResponse.json({ overdueCount: context.overdueFollowUps.length });
  }

  return NextResponse.json({
    overdueCount: context.overdueFollowUps.length,
    quotations: context.allQuotations,
    agentStats: context.agentStats,
    teamStats: context.teamStats,
  });
}
