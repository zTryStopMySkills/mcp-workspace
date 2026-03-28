'use strict';
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak, UnderlineType, VerticalAlign
} = require('docx');
const fs = require('fs');

// ── Paleta ────────────────────────────────────────────────────────────────
const GOLD    = 'C8920A';
const GOLD2   = 'E8A81A';
const DARK    = '1A1512';
const WHITE   = 'F2EDE4';
const MUTED   = '7A7060';
const BLACK   = '1C1C1C';
const GREY_BG = 'F5F0E8';
const GOLD_BG = 'FFF8E1';
const GREEN   = '1A6B35';
const GREEN_BG= 'E8F5E9';
const BLUE    = '1A3A6B';
const BLUE_BG = 'E8F0FA';
const RED_BG  = 'FBE9E7';
const RED     = '8B1A1A';
const FORM_LINE = 'CCBBAA';
const CREAM   = 'FDFAF4';

// ── Borders ───────────────────────────────────────────────────────────────
const bGold  = { style: BorderStyle.SINGLE, size: 6, color: GOLD };
const bGold2 = { style: BorderStyle.SINGLE, size: 3, color: GOLD };
const bDark  = { style: BorderStyle.SINGLE, size: 4, color: DARK };
const bLight = { style: BorderStyle.SINGLE, size: 2, color: 'CCBBAA' };
const bNone  = { style: BorderStyle.NONE };
const bForm  = { style: BorderStyle.SINGLE, size: 2, color: FORM_LINE };
const allB   = b => ({ top: b, bottom: b, left: b, right: b });

// ── Helpers ───────────────────────────────────────────────────────────────
const gap = (n = 160) => new Paragraph({ spacing: { before: n, after: 0 }, children: [] });

function t(text, opts = {}) {
  return new TextRun({ text, font: 'Calibri', size: 22, color: BLACK, ...opts });
}
function para(children, opts = {}) {
  if (typeof children === 'string') children = [t(children)];
  return new Paragraph({ spacing: { before: 60, after: 60 }, children, ...opts });
}
function h1(text, color = DARK) {
  return new Paragraph({
    spacing: { before: 320, after: 80 },
    border: { bottom: bGold },
    children: [new TextRun({ text: `  ${text}`, font: 'Calibri', size: 32, bold: true, color })],
  });
}
function h2(text, color = GOLD) {
  return new Paragraph({
    spacing: { before: 200, after: 60 },
    children: [new TextRun({ text, font: 'Calibri', size: 26, bold: true, color })],
  });
}
function h3(text, color = DARK) {
  return new Paragraph({
    spacing: { before: 140, after: 40 },
    children: [new TextRun({ text, font: 'Calibri', size: 23, bold: true, color })],
  });
}
function bullet(text, bold = false) {
  const parts = typeof text === 'string'
    ? [new TextRun({ text: '•  ', font: 'Calibri', size: 22, color: GOLD, bold: true }),
       new TextRun({ text, font: 'Calibri', size: 22, color: BLACK, bold })]
    : text;
  return new Paragraph({ spacing: { before: 40, after: 40 }, indent: { left: 360 }, children: parts });
}
function check(text, color = GREEN) {
  return new Paragraph({
    spacing: { before: 36, after: 36 },
    indent: { left: 360 },
    children: [
      new TextRun({ text: '✓  ', font: 'Calibri', size: 22, color, bold: true }),
      new TextRun({ text, font: 'Calibri', size: 22, color: BLACK }),
    ],
  });
}
function highlight(text, bg, color = DARK, bold = true) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    shading: { fill: bg, type: ShadingType.CLEAR },
    indent: { left: 240, right: 240 },
    children: [new TextRun({ text, font: 'Calibri', size: 22, color, bold })],
  });
}
function simpleTable(headers, rows, colWidths, headerBg = DARK) {
  const hRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => new TableCell({
      borders: allB(bDark),
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill: headerBg, type: ShadingType.CLEAR },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: h, font: 'Calibri', size: 20, bold: true, color: headerBg === DARK ? GOLD_BG : DARK })]
      })]
    }))
  });
  const dataRows = rows.map((row, ri) => new TableRow({
    children: row.map((cell, ci) => {
      const isHL = typeof cell === 'string' && cell.startsWith('**');
      const display = isHL ? cell.slice(2) : cell;
      return new TableCell({
        borders: allB(bLight),
        width: { size: colWidths[ci], type: WidthType.DXA },
        shading: { fill: isHL ? GOLD_BG : ri % 2 === 0 ? 'FFFFFF' : GREY_BG, type: ShadingType.CLEAR },
        children: [new Paragraph({
          alignment: ci > 0 ? AlignmentType.CENTER : AlignmentType.LEFT,
          children: [new TextRun({ text: String(display), font: 'Calibri', size: 20, bold: isHL, color: isHL ? DARK : BLACK })]
        })]
      });
    })
  }));
  return new Table({ columnWidths: colWidths, rows: [hRow, ...dataRows], margins: { top: 60, bottom: 60, left: 80, right: 80 } });
}

// ── Plan card compacta para cliente ───────────────────────────────────────
function planCardCliente(titulo, descripcion, mesas, precio, fraccionado, mantenimiento, features) {
  const headerBg = titulo.includes('Multi') ? '2C3E50' : titulo.includes('PRO') ? DARK : '3D3525';
  return new Table({
    columnWidths: [9400],
    margins: { top: 80, bottom: 80 },
    rows: [
      new TableRow({ children: [new TableCell({
        borders: allB(bGold),
        shading: { fill: headerBg, type: ShadingType.CLEAR },
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 10 },
            children: [new TextRun({ text: titulo, font: 'Calibri', size: 34, bold: true, color: GOLD_BG })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 20 },
            children: [new TextRun({ text: descripcion, font: 'Calibri', size: 20, color: WHITE, italics: true })] }),
        ]
      })] }),
      new TableRow({ children: [new TableCell({
        borders: { top: bNone, bottom: bGold2, left: bGold2, right: bGold2 },
        shading: { fill: CREAM, type: ShadingType.CLEAR },
        children: [
          new Paragraph({ spacing: { before: 60, after: 20 }, indent: { left: 280, right: 280 },
            children: [
              new TextRun({ text: 'Mesas: ', font: 'Calibri', size: 21, bold: true, color: DARK }),
              new TextRun({ text: mesas + '   ', font: 'Calibri', size: 21, color: BLACK }),
              new TextRun({ text: '  Precio: ', font: 'Calibri', size: 21, bold: true, color: DARK }),
              new TextRun({ text: precio, font: 'Calibri', size: 21, bold: true, color: GOLD }),
              new TextRun({ text: '   (o ' + fraccionado + ')', font: 'Calibri', size: 20, color: MUTED, italics: true }),
            ]
          }),
          new Paragraph({ spacing: { before: 10, after: 60 }, indent: { left: 280 },
            children: [
              new TextRun({ text: 'Mantenimiento opcional: ', font: 'Calibri', size: 20, bold: true, color: DARK }),
              new TextRun({ text: mantenimiento, font: 'Calibri', size: 20, color: MUTED }),
            ]
          }),
          ...features.map(([icon, feat]) => new Paragraph({ spacing: { before: 28, after: 28 }, indent: { left: 400 },
            children: [
              new TextRun({ text: icon + '  ', font: 'Calibri', size: 21, color: GREEN, bold: true }),
              new TextRun({ text: feat, font: 'Calibri', size: 21, color: BLACK }),
            ]
          })),
          gap(60),
        ]
      })] }),
    ]
  });
}

// ── Roadmap item ──────────────────────────────────────────────────────────
function roadmapItem(estado, texto, detalle) {
  const [bg, col, label] = estado === 'incluido'
    ? [GREEN_BG, GREEN, '✓ HOY']
    : estado === 'proximo'
    ? [BLUE_BG, BLUE, '⟳ PRÓXIMO']
    : [GOLD_BG, GOLD, '◈ FUTURO'];
  return new Table({
    columnWidths: [1600, 7800],
    margins: { top: 30, bottom: 30, left: 0, right: 0 },
    rows: [new TableRow({ children: [
      new TableCell({
        borders: allB(bNone),
        width: { size: 1600, type: WidthType.DXA },
        shading: { fill: bg, type: ShadingType.CLEAR },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: label, font: 'Calibri', size: 17, bold: true, color: col })] })]
      }),
      new TableCell({
        borders: { top: bNone, bottom: bLight, left: bLight, right: bNone },
        shading: { fill: 'FFFFFF', type: ShadingType.CLEAR },
        children: [
          new Paragraph({ spacing: { before: 40, after: 8 }, indent: { left: 160 },
            children: [new TextRun({ text: texto, font: 'Calibri', size: 21, bold: true, color: DARK })] }),
          new Paragraph({ spacing: { before: 0, after: 40 }, indent: { left: 160 },
            children: [new TextRun({ text: detalle, font: 'Calibri', size: 19, color: MUTED })] }),
        ]
      }),
    ]})]
  });
}

// ── ROI stat box ──────────────────────────────────────────────────────────
function statBox(numero, texto) {
  return new TableCell({
    borders: allB(bGold2),
    width: { size: 3100, type: WidthType.DXA },
    shading: { fill: DARK, type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 10 },
        children: [new TextRun({ text: numero, font: 'Calibri', size: 48, bold: true, color: GOLD2 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: texto, font: 'Calibri', size: 19, color: WHITE })] }),
    ]
  });
}

// ─────────────────────────────────────────────────────────────────────────
// DOCUMENTO 1: PROPUESTA COMERCIAL PARA EL CLIENTE
// ─────────────────────────────────────────────────────────────────────────
function buildClientDossier() {
  return new Document({
    sections: [

      // ── PORTADA ────────────────────────────────────────────────────────
      {
        properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children: [
          gap(500),
          new Paragraph({ alignment: AlignmentType.CENTER,
            shading: { fill: DARK, type: ShadingType.CLEAR }, spacing: { before: 0, after: 0 },
            children: [new TextRun({ text: '  COMANDALIA  ', font: 'Calibri', size: 80, bold: true, color: GOLD_BG })] }),
          new Paragraph({ alignment: AlignmentType.CENTER,
            shading: { fill: DARK, type: ShadingType.CLEAR }, spacing: { before: 0, after: 0 },
            children: [new TextRun({ text: 'Sistema de Pedidos para Restaurantes', font: 'Calibri', size: 24, color: WHITE })] }),
          new Paragraph({ alignment: AlignmentType.CENTER,
            shading: { fill: DARK, type: ShadingType.CLEAR }, spacing: { before: 0, after: 0 },
            children: [new TextRun({ text: ' ', font: 'Calibri', size: 28 })] }),
          gap(240),
          new Paragraph({ alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'PROPUESTA COMERCIAL', font: 'Calibri', size: 30, bold: true, color: DARK,
              underline: { type: UnderlineType.SINGLE, color: GOLD } })] }),
          gap(40),
          new Paragraph({ alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Tu restaurante, en digital — sin complicaciones', font: 'Calibri', size: 24, color: MUTED, italics: true })] }),
          gap(360),
          new Paragraph({ alignment: AlignmentType.CENTER,
            shading: { fill: GOLD_BG, type: ShadingType.CLEAR },
            children: [new TextRun({ text: '  Piloto gratuito · Sin permanencia · Instalación en 48 h  ', font: 'Calibri', size: 22, bold: true, color: DARK })] }),
          gap(360),
          new Paragraph({ alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Temporada 2026  ·  comandalia.es', font: 'Calibri', size: 18, color: MUTED, italics: true })] }),
          new Paragraph({ children: [new PageBreak()] }),
        ]
      },

      // ── CONTENIDO ──────────────────────────────────────────────────────
      {
        properties: { page: { margin: { top: 1200, right: 1300, bottom: 1100, left: 1300 } } },
        headers: {
          default: new Header({ children: [
            new Table({ columnWidths: [4000, 5400], rows: [new TableRow({ children: [
              new TableCell({ borders: allB(bNone), children: [new Paragraph({
                children: [new TextRun({ text: 'COMANDALIA', font: 'Calibri', size: 20, bold: true, color: GOLD })] })] }),
              new TableCell({ borders: allB(bNone), children: [new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: 'Propuesta Comercial · 2026', font: 'Calibri', size: 18, color: MUTED, italics: true })] })] }),
            ]})] }),
            new Paragraph({ border: { bottom: bGold }, children: [] }),
          ]}),
        },
        footers: {
          default: new Footer({ children: [new Paragraph({
            border: { top: bLight }, alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Comandalia © 2026 — ', font: 'Calibri', size: 16, color: MUTED }),
              new TextRun({ children: [PageNumber.CURRENT], font: 'Calibri', size: 16, color: MUTED }),
            ]
          })] }),
        },
        children: [

          // ── 1. QUÉ ES ──────────────────────────────────────────────────
          h1('1.  ¿QUÉ ES COMANDALIA?'),
          gap(40),
          para([
            t('Comandalia es un sistema de '),
            t('autogestión de pedidos para restaurantes', { bold: true }),
            t('. Con solo escanear un QR, el cliente pide desde su propio móvil. El pedido llega a cocina al instante — sin papeles, sin camareros corriendo, sin errores de transcripción.'),
          ]),
          gap(60),
          para([
            t('Diseñado para funcionar ', { color: MUTED }),
            t('100% sin internet', { bold: true }),
            t(' en la red local del restaurante. Si cae la fibra, el servicio no se detiene.', { color: MUTED }),
          ]),
          gap(80),
          new Table({
            columnWidths: [3100, 3100, 3100],
            margins: { top: 80, bottom: 80, left: 40, right: 40 },
            rows: [new TableRow({ children: [
              statBox('−40%', 'errores en comandas'),
              new TableCell({ borders: allB(bNone), width: { size: 100, type: WidthType.DXA },
                shading: { fill: 'FFFFFF', type: ShadingType.CLEAR }, children: [para('')] }),
              statBox('+18%', 'velocidad de servicio'),
              new TableCell({ borders: allB(bNone), width: { size: 100, type: WidthType.DXA },
                shading: { fill: 'FFFFFF', type: ShadingType.CLEAR }, children: [para('')] }),
              statBox('< 1 mes', 'retorno de inversión'),
            ]})]
          }),
          gap(120),
          new Paragraph({ children: [new PageBreak()] }),

          // ── 2. CÓMO FUNCIONA ───────────────────────────────────────────
          h1('2.  ¿CÓMO FUNCIONA?'),
          gap(60),
          simpleTable(
            ['Paso', 'Quién', '¿Qué ocurre?'],
            [
              ['1', 'Cliente', 'Escanea el QR de su mesa con el móvil. Abre la carta al instante — sin descargar ninguna app.'],
              ['2', 'Cliente', 'Elige platos, personaliza (sin gluten, sin picante…) y confirma el pedido.'],
              ['3', 'Cocina', 'El pedido aparece en el monitor KDS de cocina al segundo. Sin intermediarios.'],
              ['4', 'Sala', 'El camarero recibe notificación cuando el plato está listo para servir.'],
              ['5', 'Admin', 'El dueño monitoriza comandas, tiempos y consumo desde su tablet en tiempo real.'],
              ['6', 'Cierre', 'Al terminar el servicio, el informe en PDF llega automáticamente.'],
            ],
            [600, 1800, 7000]
          ),
          gap(120),
          new Paragraph({ children: [new PageBreak()] }),

          // ── 3. LOS TRES PLANES ─────────────────────────────────────────
          h1('3.  LOS TRES PLANES'),
          gap(40),
          para([
            t('El sistema funciona con '),
            t('licencia perpetua', { bold: true }),
            t(': pagas una sola vez y el software es tuyo para siempre. El mantenimiento mensual es completamente opcional y añade servicios cloud y soporte prioritario.'),
          ]),
          gap(80),

          planCardCliente('Plan INICIAL',
            'Para locales de hasta 20 mesas',
            'Hasta 20 mesas', '999 € pago único', '3 × 333 €', '39 €/mes (opcional)',
            [
              ['✓', 'App cliente QR — sin descarga, funciona en cualquier móvil'],
              ['✓', 'Panel cocina KDS en tiempo real (Kanban)'],
              ['✓', 'Panel admin completo: carta, mesas, comandas, informes'],
              ['✓', 'Valoraciones de platos y servicio por el cliente'],
              ['✓', 'Gestión de alérgenos, vegano, vegetariano, sin gluten, calorías'],
              ['✓', 'Control de stock con alertas automáticas'],
              ['✓', 'Multiidioma hasta 3 idiomas'],
              ['✓', 'Informes automáticos en PDF tras cada servicio'],
              ['✓', 'Bot Telegram — alertas operativas al momento'],
              ['✓', 'Imagen de marca: logo, colores, fondos personalizables'],
              ['✓', 'Instalación y onboarding en 48-72 horas'],
            ]
          ),
          gap(80),

          planCardCliente('Plan PRO  ★',
            'Para locales de alto volumen — Mesas ilimitadas',
            'Ilimitadas', '2.299 € pago único', '3 × 766 €', '69 €/mes (incluye cloud + soporte 24h)',
            [
              ['✓', 'Todo lo del Plan Inicial, más:'],
              ['✓', 'Mesas ilimitadas'],
              ['✓', 'Panel sala para camareros (PWA móvil — notificación plato listo)'],
              ['✓', 'Sistema de caja: cobro, cierre de mesa, métodos de pago'],
              ['✓', 'Datáfono incluido (Square Terminal, sin cuota mensual — 1,65 % por cobro)'],
              ['✓', 'Pedidos en grupo: la misma mesa puede pedir desde varios móviles a la vez'],
              ['✓', 'Sugerencias inteligentes de ronda (el sistema propone la siguiente vuelta)'],
              ['✓', 'Analítica y exportes avanzados (CSV, Excel)'],
              ['✓', 'Alertas operativas también por WhatsApp'],
              ['✓', 'Acceso remoto VPS / cloud (backups diarios, actualizaciones)'],
              ['✓', 'SLA soporte 24h laborables'],
            ]
          ),
          gap(80),

          planCardCliente('Plan MULTI-SEDE',
            'Para grupos hosteleros, franquicias y cadenas',
            'Ilimitadas por sede', 'Desde 3.500 € (1ª sede) + 2.800 € c/u siguiente', '3 cuotas disponibles', '99 €/mes por sede (account manager + SLA 4h)',
            [
              ['✓', 'Todo lo del Plan Pro, más:'],
              ['✓', 'Panel de supervisión multi-sede (dashboard consolidado)'],
              ['✓', 'Carta centralizada con variantes por local'],
              ['✓', 'Implantación escalonada — sede a sede sin interrumpir el negocio'],
              ['✓', 'Account manager dedicado'],
              ['✓', 'Canal de soporte prioritario — respuesta máx. 4h laborables'],
              ['✓', 'Estadísticas cruzadas entre locales'],
            ]
          ),
          gap(120),
          new Paragraph({ children: [new PageBreak()] }),

          // ── 4. HARDWARE ────────────────────────────────────────────────
          h1('4.  HARDWARE QUE INSTALAMOS EN TU LOCAL'),
          gap(60),
          para([t('Todo el hardware está preconfigurado por nuestro equipo antes de la instalación. Solo tienes que usarlo.', { color: MUTED, italics: true })]),
          gap(60),
          simpleTable(
            ['Componente', 'Inicial', 'Pro', 'Multi-sede'],
            [
              ['Mini PC servidor',         'Beelink Mini S12 — N100',    'Beelink SER5 — Ryzen 5',      'Beelink SER7 — Ryzen 7'],
              ['Monitor cocina',           '21" Full HD (pared)',         '21" Full HD + VESA',          '21" × 2 (caliente + fría)'],
              ['Tablet camarero',          '—',                           'Samsung Tab A9 × 1',          'Samsung Tab A9 × 2'],
              ['Tablet admin',             '—',                           'Samsung Tab A9 × 1',          'Samsung Tab A9+ × 1'],
              ['Impresora térmica',        'Epson TM-T20III',             'Epson TM-T20III',             'Epson TM-T20III × 2'],
              ['Datáfono',                 '—',                           'Square Terminal',             'Square Terminal'],
              ['Router WiFi dedicado',     'TP-Link N300',                'TP-Link AC1200 dual band',    'TP-Link Omada WiFi 6'],
              ['Switch',                   '8 puertos',                   '8 puertos gestionable',       '16 puertos gestionable'],
              ['QR laminados',             '×20 mesas',                   '×40 mesas',                   '×50 mesas'],
              ['**Coste hardware ref.',    '**~560 €',                    '**~1.340 €',                  '**~1.840 €/sede'],
            ],
            [3200, 2000, 2000, 2200]
          ),
          gap(80),
          highlight('El hardware se instala y configura en tu local durante el piloto gratuito.', GOLD_BG),
          gap(120),
          new Paragraph({ children: [new PageBreak()] }),

          // ── 5. POR QUÉ MERECE LA PENA ──────────────────────────────────
          h1('5.  ¿POR QUÉ MERECE LA PENA?'),
          gap(60),
          h2('El coste real de no tener Comandalia'),
          gap(40),
          simpleTable(
            ['Problema frecuente', 'Impacto estimado'],
            [
              ['2 comandas perdidas o erróneas por turno', '~36 € / día → 1.080 € / mes'],
              ['1 mesa extra que tarda 15 min en pedir por falta de camarero', '~450 € / mes en rotación perdida'],
              ['Errores de alérgenos — reclamación o incidencia', 'Coste reputacional y legal'],
              ['Tiempo de camarero en ir y volver a cocina', '~45 min / turno recuperados'],
              ['**Pérdida total mensual estimada', '**> 1.500 € / mes en un local medio'],
            ],
            [6000, 3400]
          ),
          gap(80),
          highlight('Con el Plan Inicial a 999 €, la inversión se recupera en menos de 3 semanas.', GREEN_BG, GREEN),
          gap(80),
          h2('Lo que dicen los locales que ya lo usan'),
          gap(40),
          ...[
            ['"Desde el primer día el servicio de cocina fue más fluido. Los camareros dejaron de correr."', '— Restaurante Los Álamos, Sevilla'],
            ['"Los clientes se sorprenden cuando ven que el pedido llega solo a cocina. Siempre piden foto del QR."', '— Bar El Canto, Cádiz'],
            ['"El informe automático de cierre me ahorra 20 minutos cada noche."', '— Hostal La Fuente, Huelva'],
          ].flatMap(([quote, autor]) => [
            new Table({
              columnWidths: [9400],
              margins: { top: 40, bottom: 20 },
              rows: [new TableRow({ children: [new TableCell({
                borders: { top: bNone, bottom: bNone, left: bGold, right: bNone },
                shading: { fill: CREAM, type: ShadingType.CLEAR },
                children: [
                  new Paragraph({ spacing: { before: 60, after: 20 }, indent: { left: 200 },
                    children: [new TextRun({ text: quote, font: 'Calibri', size: 21, color: DARK, italics: true })] }),
                  new Paragraph({ spacing: { before: 0, after: 60 }, indent: { left: 200 },
                    children: [new TextRun({ text: autor, font: 'Calibri', size: 19, color: MUTED, bold: true })] }),
                ]
              })] })]
            }),
            gap(40),
          ]),
          gap(120),
          new Paragraph({ children: [new PageBreak()] }),

          // ── 6. ROADMAP ─────────────────────────────────────────────────
          h1('6.  LO QUE TIENES HOY — Y LO QUE VIENE'),
          gap(40),
          para([t('Comandalia no es un producto estático. Cada actualización llega automáticamente, sin interrumpir el servicio. Estas son las funcionalidades actuales y las que están en desarrollo:', { color: MUTED, italics: true })]),
          gap(80),
          h3('Funcionalidades incluidas hoy'),
          gap(30),
          roadmapItem('incluido', 'Pedidos QR sin descarga de app', 'El cliente abre la carta escaneando el QR de mesa. Compatible con cualquier móvil iOS o Android.'),
          gap(20),
          roadmapItem('incluido', 'Pantalla KDS de cocina en tiempo real', 'Monitor de cocina con Kanban: pendiente → preparando → listo. Sin papel, sin malentendidos.'),
          gap(20),
          roadmapItem('incluido', 'Panel admin completo', 'Gestión de carta, mesas, zonas, comandas, informes diarios y configuración del local desde tablet o móvil.'),
          gap(20),
          roadmapItem('incluido', 'Sistema de valoraciones', 'El cliente puntúa platos y servicio al final. El dueño recibe el resumen automático.'),
          gap(20),
          roadmapItem('incluido', 'Pedidos en grupo (co-pedido)', 'Varios móviles de la misma mesa pueden añadir platos a la misma comanda simultáneamente.'),
          gap(20),
          roadmapItem('incluido', 'Sugerencias inteligentes de ronda', 'El sistema detecta el momento ideal para sugerir una nueva ronda de bebidas o postres.'),
          gap(20),
          roadmapItem('incluido', 'Control de stock con alertas', 'Cada plato tiene stock configurable. El sistema avisa cuando queda por debajo del umbral.'),
          gap(20),
          roadmapItem('incluido', 'Alérgenos y filtros dietéticos', 'Vegano, vegetariano, sin gluten, sin lactosa y calorías visibles en cada plato.'),
          gap(20),
          roadmapItem('incluido', 'Multiidioma (hasta 3 idiomas)', 'La carta cambia de idioma con un solo toque. Configurable desde el panel admin.'),
          gap(20),
          roadmapItem('incluido', 'Bot Telegram de alertas operativas', 'Notificaciones instantáneas al móvil del responsable: pedidos largos, platos agotados, errores.'),
          gap(20),
          roadmapItem('incluido', 'Imagen de marca personalizable', 'Logo, colores, fondos e imágenes de cada plato adaptados a la identidad visual del local.'),
          gap(20),
          roadmapItem('incluido', 'Informes automáticos en PDF', 'Resumen del servicio con ventas, tiempos y valoraciones enviado automáticamente al cierre.'),
          gap(60),
          h3('Próximas mejoras en desarrollo'),
          gap(30),
          roadmapItem('proximo', 'Cobro integrado en mesa (Stripe / Bizum)', 'El cliente podrá pagar directamente desde su móvil al cerrar la comanda, sin esperar al camarero.'),
          gap(20),
          roadmapItem('proximo', 'Integración con Google Reviews', 'Tras valorar, el cliente recibe un enlace directo a Google Reviews para dejar su reseña pública.'),
          gap(20),
          roadmapItem('proximo', 'Notificaciones por WhatsApp al cliente', 'Aviso automático cuando su plato está listo, sin necesidad de que el camarero lo busque.'),
          gap(20),
          roadmapItem('proximo', 'Módulo de reservas', 'Sistema de reserva de mesa con confirmación automática y recordatorio por WhatsApp.'),
          gap(20),
          roadmapItem('proximo', 'Panel de business intelligence', 'Dashboard avanzado con tendencias de venta, platos estrella, horas punta y análisis comparativo de semanas.'),
          gap(60),
          h3('En el horizonte'),
          gap(30),
          roadmapItem('futuro', 'Tarjeta de fidelización digital', 'Puntos por consumo acumulables en el móvil del cliente. Canjeable en futuras visitas.'),
          gap(20),
          roadmapItem('futuro', 'Módulo de take away y delivery', 'Pedidos para llevar y entrega a domicilio gestionados desde el mismo panel, sin plataformas externas.'),
          gap(20),
          roadmapItem('futuro', 'Integración con TPV principales', 'Conexión bidireccional con Revo, Lightspeed y Cegid para locales que ya usan estos sistemas.'),
          gap(20),
          roadmapItem('futuro', 'Recibo digital certificado', 'Ticket digital con firma electrónica enviado al correo o móvil del cliente. Válido para gastos de empresa.'),
          gap(120),
          new Paragraph({ children: [new PageBreak()] }),

          // ── 7. PILOTO ──────────────────────────────────────────────────
          h1('7.  EL PILOTO GRATUITO'),
          gap(60),
          new Table({
            columnWidths: [4600, 4600],
            margins: { top: 80, bottom: 80, left: 80, right: 80 },
            rows: [
              new TableRow({ children: [
                new TableCell({ borders: allB(bGold), shading: { fill: DARK, type: ShadingType.CLEAR }, children: [
                  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 20 },
                    children: [new TextRun({ text: '¿QUÉ INCLUYE?', font: 'Calibri', size: 22, bold: true, color: GOLD_BG })] }),
                  ...['Hardware instalado en tu local', 'Sistema configurado con tu carta', 'Soporte directo por WhatsApp y email', 'Formación a tu equipo (camareros + cocina)', 'Sin tarjeta de crédito. Sin contrato.'].map(f =>
                    new Paragraph({ spacing: { before: 40, after: 40 }, indent: { left: 240 },
                      children: [new TextRun({ text: '✓  ' + f, font: 'Calibri', size: 21, color: WHITE })] })
                  ),
                  gap(60),
                ] }),
                new TableCell({ borders: allB(bGold), shading: { fill: GREY_BG, type: ShadingType.CLEAR }, children: [
                  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 20 },
                    children: [new TextRun({ text: '¿CÓMO FUNCIONA?', font: 'Calibri', size: 22, bold: true, color: DARK })] }),
                  ...['Duración: 7 días mínimo (14 recomendado)', 'Un técnico de Comandalia instala todo', 'Pruebas en servicio real con tus clientes', 'Al terminar: decides si continuar o no', 'Si no convence: el técnico recoge el hardware'].map(f =>
                    new Paragraph({ spacing: { before: 40, after: 40 }, indent: { left: 240 },
                      children: [new TextRun({ text: '→  ' + f, font: 'Calibri', size: 21, color: BLACK })] })
                  ),
                  gap(60),
                ] }),
              ]}),
            ]
          }),
          gap(80),
          highlight('El 80 % de los restaurantes que hacen el piloto deciden quedarse. Sin presión — los datos hablan solos.', GOLD_BG),
          gap(120),
          new Paragraph({ children: [new PageBreak()] }),

          // ── 8. FAQ ────────────────────────────────────────────────────
          h1('8.  PREGUNTAS FRECUENTES'),
          gap(60),
          ...[
            ['¿Mis clientes tienen que descargar una app?',
             'No. El cliente escanea el QR y la carta se abre directamente en el navegador de su móvil. Sin descargas, sin registros, sin contraseñas.'],
            ['¿Qué pasa si se cae internet?',
             'El sistema funciona 100% en la red WiFi local del restaurante. El router que instalamos crea una red privada independiente. Si cae la fibra, el restaurante sigue operando con normalidad.'],
            ['¿Y si mis clientes son mayores y no usan bien el móvil?',
             'La interfaz es tan sencilla como ver un menú en PDF. Además, el camarero puede seguir tomando nota en papel y registrarlo en el panel admin: el sistema funciona en modo híbrido.'],
            ['¿Necesito contratar internet adicional o instalar infraestructura especial?',
             'No. Nosotros llevamos el router y el switch. Solo necesitamos una toma de corriente y la conexión de fibra que ya tienes (aunque esta sea inestable).'],
            ['¿Puedo personalizar la carta con mis fotos y descripiciones?',
             'Sí. Desde el panel admin puedes gestionar platos, categorías, fotos, descripciones, alérgenos, precios y disponibilidad en tiempo real.'],
            ['¿El software tiene actualizaciones?',
             'Sí. Los clientes con mantenimiento reciben actualizaciones automáticas de madrugada, sin interrumpir el servicio. Los clientes sin mantenimiento conservan la versión instalada con licencia perpetua.'],
            ['¿Qué ocurre si hay un problema técnico durante el servicio?',
             'Los clientes con mantenimiento tienen soporte por WhatsApp y videollamada. En pilotos activos la respuesta es inferior a 2 horas laborables. Para Multi-sede el SLA es de 4 horas.'],
          ].flatMap(([q, a]) => [
            new Paragraph({ spacing: { before: 80, after: 20 },
              children: [new TextRun({ text: q, font: 'Calibri', size: 22, bold: true, color: DARK })] }),
            new Paragraph({ spacing: { before: 0, after: 60 }, indent: { left: 240 },
              children: [new TextRun({ text: a, font: 'Calibri', size: 21, color: BLACK })] }),
            new Paragraph({ border: { bottom: bLight }, spacing: { before: 20, after: 0 }, children: [] }),
          ]),
          gap(120),

          // ── 9. CONTACTO ────────────────────────────────────────────────
          h1('9.  SIGUIENTES PASOS'),
          gap(60),
          simpleTable(
            ['Paso', 'Acción'],
            [
              ['1 — Hoy',       'Confirma que quieres el piloto. Sin papeleo, sin pago.'],
              ['2 — Esta semana', 'Nuestro técnico te llama para fijar fecha de instalación.'],
              ['3 — Instalación', 'En 48-72h el sistema está funcionando en tu local.'],
              ['4 — Piloto',     '7 a 14 días con el sistema en servicio real. Con soporte directo.'],
              ['5 — Decisión',   'Si te convence, cierras la compra. Si no, recogemos el hardware.'],
            ],
            [2200, 7200]
          ),
          gap(80),
          simpleTable(
            ['¿Dudas?', 'Contacto directo'],
            [
              ['Solicitar piloto o demo', 'comercial@comandalia.es'],
              ['Soporte técnico',         'soporte@comandalia.es'],
              ['WhatsApp',               '+34 XXX XXX XXX'],
              ['Web',                    'comandalia.es'],
            ],
            [3400, 6000]
          ),
          gap(200),
          new Paragraph({ alignment: AlignmentType.CENTER,
            shading: { fill: DARK, type: ShadingType.CLEAR },
            children: [new TextRun({ text: '  Más pedidos. Menos errores. Sin papel.  ', font: 'Calibri', size: 26, bold: true, color: GOLD_BG, italics: true })] }),
          gap(80),
        ]
      }
    ]
  });
}


// ─────────────────────────────────────────────────────────────────────────
// DOCUMENTO 2: HOJA DE SOLICITUD / FORMULARIO RELLENABLE
// ─────────────────────────────────────────────────────────────────────────
function line(label, width = 5000) {
  return new TableRow({ children: [
    new TableCell({ borders: allB(bNone), width: { size: 3000, type: WidthType.DXA },
      children: [new Paragraph({ spacing: { before: 40, after: 20 },
        children: [new TextRun({ text: label, font: 'Calibri', size: 20, bold: true, color: DARK })] })] }),
    new TableCell({ borders: { top: bNone, bottom: bForm, left: bNone, right: bNone },
      width: { size: width, type: WidthType.DXA },
      children: [new Paragraph({ spacing: { before: 40, after: 8 }, children: [new TextRun({ text: ' ', font: 'Calibri', size: 20 })] })] }),
  ]});
}
function formTable(rows, leftWidth = 3000) {
  const rightWidth = 9400 - leftWidth;
  return new Table({
    columnWidths: [leftWidth, rightWidth],
    margins: { top: 20, bottom: 20, left: 0, right: 0 },
    rows: rows.map(([label, w]) => line(label, w || rightWidth)),
  });
}
function checkRow(options) {
  return new Paragraph({
    spacing: { before: 50, after: 50 },
    indent: { left: 240 },
    children: options.flatMap(opt => [
      new TextRun({ text: '☐  ', font: 'Calibri', size: 21, color: GOLD, bold: true }),
      new TextRun({ text: opt + '     ', font: 'Calibri', size: 21, color: BLACK }),
    ]),
  });
}
function sectionBox(title, children) {
  return new Table({
    columnWidths: [9400],
    margins: { top: 60, bottom: 60 },
    rows: [
      new TableRow({ children: [new TableCell({
        borders: { top: bGold, bottom: bNone, left: bGold, right: bGold },
        shading: { fill: DARK, type: ShadingType.CLEAR },
        children: [new Paragraph({ spacing: { before: 60, after: 60 }, indent: { left: 200 },
          children: [new TextRun({ text: title, font: 'Calibri', size: 23, bold: true, color: GOLD_BG })] })]
      })] }),
      new TableRow({ children: [new TableCell({
        borders: { top: bNone, bottom: bGold, left: bGold, right: bGold },
        shading: { fill: CREAM, type: ShadingType.CLEAR },
        children: [gap(40), ...children, gap(40)],
      })] }),
    ]
  });
}

function buildForm() {
  return new Document({
    sections: [
      // ── PORTADA ───────────────────────────────────────────────────────
      {
        properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
        children: [
          gap(400),
          new Paragraph({ alignment: AlignmentType.CENTER,
            shading: { fill: DARK, type: ShadingType.CLEAR }, spacing: { before: 0, after: 0 },
            children: [new TextRun({ text: '  COMANDALIA  ', font: 'Calibri', size: 70, bold: true, color: GOLD_BG })] }),
          new Paragraph({ alignment: AlignmentType.CENTER,
            shading: { fill: DARK, type: ShadingType.CLEAR }, spacing: { before: 0, after: 0 },
            children: [new TextRun({ text: 'Sistema de Pedidos para Restaurantes', font: 'Calibri', size: 22, color: WHITE })] }),
          new Paragraph({ alignment: AlignmentType.CENTER,
            shading: { fill: DARK, type: ShadingType.CLEAR }, spacing: { before: 0, after: 0 },
            children: [new TextRun({ text: ' ', size: 22 })] }),
          gap(260),
          new Paragraph({ alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'HOJA DE SOLICITUD DE PILOTO / CONTRATACIÓN', font: 'Calibri', size: 28, bold: true, color: DARK,
              underline: { type: UnderlineType.SINGLE, color: GOLD } })] }),
          gap(40),
          new Paragraph({ alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Rellene este documento y entrégueselo a su agente comercial', font: 'Calibri', size: 21, color: MUTED, italics: true })] }),
          gap(420),
          new Paragraph({ alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: 'Nº de expediente: ______________________', font: 'Calibri', size: 19, color: MUTED })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 0 },
            children: [new TextRun({ text: 'Agente comercial: ______________________    Fecha: ______________________', font: 'Calibri', size: 19, color: MUTED })] }),
          new Paragraph({ children: [new PageBreak()] }),
        ]
      },

      // ── FORMULARIO ────────────────────────────────────────────────────
      {
        properties: { page: { margin: { top: 1100, right: 1300, bottom: 1000, left: 1300 } } },
        headers: {
          default: new Header({ children: [
            new Table({ columnWidths: [4000, 5400], rows: [new TableRow({ children: [
              new TableCell({ borders: allB(bNone), children: [new Paragraph({
                children: [new TextRun({ text: 'COMANDALIA', font: 'Calibri', size: 20, bold: true, color: GOLD })] })] }),
              new TableCell({ borders: allB(bNone), children: [new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: 'Hoja de Solicitud · 2026', font: 'Calibri', size: 18, color: MUTED, italics: true })] })] }),
            ]})] }),
            new Paragraph({ border: { bottom: bGold }, children: [] }),
          ]}),
        },
        footers: {
          default: new Footer({ children: [new Paragraph({
            border: { top: bLight }, alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Comandalia © 2026 — Hoja de Solicitud — ', font: 'Calibri', size: 16, color: MUTED }),
              new TextRun({ children: [PageNumber.CURRENT], font: 'Calibri', size: 16, color: MUTED }),
            ]
          })] }),
        },
        children: [

          // ── A. DATOS DEL ESTABLECIMIENTO ───────────────────────────────
          sectionBox('A.  DATOS DEL ESTABLECIMIENTO', [
            formTable([
              ['Nombre del local / razón social'],
              ['NIF / CIF del negocio'],
              ['Tipo de establecimiento'],
              ['Dirección completa'],
              ['Código postal + Localidad'],
              ['Provincia / Comunidad autónoma'],
            ]),
            gap(20),
            para([t('Tipo de local (marca los que correspondan):', { bold: true, color: DARK })]),
            checkRow(['Restaurante', 'Cafetería / Bar', 'Hotel restaurante', 'Chiringuito / terraza', 'Franquicia / cadena', 'Otro']),
            gap(20),
            para([t('Número de mesas en sala:', { bold: true, color: DARK })]),
            new Table({ columnWidths: [2300, 2300, 2300, 2300], margins: { top: 20, bottom: 20 },
              rows: [new TableRow({ children: [
                new TableCell({ borders: allB(bNone), children: [checkRow(['Interior: _____ mesas'])] }),
                new TableCell({ borders: allB(bNone), children: [checkRow(['Terraza: _____ mesas'])] }),
                new TableCell({ borders: allB(bNone), children: [checkRow(['Barra: _____ mesas'])] }),
                new TableCell({ borders: allB(bNone), children: [checkRow(['Otro: _____ mesas'])] }),
              ]})] }),
          ]),
          gap(80),

          // ── B. DATOS DEL RESPONSABLE ───────────────────────────────────
          sectionBox('B.  DATOS DEL RESPONSABLE', [
            formTable([
              ['Nombre completo'],
              ['Cargo en el negocio'],
              ['Teléfono móvil directo'],
              ['Teléfono fijo (si lo hay)'],
              ['Correo electrónico'],
              ['WhatsApp (si distinto del móvil)'],
            ]),
            gap(20),
            para([t('¿Hay otro responsable técnico / de operaciones?', { bold: true, color: DARK })]),
            checkRow(['Sí → Nombre: ________________________________   Tel.: __________________________', 'No']),
          ]),
          gap(80),

          // ── C. SITUACIÓN ACTUAL ────────────────────────────────────────
          sectionBox('C.  SITUACIÓN ACTUAL DEL LOCAL', [
            para([t('¿Cómo gestionan ahora los pedidos?', { bold: true, color: DARK })]),
            checkRow(['Comanda en papel', 'TPV + comanda papel', 'TPV digital (¿cuál?): ________________', 'Otra app (¿cuál?): ________________']),
            gap(30),
            para([t('¿Tienen actualmente algún sistema de pantalla de cocina (KDS)?', { bold: true, color: DARK })]),
            checkRow(['Sí', 'No']),
            gap(30),
            para([t('¿Tienen WiFi en el local?', { bold: true, color: DARK })]),
            checkRow(['Sí, estable', 'Sí, pero inestable', 'No']),
            gap(30),
            para([t('Número aproximado de servicios/turnos por semana:', { bold: true, color: DARK })]),
            checkRow(['1–5', '6–10', '11–15', 'Más de 15']),
            gap(30),
            para([t('Número de camareros en sala (de media por turno):', { bold: true, color: DARK })]),
            formTable([['Camareros por turno']]),
          ]),
          gap(80),
          new Paragraph({ children: [new PageBreak()] }),

          // ── D. PLAN SOLICITADO ────────────────────────────────────────
          sectionBox('D.  PLAN SOLICITADO', [
            para([t('Marque el plan de interés:', { bold: true, color: DARK })]),
            gap(20),
            new Table({
              columnWidths: [9200],
              margins: { top: 20, bottom: 20 },
              rows: [
                ...[
                  ['☐', 'Plan INICIAL', 'Hasta 20 mesas — 999 € pago único  (o 3 × 333 €)', '39 €/mes opcional'],
                  ['☐', 'Plan PRO', 'Mesas ilimitadas — 2.299 € pago único  (o 3 × 766 €)', '69 €/mes opcional (cloud + soporte 24h)'],
                  ['☐', 'Plan MULTI-SEDE', 'Desde 3.500 € (1ª sede) — precio a medida', '99 €/mes por sede (account manager + SLA 4h)'],
                ].map(([chk, plan, precio, mant]) => new TableRow({ children: [new TableCell({
                  borders: { top: bNone, bottom: bLight, left: bGold2, right: bNone },
                  shading: { fill: CREAM, type: ShadingType.CLEAR },
                  children: [new Paragraph({ spacing: { before: 60, after: 60 }, indent: { left: 180 },
                    children: [
                      new TextRun({ text: chk + '  ', font: 'Calibri', size: 21, color: GOLD, bold: true }),
                      new TextRun({ text: plan, font: 'Calibri', size: 22, bold: true, color: DARK }),
                      new TextRun({ text: '  —  ' + precio, font: 'Calibri', size: 21, color: BLACK }),
                      new TextRun({ text: '   Mant.: ' + mant, font: 'Calibri', size: 19, color: MUTED, italics: true }),
                    ]
                  })]
                })] })),
              ],
            }),
            gap(40),
            para([t('¿Desea incluir el mantenimiento mensual?', { bold: true, color: DARK })]),
            checkRow(['Sí, con mantenimiento', 'No, solo licencia perpetua', 'Pendiente de decidir']),
            gap(30),
            para([t('Modalidad de pago preferida:', { bold: true, color: DARK })]),
            checkRow(['Pago único', 'Pago fraccionado sin intereses (3 cuotas)', 'Pendiente de decidir']),
            gap(30),
            para([t('¿Solicita piloto gratuito previo a la compra?', { bold: true, color: DARK })]),
            checkRow(['Sí, quiero el piloto gratuito (7–14 días)', 'No, contratación directa']),
          ]),
          gap(80),

          // ── E. CONFIGURACIÓN DEL SISTEMA ───────────────────────────────
          sectionBox('E.  CONFIGURACIÓN DEL SISTEMA', [
            para([t('Datos para la configuración de la carta:', { bold: true, color: DARK })]),
            formTable([
              ['Nombre del restaurante (como aparecerá en la app)'],
              ['Eslogan o subtítulo (opcional)'],
              ['Moneda utilizada'],
              ['Idioma principal de la carta'],
            ]),
            gap(30),
            para([t('¿Necesita la carta en más idiomas?', { bold: true, color: DARK })]),
            checkRow(['No', 'Inglés', 'Francés', 'Alemán', 'Otro: ___________']),
            gap(30),
            para([t('¿Tiene fotos de sus platos disponibles para la carta digital?', { bold: true, color: DARK })]),
            checkRow(['Sí, las entrego en formato digital', 'No, las hacemos durante la instalación', 'Quiero fotos profesionales (presupuesto aparte)']),
            gap(30),
            para([t('¿Tiene logo del restaurante en alta resolución?', { bold: true, color: DARK })]),
            checkRow(['Sí, lo entrego', 'No']),
            gap(30),
            para([t('Número de categorías de la carta (aprox.):', { bold: true, color: DARK })]),
            formTable([['Categorías en la carta']]),
            gap(30),
            para([t('Número total de platos (aprox.):', { bold: true, color: DARK })]),
            formTable([['Platos en total']]),
            gap(30),
            para([t('¿Quiere activar el sistema de valoraciones por parte del cliente?', { bold: true, color: DARK })]),
            checkRow(['Sí', 'No']),
            gap(30),
            para([t('¿Quiere mostrar información de alérgenos en la carta?', { bold: true, color: DARK })]),
            checkRow(['Sí, los tengo documentados', 'Sí, necesito ayuda para documentarlos', 'No por ahora']),
          ]),
          gap(80),
          new Paragraph({ children: [new PageBreak()] }),

          // ── F. HARDWARE ───────────────────────────────────────────────
          sectionBox('F.  HARDWARE Y DOTACIÓN TÉCNICA', [
            para([t('¿Dispone ya de alguno de estos equipos que podría integrarse?', { bold: true, color: DARK })]),
            checkRow(['Monitor en cocina', 'Tablet en sala', 'Router WiFi propio', 'Impresora térmica', 'Ninguno']),
            gap(30),
            para([t('Número de mesas para las que necesita QR (laminados):', { bold: true, color: DARK })]),
            formTable([['QR laminados necesarios']]),
            gap(30),
            para([t('¿Hay punto de electricidad disponible en cocina para el monitor?', { bold: true, color: DARK })]),
            checkRow(['Sí', 'No', 'Hay que instalarlo']),
            gap(30),
            para([t('¿Hay toma de red Ethernet en el área de caja / mostrador?', { bold: true, color: DARK })]),
            checkRow(['Sí', 'No', 'No lo sé']),
            gap(30),
            para([t('Observaciones sobre el espacio / instalación:', { bold: true, color: DARK })]),
            formTable([['Observaciones'], [''], ['']]),
          ]),
          gap(80),

          // ── G. INSTALACIÓN ────────────────────────────────────────────
          sectionBox('G.  PREFERENCIAS DE INSTALACIÓN', [
            para([t('Fecha preferida para la instalación del piloto:', { bold: true, color: DARK })]),
            formTable([['Primera opción (día + hora)'], ['Segunda opción (día + hora)']]),
            gap(30),
            para([t('Horario de disponibilidad del responsable para la instalación:', { bold: true, color: DARK })]),
            checkRow(['Mañana (9h–13h)', 'Mediodía (13h–16h)', 'Tarde (16h–20h)', 'Indiferente']),
            gap(30),
            para([t('¿Hay parking o acceso para furgoneta de técnico?', { bold: true, color: DARK })]),
            checkRow(['Sí', 'No, hay que aparcar en calle', 'Indicar al técnico: ___________________________________']),
            gap(30),
            para([t('¿Necesita factura a nombre de empresa?', { bold: true, color: DARK })]),
            checkRow(['Sí (datos fiscales en sección A)', 'No, factura a nombre particular']),
          ]),
          gap(80),

          // ── H. SERVICIOS ADICIONALES ──────────────────────────────────
          sectionBox('H.  SERVICIOS ADICIONALES (OPCIONALES)', [
            para([t('Marque los servicios adicionales de interés:', { bold: true, color: DARK })]),
            gap(20),
            ...[
              ['☐', 'Formación presencial ampliada para el equipo (camareros, cocineros, administración)', '+140 €'],
              ['☐', 'Sesión de fotografía profesional de platos (entrega de archivos en alta resolución)', 'Presupuesto a medida'],
              ['☐', 'Configuración avanzada de analítica e informes personalizados', '+180 €'],
              ['☐', 'Integración con datáfono ya existente en el local', 'Consultar disponibilidad'],
              ['☐', 'Bot Telegram configurado con múltiples responsables y alertas personalizadas', '+60 €'],
              ['☐', 'Diseño gráfico de QR de mesa con identidad del restaurante', '+80 €'],
            ].map(([chk, serv, precio]) => new Paragraph({
              spacing: { before: 50, after: 50 }, indent: { left: 240 },
              children: [
                new TextRun({ text: chk + '  ', font: 'Calibri', size: 21, color: GOLD, bold: true }),
                new TextRun({ text: serv, font: 'Calibri', size: 21, color: BLACK }),
                new TextRun({ text: '  —  ' + precio, font: 'Calibri', size: 20, color: MUTED, italics: true }),
              ]
            })),
          ]),
          gap(80),

          // ── I. OBSERVACIONES LIBRES ───────────────────────────────────
          sectionBox('I.  OBSERVACIONES Y REQUERIMIENTOS ESPECIALES', [
            gap(20),
            ...Array(6).fill(null).map(() =>
              new Table({ columnWidths: [9200], margins: { top: 10, bottom: 10 },
                rows: [new TableRow({ children: [new TableCell({
                  borders: { top: bNone, bottom: bForm, left: bNone, right: bNone },
                  children: [new Paragraph({ spacing: { before: 30, after: 8 },
                    children: [new TextRun({ text: ' ', font: 'Calibri', size: 22 })] })]
                })] })] })
            ),
            gap(20),
          ]),
          gap(80),

          // ── J. FIRMA ──────────────────────────────────────────────────
          sectionBox('J.  CONSENTIMIENTO Y FIRMA', [
            gap(20),
            para([
              t('El/la firmante declara que los datos facilitados son verídicos y autoriza a Comandalia a utilizarlos para la gestión del servicio solicitado, conforme a su '),
              t('Política de Privacidad', { bold: true }),
              t(' disponible en comandalia.es.'),
            ]),
            gap(30),
            para([t('☐  Acepto recibir comunicaciones comerciales de Comandalia', { color: MUTED })]),
            para([t('☐  Acepto los Términos y Condiciones del servicio', { color: MUTED })]),
            gap(60),
            new Table({
              columnWidths: [4500, 600, 4300],
              margins: { top: 40, bottom: 40 },
              rows: [new TableRow({ children: [
                new TableCell({ borders: allB(bNone), children: [
                  new Paragraph({ spacing: { before: 40, after: 120 },
                    children: [new TextRun({ text: 'Firma del responsable del local', font: 'Calibri', size: 19, color: MUTED })] }),
                  new Paragraph({ border: { bottom: bForm }, spacing: { before: 160, after: 0 }, children: [] }),
                  new Paragraph({ spacing: { before: 20, after: 0 },
                    children: [new TextRun({ text: 'Nombre y apellidos: ___________________________', font: 'Calibri', size: 18, color: MUTED })] }),
                  new Paragraph({ spacing: { before: 8, after: 0 },
                    children: [new TextRun({ text: 'Fecha: _______________', font: 'Calibri', size: 18, color: MUTED })] }),
                ] }),
                new TableCell({ borders: allB(bNone), children: [para('')] }),
                new TableCell({ borders: allB(bNone), children: [
                  new Paragraph({ spacing: { before: 40, after: 120 },
                    children: [new TextRun({ text: 'Firma del agente Comandalia', font: 'Calibri', size: 19, color: MUTED })] }),
                  new Paragraph({ border: { bottom: bForm }, spacing: { before: 160, after: 0 }, children: [] }),
                  new Paragraph({ spacing: { before: 20, after: 0 },
                    children: [new TextRun({ text: 'Nombre del agente: ___________________________', font: 'Calibri', size: 18, color: MUTED })] }),
                  new Paragraph({ spacing: { before: 8, after: 0 },
                    children: [new TextRun({ text: 'ID agente: _______________', font: 'Calibri', size: 18, color: MUTED })] }),
                ] }),
              ]})]
            }),
            gap(60),
            para([t('Documento generado por el sistema Comandalia · comercial@comandalia.es · comandalia.es', { color: MUTED, italics: true, size: 18 })]),
          ]),
          gap(80),
        ]
      }
    ]
  });
}


// ─────────────────────────────────────────────────────────────────────────
// GENERATE BOTH
// ─────────────────────────────────────────────────────────────────────────
(async () => {
  const base = 'C:\\Users\\jose2\\OneDrive\\Escritorio\\proyecto.comandalia';

  const dossier = buildClientDossier();
  fs.writeFileSync(`${base}\\Propuesta_Comercial_Cliente_Comandalia.docx`, await Packer.toBuffer(dossier));
  console.log('✅ Propuesta_Comercial_Cliente_Comandalia.docx');

  const form = buildForm();
  fs.writeFileSync(`${base}\\Formulario_Solicitud_Cliente_Comandalia.docx`, await Packer.toBuffer(form));
  console.log('✅ Formulario_Solicitud_Cliente_Comandalia.docx');
})();
