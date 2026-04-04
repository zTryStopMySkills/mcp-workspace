import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { DocumentViewer } from "@/components/documents/DocumentViewer";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DocumentViewPage({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const { data: doc, error } = await supabaseAdmin
    .from("documents")
    .select("*, creator:created_by(nick, name)")
    .eq("id", id)
    .single();

  if (error || !doc) notFound();

  // Marcar como visto en el servidor
  await supabaseAdmin
    .from("document_assignments")
    .upsert(
      { document_id: id, agent_id: session.user.id, seen_at: new Date().toISOString() },
      { onConflict: "document_id,agent_id", ignoreDuplicates: false }
    );

  return (
    <DashboardLayout>
      <DocumentViewer doc={doc} />
    </DashboardLayout>
  );
}
