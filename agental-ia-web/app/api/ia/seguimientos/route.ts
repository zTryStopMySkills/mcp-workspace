import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimitAsync } from "@/lib/rateLimit";
import { supabaseAdmin } from "@/lib/supabase";
import type { SeguimientoRequest } from "@/types/ia";
import type { Quotation } from "@/types";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "IA no configurada" }, { status: 503 });
  }

  const rl = await rateLimitAsync({ key: `ia:seg:${session.user.id}`, limit: 10, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiadas consultas. Espera un momento." }, { status: 429 });
  }

  const body = await req.json() as SeguimientoRequest;
  const { quotationId, channel } = body;

  if (!quotationId || !channel) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const { data: quotation } = await supabaseAdmin
    .from("quotations")
    .select("*")
    .eq("id", quotationId)
    .eq("agent_id", session.user.id)
    .single();

  if (!quotation) {
    return NextResponse.json({ error: "Propuesta no encontrada" }, { status: 404 });
  }

  const q = quotation as Quotation;
  const daysOverdue = q.follow_up_date
    ? Math.floor(
        (Date.now() - new Date(q.follow_up_date).getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  const extrasText = q.extras?.length
    ? q.extras.map((e) => e.nombre).join(", ")
    : "ninguno";

  const channelRules: Record<string, string> = {
    email:
      "Email profesional con asunto (Asunto: ...). Párrafos cortos. Tono empático y sin presión. Firma con nombre del agente.",
    whatsapp:
      "WhatsApp directo, cálido y corto. Máximo 2-3 párrafos. 1-2 emojis relevantes. Tono de recordatorio amigable, sin presión.",
  };

  const systemPrompt = `Eres un experto en seguimiento comercial para agencias web.
Generas mensajes de seguimiento efectivos en español: cálidos, sin presión, que reabren la conversación.
No inventes datos. Usa solo lo que se te proporciona.`;

  const userMessage = `
Genera un mensaje de seguimiento por ${channel} para esta propuesta con ${daysOverdue} día(s) de retraso en el seguimiento:

AGENTE: ${session.user.name}
CLIENTE: ${q.client_name} (${q.client_sector ?? "sector no especificado"})
PLAN: ${q.plan_name} — ${q.total_once.toLocaleString("es-ES")}€
EXTRAS: ${extrasText}
ESTADO: ${q.status}
${q.notes ? `NOTAS: ${q.notes}` : ""}

REGLAS DE FORMATO:
${channelRules[channel]}
`.trim();

  const { Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = response.content.find((c) => c.type === "text")?.text ?? "";
  return NextResponse.json({ text });
}
