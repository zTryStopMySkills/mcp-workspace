import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

function adminGuard(session: Awaited<ReturnType<typeof getServerSession>>) {
  if (!session || session.user.role !== "admin") {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }
  return null;
}

// GET — lista estudiantes
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const err = adminGuard(session);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 50;
  const from = (page - 1) * limit;

  const supabase = getSupabaseAdmin();
  const { data, error, count } = await supabase
    .from("academy_users")
    .select("id, nick, tier, is_active, created_at, stripe_customer_id", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return Response.json({ students: data ?? [], total: count ?? 0, page, limit });
}

// PATCH — cambiar tier o activar/desactivar
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const err = adminGuard(session);
  if (err) return err;

  const { id, tier, is_active } = await req.json();
  if (!id) return new Response(JSON.stringify({ error: "id requerido" }), { status: 400 });

  const supabase = getSupabaseAdmin();
  const update: Record<string, unknown> = {};
  if (tier !== undefined) update.tier = tier;
  if (is_active !== undefined) update.is_active = is_active;

  const { error } = await supabase.from("academy_users").update(update).eq("id", id);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return Response.json({ ok: true });
}
