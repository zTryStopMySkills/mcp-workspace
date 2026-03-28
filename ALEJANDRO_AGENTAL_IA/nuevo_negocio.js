/**
 * nuevo_negocio.js — Agental.iA
 * Genera PROPUESTA + CONTRATO DE CLIENTE para un nuevo negocio
 * y los guarda en la carpeta de Alejandro.
 *
 * USO (al finalizar cada proyecto /webprocess):
 *   1. Editar el bloque DATOS DEL NEGOCIO a continuación
 *   2. node nuevo_negocio.js
 */

// ════════════════════════════════════════════════════════════════════
// DATOS DEL NEGOCIO — editar antes de ejecutar
// ════════════════════════════════════════════════════════════════════
const NEGOCIO = {
  // Número de carpeta (siguiente al último en ALEJANDRO_AGENTAL_IA/)
  numero:     '18',
  carpeta:    '18_ElRincon_Salteras',

  // Datos del negocio
  nombre:     'El Rincón de Salteras',
  tipo:       'Restaurante Carnes a la Brasa — Salteras, Sevilla',
  intro:      'El Rincón de Salteras es el restaurante de referencia del municipio para carnes a la brasa. Rubén Darío Enciso Bernal, llegado desde Caacupé (Paraguay), lleva más de 15 años en Salteras y en 2018 abrió El Rincón. En 2024 inauguró nuevo local diseñado por FABI interiorismo. 4.4 estrellas en Google con 736 reseñas y 9.2/10 en TheFork. Picaña, chuletón, cachopo artesano y croquetas caseras. Una historia de esfuerzo, fuego y excelencia.',

  // Lo que incluye la web (adaptar según lo que se ha construido)
  incluye: [
    'Landing page dark mode con diseño personalizado (arquetipo "El Amante + El Gobernante") y animaciones con Framer Motion',
    'Hero fullscreen con badge de ratings (Google 4.4★ + TheFork 9.2)',
    'Sección Especialidades con cards animadas y hover effects',
    'Sección Historia — storytelling de Rubén Darío Enciso con pull quote y stats',
    'Galería con lightbox y efecto masonry',
    'Testimoniales con las reseñas reales de Google',
    'Formulario de reserva que abre WhatsApp con mensaje prellenado',
    'Panel de administración completo en /admin — edición de hero, especialidades, testimoniales, horario y configuración',
    'Sincronización en tiempo real landing ↔ admin (revalidación ISR + BroadcastChannel)',
    'Botón WhatsApp flotante + scroll-to-top',
    'Schema.org Restaurant para SEO',
    'Tipografía Playfair Display (display) + Lato (cuerpo)',
    'Deploy en Vercel con HTTPS automático',
  ],

  // Precios acordados (pares [servicio, precio])
  precios: [
    ['Diseño y desarrollo web completo', '1.200 €'],
    ['Mantenimiento mensual (admin incluido)', '80 €/mes'],
  ],

  // Frase de cierre para la propuesta
  cta: 'El Rincón de Salteras ya tiene la reputación. Con esta web, la tiene también online. Quien busque "carnes a la brasa Salteras" o "restaurante Salteras" va a encontrar algo a la altura de lo que Rubén lleva 15 años construyendo.',

  // Datos del cliente para el contrato (rellenar si se conocen)
  cliente: {
    nombre:    'Rubén Darío Enciso Bernal',
    cif:       '',
    direccion: 'C/ Juan Ramón Jiménez, 29, 41909 Salteras, Sevilla',
    telefono:  '+34 954 96 61 84',
    email:     '',
    contacto:  'Rubén',
    dominio:   'https://rincon-salteras.vercel.app',
  },

  // Precio acordado para el contrato
  precioDesarrollo:    '1200',
  precioMantenimiento: '80',
  primerPago:          '600',
};
// ════════════════════════════════════════════════════════════════════

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, ImageRun
} = require('docx');
const fs   = require('fs');
const path = require('path');

const BASE = __dirname;
const LOGO = fs.readFileSync(path.join(BASE, 'logo_agental.png'));

const NAVY  = '0A1628';
const BLUE  = '2563EB';
const GRAY  = 'F0F4F8';
const WHITE = 'FFFFFF';
const DARK  = '1E293B';
const MID   = '64748B';

function buildNumbering() {
  return { config: [
    { reference: 'bullets',
      levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
    { reference: 'numbered',
      levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] }
  ]};
}

function buildStyles() {
  return {
    default: { document: { run: { font: 'Calibri', size: 22, color: DARK } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, color: NAVY, font: 'Calibri' },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, color: BLUE, font: 'Calibri' },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: 'LabelField', name: 'LabelField', basedOn: 'Normal',
        run: { size: 20, bold: true, color: MID, font: 'Calibri' },
        paragraph: { spacing: { after: 60 } } },
      { id: 'FieldValue', name: 'FieldValue', basedOn: 'Normal',
        run: { size: 22, color: DARK, font: 'Calibri' },
        paragraph: { spacing: { after: 160 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' } } } },
      { id: 'BodyText', name: 'BodyText', basedOn: 'Normal',
        run: { size: 22, color: DARK, font: 'Calibri' },
        paragraph: { spacing: { after: 120 } } }
    ]
  };
}

function buildHeader(subtitulo = '') {
  return new Header({ children: [
    new Table({
      columnWidths: [7200, 2160],
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      rows: [new TableRow({ children: [
        new TableCell({
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                     left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          shading: { fill: NAVY, type: ShadingType.CLEAR },
          width: { size: 7200, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({
            alignment: AlignmentType.LEFT, spacing: { before: 80, after: 80 }, indent: { left: 160 },
            children: [
              new ImageRun({ type: 'png', data: LOGO, transformation: { width: 110, height: 60 },
                altText: { title: 'Agental.iA', description: 'Logo', name: 'logo' } }),
              ...(subtitulo ? [new TextRun({ text: '   ' + subtitulo, size: 16, color: 'A0B4CC', font: 'Calibri', italics: true })] : [])
            ]
          })]
        }),
        new TableCell({
          borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                     left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          shading: { fill: BLUE, type: ShadingType.CLEAR },
          width: { size: 2160, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({
            alignment: AlignmentType.CENTER, spacing: { before: 120, after: 120 },
            children: [new TextRun({ text: 'info@agental.ia', size: 16, color: WHITE, font: 'Calibri', bold: true })]
          })]
        })
      ]})]
    }),
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun('')] })
  ]});
}

function buildFooter(label = '') {
  return new Footer({ children: [new Paragraph({
    alignment: AlignmentType.CENTER,
    border: { top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' } },
    spacing: { before: 80 },
    children: [
      new TextRun({ text: 'Agental.iA  |  info@agental.ia  |  agental.ia', size: 16, color: MID, font: 'Calibri' }),
      ...(label ? [new TextRun({ text: '  |  ' + label, size: 16, color: MID, font: 'Calibri' })] : []),
      new TextRun({ text: '    Pág. ', size: 16, color: MID, font: 'Calibri' }),
      new TextRun({ children: [PageNumber.CURRENT], size: 16, color: MID, font: 'Calibri' })
    ]
  })]});
}

const divider = () => new Paragraph({ spacing: { before: 80, after: 80 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLUE } }, children: [new TextRun('')] });
const spacer  = () => new Paragraph({ spacing: { after: 160 }, children: [new TextRun('')]});
const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const body = (t) => new Paragraph({ style: 'BodyText', children: [new TextRun(t)] });
const bullet = (t) => new Paragraph({ numbering: { reference: 'bullets', level: 0 }, children: [new TextRun({ text: t, size: 22, color: DARK, font: 'Calibri' })] });
const numbered = (t) => new Paragraph({ numbering: { reference: 'numbered', level: 0 }, children: [new TextRun({ text: t, size: 22, color: DARK, font: 'Calibri' })] });

function field(label, value = '') {
  return [
    new Paragraph({ style: 'LabelField', children: [new TextRun(label)] }),
    new Paragraph({ style: 'FieldValue', children: [new TextRun({
      text: value || '_______________________________________________',
      color: value ? DARK : 'CBD5E1', italics: !value, font: 'Calibri', size: 22
    })] })
  ];
}

function infoBox(children, fill = GRAY) {
  const border = { style: BorderStyle.SINGLE, size: 2, color: BLUE };
  return new Table({ columnWidths: [9360], margins: { top: 120, bottom: 120, left: 240, right: 240 },
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: border, bottom: border, left: border, right: border },
      shading: { fill, type: ShadingType.CLEAR },
      width: { size: 9360, type: WidthType.DXA }, children
    })] })] });
}

function priceTable(rows) {
  const b = { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' };
  const borders = { top: b, bottom: b, left: b, right: b };
  return new Table({
    columnWidths: [5760, 3600], margins: { top: 80, bottom: 80, left: 200, right: 200 },
    rows: [
      new TableRow({ tableHeader: true, children: [
        new TableCell({ borders, shading: { fill: NAVY, type: ShadingType.CLEAR }, width: { size: 5760, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Servicio', bold: true, size: 22, color: WHITE, font: 'Calibri' })] })] }),
        new TableCell({ borders, shading: { fill: NAVY, type: ShadingType.CLEAR }, width: { size: 3600, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Precio', bold: true, size: 22, color: WHITE, font: 'Calibri' })] })] })
      ]}),
      ...rows.map(([svc, price], i) => new TableRow({ children: [
        new TableCell({ borders, shading: { fill: i % 2 === 0 ? WHITE : GRAY, type: ShadingType.CLEAR }, width: { size: 5760, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: svc, size: 22, color: DARK, font: 'Calibri' })] })] }),
        new TableCell({ borders, shading: { fill: i % 2 === 0 ? WHITE : GRAY, type: ShadingType.CLEAR }, width: { size: 3600, type: WidthType.DXA },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: price, size: 22, bold: true, color: BLUE, font: 'Calibri' })] })] })
      ]}))
    ]
  });
}

function firmaTable(izquierda, derecha) {
  const none = { style: BorderStyle.NONE };
  const borders = { top: none, bottom: none, left: none, right: none };
  return new Table({ columnWidths: [4320, 480, 4560], margins: { top: 120, bottom: 120, left: 0, right: 0 },
    rows: [new TableRow({ children: [
      new TableCell({ borders, width: { size: 4320, type: WidthType.DXA }, children: izquierda }),
      new TableCell({ borders, width: { size: 480,  type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun('')] })] }),
      new TableCell({ borders, width: { size: 4560, type: WidthType.DXA }, children: derecha })
    ]})]
  });
}

async function save(doc, filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buf);
  console.log('✓', path.relative(BASE, filePath));
}

// ─── PROPUESTA COMERCIAL ──────────────────────────────────────────────────────
async function makePropuesta() {
  const outDir = path.join(BASE, NEGOCIO.carpeta);
  const outFile = path.join(outDir, `PROPUESTA_${NEGOCIO.nombre.toUpperCase().replace(/\s+/g, '_')}.docx`);

  const doc = new Document({
    numbering: buildNumbering(), styles: buildStyles(),
    sections: [{
      properties: { page: { margin: { top: 1440, right: 1260, bottom: 1260, left: 1260 } } },
      headers: { default: buildHeader('Tu negocio en internet, sin complicaciones') },
      footers: { default: buildFooter(NEGOCIO.nombre) },
      children: [
        spacer(),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 160, after: 80 },
          children: [new TextRun({ text: 'PROPUESTA WEB PARA', size: 20, color: MID, font: 'Calibri', bold: true })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
          children: [new TextRun({ text: NEGOCIO.nombre.toUpperCase(), bold: true, size: 52, color: NAVY, font: 'Calibri' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
          children: [new TextRun({ text: NEGOCIO.tipo, size: 24, color: BLUE, italics: true, font: 'Calibri' })] }),
        divider(), spacer(),

        h1('Sobre el negocio'),
        body(NEGOCIO.intro),
        spacer(),

        h1('¿Qué incluye su web?'),
        ...NEGOCIO.incluye.map(item => bullet(item)),
        spacer(),

        h1('Inversión'),
        body('Transparencia total. Sin sorpresas ni costes ocultos:'),
        spacer(),
        priceTable(NEGOCIO.precios),
        spacer(),

        h1('¿Por qué Agental.iA?'),
        bullet('Entregamos la web en 7-10 días hábiles, no en meses.'),
        bullet('Diseño personalizado, no una plantilla genérica.'),
        bullet('Panel de administración que cualquier persona maneja desde el móvil.'),
        bullet('Soporte en español, cercano y rápido.'),
        bullet('Precio fijo sin sorpresas desde el primer día.'),
        spacer(),

        h1('El siguiente paso'),
        infoBox([
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
            children: [new TextRun({ text: NEGOCIO.cta, size: 24, color: NAVY, font: 'Calibri', bold: true })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 },
            children: [new TextRun({ text: 'Contacta ahora: info@agental.ia  |  agental.ia', size: 22, color: BLUE, font: 'Calibri' })] })
        ], 'EFF6FF'),
        spacer(), spacer(),

        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
          children: [new TextRun({ text: 'Esta propuesta tiene una validez de 30 días naturales desde la fecha de emisión.', size: 18, color: MID, italics: true, font: 'Calibri' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
          children: [new TextRun({ text: 'Fecha de emisión: ' + new Date().toLocaleDateString('es-ES'), size: 18, color: MID, font: 'Calibri' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 },
          children: [new TextRun({ text: 'Presentada por: Alejandro — Agente Comercial Agental.iA', size: 18, color: MID, font: 'Calibri' })] }),
        spacer(),

        firmaTable(
          [
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CLIENTE', bold: true, size: 22, color: NAVY, font: 'Calibri' })] }),
            spacer(),
            new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 1, color: NAVY } }, spacing: { before: 500, after: 80 }, children: [new TextRun({ text: 'Firma y nombre', size: 18, color: MID, italics: true, font: 'Calibri' })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Fecha: _______________', size: 20, color: DARK, font: 'Calibri' })] })
          ],
          [
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'AGENTE COMERCIAL', bold: true, size: 22, color: NAVY, font: 'Calibri' })] }),
            spacer(),
            new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 1, color: NAVY } }, spacing: { before: 500, after: 80 }, children: [new TextRun({ text: 'Alejandro — Agental.iA', size: 18, color: MID, italics: true, font: 'Calibri' })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Fecha: _______________', size: 20, color: DARK, font: 'Calibri' })] })
          ]
        )
      ]
    }]
  });
  await save(doc, outFile);
}

// ─── CONTRATO SERVICIO CLIENTE ────────────────────────────────────────────────
async function makeContratoCliente() {
  const c = NEGOCIO.cliente;
  const outDir = path.join(BASE, NEGOCIO.carpeta);
  const outFile = path.join(outDir, `CONTRATO_SERVICIO_WEB_CLIENTE_${NEGOCIO.nombre.toUpperCase().replace(/\s+/g, '_')}.docx`);

  const totalPrimer = NEGOCIO.precioDesarrollo ? (parseInt(NEGOCIO.precioDesarrollo) / 2).toString() : '';

  const doc = new Document({
    numbering: buildNumbering(), styles: buildStyles(),
    sections: [{
      properties: { page: { margin: { top: 1440, right: 1260, bottom: 1260, left: 1260 } } },
      headers: { default: buildHeader() },
      footers: { default: buildFooter('Confidencial') },
      children: [
        spacer(),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 80 },
          children: [new TextRun({ text: 'CONTRATO DE SERVICIO WEB', bold: true, size: 44, color: NAVY, font: 'Calibri' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 },
          children: [new TextRun({ text: `Agental.iA — ${NEGOCIO.nombre}`, size: 24, color: BLUE, font: 'Calibri', italics: true })] }),
        divider(), spacer(),

        h1('1. Partes del Contrato'),
        h2('Prestador del servicio'),
        infoBox([
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'Empresa: ', bold: true, size: 22, color: NAVY, font: 'Calibri' }), new TextRun({ text: 'Agental.iA', size: 22, color: DARK, font: 'Calibri' })] }),
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'Contacto: ', bold: true, size: 22, color: NAVY, font: 'Calibri' }), new TextRun({ text: 'info@agental.ia  |  agental.ia', size: 22, color: DARK, font: 'Calibri' })] }),
          new Paragraph({ spacing: { after: 0  }, children: [new TextRun({ text: 'Agente comercial: ', bold: true, size: 22, color: NAVY, font: 'Calibri' }), new TextRun({ text: 'Alejandro', size: 22, color: DARK, font: 'Calibri' })] })
        ]),
        spacer(),
        h2('Cliente'),
        ...field('Nombre o razón social', c.nombre),
        ...field('CIF / DNI del titular', c.cif),
        ...field('Dirección fiscal', c.direccion),
        ...field('Teléfono', c.telefono),
        ...field('Email', c.email),
        ...field('Persona de contacto (si es empresa)', c.contacto),
        spacer(),

        h1('2. Objeto del Contrato'),
        body(`Agental.iA se compromete a diseñar, desarrollar y entregar un sitio web profesional para ${NEGOCIO.nombre} según las especificaciones detalladas a continuación.`),
        spacer(),
        ...field('Nombre del proyecto / web', NEGOCIO.nombre),
        ...field('Dominio web', c.dominio),
        spacer(),

        h1('3. Alcance del Servicio Contratado'),
        body('El servicio incluye los siguientes elementos:'),
        spacer(),
        ...NEGOCIO.incluye.map(item => bullet(item)),
        spacer(),
        ...field('Especificaciones adicionales acordadas'),
        spacer(),

        h1('4. Precio y Forma de Pago'),
        spacer(),
        priceTable([
          ['Desarrollo web (pago único)', NEGOCIO.precioDesarrollo ? NEGOCIO.precioDesarrollo + ' €' : '_____ €'],
          ['Mantenimiento mensual (opcional)', NEGOCIO.precioMantenimiento && NEGOCIO.precioMantenimiento !== '0' ? NEGOCIO.precioMantenimiento + ' €/mes' : '_____ €/mes'],
          ['Primer pago al firmar (50% desarrollo)', totalPrimer ? totalPrimer + ' €' : '_____ €'],
        ]),
        spacer(),
        h2('Condiciones de pago'),
        bullet('50% al firmar este contrato → inicio inmediato del proyecto.'),
        bullet('50% restante en la entrega y publicación de la web.'),
        bullet('La cuota de mantenimiento se abona mensualmente a partir del mes siguiente a la entrega.'),
        spacer(),
        ...field('Forma de pago acordada', ''),
        spacer(),

        h1('5. Plazos de Entrega'),
        bullet('Inicio del proyecto: a partir de la recepción del primer pago.'),
        bullet('Plazo estimado de entrega: 7 a 10 días hábiles.'),
        bullet('El cliente se compromete a facilitar el material (fotos, textos, logo) en máximo 3 días desde el inicio.'),
        spacer(),
        ...field('Fecha de inicio acordada', ''),
        ...field('Fecha estimada de entrega', ''),
        spacer(),

        h1('6. Revisiones'),
        bullet('Incluye hasta 2 rondas de revisiones sobre diseño y contenido.'),
        bullet('Cambios adicionales fuera del alcance se presupuestan aparte.'),
        bullet('Una vez el cliente apruebe la web publicada, se considera el proyecto entregado y aceptado.'),
        spacer(),

        h1('7. Propiedad y Derechos'),
        bullet('El dominio es propiedad del cliente desde el pago completo.'),
        bullet('El código y diseño son propiedad de Agental.iA hasta el pago íntegro, momento en que se ceden al cliente.'),
        bullet('El cliente es responsable de que las imágenes y textos facilitados no infrinjan derechos de terceros.'),
        spacer(),

        h1('8. Mantenimiento Mensual'),
        body('El mantenimiento incluye: actualizaciones de seguridad, soporte para modificaciones de contenido (carta, horarios, fotos, precios), panel admin operativo y atención en horario laboral.'),
        body('Cancelable con 30 días de preaviso por escrito. Agental.iA puede cancelarlo si la cuota lleva más de 60 días impagada.'),
        spacer(),

        h1('9. Aceptación'),
        spacer(),
        ...field('Firmado en', ''),
        ...field('Fecha de firma', ''),
        spacer(), spacer(),

        firmaTable(
          [
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'EL CLIENTE', bold: true, size: 22, color: NAVY, font: 'Calibri' })] }),
            spacer(),
            new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 1, color: NAVY } }, spacing: { before: 600, after: 80 }, children: [new TextRun({ text: c.nombre || 'Firma y nombre', size: 18, color: MID, italics: true, font: 'Calibri' })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CIF/DNI: ' + (c.cif || '_______________'), size: 20, color: DARK, font: 'Calibri' })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Fecha: _______________', size: 20, color: DARK, font: 'Calibri' })] })
          ],
          [
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'AGENTAL.IA', bold: true, size: 22, color: NAVY, font: 'Calibri' })] }),
            spacer(),
            new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 1, color: NAVY } }, spacing: { before: 600, after: 80 }, children: [new TextRun({ text: 'Alejandro — Agente Comercial', size: 18, color: MID, italics: true, font: 'Calibri' })] }),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Fecha: _______________', size: 20, color: DARK, font: 'Calibri' })] })
          ]
        ),
        spacer(),
        infoBox([new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [
          new TextRun({ text: 'Al firmar, el cliente acepta todas las condiciones descritas. Se recomienda guardar una copia firmada por ambas partes.', size: 18, color: MID, italics: true, font: 'Calibri' })
        ]})], 'EFF6FF')
      ]
    }]
  });
  await save(doc, outFile);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log(`\n⚡ Generando documentos Alejandro para: ${NEGOCIO.nombre}\n`);
  await makePropuesta();
  await makeContratoCliente();
  console.log(`\n✅ Documentos generados en: ALEJANDRO_AGENTAL_IA/${NEGOCIO.carpeta}/\n`);
})();
