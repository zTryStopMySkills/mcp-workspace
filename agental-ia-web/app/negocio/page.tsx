import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { NegocioClient } from "@/components/negocio/NegocioClient";

export default async function NegocioPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "admin" && session.user.role !== "editor") redirect("/chat");

  return (
    <DashboardLayout>
      <NegocioClient />
    </DashboardLayout>
  );
}
