/**
 * seed-content.mjs
 * Crea el agente Alejandro + sube 3 documentos al portal Agental.IA
 * Uso: node scripts/seed-content.mjs
 */

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Leer .env.local con soporte para valores multi-línea (formato Vercel CLI)
function parseEnvFile(content) {
  const result = {};
  // Soporta: KEY=value, KEY="value", KEY='value', KEY="multi\nline"
  const re = /^([A-Za-z_][A-Za-z0-9_]*)=(["']?)([\s\S]*?)\2\s*$/gm;
  let m;
  while ((m = re.exec(content)) !== null) {
    result[m[1]] = m[3];
  }
  return result;
}

const envPath = join(__dirname, "../.env.local");
let fileEnv = {};
try {
  fileEnv = parseEnvFile(readFileSync(envPath, "utf-8"));
} catch {
  // .env.local no encontrado — usamos solo process.env
}

// process.env tiene prioridad (permite pasar vars por CLI)
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || fileEnv.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const SERVICE_KEY  = (process.env.SUPABASE_SERVICE_ROLE_KEY  || fileEnv.SUPABASE_SERVICE_ROLE_KEY  || "").trim();

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

console.log("  URL:", SUPABASE_URL.substring(0, 40) + "...");
console.log("  KEY:", SERVICE_KEY.substring(0, 20) + "...");

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

/* ──────────────────────────────────────────
   PASO 1: Crear agente Alejandro
   ────────────────────────────────────────── */

console.log("\n🤖 Creando agente Alejandro...");

const PASSWORD = "4RÑ9%.1ñja!";
const hash = await bcrypt.hash(PASSWORD, 12);

const { data: existing } = await supabase
  .from("agents")
  .select("id, nick")
  .eq("nick", "alejandro")
  .maybeSingle();

if (existing) {
  console.log(`⚠️  El agente @alejandro ya existe (id: ${existing.id}). Saltando creación.`);
} else {
  const { data: agent, error } = await supabase
    .from("agents")
    .insert({
      nick: "alejandro",
      name: "Alejandro",
      password_hash: hash,
      role: "agent",
      is_active: true,
    })
    .select("id, nick, name, role")
    .single();

  if (error) {
    console.error("❌ Error al crear Alejandro:", error.message);
    process.exit(1);
  }
  console.log(`✓ Agente creado: @${agent.nick} (${agent.name}) — id: ${agent.id}`);
}

/* ──────────────────────────────────────────
   PASO 2: Obtener admin para createdBy
   ────────────────────────────────────────── */

const { data: admin } = await supabase
  .from("agents")
  .select("id")
  .eq("role", "admin")
  .limit(1)
  .maybeSingle();

const createdBy = admin?.id ?? null;

/* ──────────────────────────────────────────
   PASO 3: Subir documentos
   ────────────────────────────────────────── */

const docs = [
  {
    key: "agental-madre-v1.txt",
    title: "📋 Documento Madre — Agental.IA v1.0",
    description: "Base completa del proyecto Agental.IA: qué somos, qué hacemos, stack tecnológico, portfolio, precios y visión de futuro. El documento de referencia para todos los agentes.",
    content: `DOCUMENTO MADRE — AGENTAL.IA v1.0
Fecha: Abril 2026
Versión: 1.0 (Base fundacional)
═══════════════════════════════════════════════════════════

1. ¿QUÉ ES AGENTAL.IA?
───────────────────────
Agental.IA es una agencia de desarrollo web especializada en negocios locales,
con base en Sevilla (España). Creamos webs completas de nivel premium para
restaurantes, bares, tiendas, estudios y servicios, con un tiempo de entrega
de 1-5 días laborables frente a los 1-3 meses de las agencias tradicionales.

Nuestro modelo: diseño basado en DNA de marca + tecnología de vanguardia +
panel de administración editable + soporte local cercano.

2. MISIÓN
──────────
Democratizar el acceso a webs de calidad para los negocios locales españoles,
ofreciendo el nivel de diseño y tecnología de grandes agencias internacionales
a precios accesibles para el mercado de pymes y autónomos.

3. VISIÓN
──────────
Ser la referencia en webs para negocios locales en el área metropolitana de
Sevilla para 2027, con más de 100 clientes activos y un equipo de agentes
comerciales cubriendo los principales municipios del Aljarafe y Sevilla capital.

4. PROPUESTA DE VALOR
──────────────────────
- Velocidad: 1-5 días vs 1-3 meses de la competencia
- Precio: 600-1.500€ vs 3.000-15.000€ de agencias tradicionales
- Calidad: diseño premium basado en arquetipos de marca
- Admin: panel editable sin programar (Supabase tiempo real)
- SEO: base técnica perfecta desde el primer día (PageSpeed 85-100)
- Soporte: local, en español, accesible por WhatsApp

5. STACK TECNOLÓGICO
─────────────────────
Frontend:
  - Next.js 15-16 (React framework, App Router)
  - TypeScript (tipado estático)
  - Tailwind CSS v4 (diseño utility-first)
  - Framer Motion (animaciones premium)

Backend & Datos:
  - Supabase (PostgreSQL en la nube + Realtime + Storage)
  - NextAuth.js v4 (autenticación)
  - bcryptjs (hash de contraseñas)

Infraestructura:
  - Vercel (hosting, CDN global, SSL automático)
  - Supabase (base de datos y almacenamiento)

Herramientas de desarrollo:
  - Claude AI (asistente de desarrollo IA)
  - yt-dlp (descarga de media de Instagram/YouTube)
  - Agente web-business-builder (pipeline propio de 9 fases)

6. PORTFOLIO (ABRIL 2026)
──────────────────────────
Webs en producción:

HOSTELERÍA:
  ✓ Bar Ryky — Bar tapas, Castilleja de la Cuesta
    URL: bar-ryky-web.vercel.app | Precio: Plan Estándar
  ✓ Chantarela — Parrilla mediterránea, Mairena del Aljarafe
    URL: chantarela-web.vercel.app | 9.6/10 Google (339 reseñas)
  ✓ Bodega Mairena — Asador/Josper, Mairena del Aljarafe
    URL: bodega-mairena-web.vercel.app
  ✓ El Rincón de Salteras — Carnes a la brasa, Salteras
    URL: rincon-salteras.vercel.app | 4.4★ Google (736 reseñas) | 1.200€
  ✓ Dichoso — Tapas y arroces
    URL: dichoso-web.vercel.app
  ✓ Taberna Alambique — Taberna tradicional
  ✓ Bar La Espuela — Bar local
  ✓ Las Palmeras — Negocio local
  ✓ El Rinconcito Pirata — Bar temático
  ✓ Bonnet Cocktail Bar — Coctelería premium
  ✓ Bodega Zampuzo — Bodega local
  ○ Bodega Aljarafe — En desarrollo (2026-04)

OTROS SECTORES:
  ✓ Shisha Vaper Sevilla — Tienda shishas/vapers premium
    URL: shisha-vaper-web.vercel.app | Deploy: 02/04/2026
  ✓ La Dama — Peluquería canina
  ✓ Twin Bros Tattoo Studio — Estudio tatuaje/piercing, Tomares

PROYECTOS ESPECIALES:
  ✓ Comandalia — SaaS restaurante buffet (sistema completo)
  ✓ Pixel Agents — Extensión VS Code con agentes Claude animados
  ✓ HackQuest — Juego educativo ciberseguridad
  ✓ Dungeon & Dynasty — Idle RPG browser game

7. PLANES Y TARIFAS
────────────────────
Plan Básico           600€ dev | 30€/mes
Plan Estándar         900€ dev | 50€/mes
Plan Premium        1.200€ dev | 80€/mes (ref: El Rincón de Salteras)
Plan SaaS          2.500€+ dev | 150€+/mes (ref: Comandalia)

Formas de pago: 50% inicio + 50% entrega
Dominio: 10-15€/año (gestión incluida)
Hosting Vercel: incluido (plan gratuito para mayoría de clientes)

8. HERRAMIENTAS INTERNAS
─────────────────────────
Portal Agental.IA (este portal):
  - Chat comunitario entre agentes (Supabase Realtime)
  - Biblioteca de documentos compartidos
  - Curso comercial interactivo
  - Panel admin para gestionar agentes y documentos
  URL: agental-ia-web.vercel.app

9. EQUIPO (ABRIL 2026)
───────────────────────
- Joselito — Fundador / Admin principal
- Alejandro — Agente comercial

10. HOJA DE RUTA
─────────────────
Q2 2026:
  - Bodega Aljarafe (en desarrollo)
  - Ampliar equipo comercial
  - Establecer proceso de referidos (comisión por cliente referido)

Q3 2026:
  - 30+ clientes activos
  - Servicio de Google Ads / Meta Ads como upsell
  - Plantillas de sector reutilizables (reducir tiempo de dev a <24h)

Q4 2026:
  - 50+ clientes activos
  - Herramienta de onboarding automatizado para nuevos clientes
  - Dashboard de métricas para clientes (visitas, posicionamiento)

═══════════════════════════════════════════════════════════
Documento mantenido por el equipo de Agental.IA
Última actualización: Abril 2026
`
  },
  {
    key: "posicionamiento-google-guia.txt",
    title: "🔍 Guía de Posicionamiento en Google",
    description: "Manual completo de SEO local para vender y gestionar el posicionamiento de nuestras webs. Incluye Google Business Profile, Core Web Vitals, schema markup y estrategia de reseñas.",
    content: `GUÍA DE POSICIONAMIENTO EN GOOGLE — AGENTAL.IA
Para uso interno de agentes comerciales
Versión 1.0 | Abril 2026
═══════════════════════════════════════════════════════════

ÍNDICE
1. Por qué el SEO local importa
2. Los 3 factores clave del posicionamiento local
3. Google Business Profile — Guía completa
4. SEO técnico on-page (lo que hacemos en todas nuestras webs)
5. Core Web Vitals — Rendimiento web
6. Estrategia de reseñas
7. Lo que NO hacemos
8. Argumentario de venta SEO
9. Servicios adicionales de posicionamiento

═══════════════════════════════════════════════════════════

1. POR QUÉ EL SEO LOCAL IMPORTA
────────────────────────────────
Datos clave que debes memorizar:

• 46% de las búsquedas en Google tienen intención local
• 78% de búsquedas locales en móvil terminan en compra offline ese día
• 97% de los usuarios buscan negocios locales en internet
• El 60%+ de las pymes españolas no tienen web o tienen una obsoleta

Cuando alguien busca "restaurante mairena del aljarafe" o "bar de tapas cerca",
Google muestra 3 resultados en el mapa (Google Local Pack) + resultados orgánicos.
Los negocios sin web o con web mala prácticamente no existen para el 40-50%
de sus clientes potenciales.

2. LOS 3 FACTORES CLAVE DEL POSICIONAMIENTO LOCAL
───────────────────────────────────────────────────
Google rankea los negocios locales según 3 factores principales:

A) RELEVANCIA — ¿Eres lo que busca el usuario?
   Determinado por: el contenido de tu web, las palabras clave que usas,
   el schema markup que tienes, la descripción en GBP.

B) DISTANCIA — ¿Estás cerca del usuario?
   Google usa la ubicación GPS del móvil. No puedes controlarlo,
   pero sí optimizar tu ficha para el área correcta.

C) PROMINENCIA — ¿Eres conocido y fiable?
   Determinado por: número y calidad de reseñas, menciones en webs externas,
   antigüedad de la ficha GBP, calidad y velocidad de tu web.

Nuestra web actúa principalmente sobre RELEVANCIA y PROMINENCIA.

3. GOOGLE BUSINESS PROFILE (GBP)
──────────────────────────────────
El GBP (antes Google My Business) es la ficha gratuita que aparece en Google Maps
y en las búsquedas locales. Es INDEPENDIENTE de la web pero complementaria.

PARA RECLAMAR UNA FICHA (si el negocio no la tiene):
1. Ir a business.google.com
2. Buscar el nombre del negocio
3. "Reclamar este negocio" o "Añadir mi negocio"
4. Verificar por carta postal o video (Google elige el método)
5. Tiempo de verificación: 1-14 días

OPTIMIZACIÓN DEL GBP:
• Nombre: Exactamente el nombre del negocio (sin palabras clave extra)
• Categoría principal: Ser muy específico (ej: "Restaurante de carnes a la brasa")
• Categorías secundarias: Añadir 3-5 categorías relevantes
• Descripción: 750 caracteres. Incluir ciudad, tipo de cocina/servicio, diferencial
• Fotos: Mínimo 10-20 fotos de calidad (interior, exterior, platos, equipo)
• Horarios: Siempre actualizados, incluyendo festivos
• URL del sitio web: Enlace a nuestra web
• Número de teléfono: Verificado y activo
• Atributos: Marcar todos los que apliquen (terraza, parking, wifi, etc.)
• Productos/Servicios: Añadir los principales con foto y precio
• Posts: Publicar 1-2 veces por semana (ofertas, novedades, eventos)

PRECIO DEL SERVICIO GBP:
• Optimización inicial: 100€ única vez
• Gestión mensual GBP (posts + respuestas + fotos): 50€/mes adicionales

4. SEO TÉCNICO ON-PAGE
───────────────────────
Lo que incluimos en TODAS nuestras webs automáticamente:

META TAGS:
  <title>Nombre Negocio | Tipo de Negocio en Ciudad</title>
  <meta name="description" content="...150-160 caracteres con ciudad y tipo...">
  Ejemplo: "El Rincón de Salteras | Restaurante Carnes a la Brasa en Salteras, Sevilla"

OPEN GRAPH (redes sociales y WhatsApp):
  og:title, og:description, og:image (1200x630px), og:url
  Cuando alguien comparte la web por WhatsApp, se ve bonito automáticamente

SCHEMA MARKUP (JSON-LD):
  Código invisible para el usuario que le dice a Google exactamente qué es el negocio.
  Incluimos:
  - LocalBusiness (nombre, dirección, teléfono, horarios, coordenadas GPS)
  - Restaurant (para hostelería): includes menu, servesCuisine, priceRange
  - Store (para tiendas): includes product categories
  - GeoCoordinates: latitud y longitud exactas
  Resultado: el negocio aparece en Knowledge Panel de Google con toda la info

SITEMAP.XML:
  Archivo automático que le dice a Google qué páginas indexar y con qué frecuencia

ROBOTS.TXT:
  Controla qué partes de la web puede/no puede rastrear Google

HREFLANG:
  Para versiones en múltiples idiomas (incluimos versión española por defecto)

5. CORE WEB VITALS — RENDIMIENTO WEB
──────────────────────────────────────
Google usa estas métricas para rankear webs (factor de ranking oficial desde 2021):

LCP (Largest Contentful Paint) — Velocidad de carga
  ✓ Bueno: < 2.5 segundos
  ✓ Nuestras webs: ~1-1.5s en móvil
  ✗ Wix/WordPress típico: 3-6 segundos

FID/INP (Interactividad)
  ✓ Bueno: < 100ms
  ✓ Nuestras webs: <50ms (React optimizado)

CLS (Cumulative Layout Shift) — Estabilidad visual
  ✓ Bueno: < 0.1
  ✓ Nuestras webs: 0.0-0.05
  ✗ Webs con imágenes sin dimensiones definidas: >0.25

PUNTUACIONES PAGESPEED (Google's tool):
  Nuestras webs: 85-100 en móvil, 95-100 en escritorio
  Wix/WordPress medio: 40-65 en móvil

Esto se traduce en un mejor posicionamiento orgánico y menos abandonos
(el 53% de usuarios abandona si tarda más de 3 segundos).

6. ESTRATEGIA DE RESEÑAS
─────────────────────────
Las reseñas son el factor #1 de prominencia local. Estrategia para clientes:

OBJETIVO MÍNIMO: 50+ reseñas con media >4.2★
TOP COMPETITIVO: 200+ reseñas con media >4.4★

CÓMO CONSEGUIR RESEÑAS:
• QR en la mesa / mostrador que va directo a dejar reseña en Google
  (URL: https://g.page/r/XXXXXX/review — se encuentra en GBP → Obtener enlace)
• Mensaje WhatsApp post-visita: "¿Qué te pareció? Si te gustó, nos ayudaría mucho
  una reseña en Google: [enlace]"
• Cartel en el local con QR
• Recordatorio en el ticket/factura

RESPUESTA A RESEÑAS:
• Responder SIEMPRE, tanto positivas como negativas
• Positivas: agradecer + mencionar el nombre del plato/servicio que citaron
• Negativas: no defenderse, pedir disculpas, ofrecer solución privada
• Tiempo de respuesta: < 48 horas

SERVICIO DE GESTIÓN DE RESEÑAS:
• Incluido en mantenimiento Premium (80€/mes)
• Como servicio adicional para otros planes: 30€/mes extra

7. LO QUE NO HACEMOS
──────────────────────
Sé honesto con los clientes. NO ofrecemos:

✗ Garantía de posición #1 en Google (nadie puede garantizarlo honestamente)
✗ Resultados inmediatos (el SEO orgánico tarda 3-6 meses)
✗ Black-hat SEO (granjas de enlaces, keyword stuffing) — penaliza a largo plazo
✗ Google Ads management (podemos derivar a especialistas)
✗ Generación de reseñas falsas (va contra términos de Google y puede penalizar)

8. ARGUMENTARIO DE VENTA SEO
──────────────────────────────
Frases que funcionan:

"¿Sabes cuántas personas buscan '[tipo negocio] en [ciudad]' cada mes?
Con nuestra web, empiezas a capturar ese tráfico desde el día 1."

"Tu competidor de la calle de al lado tiene web desde hace 2 años y 300 reseñas.
Cada mes que pasa sin web, él captura más clientes que podrían ser tuyos."

"Una web de Wix tarda 5-6 segundos en cargar en móvil. Google penaliza eso.
La nuestra carga en 1.5 segundos. Esa diferencia se nota en el ranking."

"El SEO es como un empleado que trabaja 24/7 sin sueldo. La web atrae
clientes mientras tú duermes, estás de vacaciones o en el local."

9. SERVICIOS ADICIONALES DE POSICIONAMIENTO
─────────────────────────────────────────────
Estos servicios son oportunidades de upsell:

• Optimización GBP (una vez): 100€
• Gestión mensual GBP: 50€/mes adicionales
• Gestión de reseñas: 30€/mes
• Blog corporativo (2 artículos/mes): 200€/mes
• Informe SEO mensual: incluido en Plan Premium
• Auditoría SEO de web existente: 150€

═══════════════════════════════════════════════════════════
Documento de uso interno — Agental.IA
Abril 2026
`
  },
  {
    key: "catalogo-webs-tarifas.txt",
    title: "💼 Catálogo de Webs y Tarifas — Agental.IA",
    description: "Catálogo completo de todos los servicios y planes con precios detallados. Incluye portfolio de webs entregadas, comparativa de planes, servicios adicionales y condiciones comerciales.",
    content: `CATÁLOGO DE SERVICIOS Y TARIFAS — AGENTAL.IA
Versión 1.0 | Abril 2026
Para uso de agentes comerciales
═══════════════════════════════════════════════════════════

╔═══════════════════════════════════════════════════════╗
║           RESUMEN DE PLANES Y PRECIOS                 ║
╠═══════════════════════════════════════════════════════╣
║  Plan Básico       │ 600€ dev  │ 30€/mes              ║
║  Plan Estándar     │ 900€ dev  │ 50€/mes              ║
║  Plan Premium      │ 1.200€ dev│ 80€/mes              ║
║  Plan SaaS         │ 2.500€+   │ 150€+/mes            ║
╚═══════════════════════════════════════════════════════╝

FORMA DE PAGO: 50% al inicio · 50% al entregar
DESCUENTOS: Trimestral -5% | Anual -10% (en cuota mensual)

═══════════════════════════════════════════════════════════

PLAN BÁSICO — 600 €
────────────────────
Ideal para: Negocios que necesitan presencia digital rápida y sencilla.
Tiempo de desarrollo: 1-2 días laborables
Mantenimiento: 30€/mes

INCLUYE:
✓ Landing page de 1 página completa
✓ Secciones: Hero + Info del negocio + Localización + Contacto
✓ Diseño responsive (móvil, tablet, escritorio)
✓ DNA de marca (colores y tipografía del negocio)
✓ Animaciones básicas (Framer Motion)
✓ SEO técnico completo (meta tags, schema markup, sitemap)
✓ Integración Google Maps
✓ Enlace WhatsApp / formulario de contacto
✓ Deploy en Vercel con SSL (HTTPS)
✓ Dominio .vercel.app gratuito
✓ 30 días de soporte post-entrega

NO INCLUYE:
✗ Panel de administración
✗ Carta/menú editable
✗ Galería de fotos gestionable
✗ Sistema de reservas

ADICIONALES (para este plan):
+ Dominio personalizado (ej: mirestaurante.es): 10-15€/año
+ Google Business Profile setup: 100€ único
+ Domicilio de mantenimiento a Plan Estándar: +20€/mes

─────────────────────────────────────────────────────────

PLAN ESTÁNDAR — 900 €
──────────────────────
Ideal para: Bares, cafeterías, tiendas y servicios que quieren varias secciones
y poder actualizar contenido básico sin llamar al desarrollador.
Tiempo de desarrollo: 2-3 días laborables
Mantenimiento: 50€/mes

TODO LO DEL PLAN BÁSICO, MÁS:
✓ Multi-sección: About, Servicios/Carta, Galería, Horarios, Contacto
✓ Panel Admin básico: actualizar textos, horarios, fotos y datos de contacto
✓ Galería de fotos gestionable desde el admin
✓ Carta/menú por categorías (no editable en precios en vivo)
✓ Animaciones avanzadas con scroll reveal y hover effects
✓ DNA de marca completo: arquetipo, paleta, tipografía, tono comunicativo
✓ 1 ronda de revisiones de diseño incluida

NO INCLUYE:
✗ Carta editable con precios y fotos en tiempo real
✗ Sistema de reservas integrado
✗ Integración Instagram automática

─────────────────────────────────────────────────────────

PLAN PREMIUM — 1.200€ - 1.500€
────────────────────────────────
Ideal para: Restaurantes y negocios de hostelería que quieren la web más completa
y poder gestionar todo su contenido sin dependencias.
Tiempo de desarrollo: 3-5 días laborables
Mantenimiento: 80€/mes

TODO LO DEL PLAN ESTÁNDAR, MÁS:
✓ Carta/menú editable en tiempo real: precios, alérgenos, fotos, categorías
✓ Sistema de reservas (enlace TheFork/Cover Manager o formulario propio)
✓ Galería premium con subida de fotos y vídeos desde el admin
✓ Sección de especialidades destacadas con fotos
✓ Testimonios/reseñas en la landing
✓ Integración Instagram (últimas publicaciones)
✓ Schema markup avanzado (Restaurant, Menu, MenuSection)
✓ Google Analytics + Meta Pixel (configuración incluida)
✓ 1 ronda de revisiones de diseño incluida
✓ Reporte SEO mensual en mantenimiento

PRECIO SEGÚN COMPLEJIDAD:
• 1.200€ — Web Premium estándar (referencia: El Rincón de Salteras)
• 1.500€ — Web Premium con módulos extra (sistema de pedidos básico,
           múltiples idiomas, integración con sistemas POS)

─────────────────────────────────────────────────────────

PLAN SAAS / SISTEMA AVANZADO — desde 2.500 €
─────────────────────────────────────────────
Ideal para: Negocios con necesidades especiales, sistemas de gestión complejos,
múltiples puntos de venta, o cuando el cliente quiere un software a medida.
Tiempo de desarrollo: 7-21 días laborables
Mantenimiento: desde 150€/mes

Presupuesto personalizado según requerimientos.

EJEMPLOS DESARROLLADOS:
• Comandalia SaaS (2.500€+):
  - Sistema de pedidos QR por mesa
  - Panel de cocina en tiempo real con WebSockets
  - Backoffice de gestión completo
  - 3 frontends React independientes
  - Bot Telegram para alertas
  - Node.js + Fastify + SQLite + React + WebSockets

• Pixel Agents VS Code Extension:
  - Extensión VS Code con agentes Claude AI animados
  - Sistema multiplayer (roles, reacciones, feed, stats)
  - Webview React dentro del editor

• HackQuest — Juego educativo:
  - Juego web competitivo de ciberseguridad
  - Sistema de puntuación en tiempo real

─────────────────────────────────────────────────────────

SERVICIOS ADICIONALES
──────────────────────
Estos servicios se pueden añadir a cualquier plan:

POSICIONAMIENTO Y MARKETING:
• Google Business Profile — Setup inicial          100 €
• Gestión mensual GBP (posts + fotos + respuestas) +50 €/mes
• Gestión de reseñas                               +30 €/mes
• Blog corporativo (2 artículos SEO/mes)           200 €/mes
• Auditoría SEO completa                           150 €

DISEÑO:
• Branding completo (logo + manual)                300-500 €
• Pack fotos con móvil (sesión básica)             100-150 €
• Vídeo de presentación (30-60 seg)               200-400 €

DOMINIO Y HOSTING:
• Registro dominio .es o .com                      10-15 €/año
• Configuración dominio en Vercel                  Gratis (incluido)
• Email corporativo (Google Workspace)             6-12 €/user/mes

MODIFICACIONES POST-ENTREGA (sin mantenimiento):
• Cambio pequeño (texto, foto, horario)            30-50 €
• Nueva sección                                   150-300 €
• Rediseño parcial                                300-600 €
• Rediseño completo                               Tarifa de desarrollo

─────────────────────────────────────────────────────────

PORTFOLIO COMPLETO (ABRIL 2026)
────────────────────────────────

ENTREGADOS — HOSTELERÍA:
Nº  Negocio                    Sector           Plan      URL
 1  Bar Ryky                   Bar tapas        Estándar  bar-ryky-web.vercel.app
 2  Chantarela                 Parrilla mediter. Premium   chantarela-web.vercel.app
 3  Bodega Mairena             Asador/Josper    Premium   bodega-mairena-web.vercel.app
 4  El Rincón de Salteras      Carnes brasa     Premium   rincon-salteras.vercel.app
 5  Dichoso                    Tapas/arroces    Estándar  dichoso-web.vercel.app
 6  Taberna Alambique          Taberna          Estándar  —
 7  Bar La Espuela             Bar local        Básico    —
 8  Las Palmeras               Negocio local    Básico    —
 9  El Rinconcito Pirata       Bar temático     Estándar  —
10  Bonnet Cocktail Bar        Coctelería       Premium   —
11  Bodega Zampuzo             Bodega           Estándar  —
12  Bodega Aljarafe            Bodega           Estándar  En desarrollo

ENTREGADOS — OTROS SECTORES:
13  Shisha Vaper Sevilla       Tienda premium   Premium   shisha-vaper-web.vercel.app
14  La Dama                    Peluquería canina Básico   ladama-web.vercel.app
15  Twin Bros Tattoo Studio    Tatuaje/Piercing Premium   —

PROYECTOS ESPECIALES:
16  Comandalia                 SaaS restaurante SaaS      —
17  Pixel Agents               Extensión VS Code Especial —
18  HackQuest                  Juego educativo  Especial  —
19  Dungeon & Dynasty          Idle RPG         Especial  —

TOTAL: 19+ proyectos entregados / en desarrollo a abril 2026

─────────────────────────────────────────────────────────

CONDICIONES COMERCIALES
────────────────────────
PAGO:
• 50% al firmar y antes de iniciar desarrollo
• 50% al entregar la web en staging (pre-producción)
• Formas: transferencia bancaria o Bizum

REVISIONES:
• 1 ronda de revisiones incluida en todos los planes
• Revisiones adicionales: 50€/hora

SOPORTE POST-ENTREGA:
• 30 días de soporte incluido
• Mantenimiento mensual para soporte continuado

PROPIEDAD:
• El código y dominio son siempre del cliente
• Si el cliente cancela, la web sigue funcionando

PLAZO DE ENTREGA:
• Comienza cuando se recibe el 50% inicial + materiales del cliente
• Se necesita: logo, fotos (o nos indica que no tiene), textos principales

MATERIALES QUE EL CLIENTE DEBE APORTAR:
• Logo en buena resolución (PNG, SVG o AI/EPS)
• Fotos del local y productos (mínimo 5-10 fotos)
• Textos principales (descripción del negocio, carta si aplica)
• Datos de contacto, horarios y dirección exacta
• Redes sociales activas (Instagram, Facebook si los tiene)

─────────────────────────────────────────────────────────

COMISIONES PARA AGENTES
────────────────────────
• Plan Básico (600€):    comisión XX% = XX€
• Plan Estándar (900€):  comisión XX% = XX€
• Plan Premium (1.200€): comisión XX% = XX€
• SaaS (2.500€+):        comisión XX% = XX€
• Mantenimiento mensual: comisión XX% mensual recurrente

[Las comisiones exactas las establece el administrador — consultar con Joselito]

═══════════════════════════════════════════════════════════
Agental.IA — Catálogo de Servicios v1.0
Abril 2026
Documento confidencial — Solo para uso de agentes
`
  }
];

/* ──────────────────────────────────────────
   Subir cada documento
   ────────────────────────────────────────── */

// Asegurar que el bucket existe
const { data: buckets } = await supabase.storage.listBuckets();
const bucketExists = (buckets ?? []).some((b) => b.name === "documents");
if (!bucketExists) {
  await supabase.storage.createBucket("documents", { public: true });
  console.log("✓ Bucket 'documents' creado.");
}

for (const doc of docs) {
  console.log(`\n📄 Subiendo: ${doc.title}...`);

  const buffer = Buffer.from(doc.content, "utf-8");
  const filePath = `docs/${Date.now()}_${doc.key}`;

  // Subir al Storage
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(filePath, buffer, {
      contentType: "text/plain; charset=utf-8",
      upsert: false
    });

  if (uploadError) {
    console.error(`  ❌ Error al subir "${doc.key}":`, uploadError.message);
    continue;
  }

  // Obtener URL pública
  const { data: urlData } = supabase.storage.from("documents").getPublicUrl(filePath);
  const publicUrl = urlData?.publicUrl;

  if (!publicUrl) {
    console.error(`  ❌ No se pudo obtener URL pública para "${doc.key}"`);
    continue;
  }

  // Crear registro en la tabla documents
  const { data: docRecord, error: docError } = await supabase
    .from("documents")
    .insert({
      title: doc.title,
      description: doc.description,
      file_url: publicUrl,
      file_name: doc.key,
      file_type: "text",
      file_size: buffer.length,
      visibility: "all",
      created_by: createdBy
    })
    .select("id, title")
    .single();

  if (docError) {
    console.error(`  ❌ Error al guardar registro de "${doc.key}":`, docError.message);
    continue;
  }

  console.log(`  ✓ Documento creado: "${docRecord.title}" (id: ${docRecord.id})`);
}

console.log("\n✅ Proceso completado.\n");
console.log("Resumen:");
console.log("  • Agente Alejandro: nick=alejandro / pass=4RÑ9%.1ñja!");
console.log("  • 3 documentos subidos y visibles para todos los agentes");
console.log("  • Accede al portal: agental-ia-web.vercel.app\n");
