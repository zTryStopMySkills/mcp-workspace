import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import webpush from "web-push";

// POST /api/push/send — admin only, send push to one or all agents
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
      "mailto:admin@agentalia.com",
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
  }
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { agent_id, title, body, url } = await req.json();
  if (!title || !body) return NextResponse.json({ error: "title and body required" }, { status: 400 });

  let query = supabaseAdmin.from("push_subscriptions").select("subscription");
  if (agent_id) query = query.eq("agent_id", agent_id);

  const { data: subs } = await query;
  if (!subs?.length) return NextResponse.json({ sent: 0 });

  const payload = JSON.stringify({ title, body, url: url ?? "/dashboard" });
  const results = await Promise.allSettled(
    subs.map(({ subscription }) =>
      webpush.sendNotification(JSON.parse(subscription), payload)
    )
  );

  const sent = results.filter(r => r.status === "fulfilled").length;
  return NextResponse.json({ sent, total: subs.length });
}
