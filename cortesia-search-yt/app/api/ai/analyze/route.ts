import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const AI_NICHE_CONTEXT = "Contexto: nicho de IA y tecnología en YouTube (Matt Wolfe, Fireship, Nate Herk, AI Jason, Anthropic, n8n, Cursor AI, Greg Isenberg, Lex Fridman, Andrej Karpathy).";

function fmtK(n: number) { return n >= 1_000_000 ? (n/1_000_000).toFixed(1)+"M" : n >= 1_000 ? (n/1_000).toFixed(0)+"K" : String(n); }

export async function POST(req: NextRequest) {
  const { type, data } = await req.json();

  let prompt = "";
  let maxTokens = 1024;

  if (type === "videos") {
    const videos = data as Array<{
      title: string;
      viewCount: number;
      likeCount: number;
      viralScore: number;
      engagementRate: number;
      tags: string[];
    }>;
    prompt = `Eres un experto en estrategia de contenido de YouTube. Analiza estos ${videos.length} vídeos virales y extrae patrones accionables.

DATOS DE VÍDEOS:
${videos.slice(0, 10).map((v, i) => `${i+1}. "${v.title}" — ${fmtK(v.viewCount)} views, score viral: ${v.viralScore}, engagement: ${v.engagementRate}%`).join("\n")}

Responde en formato JSON con esta estructura exacta:
{
  "patron_titulos": "Qué tienen en común los títulos que más funcionan (fórmulas, palabras, estructura)",
  "patron_contenido": "Qué tipo de contenido domina y por qué atrae en el nicho IA/tech",
  "oportunidad": "El ángulo o subnicho específico que tiene menos competencia pero alta demanda en IA",
  "idea_video": "Una idea concreta de vídeo lista para producir, con título incluido",
  "hook_sugerido": "Un gancho de apertura de 15 segundos para el vídeo sugerido",
  "tags_recomendados": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Solo el JSON, sin texto adicional.`;

  } else if (type === "channels") {
    const channels = data as Array<{
      title: string;
      subscriberCount: number;
      avgViewsPerVideo: number;
      growthScore: number;
      nicheScore: number;
      description: string;
    }>;
    prompt = `Eres un analista de nichos de YouTube especializado en IA/tech. Analiza estos canales y detecta oportunidades de nicho.

CANALES:
${channels.slice(0, 10).map((c, i) => `${i+1}. "${c.title}" — ${fmtK(c.subscriberCount)} subs, ${fmtK(c.avgViewsPerVideo)} views/video, score crecimiento: ${c.growthScore}`).join("\n")}

Responde en JSON:
{
  "nicho_detectado": "El subnicho específico de IA/tech que domina estos canales",
  "nivel_saturacion": "Alto/Medio/Bajo — con explicación de 1 línea",
  "oportunidad_entrada": "Cómo entrar a este nicho de IA con ventaja competitiva",
  "subnicho_sin_explotar": "Un subnicho de IA relacionado con menos competencia",
  "estrategia_crecimiento": "3 acciones concretas para crecer rápido en este nicho de IA"
}

Solo el JSON.`;

  } else if (type === "keyword") {
    const { keyword, suggestions } = data as { keyword: string; suggestions: string[] };
    prompt = `Eres un especialista en SEO de YouTube para el nicho de IA y tecnología. Analiza la keyword principal y sus sugerencias.

KEYWORD PRINCIPAL: "${keyword}"
SUGERENCIAS RELACIONADAS: ${suggestions.slice(0, 20).join(", ")}

Responde en JSON:
{
  "intension_busqueda": "Qué está buscando realmente el usuario — informacional/comercial/navegacional",
  "dificultad_estimada": "Alta/Media/Baja con justificación en el contexto del nicho IA/tech",
  "mejor_keyword": "La keyword de esta lista con mejor ratio volumen/competencia en IA",
  "keywords_long_tail": ["keyword larga 1", "keyword larga 2", "keyword larga 3"],
  "tipo_video_ideal": "El formato de vídeo que mejor posiciona para estas keywords en el nicho IA",
  "titulo_optimizado": "Un título de vídeo listo para usar, optimizado para SEO y CTR en el nicho IA/tech"
}

Solo el JSON.`;

  } else if (type === "serp") {
    // SERP competition analysis for a keyword
    const { keyword, videos, avgCoeff, avgSubs, smallCount } = data as {
      keyword: string;
      videos: Array<{ title: string; channelTitle: string; channelSubscribers: number; viewCount: number; viralCoefficient: number }>;
      avgCoeff: number;
      avgSubs: number;
      smallCount: number;
    };
    prompt = `Eres un estratega de YouTube especializado en el nicho de IA y tecnología (Matt Wolfe, Fireship, Nate Herk, AI Jason, n8n, Cursor AI, Anthropic, Greg Isenberg).

El usuario quiere saber si puede competir con esta keyword: "${keyword}"

RESULTADOS ACTUALES DEL SERP (Top ${videos.length}):
${videos.map((v, i) => `${i+1}. "${v.title}" — Canal: ${v.channelTitle} (${fmtK(v.channelSubscribers)} subs) · ${fmtK(v.viewCount)} views · Coef. viral: ${v.viralCoefficient}x`).join("\n")}

MÉTRICAS AGREGADAS:
- Coeficiente viral promedio del top: ${avgCoeff}x
- Tamaño promedio del canal: ${fmtK(avgSubs)} subs
- Canales pequeños (<50K) en el top: ${smallCount}/${videos.length}

Responde SOLO en JSON:
{
  "veredicto": "SÍ / QUIZÁS / NO — con una frase directa sobre si puede competir en el nicho IA",
  "razon_principal": "El argumento más importante (una frase)",
  "angulo_diferenciador": "El ángulo específico que le daría ventaja — algo que nadie en el top está haciendo bien",
  "titulo_sugerido": "Un título listo para producir que entra por ese ángulo diferenciador",
  "mejor_momento": "¿Cuándo publicar? ¿Hay alguna ventana de oportunidad en el nicho IA?",
  "advertencia": "El principal riesgo o dificultad a tener en cuenta"
}`;

  } else if (type === "ideas") {
    // Content ideas from selected viral videos
    const videos = data as Array<{
      title: string;
      viewCount: number;
      viralCoefficient: number;
      engagementRate: number;
      channelTitle?: string;
    }>;
    maxTokens = 2048;
    prompt = `Eres un estratega de contenido especializado EXCLUSIVAMENTE en el nicho de IA y tecnología en YouTube (Matt Wolfe, Fireship, Nate Herk, AI Jason, Anthropic, n8n, Cursor AI, Greg Isenberg, Lex Fridman).

El usuario ha seleccionado estos ${videos.length} vídeos virales como referencia de qué está funcionando:
${videos.map((v, i) => `${i+1}. "${v.title}" — ${fmtK(v.viewCount)} views, coef. viral: ${v.viralCoefficient}x, engagement: ${v.engagementRate}%`).join("\n")}

Basándote en estos patrones virales, genera 8 ideas de vídeo CONCRETAS y LISTAS PARA PRODUCIR para el nicho de IA/tech.
Reglas:
- Cada idea debe ser diferente en ángulo y formato
- Favorece ángulos que NO están ya en los vídeos de referencia
- Los títulos deben estar listos para publicar en YouTube
- Los hooks deben ser exactamente lo que el creador diría en los primeros 15 segundos

Responde SOLO en JSON:
{
  "ideas": [
    {
      "titulo": "Título exacto listo para publicar en YouTube",
      "hook": "Frase de apertura de 15 segundos que engancha (di exactamente qué decir al espectador)",
      "angulo_diferenciador": "Qué lo hace diferente a los vídeos de referencia y al contenido existente",
      "formato_recomendado": "Tutorial paso a paso / Lista top N / Historia de caso real / Comparativa / Review / Experimento / etc.",
      "razon_viral": "Por qué este ángulo tiene potencial de superar a los vídeos de referencia"
    }
  ]
}`;

  } else if (type === "title") {
    // A/B title optimizer
    const { title } = data as { title: string };
    prompt = `Eres un experto en optimización de títulos de YouTube para el nicho de IA y tecnología (canales como Matt Wolfe, Fireship, Nate Herk, AI Jason, Cursor AI, n8n).

Título original del usuario: "${title}"

Genera 5 variaciones A/B del título, optimizadas para CTR máximo en el nicho de IA/tech.
Ordénalas de mayor a menor CTR estimado (la primera = la mejor).

Para cada variación considera: curiosity gap, números específicos, emociones (FOMO, sorpresa, beneficio claro), tendencias de títulos virales actuales en IA/tech, y palabras clave que busca la audiencia tech.

Responde SOLO en JSON:
{
  "variaciones": [
    {
      "titulo": "El título A/B listo para publicar",
      "ctr_improvement_estimate": "+20% CTR estimado vs original",
      "reason": "Por qué funciona mejor que el original",
      "psychological_trigger": "Curiosidad / Urgencia / Beneficio claro / Sorpresa / Autoridad / FOMO"
    }
  ]
}`;

  } else {
    return NextResponse.json({ error: "Tipo no válido. Usa: videos, channels, keyword, serp, ideas, title" }, { status: 400 });
  }

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system: [
        {
          type: "text",
          text: AI_NICHE_CONTEXT,
          cache_control: { type: "ephemeral" },
        } as any,
      ],
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: text };

    return NextResponse.json({ analysis: parsed });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error en análisis IA: " + String(e) }, { status: 500 });
  }
}
