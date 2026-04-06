import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { DocumentsClient } from "@/components/documents/DocumentsClient";
import type { DocumentWithStatus } from "@/types";

export default async function DocumentosPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const agentId = session.user.id;

  // Docs para todos
  const { data: allDocs } = await supabaseAdmin
    .from("documents")
    .select("*, creator:created_by(nick, name)")
    .eq("visibility", "all")
    .order("created_at", { ascending: false })
    .limit(200);

  // Docs asignados específicamente
  const { data: assigned } = await supabaseAdmin
    .from("document_assignments")
    .select("seen_at, document:document_id(*, creator:created_by(nick, name))")
    .eq("agent_id", agentId)
    .limit(200);

  const seenMap = new Map((assigned ?? []).map((a) => {
    const doc = a.document as unknown as { id: string } | null;
    return [doc?.id ?? "", a.seen_at];
  }));

  const allDocIds = new Set((allDocs ?? []).map((d) => d.id));

  const specificDocs = (assigned ?? [])
    .filter((a) => a.document && !allDocIds.has((a.document as unknown as { id: string }).id))
    .map((a) => ({ ...(a.document as object), seen_at: a.seen_at })) as DocumentWithStatus[];

  const enrichedAll: DocumentWithStatus[] = (allDocs ?? []).map((d) => ({
    ...d,
    seen_at: seenMap.get(d.id) ?? null,
    is_new: !seenMap.has(d.id)
  }));

  const docs = [...enrichedAll, ...specificDocs];
  docs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <DashboardLayout>
      <DocumentsClient initialDocs={docs} agentId={agentId} />
    </DashboardLayout>
  );
}
