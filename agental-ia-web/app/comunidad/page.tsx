import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { ComunidadClient } from "@/components/comunidad/ComunidadClient";

export default async function ComunidadPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "admin" && session.user.role !== "editor") redirect("/chat");

  return (
    <DashboardLayout>
      <ComunidadClient />
    </DashboardLayout>
  );
}
