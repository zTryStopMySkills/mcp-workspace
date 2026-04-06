import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimitAsync } from "@/lib/rateLimit";

const SYSTEM_PROMPT = `Eres Agental.IA, el asistente de inteligencia artificial integrado en el portal de agentes comerciales de Agental.IA.

Tu función es ayudar a los agentes comerciales respondiendo preguntas, dando consejos de ventas, resumiendo información y apoyando su trabajo diario.

Pautas:
- Responde siempre en español
- Sé conciso y directo (máximo 3-4 párrafos salvo que se pida más detalle)
- Cuando des listas o pasos, usa formato claro
- Si no sabes algo, dilo con honestidad
- Adapta el tono al contexto comercial (profesional pero cercano)`;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "IA no configurada. Añade ANTHROPIC_API_KEY en .env.local" }, { status: 503 });
  }

  // Rate limit: 10 consultas IA por minuto por agente
  const rl = await rateLimitAsync({ key: `ai:${session.user.id}`, limit: 10, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiadas consultas a la IA. Espera un momento." }, { status: 429 });
  }

  const body = await req.json();
  const { question, context } = body as { question: string; context?: Array<{ role: "user" | "assistant"; content: string }> };

  if (!question?.trim()) return NextResponse.json({ error: "Pregunta vacía" }, { status: 400 });
  if (question.length > 1000) return NextResponse.json({ error: "Pregunta demasiado larga (máx. 1000 caracteres)" }, { status: 400 });

  const { Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const messages: Array<{ role: "user" | "assistant"; content: string }> = [
    ...(context ?? []).slice(-6), // últimos 6 turnos de contexto
    { role: "user", content: question }
  ];

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  });

  const text = response.content.find(c => c.type === "text")?.text ?? "Sin respuesta.";
  return NextResponse.json({ response: text });
}
