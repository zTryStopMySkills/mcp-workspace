const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  ExternalHyperlink, TableOfContents
} = require('docx');
const fs = require('fs');

const BLUE = "1E3A5F";
const BLUE_LIGHT = "D6E4F0";
const BLUE_MID = "2E75B6";
const GRAY = "595959";
const GRAY_LIGHT = "F2F7FB";
const WHITE = "FFFFFF";
const ACCENT = "E8A020";
const ACCENT_LIGHT = "FEF3E2";
const GREEN = "1E7E34";
const GREEN_LIGHT = "E6F4EA";

const border = { style: BorderStyle.SINGLE, size: 1, color: "BBCFE0" };
const cellBorders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
}
function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(text)] });
}
function p(children, opts = {}) {
  return new Paragraph({ children: Array.isArray(children) ? children : [new TextRun(children)], ...opts });
}
function t(text, opts = {}) { return new TextRun({ text, ...opts }); }
function space() { return new Paragraph({ children: [new TextRun("")] }); }
function pb() { return new Paragraph({ children: [new PageBreak()] }); }

function bullet(text, ref = "main-bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    children: [new TextRun(text)]
  });
}
function bullet2(text, ref = "sub-bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    children: [new TextRun(text)]
  });
}

function infoBox(title, content, color = BLUE_LIGHT, textColor = BLUE) {
  return new Table({
    columnWidths: [9360],
    margins: { top: 80, bottom: 80, left: 200, right: 200 },
    rows: [
      new TableRow({ children: [
        new TableCell({
          borders: cellBorders,
          width: { size: 9360, type: WidthType.DXA },
          shading: { fill: color, type: ShadingType.CLEAR },
          children: [
            new Paragraph({ spacing: { before: 60, after: 40 }, children: [
              new TextRun({ text: title, bold: true, color: textColor, size: 22 })
            ]}),
            ...content.map(line => new Paragraph({ spacing: { before: 20, after: 20 }, children: [
              new TextRun({ text: line, color: "333333", size: 20 })
            ]}))
          ]
        })
      ]})
    ]
  });
}

function phaseBox(num, title, desc) {
  return new Table({
    columnWidths: [1400, 7960],
    margins: { top: 60, bottom: 60, left: 160, right: 160 },
    rows: [
      new TableRow({ children: [
        new TableCell({
          borders: cellBorders,
          width: { size: 1400, type: WidthType.DXA },
          shading: { fill: BLUE, type: ShadingType.CLEAR },
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `FASE ${num}`, bold: true, color: WHITE, size: 22 })
            ]
          })]
        }),
        new TableCell({
          borders: cellBorders,
          width: { size: 7960, type: WidthType.DXA },
          shading: { fill: GRAY_LIGHT, type: ShadingType.CLEAR },
          children: [
            new Paragraph({ spacing: { before: 40, after: 20 }, children: [
              new TextRun({ text: title, bold: true, color: BLUE, size: 22 })
            ]}),
            new Paragraph({ spacing: { before: 0, after: 40 }, children: [
              new TextRun({ text: desc, color: GRAY, size: 20 })
            ]})
          ]
        })
      ]})
    ]
  });
}

function projectsTable() {
  const hdr = (t) => new TableCell({
    borders: cellBorders,
    shading: { fill: BLUE, type: ShadingType.CLEAR },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: t, bold: true, color: WHITE, size: 19 })] })]
  });
  const cell = (t, fill = WHITE) => new TableCell({
    borders: cellBorders,
    shading: { fill, type: ShadingType.CLEAR },
    children: [new Paragraph({ children: [new TextRun({ text: t, size: 18 })] })]
  });

  const projects = [
    ["La Dama", "Peluquería canina", "Next.js + Tailwind", "Patrón base — primer proyecto"],
    ["Sideralbar", "Bar", "HTML/CSS vanilla", "Tipo C: sin framework, deploy rápido"],
    ["Bar Hakuna", "Bar", "Next.js dual app", "Dos apps separadas: cliente + admin"],
    ["Alambique", "Taberna", "Next.js + Tailwind", "Kit de ventas + docs comerciales"],
    ["Las Palmeras", "Restaurante", "Next.js", "Galería y carta integradas"],
    ["Bonnet Cocktail Bar", "Cocktail bar", "Next.js + embla-carousel", "Referencia para bares premium"],
    ["Pandy Shop", "Tienda", "Next.js", "Catálogo + carrito básico"],
    ["El Olivo / Comandalia", "Restaurante buffet", "Node.js+Fastify+SQLite+WS", "SaaS: QR, cocina kanban, bot Telegram"],
    ["Bodega Mairena", "Bodega/Taberna", "Next.js + Tailwind v4", "Primer CRUD admin de Carta/Menú"],
    ["El Rinconcito Pirata", "Bar temático", "Next.js + Tailwind v4", "App Router sin /src — app/ en raíz"],
    ["Dichoso", "Restaurante tapas", "Next.js + Tailwind v4", "Bug CSS cascade layers Tailwind v4"],
    ["Bonnet (refactor)", "Cocktail bar", "Next.js + Tailwind v4", "Refactor con Tailwind v4"],
  ];

  const altRow = (i) => i % 2 === 0 ? WHITE : GRAY_LIGHT;

  return new Table({
    columnWidths: [1800, 1700, 2000, 3860],
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    rows: [
      new TableRow({ tableHeader: true, children: [
        hdr("Proyecto"), hdr("Sector"), hdr("Stack"), hdr("Lección clave")
      ]}),
      ...projects.map(([proj, sector, stack, lesson], i) =>
        new TableRow({ children: [
          cell(proj, altRow(i)), cell(sector, altRow(i)), cell(stack, altRow(i)), cell(lesson, altRow(i))
        ]})
      )
    ]
  });
}

function archetypesTable() {
  const hdr = (t) => new TableCell({
    borders: cellBorders,
    shading: { fill: BLUE_MID, type: ShadingType.CLEAR },
    children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, color: WHITE, size: 19 })] })]
  });
  const cell = (t, fill = WHITE, bold = false) => new TableCell({
    borders: cellBorders,
    shading: { fill, type: ShadingType.CLEAR },
    children: [new Paragraph({ children: [new TextRun({ text: t, size: 18, bold })] })]
  });

  const data = [
    ["El Inocente", "Optimista, puro, simple", "Frescura, naturalidad, sin artificios"],
    ["El Explorador", "Libre, aventurero", "Aventura, novedad, experiencias únicas"],
    ["El Sabio", "Experto, confiable", "Educación, rigor, conocimiento profundo"],
    ["El Héroe", "Valiente, superador", "Esfuerzo, resultados, determinación"],
    ["El Rebelde", "Rompe reglas, disruptivo", "Contracultura, irreverencia, originalidad"],
    ["El Mago", "Transformador, visionario", "Magia, transformación, WOW"],
    ["El Tipo Corriente", "Cercano, real, cotidiano", "Accesibilidad, para todos, sin pretensiones"],
    ["El Amante", "Íntimo, sensual, apasionado", "Placer, belleza, experiencia sensorial"],
    ["El Bufón", "Divertido, espontáneo", "Humor, ligereza, no tomarse en serio"],
    ["El Cuidador", "Protector, empático", "Cuidado, comunidad, bienestar"],
    ["El Creador", "Artístico, innovador", "Creatividad, artesanía, expresión"],
    ["El Gobernante", "Liderazgo, exclusividad", "Lujo, estatus, excelencia, exclusividad"],
  ];

  return new Table({
    columnWidths: [2000, 2800, 4560],
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    rows: [
      new TableRow({ tableHeader: true, children: [hdr("Arquetipo"), hdr("Personalidad"), hdr("Señales en el negocio")] }),
      ...data.map(([arch, pers, sig], i) =>
        new TableRow({ children: [
          cell(arch, i % 2 === 0 ? WHITE : GRAY_LIGHT, true),
          cell(pers, i % 2 === 0 ? WHITE : GRAY_LIGHT),
          cell(sig, i % 2 === 0 ? WHITE : GRAY_LIGHT)
        ]})
      )
    ]
  });
}

function stackTable() {
  const hdr = (t) => new TableCell({
    borders: cellBorders,
    shading: { fill: BLUE, type: ShadingType.CLEAR },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: t, bold: true, color: WHITE, size: 20 })] })]
  });
  const cell = (t, fill = WHITE, bold = false, color = "333333") => new TableCell({
    borders: cellBorders,
    shading: { fill, type: ShadingType.CLEAR },
    children: [new Paragraph({ children: [new TextRun({ text: t, size: 19, bold, color })] })]
  });

  return new Table({
    columnWidths: [1000, 2000, 3000, 1800, 1560],
    margins: { top: 80, bottom: 80, left: 140, right: 140 },
    rows: [
      new TableRow({ tableHeader: true, children: [
        hdr("Tipo"), hdr("Cuándo usar"), hdr("Stack"), hdr("Deploy"), hdr("Ejemplos")
      ]}),
      new TableRow({ children: [
        cell("A", BLUE_LIGHT, true, BLUE),
        cell("Negocios locales estándar — la gran mayoría"),
        cell("Next.js App Router + Tailwind + Framer Motion"),
        cell("Vercel"),
        cell("La Dama, Hakuna, Alambique, Bodega Mairena")
      ]}),
      new TableRow({ children: [
        cell("B", ACCENT_LIGHT, true, "8B5E00"),
        cell("Pedidos en tiempo real, multi-panel, offline"),
        cell("Node.js + Fastify + SQLite + React Vite + WebSockets"),
        cell("VPS Ubuntu + systemd"),
        cell("El Olivo / Comandalia")
      ]}),
      new TableRow({ children: [
        cell("C", GREEN_LIGHT, true, GREEN),
        cell("Presupuesto bajo, velocidad máxima, sin admin"),
        cell("HTML + CSS + JS vanilla"),
        cell("Vercel / Netlify"),
        cell("Sideralbar")
      ]}),
    ]
  });
}

function installTable() {
  const hdr = (t) => new TableCell({
    borders: cellBorders,
    shading: { fill: "2D2D2D", type: ShadingType.CLEAR },
    children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, color: WHITE, size: 20 })] })]
  });
  const cell = (t, fill = WHITE, mono = false) => new TableCell({
    borders: cellBorders,
    shading: { fill, type: ShadingType.CLEAR },
    children: [new Paragraph({ children: [new TextRun({ text: t, size: 19, font: mono ? "Courier New" : "Arial" })] })]
  });

  const steps = [
    ["1", "Crear carpeta agents", "~/.claude/agents/", "Directorio donde van todos los agentes"],
    ["2", "Copiar agente", "web-business-builder.md", "En ~/.claude/agents/"],
    ["3", "Crear carpeta skill", "~/.claude/skills/webprocess/", "Directorio del skill"],
    ["4", "Copiar skill", "SKILL.md", "En ~/.claude/skills/webprocess/"],
    ["5", "Instalar yt-dlp", "winget install yt-dlp", "Para descarga de videos Instagram/TikTok"],
    ["6", "Instalar curl", "winget install curl", "Para descarga de imágenes"],
    ["7", "Cuenta Vercel", "vercel.com → signup", "Para deploy automático"],
    ["8", "Instalar Vercel CLI", "npm install -g vercel", "CLI para deploy desde terminal"],
    ["9", "Login Vercel", "vercel login", "Autenticarse una sola vez"],
    ["10", "Verificar", "ls ~/.claude/agents/", "Debe aparecer web-business-builder.md"],
  ];

  return new Table({
    columnWidths: [500, 2000, 2500, 4360],
    margins: { top: 70, bottom: 70, left: 140, right: 140 },
    rows: [
      new TableRow({ tableHeader: true, children: [hdr("#"), hdr("Paso"), hdr("Comando / Ruta"), hdr("Descripción")] }),
      ...steps.map(([num, step, cmd, desc], i) =>
        new TableRow({ children: [
          new TableCell({
            borders: cellBorders,
            shading: { fill: BLUE, type: ShadingType.CLEAR },
            verticalAlign: VerticalAlign.CENTER,
            width: { size: 500, type: WidthType.DXA },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: num, bold: true, color: WHITE, size: 20 })] })]
          }),
          cell(step, i % 2 === 0 ? WHITE : GRAY_LIGHT),
          cell(cmd, i % 2 === 0 ? WHITE : GRAY_LIGHT, true),
          cell(desc, i % 2 === 0 ? WHITE : GRAY_LIGHT)
        ]})
      )
    ]
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "main-bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 300 } } } }]
      },
      {
        reference: "sub-bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 900, hanging: 300 } } } }]
      },
      {
        reference: "numbered",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 300 } } } }]
      },
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22, color: "333333" } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 64, bold: true, color: WHITE, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 200 }, alignment: AlignmentType.CENTER } },
      { id: "Subtitle", name: "Subtitle", basedOn: "Normal",
        run: { size: 28, color: BLUE_LIGHT, font: "Arial", italics: true },
        paragraph: { spacing: { before: 0, after: 300 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 34, bold: true, color: WHITE, font: "Arial" },
        paragraph: { spacing: { before: 60, after: 200 }, outlineLevel: 0,
          shading: { fill: BLUE, type: ShadingType.CLEAR } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: BLUE, font: "Arial" },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1,
          border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: BLUE_LIGHT } } } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: BLUE_MID, font: "Arial" },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
      { id: "Code", name: "Code", basedOn: "Normal",
        run: { font: "Courier New", size: 18, color: "1A1A1A" },
        paragraph: { spacing: { before: 60, after: 60 },
          shading: { fill: "F0F0F0", type: ShadingType.CLEAR } } }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
          children: [
            new TextRun({ text: "Web Business Builder  ·  webprocess", size: 18, color: "888888" }),
            new TextRun({ text: "     Pág. ", size: 18, color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "888888" }),
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
          children: [new TextRun({ text: "© 2026 · Guía de uso e instalación — Documento generado automáticamente", size: 16, color: "AAAAAA" })]
        })]
      })
    },
    children: [

      // ── PORTADA ─────────────────────────────────────────────────────────────
      new Table({
        columnWidths: [9360],
        rows: [new TableRow({ children: [new TableCell({
          borders: noBorders,
          shading: { fill: BLUE, type: ShadingType.CLEAR },
          width: { size: 9360, type: WidthType.DXA },
          children: [
            space(),
            new Paragraph({ spacing: { before: 400, after: 120 }, alignment: AlignmentType.CENTER, children: [
              new TextRun({ text: "WEB BUSINESS BUILDER", bold: true, color: WHITE, size: 72, font: "Arial" })
            ]}),
            new Paragraph({ spacing: { before: 0, after: 80 }, alignment: AlignmentType.CENTER, children: [
              new TextRun({ text: "& /webprocess Skill", color: ACCENT, size: 40, font: "Arial", bold: true })
            ]}),
            new Paragraph({ spacing: { before: 80, after: 200 }, alignment: AlignmentType.CENTER, children: [
              new TextRun({ text: "Guía completa del agente + skill · Qué hacen · Cómo instalarlos", color: BLUE_LIGHT, size: 24, italics: true })
            ]}),
            new Paragraph({ spacing: { before: 200, after: 120 }, alignment: AlignmentType.CENTER, children: [
              new TextRun({ text: "12 proyectos reales · 7 fases probadas · Deploy automático a Vercel", color: WHITE, size: 22 })
            ]}),
            space(), space()
          ]
        })]})],
        margins: { top: 0, bottom: 0, left: 0, right: 0 }
      }),

      space(),
      new Paragraph({ spacing: { before: 60, after: 60 }, alignment: AlignmentType.CENTER, children: [
        new TextRun({ text: "Versión 1.0  ·  Marzo 2026  ·  Claude Code", size: 18, color: "888888" })
      ]}),
      space(),

      // ── TOC ──────────────────────────────────────────────────────────────────
      new TableOfContents("Tabla de Contenidos", { hyperlink: true, headingStyleRange: "1-2" }),
      pb(),

      // ══════════════════════════════════════════════════════════════════
      // 1. QUÉ ES
      // ══════════════════════════════════════════════════════════════════
      h1("1.  Qué son el agente y el skill"),

      space(),
      h2("1.1  web-business-builder — El agente"),

      p([
        t("El agente "),
        t("web-business-builder", { bold: true, color: BLUE }),
        t(" es un agente especialista instalado en Claude Code que construye webs profesionales completas para negocios locales de cualquier sector y complejidad."),
      ], { spacing: { after: 140 } }),

      infoBox("En una frase", [
        "Dado el nombre de un negocio y su Instagram, el agente genera una web profesional completa",
        "— desde el análisis de marca hasta el deploy automático en Vercel —",
        "sin intervención manual del desarrollador más allá de la aprobación de cada fase."
      ], BLUE_LIGHT, BLUE),

      space(),

      p("Sus capacidades principales:", { spacing: { after: 80 } }),
      bullet("Extrae el ADN de marca completo (arquetipos Jungsianos, tono de voz, storytelling)"),
      bullet("Busca en Google Maps, Instagram, TikTok y reseñas para construir el Brief real del negocio"),
      bullet("Descarga media real del negocio (videos de Instagram, fotos) — nunca placeholders"),
      bullet("Genera el diseño completo: paleta, tipografías, animaciones según el arquetipo"),
      bullet("Implementa landing page + panel admin con sincronización en tiempo real (WebSockets)"),
      bullet("Genera documentación comercial (propuesta, presupuesto, contrato)"),
      bullet("Despliega automáticamente a Vercel con un solo comando"),
      bullet("Se adapta a 3 niveles de complejidad: Landing simple, SaaS multi-panel, HTML estático"),

      space(),
      p([
        t("Aprendido en "),
        t("12 proyectos reales", { bold: true }),
        t(" de distintos sectores: peluquerías caninas, bares, restaurantes, tiendas, tabernas y sistemas SaaS complejos con cocina en tiempo real."),
      ], { spacing: { before: 100, after: 100 } }),

      space(),
      h2("1.2  /webprocess — El skill"),

      p([
        t("El skill "),
        t("/webprocess", { bold: true, color: BLUE_MID, font: "Courier New" }),
        t(" es el orquestador maestro del proceso. Se invoca con "),
        t("/webprocess", { bold: true, font: "Courier New" }),
        t(" al inicio de cada nuevo proyecto y guía TODO el proceso de principio a fin."),
      ], { spacing: { after: 140 } }),

      infoBox("Diferencia agente vs skill", [
        "AGENTE (web-business-builder): Claude lo usa internamente para delegar tareas de construcción web.",
        "SKILL (/webprocess): Tú lo invocas explícitamente para arrancar un nuevo proyecto.",
        "Ambos ejecutan el mismo pipeline de 7 fases, pero desde distintos puntos de entrada."
      ], ACCENT_LIGHT, "7A4500"),

      space(),
      bullet("Activa con solo escribir /webprocess en Claude Code"),
      bullet("Pregunta la información necesaria (nombre, Instagram, logo, teléfono) en un solo mensaje agrupado"),
      bullet("Ejecuta las 7 fases de forma autónoma, solicitando aprobación solo en puntos críticos"),
      bullet("Incluye técnicas de neuromarketing y diseño por arquetipo integradas en el flujo"),

      pb(),

      // ══════════════════════════════════════════════════════════════════
      // 2. PROYECTOS DE REFERENCIA
      // ══════════════════════════════════════════════════════════════════
      h1("2.  Proyectos de referencia"),

      p("El agente ha sido entrenado con 12 proyectos reales, todos en la ruta local C:/Users/jose2/OneDrive/Escritorio/mcp/", { spacing: { after: 160 } }),

      projectsTable(),

      space(), space(),
      infoBox("Nota importante", [
        "Cada proyecto es ÚNICO. El agente nunca copia colores, copy ni componentes de proyectos anteriores.",
        "Los proyectos de referencia sirven para aprender patrones técnicos, no para replicar diseños."
      ], GREEN_LIGHT, GREEN),

      pb(),

      // ══════════════════════════════════════════════════════════════════
      // 3. EL PIPELINE — 7 FASES
      // ══════════════════════════════════════════════════════════════════
      h1("3.  El pipeline — 7 fases"),

      p("Cada proyecto sigue el mismo pipeline probado, adaptado al tipo y sector del negocio.", { spacing: { after: 180 } }),

      phaseBox("0", "Tipo de proyecto y recogida de información",
        "Se determina si es Tipo A (Landing+Admin Next.js), Tipo B (SaaS complejo) o Tipo C (HTML estático). Se recopila nombre, Instagram, logo, teléfono, historia del negocio."),
      space(),
      phaseBox("1", "Descubrimiento del negocio",
        "WebSearch en Google Maps, Instagram, TikTok, web actual. Se extraen dirección real, teléfono, horarios, rating, reseñas de Google (para Testimonials), captions de Instagram (para análisis de tono)."),
      space(),
      phaseBox("2", "ADN de Marca y Personalidad",
        "La fase más importante. Se genera el Brand DNA Report completo: arquetipo de Jung, tono de voz, Brand DNA (propósito, valores, promesa), storytelling, experiencia del cliente, branding sensorial. También se genera el copy completo de todas las secciones ANTES de escribir código."),
      space(),
      phaseBox("3", "Análisis visual y tokens de diseño",
        "Se analiza el logo para extraer colores. Se genera globals.css con variables CSS completas. Se aplica la tabla de traducción arquetipo → design system (border-radius, animaciones, tipografía, sombras, espaciado)."),
      space(),
      phaseBox("4", "Extracción de media real",
        "Descarga videos con yt-dlp e imágenes con curl desde Instagram/TikTok. Mínimo 10 assets reales. NUNCA placeholders en producción."),
      space(),
      phaseBox("5", "Landing page y panel admin",
        "Para Tipo A: Next.js App Router + Tailwind v4 + Framer Motion. Secciones: Navbar, Hero (video autoplay), Services, About, Gallery carousel, Booking, Instagram feed, Testimonials, Contact, Footer, FloatingButtons. Panel admin con CRUD y sync WebSocket en tiempo real."),
      space(),
      phaseBox("6", "Documentación comercial",
        "Propuesta de valor, presupuesto detallado y contrato de mantenimiento. Se genera en el tono de voz del agente (profesional pero cercano)."),
      space(),
      phaseBox("7", "Deploy a Vercel",
        "Build de producción + deploy automático con vercel --prod. Se genera el enlace final y se hace una revisión QA del resultado en vivo."),

      space(), space(),

      h2("3.1  Tipos de proyecto en detalle"),
      space(),
      stackTable(),

      pb(),

      // ══════════════════════════════════════════════════════════════════
      // 4. ADN DE MARCA — ARQUETIPOS
      // ══════════════════════════════════════════════════════════════════
      h1("4.  ADN de Marca — Los 12 Arquetipos"),

      p([
        t("La Fase 2 utiliza los "),
        t("12 arquetipos de Jung", { bold: true }),
        t(" para analizar la personalidad del negocio. Esto determina TODAS las decisiones de diseño: colores, tipografías, velocidad de animaciones, border-radius, sombras, espaciado y copy."),
      ], { spacing: { after: 160 } }),

      archetypesTable(),

      space(), space(),

      h2("4.1  Ejemplo: Arquetipo → Design System"),

      infoBox("El Amante (restaurantes premium, peluquerías, spas)", [
        "Animaciones: 0.85s, ease-in-out suave. Las cosas 'florecen', nunca saltan.",
        "Border-radius: rounded-3xl (orgánico, nunca ángulos rectos).",
        "Colores: cálidos — golds, cremas, burgundy. NUNCA azules fríos.",
        "Tipografía: contraste extremo light/bold. Playfair Display + Cormorant Garamond.",
        "Sombras: difusas y cálidas con el color primario. shadow-[0_20px_60px_rgba(139,24,24,0.3)]",
        "Espaciado: muy generoso. py-32 sm:py-40. El espacio ES el producto de lujo.",
        "Headlines: 'Donde cada detalle es una caricia' — emocional, sensorial, no informativo."
      ], ACCENT_LIGHT, "7A4500"),

      space(),

      infoBox("El Gobernante (abogados, consultoras, hoteles premium)", [
        "Animaciones: 0.55s, ease-out preciso. Eficiente, sin demoras.",
        "Border-radius: rounded-none o rounded-sm. Autoridad, no suavidad.",
        "Colores: fríos — negro, blanco, plateado. Sin calidez.",
        "Tipografía: Bold uniforme. Sin contraste de pesos — todo al mismo nivel de potencia.",
        "Sombras: finas y duras. Definición, no difuminado.",
        "Espaciado: estructurado, matemático. Todo alineado, nada libre."
      ], GRAY_LIGHT, GRAY),

      pb(),

      // ══════════════════════════════════════════════════════════════════
      // 5. TÉCNICAS AVANZADAS
      // ══════════════════════════════════════════════════════════════════
      h1("5.  Técnicas avanzadas integradas"),

      h2("5.1  Neuromarketing en el copy"),

      p("El agente aplica principios de psicología cognitiva con evidencia científica en cada proyecto:", { spacing: { after: 120 } }),

      h3("Principio de Hick — Reducir opciones"),
      bullet("Navbar: máximo 5 links. Más opciones = parálisis de decisión."),
      bullet("Hero: máximo 2 CTAs (primario + secundario)."),
      bullet("Grid de servicios: máximo 6 items visibles."),

      space(),
      h3("Micro-copy de urgencia y confianza"),
      bullet2("'Reservar' → 'Reserva en 30 segundos — Confirmación inmediata'"),
      bullet2("'Enviar' → 'Recibir respuesta en menos de 2 horas'"),
      bullet2("'Nombre' → 'Tu nombre' (más personal, menos burocrático)"),

      space(),
      h3("Anclaje de precios"),
      bullet("En restaurantes: mostrar primero el plato más premium. El resto parece más asequible."),
      bullet("En páginas de precios: mostrar el pack Premium antes que el Básico."),

      space(),
      h3("Prueba social above the fold"),
      bullet("Si el negocio tiene ≥4.0 de rating con ≥50 reseñas → mostrar SIEMPRE en el Hero."),
      bullet("Es el elemento de conversión con mejor ROI en negocios locales."),

      space(),
      h2("5.2  Bug crítico de Tailwind v4 — CSS Cascade Layers"),

      infoBox("BUG CONOCIDO y solucionado", [
        "En Tailwind v4, todos los utilities viven dentro de @layer utilities.",
        "Cualquier CSS escrito FUERA de un @layer tiene prioridad sobre TODO lo que esté en un layer,",
        "independientemente de la especificidad.",
        "",
        "Síntoma: todo el contenido se desplaza a la izquierda, sin padding, sin centrado.",
        "",
        "Solución: el reset CSS SIEMPRE debe ir dentro de @layer base.",
        "El agente lo aplica automáticamente en globals.css."
      ], "#FFF3CD", "#856404"),

      space(),
      h2("5.3  Descarga de media real"),

      p("El agente usa dos herramientas para descargar assets del negocio:", { spacing: { after: 100 } }),
      bullet([
        t("yt-dlp", { bold: true, font: "Courier New" }),
        t(" → videos de Instagram Reels y TikTok (.mp4)")
      ]),
      bullet([
        t("curl", { bold: true, font: "Courier New" }),
        t(" → imágenes de posts de Instagram (.jpg)")
      ]),

      space(),
      p([
        t("Regla de oro: "),
        t("NUNCA placeholders en producción.", { bold: true, color: "CC0000" }),
        t(" Todo asset que aparece en la web es real, descargado del negocio."),
      ], { spacing: { after: 80 } }),

      pb(),

      // ══════════════════════════════════════════════════════════════════
      // 6. INSTALACIÓN
      // ══════════════════════════════════════════════════════════════════
      h1("6.  Guía de instalación"),

      p("Sigue estos pasos para instalar el agente y el skill en Claude Code.", { spacing: { after: 160 } }),

      h2("6.1  Requisitos previos"),

      bullet([t("Claude Code", { bold: true }), t(" instalado (npm install -g @anthropic-ai/claude-code)")]),
      bullet([t("Node.js 18+", { bold: true })]),
      bullet([t("Git", { bold: true })]),
      bullet([t("Cuenta en Vercel", { bold: true }), t(" (vercel.com — plan gratuito suficiente)")]),
      bullet([t("Vercel CLI", { bold: true }), t(" (npm install -g vercel)")]),
      bullet([t("yt-dlp", { bold: true }), t(" para descarga de videos de Instagram/TikTok")]),
      bullet([t("curl", { bold: true }), t(" (suele venir preinstalado en Windows 10+, macOS y Linux)")]),

      space(), space(),
      h2("6.2  Pasos de instalación"),
      space(),

      installTable(),

      space(), space(),

      h2("6.3  Estructura de archivos resultante"),

      space(),
      infoBox("Árbol de directorios esperado", [
        "~/.claude/",
        "├── agents/",
        "│   └── web-business-builder.md      ← El agente",
        "└── skills/",
        "    └── webprocess/",
        "        └── SKILL.md                  ← El skill /webprocess",
      ], "F0F0F0", "1A1A1A"),

      space(), space(),

      h2("6.4  Instalación de yt-dlp (Windows)"),

      p("Opción A — winget (recomendado):", { spacing: { after: 60 } }),
      new Paragraph({ style: "Code", children: [new TextRun("winget install yt-dlp")] }),

      space(),
      p("Opción B — descarga manual:", { spacing: { after: 60 } }),
      bullet("Descargar yt-dlp.exe desde github.com/yt-dlp/yt-dlp/releases"),
      bullet("Colocarlo en la raíz del proyecto o en una carpeta del PATH"),
      bullet("En los scripts bash usar: ./yt-dlp.exe (si está en el directorio actual)"),

      space(), space(),
      h2("6.5  Verificación post-instalación"),

      p("Abre Claude Code y escribe /webprocess. Si el skill está correctamente instalado verás:", { spacing: { after: 100 } }),

      infoBox("Respuesta esperada de /webprocess", [
        "Para empezar con tu web necesito saber:",
        "",
        "1. Nombre del negocio y sector",
        "2. Instagram / TikTok / redes sociales",
        "3. El logo (PNG o SVG)",
        "4. Teléfono, email y dirección",
        "5. ¿Hay una web actual? ¿Qué servicios ofrecen?",
        "6. ¿Hay alguna historia especial detrás del negocio?"
      ], GREEN_LIGHT, GREEN),

      pb(),

      // ══════════════════════════════════════════════════════════════════
      // 7. USO
      // ══════════════════════════════════════════════════════════════════
      h1("7.  Cómo usar el skill"),

      h2("7.1  Inicio de proyecto — Comando"),

      space(),
      new Table({
        columnWidths: [9360],
        rows: [new TableRow({ children: [new TableCell({
          borders: noBorders,
          shading: { fill: "1A1A1A", type: ShadingType.CLEAR },
          width: { size: 9360, type: WidthType.DXA },
          children: [
            new Paragraph({ spacing: { before: 120, after: 60 }, children: [
              new TextRun({ text: "$ ", color: "888888", font: "Courier New", size: 22 }),
              new TextRun({ text: "/webprocess", color: ACCENT, font: "Courier New", size: 22, bold: true })
            ]}),
            new Paragraph({ spacing: { before: 0, after: 120 }, children: [
              new TextRun({ text: "# Escríbelo en Claude Code al inicio de un nuevo proyecto", color: "666666", font: "Courier New", size: 18 })
            ]})
          ]
        })]})],
        margins: { top: 0, bottom: 0, left: 0, right: 0 }
      }),

      space(), space(),

      h2("7.2  Ejemplos de prompts"),

      p("Ejemplo 1 — Negocio con Instagram conocido:", { spacing: { after: 60 } }),
      infoBox("", [
        '"Crea la web completa para La Dama, peluquería canina en Sevilla. Su Instagram es @ladama_24"',
        "",
        "→ El agente analiza la marca, descarga media real, construye landing + admin, despliega en Vercel."
      ], BLUE_LIGHT, BLUE),

      space(),
      p("Ejemplo 2 — Sistema SaaS complejo:", { spacing: { after: 60 } }),
      infoBox("", [
        '"Necesito un sistema de pedidos para mi restaurante buffet, con QR en las mesas,',
        "panel de cocina en tiempo real y backoffice de gestión\"",
        "",
        "→ El agente activa Tipo B: Node.js+Fastify+SQLite, 3 frontends React, WebSockets, bot Telegram."
      ], ACCENT_LIGHT, "7A4500"),

      space(),
      p("Ejemplo 3 — Web sencilla sin admin:", { spacing: { after: 60 } }),
      infoBox("", [
        '"Necesito una web rápida para Sideralbar, un bar en el centro. Sin panel admin."',
        "",
        "→ El agente activa Tipo C: HTML/CSS/JS vanilla. Listo en horas, deploy en Vercel."
      ], GREEN_LIGHT, GREEN),

      space(), space(),
      h2("7.3  Flujo de aprobación"),

      p("El skill solicita aprobación del usuario en estos puntos clave:", { spacing: { after: 120 } }),

      bullet("Tras la Fase 2: \"¿Este análisis de marca refleja bien tu negocio?\""),
      bullet("Tras la Fase 3: revisión de la paleta de colores y tipografías propuestas"),
      bullet("Antes del deploy: confirmación de que el build está correcto"),
      bullet("En el resto de fases: el agente trabaja de forma autónoma"),

      space(), space(),
      h2("7.4  Después del deploy"),

      bullet("El agente entrega la URL de producción en Vercel"),
      bullet("Entrega también la documentación comercial (propuesta + presupuesto + contrato)"),
      bullet("Los archivos locales quedan en C:/Users/jose2/OneDrive/Escritorio/mcp/<nombre-proyecto>"),

      pb(),

      // ══════════════════════════════════════════════════════════════════
      // 8. PROBLEMAS COMUNES
      // ══════════════════════════════════════════════════════════════════
      h1("8.  Problemas comunes y soluciones"),

      new Table({
        columnWidths: [3000, 3000, 3360],
        margins: { top: 70, bottom: 70, left: 140, right: 140 },
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders: cellBorders, shading: { fill: BLUE, type: ShadingType.CLEAR }, children: [
              new Paragraph({ children: [new TextRun({ text: "Problema", bold: true, color: WHITE, size: 20 })] })
            ]}),
            new TableCell({ borders: cellBorders, shading: { fill: BLUE, type: ShadingType.CLEAR }, children: [
              new Paragraph({ children: [new TextRun({ text: "Causa", bold: true, color: WHITE, size: 20 })] })
            ]}),
            new TableCell({ borders: cellBorders, shading: { fill: BLUE, type: ShadingType.CLEAR }, children: [
              new Paragraph({ children: [new TextRun({ text: "Solución", bold: true, color: WHITE, size: 20 })] })
            ]}),
          ]}),
          ...[
            ["yt-dlp falla en posts de imagen", "yt-dlp no soporta posts estáticos de Instagram", "Usar curl con -L en su lugar"],
            ["curl con &slide=N siempre devuelve la primera imagen", "Comportamiento normal de la API de Instagram", "No duplicar, es correcto"],
            ["Contenido desplazado a la izquierda en Tailwind v4", "Bug CSS cascade layers — reset fuera de @layer base", "Mover reset a @layer base (ver Fase 3)"],
            ["/webprocess no responde", "Skill no instalado correctamente", "Verificar que SKILL.md está en ~/.claude/skills/webprocess/"],
            ["El agente no aparece en Claude", "Agente no instalado o nombre incorrecto", "Verificar que web-business-builder.md está en ~/.claude/agents/"],
            ["vercel --prod falla", "No autenticado en Vercel CLI", "Ejecutar: vercel login"],
            ["Build de Next.js falla", "Dependencias no instaladas", "Ejecutar: npm install en el directorio del proyecto"],
          ].map(([prob, cause, sol], i) =>
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, shading: { fill: i % 2 === 0 ? WHITE : GRAY_LIGHT, type: ShadingType.CLEAR }, children: [
                new Paragraph({ children: [new TextRun({ text: prob, size: 19, bold: true })] })
              ]}),
              new TableCell({ borders: cellBorders, shading: { fill: i % 2 === 0 ? WHITE : GRAY_LIGHT, type: ShadingType.CLEAR }, children: [
                new Paragraph({ children: [new TextRun({ text: cause, size: 19, color: GRAY })] })
              ]}),
              new TableCell({ borders: cellBorders, shading: { fill: i % 2 === 0 ? WHITE : GRAY_LIGHT, type: ShadingType.CLEAR }, children: [
                new Paragraph({ children: [new TextRun({ text: sol, size: 19, color: GREEN })] })
              ]}),
            ]})
          )
        ]
      }),

      pb(),

      // ══════════════════════════════════════════════════════════════════
      // 9. RESUMEN RÁPIDO
      // ══════════════════════════════════════════════════════════════════
      h1("9.  Resumen rápido — Cheat Sheet"),

      new Table({
        columnWidths: [4680, 4680],
        margins: { top: 100, bottom: 100, left: 200, right: 200 },
        rows: [
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, shading: { fill: BLUE, type: ShadingType.CLEAR }, children: [
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "AGENTE: web-business-builder", bold: true, color: WHITE, size: 22 })] })
            ]}),
            new TableCell({ borders: cellBorders, shading: { fill: BLUE_MID, type: ShadingType.CLEAR }, children: [
              new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "SKILL: /webprocess", bold: true, color: WHITE, size: 22 })] })
            ]})
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, children: [
              new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "Archivo:", bold: true, size: 20 })] }),
              new Paragraph({ children: [new TextRun({ text: "~/.claude/agents/web-business-builder.md", font: "Courier New", size: 18, color: BLUE_MID })] }),
              new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: "Activación:", bold: true, size: 20 })] }),
              new Paragraph({ children: [new TextRun({ text: "Claude lo usa automáticamente cuando es relevante", size: 20 })] }),
              new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: "Herramientas:", bold: true, size: 20 })] }),
              new Paragraph({ children: [new TextRun({ text: "Read, Write, Edit, Bash, Glob, Grep", font: "Courier New", size: 18 })] }),
              new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: "Modelo:", bold: true, size: 20 })] }),
              new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "claude-sonnet (especificado en frontmatter)", size: 20 })] }),
            ]}),
            new TableCell({ borders: cellBorders, children: [
              new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "Archivo:", bold: true, size: 20 })] }),
              new Paragraph({ children: [new TextRun({ text: "~/.claude/skills/webprocess/SKILL.md", font: "Courier New", size: 18, color: BLUE_MID })] }),
              new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: "Activación:", bold: true, size: 20 })] }),
              new Paragraph({ children: [new TextRun({ text: "Escribe /webprocess en Claude Code", size: 20 })] }),
              new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: "Fases:", bold: true, size: 20 })] }),
              new Paragraph({ children: [new TextRun({ text: "0→Tipo / 1→Brief / 2→Marca / 3→Diseño /", size: 20 })] }),
              new Paragraph({ children: [new TextRun({ text: "4→Media / 5→Dev / 6→Docs / 7→Deploy", size: 20 })] }),
              new Paragraph({ spacing: { before: 100 }, children: [new TextRun({ text: "Output:", bold: true, size: 20 })] }),
              new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Web en Vercel + docs comerciales", size: 20 })] }),
            ]})
          ]})
        ]
      }),

      space(), space(),

      new Table({
        columnWidths: [9360],
        rows: [new TableRow({ children: [new TableCell({
          borders: noBorders,
          shading: { fill: BLUE, type: ShadingType.CLEAR },
          width: { size: 9360, type: WidthType.DXA },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 80 }, children: [
              new TextRun({ text: "Un solo comando para una web profesional completa", bold: true, color: WHITE, size: 28 })
            ]}),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 }, children: [
              new TextRun({ text: "/webprocess", color: ACCENT, size: 36, bold: true, font: "Courier New" })
            ]}),
            new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 200 }, children: [
              new TextRun({ text: "Brand DNA · Landing · Admin · Deploy · Documentación comercial", color: BLUE_LIGHT, size: 20, italics: true })
            ]})
          ]
        })]})],
        margins: { top: 0, bottom: 0, left: 0, right: 0 }
      }),

    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  const out = "C:/Users/jose2/OneDrive/Escritorio/mcp/guia-web-business-builder.docx";
  fs.writeFileSync(out, buffer);
  console.log("OK:" + out);
}).catch(e => { console.error(e); process.exit(1); });
