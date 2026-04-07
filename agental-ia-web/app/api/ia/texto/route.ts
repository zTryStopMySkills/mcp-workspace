import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimitAsync } from "@/lib/rateLimit";
import { supabaseAdmin } from "@/lib/supabase";
import type { TextoRequest } from "@/types/ia";
import type { Quotation } from "@/types";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "IA no configurada" }, { status: 503 });
  }

  const rl = await rateLimitAsync({ key: `ia:texto:${session.user.id}`, limit: 10, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiadas consultas. Espera un momento." }, { status: 429 });
  }

  const body = await req.json() as TextoRequest;
  const { quotationId, channel, objective, customInstruction } = body;

  if (!quotationId || !channel || !objective) {
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
  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(q.updated_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  const extrasText = q.extras?.length
    ? q.extras.map((e) => `${e.nombre} (+${e.precio}€)`).join(", ")
    : "ninguno";
  const servicesText = q.services?.length
    ? q.services.map((s) => `${s.nombre} (${s.precio}€/mes)`).join(", ")
    : "ninguno";

  const objectiveLabels: Record<string, string> = {
    first_contact: "primer contacto / presentar la propuesta",
    follow_up: "seguimiento de propuesta enviada",
    close: "cerrar la venta / pedir decisión final",
    custom: customInstruction ?? "comunicación personalizada",
  };

  const channelRules: Record<string, string> = {
    email:
      "Formato email profesional. Incluye asunto al inicio (Asunto: ...). Usa párrafos bien estructurados. Tono cercano pero profesional. Firma con el nombre del agente.",
    whatsapp:
      "Formato WhatsApp: informal, cálido, directo. Máximo 3-4 párrafos cortos. Puedes usar 1-2 emojis relevantes. Sin asunto. Firma breve al final.",
    llamada:
      "Script de llamada telefónica. Incluye: apertura (saludo y presentación), propuesta de valor en 1 frase, 3-4 puntos clave a mencionar, cómo responder objeciones comunes (precio, tiempo), y cierre con call to action claro. Formato con bullet points.",
  };

  const systemPrompt = `Eres un experto en copywriting comercial para una agencia web (Agental.IA).
Generas textos de venta personalizados en español para agentes comerciales.
No inventes datos, precios ni características que no estén en el contexto.
Usa los datos del cliente y la propuesta para personalizar al máximo.`;

  const userMessage = `
Genera un texto de ${channel} para el siguiente caso:

AGENTE: ${session.user.name} (@${session.user.nick})
CANAL: ${channel}
OBJETIVO: ${objectiveLabels[objective]}
${customInstruction ? `INSTRUCCIÓN ADICIONAL: ${customInstruction}` : ""}

DATOS DEL CLIENTE:
- Nombre/Empresa: ${q.client_name}
- Sector: ${q.client_sector ?? "no especificado"}
- Email: ${q.client_email ?? "no disponible"}
- Teléfono: ${q.client_phone ?? "no disponible"}
- Tiene web actualmente: ${q.has_web ? "sí" : "no"}

PROPUESTA:
- Plan: ${q.plan_name} — ${q.plan_price.toLocaleString("es-ES")}€ (pago único)
- Extras: ${extrasText}
- Servicios recurrentes: ${servicesText}
- Total único: ${q.total_once.toLocaleString("es-ES")}€
- Total mensual: ${q.total_monthly > 0 ? q.total_monthly.toLocaleString("es-ES") + "€/mes" : "sin cuota mensual"}
- Estado actual: ${q.status}
- Días desde última actualización: ${daysSinceUpdate}
${q.notes ? `- Notas internas: ${q.notes}` : ""}

REGLAS DE FORMATO:
${channelRules[channel]}
`.trim();

  const { Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = response.content.find((c) => c.type === "text")?.text ?? "";
  return NextResponse.json({ text });
}
