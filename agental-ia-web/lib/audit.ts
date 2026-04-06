import { supabaseAdmin } from "./supabase";

interface AuditParams {
  actorId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
}

/**
 * Registra una acción en el audit log.
 * Fire-and-forget: no lanza excepciones si falla.
 */
export async function audit({ actorId, action, targetType, targetId, details }: AuditParams): Promise<void> {
  try {
    await supabaseAdmin.from("audit_log").insert({
      actor_id: actorId,
      action,
      target_type: targetType ?? null,
      target_id: targetId ?? null,
      details: details ?? null
    });
  } catch {
    // Silently ignore — audit failures should never break the main flow
  }
}
