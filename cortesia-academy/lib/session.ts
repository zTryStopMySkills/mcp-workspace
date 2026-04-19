import { cookies } from "next/headers";

export type AcademySession = {
  id: string;
  nick: string;
  tier: "free" | "premium" | "admin";
  issued: number;
};

export async function getSession(): Promise<AcademySession | null> {
  const c = await cookies();
  const raw = c.get("academy_session")?.value;
  if (!raw) return null;
  try {
    const decoded = JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
    if (typeof decoded.id !== "string") return null;
    // Expirar sesiones >7 días
    if (Date.now() - decoded.issued > 7 * 24 * 60 * 60 * 1000) return null;
    return decoded as AcademySession;
  } catch {
    return null;
  }
}
