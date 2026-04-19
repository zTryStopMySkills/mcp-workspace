import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { WikiClient } from "@/components/wiki/WikiClient";

export default async function WikiPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "admin" && session.user.role !== "editor") redirect("/chat");

  return (
    <DashboardLayout>
      <WikiClient />
    </DashboardLayout>
  );
}
