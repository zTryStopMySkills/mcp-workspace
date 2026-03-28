const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak, UnderlineType
} = require('docx');
const fs = require('fs');

// ── Colors ───────────────────────────────────────────────────────────────
const GOLD    = 'D4960A';
const DARK    = '1A1512';
const WHITE   = 'F2EDE4';
const MUTED   = '7A7060';
const BLACK   = '1C1C1C';
const GREY_BG = 'F5F0E8';
const GOLD_BG = 'FFF3C4';
const GREEN   = '1A6B35';
const GREEN_BG= 'E8F5E9';
const BLUE    = '1A3A6B';
const BLUE_BG = 'E8F0FA';
const RED_BG  = 'FBE9E7';
const RED     = '8B1A1A';

// ── Borders ───────────────────────────────────────────────────────────────
const bGold  = { style: BorderStyle.SINGLE, size: 6, color: GOLD };
const bDark  = { style: BorderStyle.SINGLE, size: 4, color: DARK };
const bLight = { style: BorderStyle.SINGLE, size: 2, color: 'CCBBAA' };
const bNone  = { style: BorderStyle.NONE };
const allBorders = (b) => ({ top: b, bottom: b, left: b, right: b });

// ── Helpers ───────────────────────────────────────────────────────────────
const gap = (n = 200) => new Paragraph({ spacing: { before: n, after: 0 }, children: [] });

function t(text, opts = {}) {
  return new TextRun({ text, font: 'Calibri', size: 22, color: BLACK, ...opts });
}

function para(children, opts = {}) {
  if (typeof children === 'string') children = [t(children)];
  return new Paragraph({ spacing: { before: 60, after: 60 }, children, ...opts });
}

function h1(text) {
  return new Paragraph({
    spacing: { before: 300, after: 80 },
    border: { bottom: bGold },
    children: [new TextRun({ text: `  ${text}`, font: 'Calibri', size: 32, bold: true, color: DARK })],
  });
}

function h2(text) {
  return new Paragraph({
    spacing: { before: 200, after: 60 },
    children: [new TextRun({ text, font: 'Calibri', size: 26, bold: true, color: GOLD })],
  });
}

function h3(text) {
  return new Paragraph({
    spacing: { before: 160, after: 40 },
    children: [new TextRun({ text, font: 'Calibri', size: 24, bold: true, color: DARK })],
  });
}

function bullet(text, indent = 0) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    indent: { left: 360 + indent * 360 },
    children: [
      new TextRun({ text: '• ', font: 'Calibri', size: 22, color: GOLD, bold: true }),
      new TextRun({ text, font: 'Calibri', size: 22, color: BLACK }),
    ],
  });
}

function check(text) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    indent: { left: 360 },
    children: [
      new TextRun({ text: '✓  ', font: 'Calibri', size: 22, color: GREEN, bold: true }),
      new TextRun({ text, font: 'Calibri', size: 22, color: BLACK }),
    ],
  });
}

function highlight(text, bg, color = BLACK) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    shading: { fill: bg.replace('#',''), type: ShadingType.CLEAR },
    indent: { left: 240, right: 240 },
    children: [new TextRun({ text, font: 'Calibri', size: 22, color: color.replace('#',''), bold: true })],
  });
}

function boldLabel(label, value) {
  return new Paragraph({
    spacing: { before: 50, after: 50 },
    indent: { left: 360 },
    children: [
      new TextRun({ text: label + ': ', font: 'Calibri', size: 22, bold: true, color: DARK }),
      new TextRun({ text: value, font: 'Calibri', size: 22, color: BLACK }),
    ],
  });
}

// ── Simple table ──────────────────────────────────────────────────────────
function simpleTable(headers, rows, colWidths) {
  const total = colWidths.reduce((a, b) => a + b, 0);
  const hRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => new TableCell({
      borders: allBorders(bDark),
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill: DARK, type: ShadingType.CLEAR },
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: h, font: 'Calibri', size: 20, bold: true, color: GOLD_BG })]
      })]
    }))
  });

  const dataRows = rows.map((row, ri) => new TableRow({
    children: row.map((cell, ci) => {
      const isTotal = typeof cell === 'string' && (cell.startsWith('TOTAL') || cell.includes('Total'));
      const isCost  = typeof cell === 'string' && cell.includes('€');
      return new TableCell({
        borders: allBorders(bLight),
        width: { size: colWidths[ci], type: WidthType.DXA },
        shading: { fill: isTotal ? GOLD_BG : ri % 2 === 0 ? 'FFFFFF' : GREY_BG, type: ShadingType.CLEAR },
        children: [new Paragraph({
          alignment: ci === colWidths.length - 1 ? AlignmentType.RIGHT : AlignmentType.LEFT,
          children: [new TextRun({ text: String(cell), font: 'Calibri', size: 20, bold: isTotal, color: isTotal ? DARK : BLACK })]
        })]
      });
    })
  }));

  return new Table({ columnWidths: colWidths, rows: [hRow, ...dataRows], margins: { top: 60, bottom: 60, left: 80, right: 80 } });
}

// ── Dialog box (guión) ────────────────────────────────────────────────────
function dialogBox(speaker, text, bg) {
  return new Table({
    columnWidths: [1400, 8000],
    margins: { top: 40, bottom: 40, left: 60, right: 60 },
    rows: [new TableRow({ children: [
      new TableCell({
        borders: allBorders(bNone),
        width: { size: 1400, type: WidthType.DXA },
        shading: { fill: DARK, type: ShadingType.CLEAR },
        children: [new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: speaker, font: 'Calibri', size: 18, bold: true, color: GOLD_BG })] })]
      }),
      new TableCell({
        borders: allBorders(bLight),
        width: { size: 8000, type: WidthType.DXA },
        shading: { fill: bg, type: ShadingType.CLEAR },
        children: [new Paragraph({ indent: { left: 120 },
          children: [new TextRun({ text, font: 'Calibri', size: 20, color: BLACK, italics: true })] })]
      }),
    ]})]
  });
}

function objDialog(objecion, respuesta) {
  return [
    new Table({
      columnWidths: [9400],
      rows: [new TableRow({ children: [new TableCell({
        borders: { top: bLight, bottom: bNone, left: { style: BorderStyle.SINGLE, size: 8, color: RED }, right: bNone },
        shading: { fill: RED_BG, type: ShadingType.CLEAR },
        children: [new Paragraph({ indent: { left: 160 },
          children: [
            new TextRun({ text: '⚠ Objeción: ', font: 'Calibri', size: 20, bold: true, color: RED }),
            new TextRun({ text: objecion, font: 'Calibri', size: 20, color: RED, italics: true }),
          ] })]
      })] })]
    }),
    new Table({
      columnWidths: [9400],
      rows: [new TableRow({ children: [new TableCell({
        borders: { top: bNone, bottom: bLight, left: { style: BorderStyle.SINGLE, size: 8, color: GREEN }, right: bNone },
        shading: { fill: GREEN_BG, type: ShadingType.CLEAR },
        children: [new Paragraph({ indent: { left: 160 }, spacing: { before: 40, after: 80 },
          children: [
            new TextRun({ text: '✓ Respuesta: ', font: 'Calibri', size: 20, bold: true, color: GREEN }),
            new TextRun({ text: respuesta, font: 'Calibri', size: 20, color: BLACK }),
          ] })]
      })] })]
    }),
    gap(60),
  ];
}

// ── Plan card ─────────────────────────────────────────────────────────────
function planCard(titulo, descripcion, mesas, precio, mantenimiento, features, hw) {
  const headerBg = titulo.includes('Multi') ? '2C3E50' : titulo.includes('Pro') ? DARK : '3D3525';
  return new Table({
    columnWidths: [9400],
    margins: { top: 80, bottom: 80, left: 0, right: 0 },
    rows: [
      new TableRow({ children: [new TableCell({
        borders: allBorders(bGold),
        shading: { fill: headerBg, type: ShadingType.CLEAR },
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 20 },
            children: [new TextRun({ text: titulo, font: 'Calibri', size: 36, bold: true, color: GOLD_BG })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 100 },
            children: [new TextRun({ text: descripcion, font: 'Calibri', size: 20, color: WHITE, italics: true })] }),
        ]
      })] }),
      new TableRow({ children: [new TableCell({
        borders: { top: bNone, bottom: bGold, left: bGold, right: bGold },
        shading: { fill: GREY_BG, type: ShadingType.CLEAR },
        children: [
          gap(60),
          new Paragraph({ indent: { left: 240, right: 240 }, spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: '  Límite mesas: ', font: 'Calibri', size: 22, bold: true, color: DARK }),
              new TextRun({ text: mesas, font: 'Calibri', size: 22, color: BLACK }),
            ] }),
          new Paragraph({ indent: { left: 240, right: 240 }, spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: '  Precio cliente: ', font: 'Calibri', size: 22, bold: true, color: DARK }),
              new TextRun({ text: precio, font: 'Calibri', size: 22, bold: true, color: GOLD }),
            ] }),
          new Paragraph({ indent: { left: 240, right: 240 }, spacing: { before: 40, after: 60 },
            children: [
              new TextRun({ text: '  Mantenimiento opcional: ', font: 'Calibri', size: 22, bold: true, color: DARK }),
              new TextRun({ text: mantenimiento, font: 'Calibri', size: 22, color: BLACK }),
            ] }),
          new Paragraph({ indent: { left: 240 }, spacing: { before: 80, after: 40 },
            children: [new TextRun({ text: 'QUÉ INCLUYE:', font: 'Calibri', size: 20, bold: true, color: DARK })] }),
          ...features.map(f => new Paragraph({ indent: { left: 480 }, spacing: { before: 30, after: 30 },
            children: [
              new TextRun({ text: '✓  ', font: 'Calibri', size: 20, color: GREEN, bold: true }),
              new TextRun({ text: f, font: 'Calibri', size: 20, color: BLACK }),
            ] })),
          new Paragraph({ indent: { left: 240 }, spacing: { before: 100, after: 40 },
            children: [new TextRun({ text: 'HARDWARE INCLUIDO (coste referencia):', font: 'Calibri', size: 20, bold: true, color: DARK })] }),
          ...hw.map(([comp, spec, coste]) => new Paragraph({ indent: { left: 480 }, spacing: { before: 28, after: 28 },
            children: [
              new TextRun({ text: '• ', font: 'Calibri', size: 20, color: GOLD, bold: true }),
              new TextRun({ text: `${comp}: `, font: 'Calibri', size: 20, bold: true, color: DARK }),
              new TextRun({ text: `${spec} — `, font: 'Calibri', size: 20, color: BLACK }),
              new TextRun({ text: coste, font: 'Calibri', size: 20, bold: true, color: GREEN }),
            ] })),
          gap(80),
        ]
      })] }),
    ]
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// DOCUMENT BUILDER
// ═══════════════════════════════════════════════════════════════════════════
function buildDoc(agentName, agentId, firstNameOverride) {

  const firstName = firstNameOverride || agentName.split(' ')[0];

  // ── Sections ──────────────────────────────────────────────────────────
  const sections = [

    // ─── COVER ────────────────────────────────────────────────────────
    {
      properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: [
        gap(400),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 40 },
          shading: { fill: DARK, type: ShadingType.CLEAR },
          children: [new TextRun({ text: '  COMANDALIA  ', font: 'Calibri', size: 80, bold: true, color: GOLD_BG })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 40 },
          shading: { fill: DARK, type: ShadingType.CLEAR },
          children: [new TextRun({ text: 'Sistema de Pedidos para Restaurantes', font: 'Calibri', size: 24, color: WHITE })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 0 },
          shading: { fill: DARK, type: ShadingType.CLEAR },
          children: [new TextRun({ text: ' ', font: 'Calibri', size: 28, color: WHITE })] }),
        gap(200),
        new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'DOSSIER COMERCIAL CONFIDENCIAL', font: 'Calibri', size: 28, bold: true, color: DARK,
            underline: { type: UnderlineType.SINGLE, color: GOLD } })] }),
        gap(100),
        new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `Agente: ${agentName}`, font: 'Calibri', size: 26, bold: true, color: DARK })] }),
        new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `ID: ${agentId}  ·  Temporada 2026`, font: 'Calibri', size: 22, color: MUTED })] }),
        gap(200),
        new Paragraph({ alignment: AlignmentType.CENTER,
          shading: { fill: GOLD_BG, type: ShadingType.CLEAR },
          children: [new TextRun({ text: '  ⚠  Documento de uso exclusivo interno — No compartir con clientes  ⚠  ', font: 'Calibri', size: 20, bold: true, color: DARK })] }),
        gap(300),
        new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'CONTENIDO:', font: 'Calibri', size: 22, bold: true, color: DARK })] }),
        gap(40),
        ...['1.  Guión de entrada comercial', '2.  Los tres planes Comandalia', '3.  Desglose de hardware por plan', '4.  Argumentario y objeciones frecuentes', '5.  Condiciones del piloto y cierre'].map(s =>
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 40 },
            children: [new TextRun({ text: s, font: 'Calibri', size: 22, color: MUTED })] })
        ),
        gap(200),
        new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Comandalia  ©  2026  ·  Todos los derechos reservados', font: 'Calibri', size: 18, color: MUTED, italics: true })] }),
        new Paragraph({ children: [new PageBreak()] }),
      ]
    },

    // ─── MAIN CONTENT ──────────────────────────────────────────────────
    {
      properties: { page: { margin: { top: 1200, right: 1300, bottom: 1100, left: 1300 } } },
      headers: {
        default: new Header({ children: [
          new Table({ columnWidths: [4000, 5400], rows: [new TableRow({ children: [
            new TableCell({ borders: allBorders(bNone), children: [
              new Paragraph({ children: [new TextRun({ text: 'COMANDALIA', font: 'Calibri', size: 20, bold: true, color: GOLD })] })
            ]}),
            new TableCell({ borders: allBorders(bNone), children: [
              new Paragraph({ alignment: AlignmentType.RIGHT, children: [
                new TextRun({ text: `Dossier Comercial — ${agentName}`, font: 'Calibri', size: 18, color: MUTED, italics: true })
              ]})
            ]}),
          ]})] }),
          new Paragraph({ border: { bottom: bGold }, children: [] }),
        ]}),
      },
      footers: {
        default: new Footer({ children: [
          new Paragraph({ border: { top: bLight }, alignment: AlignmentType.CENTER, children: [
            new TextRun({ text: 'Comandalia © 2026 — Documento confidencial de uso interno — ', font: 'Calibri', size: 16, color: MUTED }),
            new TextRun({ children: [PageNumber.CURRENT], font: 'Calibri', size: 16, color: MUTED }),
          ]})
        ]}),
      },
      children: [

        // ══════════════════════════════════════════
        // SECCIÓN 1: GUIÓN COMERCIAL
        // ══════════════════════════════════════════
        h1('1.  GUIÓN DE ENTRADA COMERCIAL'),
        gap(40),
        para([
          t(`${firstName}, este guión está diseñado para abrirte puertas con rapidez. No es un script rígido: `, { italics: true, color: MUTED }),
          t('adáptalo a tu estilo.', { bold: true, italics: true, color: MUTED }),
          t(' Úsalo como referencia antes de las primeras llamadas y visitas.', { italics: true, color: MUTED }),
        ]),
        gap(80),

        h2('FASE 1 — Primer contacto (teléfono o visita en frío)'),
        gap(40),
        highlight('Objetivo: Conseguir 15 minutos con el responsable del local. Nada más.', GOLD_BG),
        gap(60),
        dialogBox('TÚ', `"Buenos días/tardes, ¿está el encargado o el propietario del restaurante? (Pausa) Hola, me llamo ${firstName}, llamo de parte de Comandalia. Somos una empresa que ayuda a restaurantes como el suyo a gestionar sus pedidos desde el móvil del cliente directamente a cocina, sin papel y en tiempo real. ¿Tiene dos minutos?"`, GREY_BG),
        gap(20),
        dialogBox('SI DICE SÍ →', '"Perfecto. ¿Cuántas mesas tienen aproximadamente en sala?" (Escucha, apunta) "Entiendo. ¿Me puede decir si ahora mismo tienen algún sistema digital para los pedidos o siguen usando comanda en papel?" (Escucha) "Muy bien. Le propongo que le haga una demostración en vivo de 10-15 minutos, sin compromiso. ¿Qué días tiene usted disponibles esta semana?"', BLUE_BG),
        gap(20),
        dialogBox('SI DICE NO →', '"Sin problema, ¿cuándo podría llamarle? Solo le pido 10 minutos. Pueden ahorrar entre 2 y 4 comandas perdidas por servicio; en cifras eso suele ser más de 1.000€ al mes." (Pausa) "¿Le llamo mañana a la misma hora?"', RED_BG),
        gap(80),

        h2('FASE 2 — Primera reunión / demostración'),
        gap(40),
        highlight('Objetivo: Mostrar el sistema y identificar el plan adecuado.', GOLD_BG),
        gap(60),
        para([t('Abre con una pregunta diagnóstico antes de mostrar nada:')]),
        dialogBox('TÚ', '"Antes de enseñarle el sistema, cuénteme: ¿cuál es el mayor quebradero de cabeza en el servicio? ¿Las comandas? ¿La comunicación entre sala y cocina? ¿Los cobros?"', GREY_BG),
        gap(20),
        para([t('Escucha activamente. Anota. Luego conecta la demo con lo que acaba de decir:')]),
        dialogBox('TÚ', '"Pues precisamente eso es lo que resuelve Comandalia. Mire: el cliente escanea el QR de la mesa con su móvil (saca el móvil, muestra la app), elige del menú, confirma y… (pausa dramática) el pedido aparece en cocina al instante, aquí, en esta pantalla. Sin papeles, sin errores, sin camareros corriendo."', GREY_BG),
        gap(20),
        para([t('Puntos a destacar en la demo (en este orden):')]),
        check('App cliente — sencilla, funciona en cualquier móvil sin descargas'),
        check('Pantalla cocina en tiempo real (KDS) — el cocinero ve el pedido al segundo'),
        check('Panel admin — el dueño controla todo desde su tablet o móvil'),
        check('Bot Telegram — alertas al instante si algo va mal'),
        check('Informes automáticos — el cierre de cada servicio llega solo al WhatsApp'),
        gap(80),

        h2('FASE 3 — Presentación del plan y cierre'),
        gap(40),
        highlight('Objetivo: Proponer el plan correcto y cerrar el piloto gratuito.', GOLD_BG),
        gap(60),
        dialogBox('TÚ', '"Con lo que me ha contado, y viendo el tamaño de su local, el plan que mejor le encaja es el [INICIAL / PRO / MULTI-SEDE]. Incluye todo lo que acaba de ver instalado y configurado en su negocio. El precio es [XXX €] pago único. Y lo más importante: empezamos con un piloto gratuito de 7 a 14 días. Si al final del piloto no ve una mejora real en su operación, no hay coste. ¿Le parece bien que lo probemos?"', GREY_BG),
        gap(20),
        para([t('Si pide tiempo para pensarlo:')]),
        dialogBox('TÚ', '"Perfecto, no hay prisa. ¿Le parece si le mando el dossier por WhatsApp y le llamo el [día concreto] para resolver dudas?" (No dejar sin fecha de seguimiento)', BLUE_BG),
        gap(120),

        h2('FASE 4 — Seguimiento post-demo'),
        gap(40),
        para([t(`${firstName}, la venta rara vez se cierra en el primer contacto. Aquí está el protocolo de seguimiento:`)]),
        gap(40),
        simpleTable(
          ['Día', 'Acción', 'Canal'],
          [
            ['Día 0 (mismo día)', 'Enviar dossier + resumen de lo hablado', 'WhatsApp'],
            ['Día 2', 'Llamada de seguimiento: ¿ha revisado el dossier? ¿preguntas?', 'Teléfono'],
            ['Día 5', 'Si no respondió: recordatorio breve + caso de éxito', 'WhatsApp'],
            ['Día 10', 'Última llamada: oferta piloto gratuito con fecha límite', 'Teléfono'],
            ['Día 14+', 'Pasar a "frío" — ciclo de contacto mensual', 'Email / WhatsApp'],
          ],
          [1800, 5200, 2400]
        ),
        gap(120),
        new Paragraph({ children: [new PageBreak()] }),

        // ══════════════════════════════════════════
        // SECCIÓN 2: LOS TRES PLANES
        // ══════════════════════════════════════════
        h1('2.  LOS TRES PLANES COMANDALIA'),
        gap(60),
        para([
          t('Comandalia opera en modalidad '),
          t('híbrida on-premise + cloud opcional', { bold: true }),
          t(': el sistema funciona 100% dentro de la red local del restaurante, sin depender de internet. Opcional: capa cloud para backups, actualizaciones y analítica centralizada.'),
        ]),
        gap(80),

        planCard(
          'Plan INICIAL',
          'Para locales de hasta 20 mesas — Piloto ideal',
          'Hasta 20 mesas',
          '999 € pago único',
          '39 €/mes (opcional)',
          [
            'App cliente QR completa (pedidos desde móvil del cliente)',
            'Panel cocina KDS — Kanban en tiempo real',
            'Panel admin completo (carta, mesas, comandas, informes)',
            'Multiidioma hasta 3 idiomas',
            'WebSocket: actualizaciones al instante',
            'Informes automáticos en PDF',
            'Bot Telegram para alertas operativas',
            'Onboarding en 48-72 horas',
            'Soporte durante el piloto (7-14 días)',
          ],
          [
            ['Mini PC servidor', 'Beelink Mini S12 Pro — N100, 8GB RAM, 256GB SSD', '150 €'],
            ['Monitor cocina 21"', 'Full HD HDMI (montaje en pared)', '120 €'],
            ['Impresora térmica', 'Epson TM-T20III USB+red', '80 €'],
            ['Router WiFi', 'TP-Link TL-WR940N (red local dedicada)', '50 €'],
            ['Switch 8 puertos', 'TP-Link TL-SG108', '25 €'],
            ['QR codes laminados', '×20 mesas — impresión + laminado', '25 €'],
            ['Cableado + accesorios', 'HDMI, red, regleta, bridas', '30 €'],
            ['Instalación y config.', 'Desplazamiento + 3-4h trabajo técnico', '80 €'],
          ]
        ),
        gap(100),

        planCard(
          'Plan PRO  ★ Más popular',
          'Para locales de alto volumen — Mesas ilimitadas',
          'Ilimitadas',
          '2.299 € pago único',
          '69 €/mes (opcional, incluye cloud + soporte 24h)',
          [
            'Todo lo del Plan Inicial, más:',
            'Mesas ilimitadas',
            'Panel sala para camareros (PWA móvil — notificaciones plato listo)',
            'Sistema de caja propio (cobro, cierre de mesa, métodos de pago)',
            'Analítica y exportes avanzados (CSV, Excel)',
            'Alertas operativas por WhatsApp',
            'Opción VPS/cloud (backups diarios, acceso remoto)',
            'SLA de soporte: respuesta en 24h laborables',
            'Revisión mensual de mejoras',
          ],
          [
            ['Mini PC servidor', 'Beelink SER5 Pro — Ryzen 5, 16GB RAM, 512GB SSD', '220 €'],
            ['Monitor cocina 21"', 'Full HD con soporte VESA', '140 €'],
            ['Tablet sala (camarero) ×1', 'Samsung Galaxy Tab A9 10.1" WiFi', '180 €'],
            ['Tablet admin ×1', 'Samsung Galaxy Tab A9 10.1" WiFi', '180 €'],
            ['Fundas + soporte ×2', 'Funda robusta con soporte de mostrador', '40 €'],
            ['Impresora térmica', 'Epson TM-T20III USB+Ethernet', '90 €'],
            ['Datáfono sin mensualidad', 'Square Terminal (1,65% comisión, sin cuota)', '165 €'],
            ['Router WiFi', 'TP-Link Archer C6 AC1200 dual band', '70 €'],
            ['Switch 8 puertos', 'TP-Link TL-SG108E gestionable', '35 €'],
            ['QR codes laminados', '×40 mesas', '50 €'],
            ['Cableado + accesorios', 'Cables, regletas, soportes', '50 €'],
            ['Instalación y config.', 'Desplazamiento + 5-6h trabajo técnico', '120 €'],
          ]
        ),
        gap(100),

        planCard(
          'Plan MULTI-SEDE',
          'Para grupos hosteleros, franquicias y cadenas',
          'Ilimitadas por sede — Sedes ilimitadas',
          'A medida: base 3.500 € primera sede + 2.800 € cada sede adicional',
          '99 €/mes por sede (incluye account manager + SLA 4h)',
          [
            'Todo lo del Plan Pro, más:',
            'Panel de supervisión multi-sede (dashboard consolidado)',
            'Carta centralizada con variantes por local',
            'Modelo híbrido local + cloud por sede',
            'Implantación escalonada (sede a sede)',
            'Account manager dedicado',
            'Canal de soporte prioritario — respuesta máx. 4h laborables',
          ],
          [
            ['Mini PC servidor', 'Intel NUC i5 / Beelink SER7 — Ryzen 7, 16GB RAM, 512GB SSD', '280 €'],
            ['Monitor cocina ×2', 'Full HD 21" × 2 (cocina caliente + cocina fría)', '260 €'],
            ['Tablet sala ×2', 'Samsung Galaxy Tab A9 × 2 camareros', '360 €'],
            ['Tablet admin ×1', 'Samsung Galaxy Tab A9+ 11"', '220 €'],
            ['Fundas + soportes ×3', 'Fundas robustas con soporte', '60 €'],
            ['Impresora térmica ×2', 'Epson TM-T20III × 2 (cocina + caja)', '180 €'],
            ['Datáfono', 'Square Terminal o myPOS Go 2', '165 €'],
            ['Router WiFi enterprise', 'TP-Link Omada EAP670 WiFi 6', '120 €'],
            ['Switch 16 puertos', 'TP-Link TL-SG116E', '60 €'],
            ['QR codes laminados', '×50 mesas', '65 €'],
            ['Cableado + accesorios', 'Cables, regletas, soportes', '70 €'],
            ['Instalación y config.', 'Desplazamiento + 6-8h técnico por sede', '160 €'],
          ]
        ),
        gap(120),
        new Paragraph({ children: [new PageBreak()] }),

        // ══════════════════════════════════════════
        // SECCIÓN 3: RESUMEN DE PRECIOS
        // ══════════════════════════════════════════
        h1('3.  TABLA DE PRECIOS AL CLIENTE'),
        gap(60),
        simpleTable(
          ['Plan', 'Precio instalación\n(pago único)', 'Mantenimiento\n(mensual, opcional)', 'Pago fraccionado\n(×3 cuotas)'],
          [
            ['Plan Inicial', '999 €', '39 €/mes', '3 × 333 €'],
            ['Plan Pro', '2.299 €', '69 €/mes', '3 × 766 €'],
            ['Multi-sede — 1ª sede', '3.500 €', '99 €/mes por sede', '3 × 1.167 €'],
            ['Multi-sede — sedes adicionales', '2.800 € / sede', '99 €/mes por sede', '3 × 933 €'],
          ],
          [2200, 2400, 2400, 2400]
        ),
        gap(80),
        highlight('IMPORTANTE: El pago fraccionado es sin intereses. Facilita enormemente el cierre.', BLUE_BG),
        gap(60),

        h3('Qué incluye el mantenimiento mensual'),
        check('Backups diarios cifrados en cloud (servidor Comandalia)'),
        check('Actualizaciones automáticas de madrugada sin interrumpir el servicio'),
        check('Soporte técnico por email, WhatsApp y videollamada'),
        check('Revisiones mensuales de mejoras y nuevas funcionalidades'),
        check('(Plan Multi-sede) Account manager dedicado + SLA 4h de respuesta'),
        gap(60),
        para([t('Sin mantenimiento, el cliente gestiona el sistema de forma autónoma. El software sigue funcionando con licencia perpetua, solo se desactivan los servicios cloud y el soporte prioritario.', { color: MUTED, italics: true })]),
        gap(120),
        new Paragraph({ children: [new PageBreak()] }),

        // ══════════════════════════════════════════
        // SECCIÓN 4: ARGUMENTARIO Y OBJECIONES
        // ══════════════════════════════════════════
        h1('4.  ARGUMENTARIO Y OBJECIONES FRECUENTES'),
        gap(60),

        h2('Argumentos de valor clave'),
        gap(40),
        bullet('Un restaurante que pierde 2 comandas por turno a 18€ media → 36€/día → 1.080€/mes perdidos. Comandalia se amortiza en menos de 1 mes.'),
        bullet('El cliente NO necesita descargar ninguna app. Escanea el QR y ya está. Menos fricción = más pedidos.'),
        bullet('El sistema funciona sin internet. Si cae la fibra, el restaurante sigue operando.'),
        bullet('El datáfono incluido (Square Terminal) no tiene cuota mensual. Solo paga el 1,65% por transacción.'),
        bullet('Piloto gratuito sin compromiso: 7-14 días. Si no mejora su operación, no paga nada.'),
        bullet('Licencia perpetua: el cliente paga una vez y el software es suyo. La suscripción es solo para los servicios cloud y soporte.'),
        gap(80),

        h2('Objeciones frecuentes y cómo responderlas'),
        gap(40),

        ...objDialog(
          '"Es muy caro para lo que hace"',
          'Entiendo. ¿Cuántas comandas cree que pierde o se confunden al mes? Con 2 comandas al día a 18€, son más de 1.000€ al mes. Comandalia se paga sola en el primer mes. Además, empezamos con piloto gratuito: si no ve el retorno, no paga nada.'
        ),

        ...objDialog(
          '"Ya tenemos un TPV que hace algo parecido"',
          'Perfecto, entonces entiende el valor de la digitalización. La diferencia es que Comandalia va más allá del TPV: el pedido lo hace el propio cliente desde su móvil, sin camareros tomando nota. El TPV registra; Comandalia gestiona todo el flujo. ¿Le puedo mostrar la diferencia en 5 minutos?'
        ),

        ...objDialog(
          '"Mis clientes son mayores, no saben usar el móvil"',
          'Es una preocupación muy común. El diseño de la app es tan sencillo como ver un menú en PDF. Además, el camarero puede seguir tomando nota a mano y registrarlo en el panel admin: no es obligatorio que el cliente use el QR. Funciona en modo híbrido.'
        ),

        ...objDialog(
          '"¿Y si se cae internet?"',
          'Precisamente esta es una de las grandes ventajas: Comandalia funciona 100% offline dentro de la red WiFi del restaurante. El router que instalamos crea una red local dedicada solo para el sistema. Si cae la fibra, el restaurante sigue funcionando sin problema.'
        ),

        ...objDialog(
          '"Necesito consultarlo con mi socio / contable"',
          'Perfecto, tiene toda la lógica. ¿Le parece si preparamos una llamada conjunta para resolver las dudas de los dos a la vez? De ese modo no pierde tiempo explicando. ¿Cuándo les viene bien?'
        ),

        gap(120),
        new Paragraph({ children: [new PageBreak()] }),

        // ══════════════════════════════════════════
        // SECCIÓN 5: PILOTO Y CIERRE
        // ══════════════════════════════════════════
        h1('5.  CONDICIONES DEL PILOTO Y CHECKLIST DE CIERRE'),
        gap(60),

        h2('Condiciones del piloto gratuito'),
        gap(40),
        simpleTable(
          ['Condición', 'Detalle'],
          [
            ['Duración', '7 días mínimo — 14 días recomendado'],
            ['Coste', 'CERO. Sin tarjeta, sin compromiso'],
            ['Instalación', 'Técnico de Comandalia en el local (1 visita)'],
            ['Hardware', 'Se instala el plan correspondiente durante el piloto'],
            ['Soporte', 'WhatsApp + email directo durante todo el piloto'],
            ['Al finalizar', 'El cliente decide: compra el plan o el técnico recoge el hardware'],
            ['Conversión objetivo', 'El 80% de los pilotos se convierten en clientes'],
          ],
          [3000, 6400]
        ),
        gap(100),

        h2(`Checklist de cierre — ${firstName}`),
        gap(40),
        highlight('Usa esta lista antes de dar por cerrada la venta:', GREY_BG),
        gap(60),

        ...([
          '¿Has identificado el número de mesas y tipo de local?',
          '¿Has elegido el plan correcto (Inicial / Pro / Multi-sede)?',
          '¿Has explicado el piloto gratuito y su duración?',
          '¿Has ofrecido la opción de pago fraccionado (3 cuotas)?',
          '¿Ha visto la demo en directo (app cliente + cocina + admin)?',
          '¿Ha entendido que el sistema funciona sin internet?',
          '¿Tiene fecha fijada para la instalación del piloto?',
          '¿Has enviado el dossier por WhatsApp o email?',
          '¿Tienes el nombre, teléfono y email del responsable?',
          '¿Has notificado a Comandalia para coordinar la instalación?',
        ].map(item => new Paragraph({
          spacing: { before: 50, after: 50 },
          indent: { left: 360 },
          children: [
            new TextRun({ text: '☐  ', font: 'Calibri', size: 22, color: GOLD, bold: true }),
            new TextRun({ text: item, font: 'Calibri', size: 22, color: BLACK }),
          ]
        }))),

        gap(140),
        new Paragraph({ children: [new PageBreak()] }),

        // ══════════════════════════════════════════
        // GUIÓN RÁPIDO DEL CHECKLIST
        // ══════════════════════════════════════════
        h2('Guión rápido del checklist — cómo resolverlo en el momento'),
        gap(40),
        highlight('Usa este guión para no quedarte bloqueado ante cada punto del checklist.', GREY_BG),
        gap(80),

        ...[
          {
            num: '01',
            pregunta: '¿Has identificado el número de mesas y tipo de local?',
            como: 'Pregunta directa en los primeros 2 minutos:',
            frase: '"¿Cuántas mesas tienen en sala? ¿Y en terraza o exterior?"',
            nota: 'Apúntalo en el móvil al momento. Si no puedes verlo, pide recorrer el local antes de la demo. Sin este dato no puedes proponer el plan correcto.',
          },
          {
            num: '02',
            pregunta: '¿Has elegido el plan correcto (Inicial / Pro / Multi-sede)?',
            como: 'Regla rápida de decisión:',
            frase: '"Hasta 20 mesas → Inicial · 20+ mesas o necesitan caja → Pro · 2 o más locales → Multi-sede"',
            nota: 'En caso de duda entre Inicial y Pro, ve siempre al Pro: el cliente tiene más margen de crecimiento y tú más comisión. Nunca propongas Multi-sede sin confirmar que hay al menos 2 locales activos.',
          },
          {
            num: '03',
            pregunta: '¿Has explicado el piloto gratuito y su duración?',
            como: 'Intégralo antes de hablar de precio:',
            frase: '"Lo más importante: empezamos con 7 a 14 días completamente gratis. Hardware instalado, sistema funcionando. Si al terminar no ve mejora real, el técnico recoge el equipo y no paga nada."',
            nota: 'El piloto es tu mejor arma de cierre. Si el cliente pone objeciones de precio, vuelve al piloto antes de negociar nada.',
          },
          {
            num: '04',
            pregunta: '¿Has ofrecido la opción de pago fraccionado (3 cuotas)?',
            como: 'Menciónalo siempre antes de que pregunten por el precio:',
            frase: '"Y si le viene mejor, podemos dividirlo en 3 cuotas sin intereses. El Plan Inicial son 3 × 333€. El Pro, 3 × 766€."',
            nota: 'No esperes a que digan que es caro. Ofrecer el fraccionado de entrada elimina la objeción antes de que aparezca.',
          },
          {
            num: '05',
            pregunta: '¿Ha visto la demo en directo (app cliente + cocina + admin)?',
            como: 'Nunca cierres sin demo. Flujo mínimo en 5 minutos:',
            frase: '"Le muestro el pedido desde el móvil → aparece en cocina → admin lo ve todo. ¿Tiene el móvil a mano?"',
            nota: 'Si no hay WiFi disponible: usa grabación de pantalla pregrabada. Si el cliente tiene prisa: haz solo el flujo cliente→cocina, es el más impactante. Sin demo visual, la tasa de conversión cae a la mitad.',
          },
          {
            num: '06',
            pregunta: '¿Ha entendido que el sistema funciona sin internet?',
            como: 'Repítelo con énfasis si hay escepticismo:',
            frase: '"Aunque se caiga la fibra, el restaurante sigue funcionando. El router que instalamos crea su propia red privada, solo para Comandalia. Sin internet externo."',
            nota: 'Esta objeción es frecuente en locales con mala cobertura. Si el cliente la plantea, es una señal positiva: está pensando en el día a día real.',
          },
          {
            num: '07',
            pregunta: '¿Tiene fecha fijada para la instalación del piloto?',
            como: 'Nunca salgas de la reunión sin fecha. Usa siempre alternativa cerrada:',
            frase: '"¿Le viene mejor esta semana o la semana que viene? ¿Mañana por la mañana o por la tarde?"',
            nota: 'Escríbela en el móvil delante del cliente y dile que le vas a confirmar por WhatsApp. Si no fija fecha, el piloto no ocurre.',
          },
          {
            num: '08',
            pregunta: '¿Has enviado el dossier por WhatsApp o email?',
            como: 'Hazlo el mismo día, antes de las 20h. Mensaje tipo:',
            frase: '"Hola [nombre], como quedamos le mando el dossier de Comandalia. Quedo a su disposición para cualquier duda. Le llamo el [día concreto]."',
            nota: 'Adjunta el PDF del dossier general (no el interno). No envíes este dossier de agente al cliente. Marca la fecha de seguimiento en tu calendario.',
          },
          {
            num: '09',
            pregunta: '¿Tienes el nombre, teléfono y email del responsable?',
            como: 'Pídelo antes de despedirte:',
            frase: '"¿Me puede dar su nombre completo y un teléfono directo? Y si tiene email, mejor para mandarle el dossier en PDF."',
            nota: 'Si hay más de un socio, intenta conseguir el contacto del que toma decisiones financieras. Apunta también el nombre del local y la dirección para el parte de instalación.',
          },
          {
            num: '10',
            pregunta: '¿Has notificado a Comandalia para coordinar la instalación?',
            como: 'WhatsApp a operaciones el mismo día del cierre con estos datos:',
            frase: '"Nombre del local · Plan elegido · Dirección · Fecha piloto acordada · Contacto del responsable"',
            nota: 'Sin este aviso, el técnico no puede preparar el hardware ni coordinar el desplazamiento. Es el último paso y el más crítico para que el piloto ocurra en la fecha prometida.',
          },
        ].flatMap(({ num, pregunta, como, frase, nota }) => [
          new Table({
            columnWidths: [9400],
            margins: { top: 60, bottom: 0, left: 0, right: 0 },
            rows: [new TableRow({ children: [new TableCell({
              borders: { top: { style: BorderStyle.SINGLE, size: 6, color: GOLD }, bottom: bNone, left: { style: BorderStyle.SINGLE, size: 6, color: GOLD }, right: bNone },
              shading: { fill: DARK, type: ShadingType.CLEAR },
              children: [new Paragraph({ spacing: { before: 60, after: 60 }, indent: { left: 160 },
                children: [
                  new TextRun({ text: `${num}  `, font: 'Calibri', size: 20, bold: true, color: GOLD }),
                  new TextRun({ text: pregunta, font: 'Calibri', size: 22, bold: true, color: WHITE }),
                ]
              })]
            })]})],
          }),
          new Table({
            columnWidths: [9400],
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            rows: [new TableRow({ children: [new TableCell({
              borders: { top: bNone, bottom: bNone, left: { style: BorderStyle.SINGLE, size: 6, color: GOLD }, right: bNone },
              shading: { fill: GREY_BG, type: ShadingType.CLEAR },
              children: [
                new Paragraph({ spacing: { before: 60, after: 20 }, indent: { left: 200 },
                  children: [new TextRun({ text: como, font: 'Calibri', size: 20, bold: true, color: DARK })] }),
                new Paragraph({ spacing: { before: 20, after: 20 }, indent: { left: 200, right: 200 },
                  children: [new TextRun({ text: frase, font: 'Calibri', size: 20, color: BLUE, italics: true })] }),
                new Paragraph({ spacing: { before: 20, after: 60 }, indent: { left: 200, right: 200 },
                  children: [
                    new TextRun({ text: '↳ ', font: 'Calibri', size: 19, color: MUTED, bold: true }),
                    new TextRun({ text: nota, font: 'Calibri', size: 19, color: MUTED }),
                  ] }),
              ]
            })]})],
          }),
          gap(80),
        ]),

        gap(120),

        h2('Contacto con el equipo Comandalia'),
        gap(40),
        simpleTable(
          ['Para qué', 'Contacto'],
          [
            ['Coordinar instalación de piloto', 'operaciones@comandalia.es  ·  WhatsApp: +34 XXX XXX XXX'],
            ['Dudas técnicas / demo remota', 'soporte@comandalia.es'],
            ['Documentos y propuestas a medida', 'comercial@comandalia.es'],
            ['Emergencias en piloto activo', 'WhatsApp directo — respuesta en < 2h laborables'],
          ],
          [3200, 6200]
        ),
        gap(80),
        para([
          t(`${firstName}, `, { bold: true }),
          t('cualquier duda sobre un cliente específico o una propuesta a medida, escríbenos directamente. Te respondemos el mismo día.', { color: MUTED, italics: true }),
        ]),
        gap(200),
        new Paragraph({ alignment: AlignmentType.CENTER,
          shading: { fill: DARK, type: ShadingType.CLEAR },
          children: [new TextRun({ text: `  Mucha suerte, ${firstName}. El sistema se vende solo — solo hay que mostrarlo.  `, font: 'Calibri', size: 24, bold: true, color: GOLD_BG, italics: true })] }),
        gap(80),
      ]
    }
  ];

  return new Document({ sections });
}

// ═══════════════════════════════════════════════════════════════════════════
// GENERATE BOTH DOCUMENTS
// ═══════════════════════════════════════════════════════════════════════════
const agents = [
  { name: 'Jose Antonio Sanchez Guerra', id: 'AGT-001' },
  { name: 'Alejandro Villaverde del Tesoro', id: 'AGT-002' },
  { name: 'Luis Miguel Sobrino Aguirre', id: 'AGT-003', firstName: 'Luis Miguel' },
];

(async () => {
  for (const agent of agents) {
    const doc = buildDoc(agent.name, agent.id, agent.firstName);
    const buffer = await Packer.toBuffer(doc);
    const safeName = agent.name.replace(/ /g, '_');
    const outPath = `C:\\Users\\jose2\\OneDrive\\Escritorio\\proyecto.comandalia\\Dossier_Comercial_${safeName}.docx`;
    fs.writeFileSync(outPath, buffer);
    console.log(`✅ Generado: ${outPath}`);
  }
})();
