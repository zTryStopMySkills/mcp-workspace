const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, TableOfContents,
  HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign,
  PageNumber, PageBreak
} = require('docx');
const fs = require('fs');

// ── Colors ──────────────────────────────────────────────────────────────
const GOLD    = 'D4960A';
const DARK    = '1A1512';
const DARK2   = '2C2318';
const WHITE   = 'F2EDE4';
const MUTED   = '7A7060';
const BLACK   = '000000';
const GREY_BG = 'F5F0E8';
const GOLD_BG = 'F5E6B8';

// ── Borders ──────────────────────────────────────────────────────────────
const borderGold  = { style: BorderStyle.SINGLE, size: 6, color: GOLD };
const borderLight = { style: BorderStyle.SINGLE, size: 1, color: 'D0C8B8' };
const cellBorder  = { top: borderLight, bottom: borderLight, left: borderLight, right: borderLight };
const noBorder    = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noCellBorder= { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

// ── Helpers ──────────────────────────────────────────────────────────────
const gap = (pts = 120) => new Paragraph({ spacing: { before: pts, after: 0 }, children: [new TextRun('')] });

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
    children: [new TextRun({ text, font: 'Arial', size: 36, bold: true, color: DARK })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, font: 'Arial', size: 28, bold: true, color: GOLD })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, font: 'Arial', size: 24, bold: true, color: DARK2 })]
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 80 },
    children: [new TextRun({ text, font: 'Arial', size: 22, color: BLACK, ...opts })]
  });
}

function bullet(ref, text, bold = false) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, font: 'Arial', size: 22, color: BLACK, bold })]
  });
}

function numbered(ref, text) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, font: 'Arial', size: 22, color: BLACK })]
  });
}

function infoBox(label, value) {
  return new Table({
    columnWidths: [2800, 6560],
    margins: { top: 60, bottom: 60, left: 120, right: 120 },
    rows: [new TableRow({ children: [
      new TableCell({
        borders: noCellBorder,
        width: { size: 2800, type: WidthType.DXA },
        shading: { fill: GOLD_BG, type: ShadingType.CLEAR },
        children: [new Paragraph({ children: [new TextRun({ text: label, font: 'Arial', size: 20, bold: true, color: DARK })] })]
      }),
      new TableCell({
        borders: noCellBorder,
        width: { size: 6560, type: WidthType.DXA },
        shading: { fill: GREY_BG, type: ShadingType.CLEAR },
        children: [new Paragraph({ children: [new TextRun({ text: value, font: 'Arial', size: 20, color: BLACK })] })]
      })
    ]})]
  });
}

// ── Hardware table ────────────────────────────────────────────────────────
function hwTable(rows) {
  const headerCell = (text, w) => new TableCell({
    borders: cellBorder,
    width: { size: w, type: WidthType.DXA },
    shading: { fill: DARK, type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text, font: 'Arial', size: 20, bold: true, color: GOLD_BG })] })]
  });

  const dataCell = (text, w, opts = {}) => new TableCell({
    borders: cellBorder,
    width: { size: w, type: WidthType.DXA },
    shading: { fill: opts.total ? GOLD_BG : 'FFFFFF', type: ShadingType.CLEAR },
    children: [new Paragraph({ alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
      children: [new TextRun({ text, font: 'Arial', size: 20, color: BLACK, bold: opts.total || false })] })]
  });

  return new Table({
    columnWidths: [3200, 4000, 2160],
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    rows: [
      new TableRow({ tableHeader: true, children: [
        headerCell('Componente', 3200),
        headerCell('Especificación', 4000),
        headerCell('Coste Real', 2160)
      ]}),
      ...rows.map(([comp, spec, cost, isTotal]) =>
        new TableRow({ children: [
          dataCell(comp, 3200, { total: isTotal }),
          dataCell(spec, 4000, { total: isTotal }),
          dataCell(cost, 2160, { center: true, total: isTotal })
        ]})
      )
    ]
  });
}

// ── Summary table ─────────────────────────────────────────────────────────
function summaryTable() {
  const cols = [1560, 1800, 1560, 1440, 1800, 1200];
  const headers = ['Plan', 'Coste Hardware', 'Precio Venta', 'Margen', 'Mant. Mensual', 'Año 1 (con mant.)'];
  const dataRows = [
    ['Inicial',    '560 €',    '999 €',    '439 € (44%)', '39 €/mes',  '907 €'],
    ['Pro',        '1.340 €',  '2.299 €',  '959 € (42%)', '69 €/mes',  '1.787 €'],
    ['Multi-sede', '2.000 €/sede', '3.500 €', '1.500 € (43%)', '99 €/mes', '2.688 €'],
  ];

  const hCell = (text, w) => new TableCell({
    borders: cellBorder, width: { size: w, type: WidthType.DXA },
    shading: { fill: DARK, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, font: 'Arial', size: 18, bold: true, color: GOLD_BG })] })]
  });
  const dCell = (text, w, i) => new TableCell({
    borders: cellBorder, width: { size: w, type: WidthType.DXA },
    shading: { fill: i % 2 === 0 ? GREY_BG : 'FFFFFF', type: ShadingType.CLEAR },
    children: [new Paragraph({ alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, font: 'Arial', size: 20, color: BLACK })] })]
  });

  return new Table({
    columnWidths: cols,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    rows: [
      new TableRow({ tableHeader: true, children: headers.map((h, i) => hCell(h, cols[i])) }),
      ...dataRows.map((row, ri) =>
        new TableRow({ children: row.map((cell, ci) => dCell(cell, cols[ci], ri)) })
      )
    ]
  });
}

// ── Comparison table (plan features) ─────────────────────────────────────
function featTable(planName, features, color) {
  const w = 9360;
  return new Table({
    columnWidths: [w],
    margins: { top: 60, bottom: 60, left: 160, right: 160 },
    rows: [
      new TableRow({ tableHeader: true, children: [
        new TableCell({
          borders: { top: borderGold, bottom: borderGold, left: borderGold, right: borderGold },
          width: { size: w, type: WidthType.DXA },
          shading: { fill: DARK, type: ShadingType.CLEAR },
          children: [new Paragraph({ alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: `✓  ${planName}`, font: 'Arial', size: 24, bold: true, color: GOLD_BG })] })]
        })
      ]}),
      new TableRow({ children: [
        new TableCell({
          borders: { top: borderLight, bottom: borderGold, left: borderGold, right: borderGold },
          width: { size: w, type: WidthType.DXA },
          shading: { fill: GREY_BG, type: ShadingType.CLEAR },
          children: features.map(f => new Paragraph({
            numbering: { reference: 'check-list', level: 0 },
            spacing: { before: 30, after: 30 },
            children: [new TextRun({ text: f, font: 'Arial', size: 20, color: BLACK })]
          }))
        })
      ]})
    ]
  });
}

// ── Roadmap table ─────────────────────────────────────────────────────────
function roadmapTable() {
  const cols = [1200, 3960, 4200];
  const items = [
    ['Q2 2026', 'Panel Sala — Camarero Móvil', 'Notificaciones push cuando un plato está listo. El camarero sabe exactamente qué mesa recoger sin preguntar a cocina.'],
    ['Q2 2026', 'Sistema de Caja Propio', 'Cierre de mesa, desglose por comensal/grupo, selección de método de pago (efectivo / tarjeta / Bizum QR).'],
    ['Q3 2026', 'Integración Datáfono Nativa', 'Conexión directa con Square/myPOS API para enviar el importe automáticamente sin teclear manualmente.'],
    ['Q3 2026', 'Dashboard Cloud Multi-sede', 'Panel web centralizado para ver métricas de todas las sedes en tiempo real.'],
    ['Q4 2026', 'Módulo de Fidelización', 'Sistema de puntos y descuentos para clientes recurrentes, integrado con la app QR del cliente.'],
  ];
  const hCell = (t, w) => new TableCell({ borders: cellBorder, width: { size: w, type: WidthType.DXA },
    shading: { fill: DARK, type: ShadingType.CLEAR },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: t, font: 'Arial', size: 20, bold: true, color: GOLD_BG })] })]
  });
  const dCell = (t, w, gold = false) => new TableCell({ borders: cellBorder, width: { size: w, type: WidthType.DXA },
    shading: { fill: gold ? GOLD_BG : 'FFFFFF', type: ShadingType.CLEAR },
    children: [new Paragraph({ children: [new TextRun({ text: t, font: 'Arial', size: 20, color: BLACK, bold: gold })] })]
  });

  return new Table({
    columnWidths: cols,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    rows: [
      new TableRow({ tableHeader: true, children: ['Trimestre', 'Funcionalidad', 'Descripción'].map((h, i) => hCell(h, cols[i])) }),
      ...items.map(([q, feat, desc]) => new TableRow({ children: [
        dCell(q, cols[0], true), dCell(feat, cols[1], false), dCell(desc, cols[2], false)
      ]}))
    ]
  });
}

// ── Glossary table ────────────────────────────────────────────────────────
function glossaryTable() {
  const cols = [2000, 7360];
  const terms = [
    ['KDS', 'Kitchen Display System — Pantalla digital en cocina que muestra pedidos en tiempo real, sustituyendo los tickets en papel.'],
    ['On-premise', 'Software instalado en hardware físico dentro del propio negocio, sin depender de la nube.'],
    ['PWA', 'Progressive Web App — Aplicación web que funciona como app nativa en móvil sin descarga desde tiendas de apps.'],
    ['SLA', 'Service Level Agreement — Acuerdo de nivel de servicio que define el tiempo máximo de respuesta ante incidencias.'],
    ['WebSocket', 'Protocolo de comunicación bidireccional en tiempo real entre el servidor y los navegadores.'],
    ['VPS', 'Virtual Private Server — Servidor privado virtual en la nube para alojar la capa de backups y analítica centralizada.'],
  ];
  const hCell = (t, w) => new TableCell({ borders: cellBorder, width: { size: w, type: WidthType.DXA },
    shading: { fill: DARK, type: ShadingType.CLEAR },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: t, font: 'Arial', size: 20, bold: true, color: GOLD_BG })] })]
  });
  const dCell = (t, w, gold = false) => new TableCell({ borders: cellBorder, width: { size: w, type: WidthType.DXA },
    shading: { fill: gold ? GOLD_BG : 'FFFFFF', type: ShadingType.CLEAR },
    children: [new Paragraph({ children: [new TextRun({ text: t, font: 'Arial', size: 20, color: BLACK, bold: gold })] })]
  });

  return new Table({
    columnWidths: cols,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    rows: [
      new TableRow({ tableHeader: true, children: ['Término', 'Definición'].map((h, i) => hCell(h, cols[i])) }),
      ...terms.map(([term, def]) => new TableRow({ children: [dCell(term, cols[0], true), dCell(def, cols[1])] }))
    ]
  });
}

// ── DOCUMENT ──────────────────────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run:  { size: 36, bold: true, color: DARK, font: 'Arial' },
        paragraph: { spacing: { before: 400, after: 160 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GOLD } } } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run:  { size: 28, bold: true, color: GOLD, font: 'Arial' },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run:  { size: 24, bold: true, color: DARK2, font: 'Arial' },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: 'bullet-list',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { color: GOLD, bold: true } } }] },
      { reference: 'check-list',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '✓', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 560, hanging: 360 } }, run: { color: '2D9B6F', bold: true } } }] },
      { reference: 'num-op', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'num-tec', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'num-com', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: 'num-gar', levels: [{ level: 0, format: LevelFormat.BULLET, text: '—', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },

  sections: [
    // ─────────────────────────────────────────────────────────────────────
    // SECTION 1: COVER PAGE
    // ─────────────────────────────────────────────────────────────────────
    {
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      children: [
        // Top gold bar (simulated with shaded table)
        new Table({
          columnWidths: [9360],
          rows: [new TableRow({ children: [new TableCell({
            borders: noCellBorder,
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: DARK, type: ShadingType.CLEAR },
            children: [
              gap(400),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [
                new TextRun({ text: 'COMANDALIA', font: 'Arial', size: 80, bold: true, color: GOLD })
              ]}),
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 80 }, children: [
                new TextRun({ text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', font: 'Arial', size: 16, color: GOLD })
              ]}),
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 60 }, children: [
                new TextRun({ text: 'SISTEMA DE PEDIDOS PARA RESTAURANTES', font: 'Arial', size: 22, color: WHITE, bold: false })
              ]}),
              gap(120),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [
                new TextRun({ text: 'Planes de Producto, Hardware y Estructura de Costes', font: 'Arial', size: 32, color: GOLD_BG, italics: true })
              ]}),
              gap(80),
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 400 }, children: [
                new TextRun({ text: 'Marzo 2026  ·  Documento Confidencial', font: 'Arial', size: 20, color: MUTED })
              ]}),
            ]
          })]})],
        }),
        gap(240),

        // 3 plan badges
        new Table({
          columnWidths: [3000, 3000, 3360],
          margins: { top: 100, bottom: 100, left: 160, right: 160 },
          rows: [new TableRow({ children: [
            new TableCell({
              borders: { top: borderLight, bottom: borderGold, left: borderLight, right: borderLight },
              width: { size: 3000, type: WidthType.DXA },
              shading: { fill: GREY_BG, type: ShadingType.CLEAR },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '⬡', font: 'Arial', size: 28, color: GOLD })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Plan Inicial', font: 'Arial', size: 24, bold: true, color: DARK })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Hasta 20 mesas · On-premise', font: 'Arial', size: 18, color: MUTED })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 60 }, children: [new TextRun({ text: '999 € pago único', font: 'Arial', size: 22, bold: true, color: GOLD })] }),
              ]
            }),
            new TableCell({
              borders: { top: borderGold, bottom: borderGold, left: borderGold, right: borderGold },
              width: { size: 3000, type: WidthType.DXA },
              shading: { fill: DARK, type: ShadingType.CLEAR },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '★  MÁS POPULAR', font: 'Arial', size: 16, bold: true, color: GOLD })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Plan Pro', font: 'Arial', size: 24, bold: true, color: GOLD_BG })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Mesas ilimitadas · Cloud opcional', font: 'Arial', size: 18, color: WHITE })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 60 }, children: [new TextRun({ text: '2.299 € pago único', font: 'Arial', size: 22, bold: true, color: GOLD })] }),
              ]
            }),
            new TableCell({
              borders: { top: borderLight, bottom: borderGold, left: borderLight, right: borderLight },
              width: { size: 3360, type: WidthType.DXA },
              shading: { fill: GREY_BG, type: ShadingType.CLEAR },
              children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '⬡', font: 'Arial', size: 28, color: GOLD })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Plan Multi-sede', font: 'Arial', size: 24, bold: true, color: DARK })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Franquicias · Grupos hosteleros', font: 'Arial', size: 18, color: MUTED })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 60 }, children: [new TextRun({ text: 'Precio a medida', font: 'Arial', size: 22, bold: true, color: GOLD })] }),
              ]
            }),
          ]})]
        }),

        gap(200),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [
          new TextRun({ text: 'Todos los planes incluyen piloto gratuito de 7-14 días sin compromiso', font: 'Arial', size: 20, color: MUTED, italics: true })
        ]}),
        new Paragraph({ children: [new PageBreak()] }),
      ]
    },

    // ─────────────────────────────────────────────────────────────────────
    // SECTION 2: MAIN CONTENT
    // ─────────────────────────────────────────────────────────────────────
    {
      properties: {
        page: { margin: { top: 1440, right: 1300, bottom: 1440, left: 1300 } }
      },
      headers: {
        default: new Header({ children: [
          new Paragraph({ alignment: AlignmentType.RIGHT, border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: GOLD } },
            children: [
              new TextRun({ text: 'COMANDALIA ', font: 'Arial', size: 18, bold: true, color: GOLD }),
              new TextRun({ text: '— Planes de Producto y Costes 2026', font: 'Arial', size: 18, color: MUTED }),
            ]
          })
        ]})
      },
      footers: {
        default: new Footer({ children: [
          new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 2, color: GOLD } },
            children: [
              new TextRun({ text: 'Comandalia © 2026  —  Documento confidencial  —  Página ', font: 'Arial', size: 18, color: MUTED }),
              new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 18, color: GOLD, bold: true }),
              new TextRun({ text: ' de ', font: 'Arial', size: 18, color: MUTED }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Arial', size: 18, color: MUTED }),
            ]
          })
        ]})
      },

      children: [
        // ── TOC ──────────────────────────────────────────────────────────
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 }, children: [
          new TextRun({ text: 'ÍNDICE DE CONTENIDOS', font: 'Arial', size: 28, bold: true, color: DARK })
        ]}),
        new TableOfContents('Índice', { hyperlink: true, headingStyleRange: '1-3' }),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 1. INTRODUCCIÓN ───────────────────────────────────────────────
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('1. Introducción')] }),
        body('Comandalia es un SaaS de gestión de pedidos para restaurantes, bares y hostelería. Opera en modalidad híbrida: instalación local on-premise que funciona sin internet, con capa cloud opcional para backups automáticos, actualizaciones y analítica centralizada.'),
        gap(80),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Modelo de Negocio')] }),
        bullet('bullet-list', 'Pago único por instalación + hardware (licencia de uso perpetuo incluida)'),
        bullet('bullet-list', 'Suscripción mensual opcional de mantenimiento: actualizaciones, backups cloud y soporte'),
        bullet('bullet-list', 'Sin suscripción: el cliente gestiona su sistema de forma totalmente autónoma'),
        gap(80),
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Arquitectura del Sistema')] }),
        body('Cada restaurante dispone de su propia instancia corriendo en un mini PC instalado en el local. Esta instancia opera en red WiFi local dedicada, garantizando disponibilidad 24/7 independientemente de la conexión a internet del ISP. La capa cloud centralizada (disponible con mantenimiento) sincroniza backups, distribuye actualizaciones y consolida métricas.'),
        gap(60),
        infoBox('Red local', '100% operativa aunque falle internet — pedidos, cocina y caja nunca se interrumpen'),
        gap(20),
        infoBox('Cloud opcional', 'Backups diarios cifrados, actualizaciones automáticas, acceso remoto de soporte'),
        gap(20),
        infoBox('Sin app nativa', 'Clientes usan su móvil con QR — personal usa tablet/PC en el navegador'),
        gap(20),
        infoBox('Multiidioma', 'Hasta 3 idiomas en plan Inicial, ilimitados en Pro y Multi-sede'),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 2. PLANES COMERCIALES ─────────────────────────────────────────
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('2. Los Tres Planes Comerciales')] }),
        body('Todos los planes comienzan con un piloto gratuito de 7-14 días. Sin compromiso si el restaurante no aprecia mejora en su operación.'),
        gap(120),

        // Plan Inicial
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Plan Inicial')] }),
        body('Para un solo local. Instalación local on-premise. Ideal para el primer piloto y para negocios con volumen medio-bajo.'),
        gap(60),
        infoBox('Límite mesas', 'Hasta 20 mesas'),
        gap(10),
        infoBox('Cliente ideal', 'Bar de tapas, restaurante familiar, cafetería con carta fija'),
        gap(10),
        infoBox('Onboarding', 'Operativo en 48-72 horas desde la instalación'),
        gap(80),
        featTable('Funcionalidades incluidas — Plan Inicial', [
          'App cliente QR completa (pedidos desde el móvil del cliente sin descargar nada)',
          'Panel cocina KDS — Kanban en tiempo real con alertas sonoras',
          'Panel admin completo — gestión de carta, mesas, comandas e informes',
          'Multiidioma hasta 3 idiomas',
          'Informes automáticos PDF (comida y cena)',
          'Bot Telegram para alertas operativas',
          'WebSocket en tiempo real — sin necesidad de recargar pantallas',
          'Soporte durante el piloto (7-14 días)',
        ]),
        gap(120),

        // Plan Pro
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Plan Pro')] }),
        body('Para locales de alto volumen. Incluye cloud/VPS opcional, analítica avanzada y panel de camareros para móvil.'),
        gap(60),
        infoBox('Límite mesas', 'Ilimitadas'),
        gap(10),
        infoBox('Cliente ideal', 'Restaurante alto volumen, buffet libre, hotel con restaurante (20-60 mesas)'),
        gap(10),
        infoBox('SLA soporte', 'Respuesta máxima en 24h laborables'),
        gap(80),
        featTable('Funcionalidades incluidas — Plan Pro', [
          'Todo lo incluido en el Plan Inicial',
          'Mesas ilimitadas',
          'Panel sala para camareros (PWA móvil — notificación de plato listo)',
          'Sistema de caja propio (cobro, cierre de mesa, métodos de pago)',
          'Analítica y exportes avanzados (CSV, Excel)',
          'Alertas operativas por WhatsApp',
          'Opción VPS/cloud — backups diarios y acceso remoto de soporte',
          'SLA de soporte definido (24h laborables)',
          'Revisión mensual de mejoras incluida',
        ]),
        gap(120),

        // Plan Multi-sede
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Plan Multi-sede')] }),
        body('Para grupos hosteleros, franquicias o cadenas. Gestión centralizada con autonomía operativa por local.'),
        gap(60),
        infoBox('Límite mesas', 'Ilimitadas por sede, sedes ilimitadas'),
        gap(10),
        infoBox('Cliente ideal', 'Grupos de restauración, cadenas, franquicias, hoteles con varios puntos de venta'),
        gap(10),
        infoBox('SLA soporte', 'Respuesta máxima en 4h laborables — Account manager dedicado'),
        gap(80),
        featTable('Funcionalidades incluidas — Plan Multi-sede', [
          'Todo lo incluido en el Plan Pro',
          'Panel de supervisión multi-sede (dashboard consolidado en tiempo real)',
          'Carta centralizada con variantes por local',
          'Modelo híbrido local + cloud por sede',
          'Implantación escalonada sede a sede',
          'Account manager dedicado',
          'Precio a medida según número de sedes',
        ]),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 3. HARDWARE ────────────────────────────────────────────────────
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('3. Hardware Necesario por Plan')] }),
        body('Todo el hardware se entrega pre-configurado con Comandalia instalado y listo para usar. El cliente no necesita ningún conocimiento técnico. El equipo de Comandalia realiza la instalación física y la configuración completa del sistema durante el onboarding.'),
        gap(120),

        // Hardware Inicial
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('3.1 Hardware Plan Inicial')] }),
        hwTable([
          ['Mini PC servidor', 'Beelink Mini S12 Pro / Intel NUC reacond. (N100, 8GB RAM, 256GB SSD)', '150 €'],
          ['Monitor cocina 21"', 'Monitor Full HD HDMI — montaje en pared cocina', '120 €'],
          ['Impresora térmica tickets', 'Epson TM-T20III o similar (USB + red)', '80 €'],
          ['Router WiFi', 'TP-Link Archer C6 — red local dedicada', '50 €'],
          ['Switch 8 puertos', 'TP-Link TL-SG108 — conectar mini PC, monitor cocina e impresora', '25 €'],
          ['QR codes laminados', 'Impresión + laminado plastificado × 20 mesas', '25 €'],
          ['Cableado + accesorios', 'Cable HDMI, cables red, regleta, bridas', '30 €'],
          ['Instalación y configuración', 'Desplazamiento + 3-4 h de trabajo técnico en local', '80 €'],
          ['TOTAL COSTE REAL', '', '560 €', true],
        ]),
        gap(80),
        infoBox('Precio de venta', '999 € (pago único)'),
        gap(10),
        infoBox('Margen bruto', '~439 € (~44%)'),
        gap(10),
        infoBox('Mantenimiento mensual', '39 €/mes (opcional)'),
        gap(120),

        // Hardware Pro
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('3.2 Hardware Plan Pro')] }),
        hwTable([
          ['Mini PC servidor', 'Beelink SER5 Pro / Intel NUC i5 (Ryzen 5, 16GB RAM, 512GB SSD)', '220 €'],
          ['Monitor cocina 21"', 'Monitor Full HD HDMI con soporte VESA incluido', '140 €'],
          ['Tablet sala × 1 (camarero)', 'Samsung Galaxy Tab A9 10.1" WiFi — panel sala PWA', '180 €'],
          ['Tablet admin × 1', 'Samsung Galaxy Tab A9 10.1" WiFi — panel administración', '180 €'],
          ['Fundas + soportes × 2', 'Funda robusta con soporte de mostrador por tablet', '40 €'],
          ['Impresora térmica tickets', 'Epson TM-T20III (USB + Ethernet)', '90 €'],
          ['Datáfono sin mensualidad', 'Square Terminal — cobro tarjeta 1,65% comisión, sin cuota', '165 €'],
          ['Router WiFi', 'TP-Link Archer C6 AC1200 — dual band, hasta 60 dispositivos', '70 €'],
          ['Switch 8 puertos', 'TP-Link TL-SG108E (gestionable)', '35 €'],
          ['QR codes laminados', 'Impresión + laminado × 40 mesas', '50 €'],
          ['Cableado + accesorios', 'Cables, regletas, soportes de pared', '50 €'],
          ['Instalación y configuración', 'Desplazamiento + 5-6 h de trabajo técnico en local', '120 €'],
          ['TOTAL COSTE REAL', '', '1.340 €', true],
        ]),
        gap(80),
        infoBox('Precio de venta', '2.299 € (pago único) — opción 3 × 766 € sin interés'),
        gap(10),
        infoBox('Margen bruto', '~959 € (~42%)'),
        gap(10),
        infoBox('Mantenimiento mensual', '69 €/mes (backups cloud + actualizaciones + soporte 24h + revisión mensual)'),
        gap(120),

        // Hardware Multi-sede
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('3.3 Hardware Plan Multi-sede (por sede)')] }),
        hwTable([
          ['Mini PC servidor', 'Beelink SER7 / Intel NUC i5 (Ryzen 7, 16GB RAM, 512GB SSD)', '280 €'],
          ['Monitor cocina × 2', 'Monitor Full HD 21" × 2 — cocina caliente y cocina fría', '260 €'],
          ['Tablet sala × 2 camareros', 'Samsung Galaxy Tab A9 × 2 — panel sala PWA', '360 €'],
          ['Tablet admin', 'Samsung Galaxy Tab A9+ 11" — pantalla mayor para gestión', '220 €'],
          ['Fundas + soportes × 3', 'Fundas robustas con soporte de mostrador o pared', '60 €'],
          ['Impresora tickets × 2', 'Epson TM-T20III × 2 — cocina + punto de caja', '180 €'],
          ['Datáfono', 'Square Terminal o myPOS Go 2', '165 €'],
          ['Router WiFi enterprise', 'TP-Link Omada EAP670 (WiFi 6, gestión centralizada)', '120 €'],
          ['Switch 16 puertos', 'TP-Link TL-SG116E', '60 €'],
          ['QR codes laminados', 'Impresión + laminado × 50 mesas', '65 €'],
          ['Cableado + accesorios', 'Cables, regletas, soportes', '70 €'],
          ['Instalación y configuración', 'Desplazamiento + 6-8 h técnico por sede', '160 €'],
          ['TOTAL COSTE REAL POR SEDE', '', '2.000 €', true],
        ]),
        gap(80),
        infoBox('Precio de venta', '3.500 € primera sede + 2.800 € cada sede adicional'),
        gap(10),
        infoBox('Margen bruto', '~1.500 € primera sede (~43%)'),
        gap(10),
        infoBox('Mantenimiento mensual', '99 €/sede (todo lo del Pro + account manager + panel multi-sede + SLA 4h)'),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 4. RESUMEN ─────────────────────────────────────────────────────
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('4. Resumen de Precios y Márgenes')] }),
        summaryTable(),
        gap(80),
        body('* El margen anual con mantenimiento incluye el margen de instalación más 12 mensualidades de suscripción. El cliente que no contrata mantenimiento sigue usando el sistema sin coste adicional.'),
        gap(60),
        body('Nota sobre financiación: Para los planes Pro y Multi-sede se recomienda ofrecer pago en 3 cuotas sin interés para facilitar el cierre comercial.', { color: MUTED, italics: true }),
        gap(120),

        // Coste de oportunidad
        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Amortización para el Cliente')] }),
        body('Un restaurante que pierde 2 comandas por turno a un ticket medio de 18 € pierde 36 €/día = 1.080 €/mes. Con Comandalia, el Plan Pro se amortiza en menos de un mes en ese escenario.'),
        gap(60),
        infoBox('Plan Inicial', 'Amortización estimada: 1-2 meses en operación normal'),
        gap(10),
        infoBox('Plan Pro', 'Amortización estimada: 3-6 semanas en restaurante de volumen medio-alto'),
        gap(10),
        infoBox('Upsell natural', 'Cliente Inicial → Pro sin cambiar hardware: solo upgrade software + tablet + datáfono'),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 5. FACTORES CLAVE ──────────────────────────────────────────────
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('5. Factores Clave a Tener en Cuenta')] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('5.1 Factores Operativos')] }),
        numbered('num-op', 'CONECTIVIDAD LOCAL — El sistema funciona 100% offline en la red local del restaurante. El router instalado crea una red WiFi dedicada solo para Comandalia, separada del WiFi de clientes. Esto elimina interferencias y garantiza velocidad constante.'),
        numbered('num-op', 'COMPATIBILIDAD ELÉCTRICA — Verificar toma de corriente cerca de la cocina para monitor KDS y mini PC. En locales antiguos puede requerir obra menor (coste adicional no incluido: 50-150 € según caso).'),
        numbered('num-op', 'ESPACIO EN COCINA — El monitor KDS debe ser visible desde todas las estaciones de trabajo. Se recomienda montaje en pared a 1,6-1,8 m de altura. El mini PC se ubica en zona administrativa o bajo mostrador.'),
        numbered('num-op', 'WIFI EN SALA — Para camareros con panel sala en tablet/móvil, puede ser necesario un access point adicional si el local supera 200 m² o tiene paredes gruesas (coste adicional: 40-80 € por AP).'),
        gap(120),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('5.2 Factores Técnicos')] }),
        numbered('num-tec', 'ACTUALIZACIONES — Con mantenimiento: automáticas de madrugada sin interrumpir el servicio. Sin mantenimiento: el cliente actualiza manualmente siguiendo la guía incluida en la documentación entregada.'),
        numbered('num-tec', 'BACKUPS — Con mantenimiento: backup diario cifrado a cloud (servidor Comandalia). Sin mantenimiento: backup local automático cada noche en el mini PC (el cliente es responsable de exportar la copia periódicamente).'),
        numbered('num-tec', 'LICENCIAS — El software Comandalia incluye licencia de uso perpetuo con el pago único. La suscripción mensual cubre exclusivamente servicios de mantenimiento y soporte, no el uso del software.'),
        numbered('num-tec', 'DATÁFONO — El Square Terminal y myPOS no tienen cuota mensual, solo comisión por transacción (1,65% Square / 1,20% myPOS). Si el cliente ya tiene datáfono bancario propio, el precio del plan se reduce en 165 €.'),
        gap(120),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('5.3 Factores Comerciales')] }),
        numbered('num-com', 'PILOTO GRATUITO 7-14 DÍAS — Todos los planes inician con piloto sin compromiso. Si el restaurante no aprecia mejora operativa, no hay coste. Esto elimina la principal fricción de la venta.'),
        numbered('num-com', 'FINANCIACIÓN — Para Plan Pro y Multi-sede: ofrecer pago en 3 cuotas sin interés. Ejemplo: Plan Pro 3 × 766 € en lugar de 2.299 € de golpe.'),
        numbered('num-com', 'COSTE DE OPORTUNIDAD — Un restaurante que pierde 2 comandas por turno a 18 € ticket pierde 1.080 €/mes. Comandalia se amortiza en menos de 1 mes en ese escenario.'),
        numbered('num-com', 'ESCALABILIDAD — Migración Inicial → Pro sin cambiar hardware: upgrade de software + añadir tablet + datáfono. Facilita upsell natural a los 3-6 meses de operación.'),
        gap(120),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('5.4 Garantías y Niveles de Soporte')] }),
        numbered('num-gar', 'Hardware: 12 meses de garantía en todos los componentes suministrados por Comandalia'),
        numbered('num-gar', 'Software: actualizaciones de seguridad incluidas el primer año (con o sin mantenimiento)'),
        numbered('num-gar', 'Soporte Plan Inicial: email + WhatsApp durante el piloto, luego únicamente con suscripción de mantenimiento'),
        numbered('num-gar', 'Soporte Plan Pro: email + WhatsApp + videollamada — respuesta máxima 24 h laborables'),
        numbered('num-gar', 'Soporte Plan Multi-sede: canal prioritario — respuesta máxima 4 h laborables — account manager dedicado'),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 6. HOJA DE RUTA ────────────────────────────────────────────────
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('6. Hoja de Ruta de Funcionalidades')] }),
        body('Las siguientes funcionalidades están en desarrollo activo y se incorporarán al producto durante los próximos 6 meses, incrementando el valor del sistema para todos los planes existentes sin coste adicional para los clientes con mantenimiento activo.'),
        gap(80),
        roadmapTable(),
        gap(120),

        // ── 7. GLOSARIO ────────────────────────────────────────────────────
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('7. Glosario de Términos Técnicos')] }),
        glossaryTable(),
        gap(120),

        // ── Cierre ─────────────────────────────────────────────────────────
        gap(80),
        new Table({
          columnWidths: [9360],
          rows: [new TableRow({ children: [new TableCell({
            borders: { top: borderGold, bottom: borderGold, left: borderGold, right: borderGold },
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: DARK, type: ShadingType.CLEAR },
            children: [
              gap(60),
              new Paragraph({ alignment: AlignmentType.CENTER, children: [
                new TextRun({ text: 'COMANDALIA', font: 'Arial', size: 40, bold: true, color: GOLD })
              ]}),
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 40 }, children: [
                new TextRun({ text: 'Del QR a cocina en tiempo real. Menos errores, más rotación, control total.', font: 'Arial', size: 22, color: WHITE, italics: true })
              ]}),
              new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 20, after: 60 }, children: [
                new TextRun({ text: 'contacto@comandalia.es  ·  comandalia.es', font: 'Arial', size: 20, color: GOLD })
              ]}),
            ]
          })]})],
        }),
      ]
    }
  ]
});

// ── Generate file ─────────────────────────────────────────────────────────
const OUTPUT = 'C:\\Users\\jose2\\OneDrive\\Escritorio\\proyecto.comandalia\\Comandalia_Planes_Hardware_2026.docx';
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUTPUT, buf);
  console.log('✅ Documento generado:', OUTPUT);
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
