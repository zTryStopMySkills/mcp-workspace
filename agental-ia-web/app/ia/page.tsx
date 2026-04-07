import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { IAPage } from "@/components/ia/IAPage";
import { assembleAgentContext } from "@/lib/ia/assembleContext";
import type { IATab } from "@/types/ia";

export const metadata = { title: "IA Comercial — Agental.IA" };

export default async function IARoute({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const params = await searchParams;
  const validTabs: IATab[] = ["coach", "textos", "pipeline", "seguimientos"];
  const initialTab = validTabs.includes(params.tab as IATab)
    ? (params.tab as IATab)
    : "coach";

  const context = await assembleAgentContext(
    session.user.id,
    session.user.name,
    session.user.nick
  );

  return (
    <DashboardLayout>
      <IAPage
        agentStats={context.agentStats}
        teamStats={context.teamStats}
        overdueFollowUps={context.overdueFollowUps}
        quotations={context.allQuotations}
        initialTab={initialTab}
      />
    </DashboardLayout>
  );
}
