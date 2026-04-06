import { supabaseAdmin } from "@/lib/supabase";

interface NotifyOpts {
  agentId: string;
  type: "doc_assigned" | "message" | "quotation" | "system";
  title: string;
  body?: string;
  href?: string;
}

/** Fire-and-forget — nunca lanza */
export function notify(opts: NotifyOpts) {
  supabaseAdmin.from("notifications").insert({
    agent_id: opts.agentId,
    type: opts.type,
    title: opts.title,
    body: opts.body ?? null,
    href: opts.href ?? null,
  }).then(() => {}).then(undefined, () => {});
}

/** Notificar a múltiples agentes */
export function notifyMany(agentIds: string[], opts: Omit<NotifyOpts, "agentId">) {
  if (agentIds.length === 0) return;
  supabaseAdmin.from("notifications").insert(
    agentIds.map(id => ({
      agent_id: id,
      type: opts.type,
      title: opts.title,
      body: opts.body ?? null,
      href: opts.href ?? null,
    }))
  ).then(() => {}).then(undefined, () => {});
}
