import Anthropic from '@anthropic-ai/sdk';
import config from '../config.js';
import { evaluate as nexusEvaluate } from './nexus/pipeline-trigger.js';

const client = new Anthropic({ apiKey: config.anthropicApiKey });

const VIDEO_SYSTEM = 'Eres un scout de contenido para un creador de YouTube del nicho IA. Tu misión: detectar qué herramientas/lanzamientos/novedades aparecen en vídeos de otros canales para que tu creador grabe SU vídeo el primero. Siempre prioriza la velocidad sobre la profundidad. Responde SOLO en JSON válido.';
const NEWS_SYSTEM = 'Eres un scout de lanzamientos de IA para un creador de YouTube que quiere ser el primero en enseñar herramientas nuevas. Tu misión: identificar si esto es un LANZAMIENTO NUEVO (herramienta, modelo, feature) y dar al creador el título de vídeo listo para grabar HOY. Responde SOLO en JSON válido.';

export async function summarizeVideo(title, transcript) {
  const hasTranscript = transcript && transcript.length > 100;
  const prompt = hasTranscript
    ? `Título: "${title}"\nTranscripción:\n${transcript}\n\nAnaliza si esto cubre una herramienta/lanzamiento nuevo que tu creador deba grabar. Responde en JSON:\n{\n  "es_lanzamiento": true/false,\n  "herramienta_protagonista": "nombre exacto de la herramienta/modelo/feature nuevo (o null si es contenido general)",\n  "resumen_ejecutivo": "2-3 frases de qué es y qué hace nuevo",\n  "puntos_clave": ["punto 1","punto 2","punto 3","punto 4","punto 5"],\n  "herramientas_mencionadas": ["tool1"],\n  "angulo_primer_video": "El ángulo EXACTO que debe tomar tu creador para ser el primero (demo práctica, comparativa, caso de uso real…)",\n  "titulo_video_sugerido": "Título listo para publicar en YouTube que genere CTR en el nicho IA",\n  "urgencia": "🔴 Urgente (grabar hoy) / 🟡 Media (esta semana) / 🟢 Baja (evergreen)"\n}`
    : `Título: "${title}"\nSin transcripción. Estima en JSON:\n{\n  "es_lanzamiento": true/false,\n  "herramienta_protagonista": null,\n  "resumen_ejecutivo": "Estimación basada en el título",\n  "puntos_clave": ["estimado 1","estimado 2","estimado 3"],\n  "herramientas_mencionadas": [],\n  "angulo_primer_video": "Ver el vídeo completo primero",\n  "titulo_video_sugerido": "",\n  "urgencia": "🟢 Baja"\n}`;

  const analysis = await callClaude(VIDEO_SYSTEM, prompt, 1024);
  await nexusEvaluate(analysis, 'youtube').catch(err =>
    console.warn('[nexus] evaluate(youtube) error:', err.message),
  );
  return analysis;
}

export async function summarizeNewsItem(source, title, summary) {
  const prompt = `Fuente: ${source}\nTítulo: "${title}"\nDescripción: ${summary}\n\nDetermina si esto es un LANZAMIENTO nuevo de herramienta/modelo/feature de IA. Responde en JSON:\n{\n  "es_lanzamiento": true/false,\n  "que_han_lanzado": "Nombre exacto + 1 frase de qué hace (o null si no es lanzamiento)",\n  "por_que_importa": "Por qué es relevante para el nicho de creadores IA",\n  "angulo_primer_video": "El ángulo exacto que debes tomar para ser el primero en YouTube",\n  "titulo_video_sugerido": "Título listo para grabar HOY si aplica",\n  "urgencia": "🔴 Urgente (grabar en <24h) / 🟡 Media (esta semana) / 🟢 Baja"\n}`;

  const analysis = await callClaude(NEWS_SYSTEM, prompt, 512);
  await nexusEvaluate(analysis, 'rss').catch(err =>
    console.warn('[nexus] evaluate(rss) error:', err.message),
  );
  return analysis;
}

async function callClaude(systemText, userPrompt, maxTokens) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    system: [{ type: 'text', text: systemText, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userPrompt }],
  });
  const text = message.content[0]?.type === 'text' ? message.content[0].text : '{}';
  const match = text.match(/\{[\s\S]*\}/);
  try { return match ? JSON.parse(match[0]) : {}; }
  catch { return {}; }
}
