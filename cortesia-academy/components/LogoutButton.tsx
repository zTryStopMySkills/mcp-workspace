"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-[#8B95A9] hover:text-red-400 transition-colors"
      title="Cerrar sesión"
    >
      <LogOut size={16} />
    </button>
  );
}
