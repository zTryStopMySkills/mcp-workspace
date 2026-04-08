import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimitAsync } from "@/lib/rateLimit";
import { supabaseAdmin } from "@/lib/supabase";
import type { PipelineAnalysisResponse } from "@/types/ia";
import type { Quotation } from "@/types";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "IA no configurada" }, { status: 503 });
  }

  const rl = await rateLimitAsync({ key: `ia:pipeline:${session.user.id}`, limit: 3, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiadas consultas. Espera un momento." }, { status: 429 });
  }

  const { data: rawQuotations } = await supabaseAdmin
    .from("quotations")
    .select("*")
    .eq("agent_id", session.user.id)
    .not("status", "in", '("closed","lost")')
    .order("created_at", { ascending: false });

  const openQuotations = (rawQuotations ?? []) as Quotation[];

  if (openQuotations.length === 0) {
    return NextResponse.json({
      quotations: [],
      summary: "No tienes propuestas abiertas en este momento. ¡Es el momento de generar nuevas oportunidades!",
    } satisfies PipelineAnalysisResponse);
  }

  // Historical close rate by sector
  const { data: closedQuotations } = await supabaseAdmin
    .from("quotations")
    .select("client_sector, status")
    .eq("agent_id", session.user.id)
    .eq("status", "closed");

  const sectorCloseRates: Record<string, number> = {};
  const sectorCounts: Record<string, { closed: number; total: number }> = {};
  for (const q of closedQuotations ?? []) {
    const s = q.client_sector ?? "Sin sector";
    if (!sectorCounts[s]) sectorCounts[s] = { closed: 0, total: 0 };
    sectorCounts[s].total += 1;
    if (q.status === "closed") sectorCounts[s].closed += 1;
  }
  for (const [sector, counts] of Object.entries(sectorCounts)) {
    sectorCloseRates[sector] = Math.round((counts.closed / counts.total) * 100);
  }

  const quotationsList = openQuotations.map((q) => {
    const daysInStatus = Math.floor(
      (Date.now() - new Date(q.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysOld = Math.floor(
      (Date.now() - new Date(q.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    const isOverdue =
      q.follow_up_date &&
      new Date(q.follow_up_date) < new Date();
    const sectorRate = sectorCloseRates[q.client_sector ?? "Sin sector"] ?? null;

    return {
      id: q.id,
      client_name: q.client_name,
      sector: q.client_sector ?? "Sin sector",
      status: q.status,
      total_once: q.total_once,
      days_in_current_status: daysInStatus,
      days_since_created: daysOld,
      has_notes: !!(q.notes && q.notes.trim().length > 0),
      has_follow_up: !!q.follow_up_date,
      is_overdue: !!isOverdue,
      sector_close_rate: sectorRate,
    };
  });

  const systemPrompt = `Eres un analista experto en pipelines de ventas B2B para agencias web.
Analiza las propuestas abiertas y devuelve ÚNICAMENTE un JSON válido sin ningún texto adicional, sin bloques de código markdown.
El JSON debe tener exactamente este formato:
{
  "quotations": [
    {
      "id": "...",
      "client_name": "...",
      "score": <número 1-10>,
      "reason": "...",
      "recommended_action": "..."
    }
  ],
  "summary": "..."
}

Criterios de scoring (1-10):
- Alta puntuación (8-10): cliente activo recientemente, notas detalladas, seguimiento al día, sector con buena tasa histórica, valor alto
- Media (5-7): sin señales fuertes en ningún sentido
- Baja (1-4): inactivo muchos días, sin notas, seguimiento vencido, sin seguimiento configurado

Para "reason": explica en 1-2 frases por qué esa puntuación.
Para "recommended_action": una acción concreta y específica (no genérica).
Para "summary": análisis general del pipeline en 3-4 frases: salud general, principales cuellos de botella, 2 recomendaciones tácticas.
Responde SOLO con el JSON. Nada más.`;

  const userMessage = `Analiza este pipeline de ${openQuotations.length} propuestas abiertas:

${JSON.stringify(quotationsList, null, 2)}

Tasa de cierre histórica por sector:
${JSON.stringify(sectorCloseRates, null, 2)}`;

  const Groq = (await import("groq-sdk")).default;
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: 2048,
  });

  const rawText = response.choices[0]?.message?.content ?? "{}";

  try {
    const parsed = JSON.parse(rawText) as PipelineAnalysisResponse;
    return NextResponse.json(parsed);
  } catch {
    // Gemini sometimes wraps JSON in code blocks despite instructions — strip them
    const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    try {
      const parsed = JSON.parse(cleaned) as PipelineAnalysisResponse;
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json(
        { error: "Error procesando el análisis. Inténtalo de nuevo." },
        { status: 500 }
      );
    }
  }
}
