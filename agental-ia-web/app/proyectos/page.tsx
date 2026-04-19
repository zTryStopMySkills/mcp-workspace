import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardLayout } from "@/components/ui/DashboardLayout";
import { ProyectosClient } from "@/components/proyectos/ProyectosClient";

export default async function ProyectosPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "admin" && session.user.role !== "editor") redirect("/chat");

  return (
    <DashboardLayout>
      <ProyectosClient />
    </DashboardLayout>
  );
}
