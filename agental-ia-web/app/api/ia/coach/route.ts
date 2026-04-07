import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimitAsync } from "@/lib/rateLimit";
import type { AgentStats, TeamStats } from "@/types/ia";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "IA no configurada" }, { status: 503 });
  }

  const rl = await rateLimitAsync({ key: `ia:coach:${session.user.id}`, limit: 5, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiadas consultas. Espera un momento." }, { status: 429 });
  }

  const body = await req.json() as { question?: string; agentStats: AgentStats; teamStats: TeamStats; overdueCount: number };
  const { question, agentStats, teamStats, overdueCount } = body;

  const { Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const statsContext = `
DATOS DEL AGENTE (${agentStats.agentName}, @${agentStats.agentNick}):
- Propuestas totales: ${agentStats.total}
- Propuestas cerradas: ${agentStats.closed}
- Tasa de cierre: ${agentStats.closeRate}%
- Pipeline activo (valor): ${agentStats.pipeline.toLocaleString("es-ES")}€
- Mes anterior: ${agentStats.prevClosed} cerradas, ${agentStats.prevPipeline.toLocaleString("es-ES")}€ pipeline
- Objetivo mensual: ${agentStats.monthlyTarget ? agentStats.monthlyTarget.toLocaleString("es-ES") + "€" : "No definido"}
- Facturado este mes: ${agentStats.monthClosedAmount.toLocaleString("es-ES")}€
- Tasa de comisión: ${agentStats.commissionRate !== null ? agentStats.commissionRate + "%" : "No configurada"}
- Posición en el ranking del equipo: #${agentStats.rankingPosition} de ${teamStats.totalAgents}
- Seguimientos vencidos: ${overdueCount}

MEDIA DEL EQUIPO:
- Tasa de cierre media: ${teamStats.avgCloseRate}%
- Pipeline medio por agente: ${teamStats.avgPipeline.toLocaleString("es-ES")}€
`.trim();

  const systemPrompt = `Eres "Coach IA", un coach especialista en rendimiento comercial para agentes que venden servicios web y digitales.

Hablas en español, en primera persona, con tono motivador y directo.
Tienes acceso a los datos reales del agente para este periodo.

Tu misión: analizar los datos y dar entre 3 y 5 consejos específicos y accionables, comparando el rendimiento del agente con la media del equipo.
- Si hay pregunta explícita, respóndela en el contexto de los datos.
- Si no hay pregunta, da un análisis proactivo: puntos fuertes, áreas de mejora y próximas acciones concretas.
- Usa markdown con secciones claras (## título, listas con -).
- Sé honesto pero constructivo. Máximo 400 palabras salvo que se pida más.
- No inventes datos que no estén en el contexto proporcionado.`;

  const userMessage = question
    ? `${statsContext}\n\nPregunta del agente: ${question}`
    : `${statsContext}\n\nDame un análisis completo de mi rendimiento y consejos para mejorar.`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = response.content.find((c) => c.type === "text")?.text ?? "";
  return NextResponse.json({ text });
}
