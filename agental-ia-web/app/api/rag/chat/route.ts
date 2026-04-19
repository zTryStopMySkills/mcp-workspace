import Groq from "groq-sdk";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { searchRag } from "@/lib/rag";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

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

    const groqMessages = [
      { role: "system" as const, content: `${SYSTEM}\n\n<context>\n${context}\n</context>` },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2048,
      messages: groqMessages,
      stream: true,
    });

    const readable = new ReadableStream({
      async start(controller) {
        const enc = new TextEncoder();
        if (chunks.length) {
          controller.enqueue(
            enc.encode(
              `data: ${JSON.stringify({ type: "sources", sources: chunks.map((c) => ({ source: c.source, section: c.section, similarity: c.similarity })) })}\n\n`
            )
          );
        }
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) {
            controller.enqueue(enc.encode(`data: ${JSON.stringify({ type: "text", text })}\n\n`));
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
