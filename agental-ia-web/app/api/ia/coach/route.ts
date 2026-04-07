import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimitAsync } from "@/lib/rateLimit";
import { assembleAgentContext } from "@/lib/ia/assembleContext";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "IA no configurada" }, { status: 503 });
    }

    const rl = await rateLimitAsync({ key: `ia:coach:${session.user.id}`, limit: 5, windowSec: 60 });
    if (!rl.allowed) {
      return NextResponse.json({ error: "Demasiadas consultas. Espera un momento." }, { status: 429 });
    }

    const body = await req.json().catch(() => ({})) as { question?: string };
    const question = body.question ?? undefined;

    // Fetch data server-side — never rely on client-sent stats
    const context = await assembleAgentContext(
      session.user.id,
      session.user.name,
      session.user.nick
    );
    const { agentStats, teamStats, overdueFollowUps } = context;
    const overdueCount = overdueFollowUps.length;

    const fmt = (n: number) => n.toLocaleString("es-ES");

    const statsContext = `
DATOS DEL AGENTE (${agentStats.agentName}, @${agentStats.agentNick}):
- Propuestas totales: ${agentStats.total}
- Propuestas cerradas: ${agentStats.closed}
- Tasa de cierre: ${agentStats.closeRate}%
- Pipeline activo: ${fmt(agentStats.pipeline)}€
- Mes anterior: ${agentStats.prevClosed} cerradas, ${fmt(agentStats.prevPipeline)}€ pipeline
- Objetivo mensual: ${agentStats.monthlyTarget ? fmt(agentStats.monthlyTarget) + "€" : "No definido"}
- Facturado este mes: ${fmt(agentStats.monthClosedAmount)}€
- Comisión: ${agentStats.commissionRate !== null ? agentStats.commissionRate + "%" : "No configurada"}
- Posición ranking: #${agentStats.rankingPosition} de ${teamStats.totalAgents}
- Seguimientos vencidos: ${overdueCount}

MEDIA DEL EQUIPO:
- Tasa de cierre media: ${teamStats.avgCloseRate}%
- Pipeline medio: ${fmt(teamStats.avgPipeline)}€
`.trim();

    const systemPrompt = `Eres "Coach IA", especialista en rendimiento comercial para agentes que venden servicios web.
Hablas en español, tono motivador y directo.
Analiza los datos y da 3-5 consejos específicos y accionables comparando al agente con la media del equipo.
Si hay pregunta, respóndela en contexto de los datos.
Usa markdown con secciones (## título, listas con -). Máximo 400 palabras.`;

    const userMessage = question
      ? `${statsContext}\n\nPregunta: ${question}`
      : `${statsContext}\n\nDame un análisis de mi rendimiento y consejos para mejorar.`;

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
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[ia/coach] error:", msg);
    // Créditos insuficientes
    if (msg.includes("credit balance")) {
      return NextResponse.json({ error: "Créditos de IA agotados. Contacta con el administrador." }, { status: 503 });
    }
    return NextResponse.json({ error: "Error interno. Inténtalo de nuevo." }, { status: 500 });
  }
}
