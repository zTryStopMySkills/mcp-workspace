import Anthropic from "@anthropic-ai/sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { searchRag } from "@/lib/rag";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const SYSTEM = `Eres el asistente interno de CortesIA Corporation. Tienes acceso a la documentación completa del ecosistema: Cockpit, Bot AI Intel, Nexus Hub, Academy y SonarForge.

Responde siempre en español. Sé concreto y directo. Cuando cites información específica, menciona de qué fuente proviene entre paréntesis. Si no encuentras la respuesta en el contexto, dilo claramente en lugar de inventar.

Equipo: Diego (Divulgador, cara del canal), Joselito (Research/Dev/YouTube), Enaitz (Editor).`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response("No autenticado", { status: 401 });

    const { messages, limit = 6 } = await req.json();
    const lastUser = [...messages].reverse().find((m: { role: string }) => m.role === "user");
    if (!lastUser) return new Response("Sin mensaje", { status: 400 });

    const chunks = await searchRag(lastUser.content, limit, 0.5);
    const context = chunks.length
      ? chunks.map((c, i) => `[Fuente ${i + 1}: ${c.source}${c.section ? ` › ${c.section}` : ""}]\n${c.content}`).join("\n\n---\n\n")
      : "No se encontró contexto relevante en la base de conocimiento.";

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: [
        { type: "text", text: `${SYSTEM}\n\n<context>\n${context}\n</context>`, cache_control: { type: "ephemeral" } },
      ],
      messages: messages.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
    });

    const readable = new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder();
        if (chunks.length) {
          controller.enqueue(enc.encode(`data: ${JSON.stringify({ type: "sources", sources: chunks.map((c) => ({ source: c.source, section: c.section, similarity: c.similarity })) })}\n\n`));
        }
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(enc.encode(`data: ${JSON.stringify({ type: "text", text: event.delta.text })}\n\n`));
          }
        }
        controller.enqueue(enc.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error interno";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
