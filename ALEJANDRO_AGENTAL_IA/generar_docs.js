const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, UnderlineType, ImageRun
} = require('docx');
const fs = require('fs');
const path = require('path');

const BASE = __dirname;
const LOGO = fs.readFileSync(path.join(BASE, 'logo_agental.png'));

// ─── Brand ───────────────────────────────────────────────────────────────────
const NAVY  = '0A1628';
const BLUE  = '2563EB';
const GRAY  = 'F0F4F8';
const WHITE = 'FFFFFF';
const DARK  = '1E293B';
const MID   = '64748B';

// ─── Shared numbering config ──────────────────────────────────────────────────
function buildNumbering() {
  return {
    config: [
      {
        reference: 'bullets',
        levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 270 } } } }]
      },
      {
        reference: 'numbered',
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 270 } } } }]
      }
    ]
  };
}

// ─── Shared styles ────────────────────────────────────────────────────────────
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

// ─── Header Agental.iA ───────────────────────────────────────────────────────
function buildHeader() {
  return new Header({
    children: [
      new Table({
        columnWidths: [7200, 2160],
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        rows: [new TableRow({
          children: [
            new TableCell({
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                         left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              shading: { fill: NAVY, type: ShadingType.CLEAR },
              width: { size: 7200, type: WidthType.DXA },
              verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 80, after: 80 },
                indent: { left: 160 },
                children: [
                  new ImageRun({
                    type: 'png',
                    data: LOGO,
                    transformation: { width: 110, height: 60 },
                    altText: { title: 'Agental.iA', description: 'Logo Agental.iA', name: 'logo' }
                  }),
                  new TextRun({ text: '   Tu negocio en internet, sin complicaciones', size: 16, color: 'A0B4CC', font: 'Calibri', italics: true })
                ]
              })]
            }),
            new TableCell({
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
                         left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              shading: { fill: BLUE, type: ShadingType.CLEAR },
              width: { size: 2160, type: WidthType.DXA },
              verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 120, after: 120 },
                children: [new TextRun({ text: 'info@agental.ia', size: 16, color: WHITE, font: 'Calibri', bold: true })]
              })]
            })
          ]
        })]
      }),
      new Paragraph({ spacing: { after: 0 }, children: [new TextRun('')] })
    ]
  });
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function buildFooter(extraText = '') {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' } },
        spacing: { before: 80 },
        children: [
          new TextRun({ text: 'Agental.iA  |  info@agental.ia  |  agental.ia', size: 16, color: MID, font: 'Calibri' }),
          ...(extraText ? [new TextRun({ text: '  |  ' + extraText, size: 16, color: MID, font: 'Calibri' })] : []),
          new TextRun({ text: '    Pág. ', size: 16, color: MID, font: 'Calibri' }),
          new TextRun({ children: [PageNumber.CURRENT], size: 16, color: MID, font: 'Calibri' })
        ]
      })
    ]
  });
}

// ─── Thin blue divider ────────────────────────────────────────────────────────
function divider() {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: BLUE } },
    children: [new TextRun('')]
  });
}

// ─── Field (label + underlined value) ────────────────────────────────────────
function field(label, placeholder = '') {
  return [
    new Paragraph({ style: 'LabelField', children: [new TextRun(label)] }),
    new Paragraph({
      style: 'FieldValue',
      children: [new TextRun({ text: placeholder, color: 'CBD5E1', italics: true })]
    })
  ];
}

// ─── Bullet paragraph ─────────────────────────────────────────────────────────
function bullet(text) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [new TextRun({ text, size: 22, color: DARK, font: 'Calibri' })]
  });
}

// ─── Numbered paragraph ───────────────────────────────────────────────────────
function numbered(ref, text) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    children: [new TextRun({ text, size: 22, color: DARK, font: 'Calibri' })]
  });
}

// ─── Section heading ─────────────────────────────────────────────────────────
function h1(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] }); }

function body(text) {
  return new Paragraph({ style: 'BodyText', children: [new TextRun(text)] });
}

function spacer() {
  return new Paragraph({ spacing: { after: 160 }, children: [new TextRun('')]});
}

// ─── Highlighted box (table single cell) ─────────────────────────────────────
function infoBox(children, fillColor = GRAY) {
  const border = { style: BorderStyle.SINGLE, size: 2, color: BLUE };
  return new Table({
    columnWidths: [9360],
    margins: { top: 120, bottom: 120, left: 240, right: 240 },
    rows: [new TableRow({
      children: [new TableCell({
        borders: { top: border, bottom: border, left: border, right: border },
        shading: { fill: fillColor, type: ShadingType.CLEAR },
        width: { size: 9360, type: WidthType.DXA },
        children
      })]
    })]
  });
}

// ─── Price table ─────────────────────────────────────────────────────────────
function priceTable(rows) {
  const hBorder = { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' };
  const cBorders = { top: hBorder, bottom: hBorder, left: hBorder, right: hBorder };
  return new Table({
    columnWidths: [5760, 3600],
    margins: { top: 80, bottom: 80, left: 200, right: 200 },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({ borders: cBorders, shading: { fill: NAVY, type: ShadingType.CLEAR }, width: { size: 5760, type: WidthType.DXA },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Servicio', bold: true, size: 22, color: WHITE, font: 'Calibri' })] })] }),
          new TableCell({ borders: cBorders, shading: { fill: NAVY, type: ShadingType.CLEAR }, width: { size: 3600, type: WidthType.DXA },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Precio', bold: true, size: 22, color: WHITE, font: 'Calibri' })] })] })
        ]
      }),
      ...rows.map(([svc, price], i) => new TableRow({
        children: [
          new TableCell({ borders: cBorders, shading: { fill: i % 2 === 0 ? WHITE : GRAY, type: ShadingType.CLEAR }, width: { size: 5760, type: WidthType.DXA },
            children: [new Paragraph({ children: [new TextRun({ text: svc, size: 22, color: DARK, font: 'Calibri' })] })] }),
          new TableCell({ borders: cBorders, shading: { fill: i % 2 === 0 ? WHITE : GRAY, type: ShadingType.CLEAR }, width: { size: 3600, type: WidthType.DXA },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: price, size: 22, bold: true, color: BLUE, font: 'Calibri' })] })] })
        ]
      }))
    ]
  });
}

// ─── Save helper ─────────────────────────────────────────────────────────────
async function save(doc, filePath) {
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buf);
  console.log('✓', path.relative(BASE, filePath));
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. CONTRATO AGENTE COMERCIAL
// ═══════════════════════════════════════════════════════════════════════════════
async function makeContrato() {
  const doc = new Document({
    numbering: buildNumbering(),
    styles: buildStyles(),
    sections: [{
      properties: { page: { margin: { top: 1440, right: 1260, bottom: 1260, left: 1260 } } },
      headers: { default: buildHeader() },
      footers: { default: buildFooter('Documento confidencial') },
      children: [
        // Title block
        spacer(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 80 },
          children: [new TextRun({ text: 'CONTRATO DE AGENCIA COMERCIAL', bold: true, size: 44, color: NAVY, font: 'Calibri' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [new TextRun({ text: 'Agental.iA — Soluciones Web para Negocios Locales', size: 24, color: BLUE, font: 'Calibri', italics: true })]
        }),
        divider(), spacer(),

        // DATOS DEL AGENTE
        h1('1. Datos del Agente'),
        ...field('Nombre completo', 'Introduce el nombre completo del agente'),
        ...field('DNI / NIE', 'Introduce el número de documento'),
        ...field('Dirección', 'Calle, número, piso, ciudad, código postal'),
        ...field('Teléfono de contacto', 'Número de teléfono'),
        ...field('Email', 'correo@ejemplo.com'),
        ...field('Número de autónomo / NAF', 'Número de afiliación a la Seguridad Social'),
        spacer(),

        // DATOS DE LA EMPRESA
        h1('2. Datos de la Empresa'),
        infoBox([
          new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: 'Empresa: ', bold: true, size: 22, color: NAVY, font: 'Calibri' }), new TextRun({ text: 'Agental.iA', size: 22, color: DARK, font: 'Calibri' })] }),
          new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: 'CIF: ', bold: true, size: 22, color: NAVY, font: 'Calibri' }), new TextRun({ text: '[pendiente de registro]', size: 22, color: MID, italics: true, font: 'Calibri' })] }),
          new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: 'Web: ', bold: true, size: 22, color: NAVY, font: 'Calibri' }), new TextRun({ text: 'agental.ia  |  info@agental.ia', size: 22, color: DARK, font: 'Calibri' })] })
        ]),
        spacer(),
        ...field('Representante legal de Agental.iA', 'Nombre del representante legal'),
        spacer(),

        // OBJETO
        h1('3. Objeto del Contrato'),
        body('El AGENTE se compromete a la captación de clientes para los servicios de diseño, desarrollo y mantenimiento web ofrecidos por Agental.iA, en nombre y representación de la empresa, dentro de las condiciones establecidas en el presente contrato.'),
        spacer(),

        // COMISIONES
        h1('4. Comisiones y Facturación'),
        ...field('Porcentaje de comisión acordado', 'Ej.: 15% sobre el precio de venta final'),
        spacer(),
        body('Condiciones de facturación:'),
        bullet('La factura deberá emitirse una vez el cliente haya firmado el contrato de servicio y abonado el primer pago a Agental.iA.'),
        bullet('El AGENTE emitirá la factura como profesional autónomo, con el IVA correspondiente (21%).'),
        bullet('El plazo máximo de pago de la comisión será de 15 días hábiles desde la recepción de la factura.'),
        spacer(),
        ...field('Forma de cobro', 'Ej.: Transferencia bancaria'),
        ...field('IBAN para transferencia', 'ES00 0000 0000 0000 0000 0000'),
        spacer(),

        // PRECIOS DE REFERENCIA
        h1('5. Productos y Precios de Referencia'),
        body('Los siguientes precios son orientativos y pueden ajustarse según las necesidades del cliente:'),
        spacer(),
        priceTable([
          ['Web básica — Landing page', 'desde 497 €'],
          ['Web con panel de administración', 'desde 797 €'],
          ['Web completa con carta/menú + admin', 'desde 997 €'],
          ['Sistema SaaS para restaurantes (Comandalia)', 'desde 1.997 €'],
          ['Mantenimiento mensual (básico)', 'desde 39 €/mes'],
          ['Mantenimiento mensual (con admin)', 'desde 49 €/mes'],
          ['Mantenimiento mensual (premium)', 'desde 59 €/mes']
        ]),
        spacer(),

        // EXCLUSIVIDAD
        h1('6. Exclusividad y Territorio'),
        bullet('El AGENTE opera sin exclusividad territorial. Agental.iA puede operar en la misma zona con otros agentes u otros canales de venta.'),
        ...field('Zona preferente de actuación del agente', 'Ej.: Mairena del Aljarafe, Castilleja de la Cuesta y municipios del Aljarafe'),
        spacer(),

        // DURACION
        h1('7. Duración del Contrato'),
        ...field('Fecha de inicio', 'DD/MM/AAAA'),
        bullet('Duración inicial: 6 meses, prorrogable automáticamente por periodos iguales.'),
        bullet('Preaviso para resolución: 30 días por escrito a la parte contraria.'),
        spacer(),

        // OBLIGACIONES AGENTE
        h1('8. Obligaciones del Agente'),
        numbered('numbered', 'Presentar los servicios de Agental.iA con profesionalidad y veracidad.'),
        numbered('numbered', 'No ofrecer ni representar servicios de la competencia directa durante la vigencia del contrato.'),
        numbered('numbered', 'Reportar cada visita o contacto comercial mediante el formulario de seguimiento facilitado por Agental.iA.'),
        numbered('numbered', 'Mantener la confidencialidad sobre precios, clientes y acuerdos comerciales de Agental.iA.'),
        numbered('numbered', 'No firmar contratos en nombre de Agental.iA sin autorización expresa por escrito.'),
        spacer(),

        // OBLIGACIONES EMPRESA
        h1('9. Obligaciones de Agental.iA'),
        numbered('numbered', 'Proporcionar al AGENTE material comercial actualizado (dossiers, propuestas, tarifas).'),
        numbered('numbered', 'Abonar las comisiones acordadas en un plazo máximo de 15 días hábiles tras el cobro al cliente.'),
        numbered('numbered', 'Dar soporte técnico y comercial al AGENTE para facilitar el cierre de ventas.'),
        numbered('numbered', 'Informar al AGENTE de cualquier cambio en los productos, precios o condiciones con un mínimo de 15 días de antelación.'),
        spacer(),

        // FIRMA
        h1('10. Firma del Contrato'),
        body('Las partes, de mutuo acuerdo y en plena capacidad jurídica, firman el presente contrato:'),
        spacer(),
        ...field('Firmado en la ciudad de', 'Ciudad'),
        ...field('Fecha', 'DD / MM / AAAA'),
        spacer(), spacer(),

        // Firma block
        new Table({
          columnWidths: [4320, 480, 4560],
          margins: { top: 120, bottom: 120, left: 0, right: 0 },
          rows: [new TableRow({
            children: [
              new TableCell({
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                width: { size: 4320, type: WidthType.DXA },
                children: [
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'EL AGENTE', bold: true, size: 22, color: NAVY, font: 'Calibri' })] }),
                  spacer(),
                  new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 1, color: NAVY } }, spacing: { before: 600, after: 80 }, children: [new TextRun({ text: 'Firma y nombre', size: 18, color: MID, italics: true, font: 'Calibri' })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'DNI: ___________________', size: 20, color: DARK, font: 'Calibri' })] })
                ]
              }),
              new TableCell({
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                width: { size: 480, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun('')]})],
              }),
              new TableCell({
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                width: { size: 4560, type: WidthType.DXA },
                children: [
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'AGENTAL.IA', bold: true, size: 22, color: NAVY, font: 'Calibri' })] }),
                  spacer(),
                  new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 1, color: NAVY } }, spacing: { before: 600, after: 80 }, children: [new TextRun({ text: 'Firma y nombre', size: 18, color: MID, italics: true, font: 'Calibri' })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'En representación de la empresa', size: 18, color: MID, italics: true, font: 'Calibri' })] })
                ]
              })
            ]
          })]
        }),
        spacer(), spacer(),

        // Nota legal
        infoBox([
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [
            new TextRun({ text: 'Nota: ', bold: true, size: 18, color: NAVY, font: 'Calibri' }),
            new TextRun({ text: 'Este contrato tiene carácter mercantil. El AGENTE actúa como profesional autónomo independiente, sin relación laboral con Agental.iA.', size: 18, color: MID, italics: true, font: 'Calibri' })
          ]}
          )
        ], 'EFF6FF')
      ]
    }]
  });
  await save(doc, path.join(BASE, 'CONTRATO_AGENTE_COMERCIAL_ALEJANDRO.docx'));
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. PROPUESTAS COMERCIALES
// ═══════════════════════════════════════════════════════════════════════════════
const businesses = [
  {
    folder: '01_Alambique', file: 'PROPUESTA_ALAMBIQUE.docx',
    nombre: 'Alambique', tipo: 'Taberna Tradicional',
    intro: 'Alambique es una taberna con alma, donde la tradición y el buen gusto se fusionan en cada plato. Un espacio que merece una presencia digital a la altura de su cocina.',
    incluye: [
      'Landing page elegante con diseño de taberna clásica y animaciones suaves',
      'Galería de ambiente y platos de temporada',
      'Carta digital de tapas y vinos actualizable desde el panel admin',
      'Sección de reservas por WhatsApp con botón directo',
      'Integración con Google Maps y horarios',
      'Panel de administración para actualizar carta y galería sin conocimientos técnicos'
    ],
    precios: [['Diseño y desarrollo web completo', '997 €'], ['Mantenimiento mensual (admin incluido)', '49 €/mes']],
    cta: 'Con Alambique en internet, tus clientes te encontrarán antes que a la competencia. Una web hecha con el mismo cuidado que tu cocina.'
  },
  {
    folder: '02_Bar_HAKUNA', file: 'PROPUESTA_BAR_HAKUNA.docx',
    nombre: 'Bar HAKUNA', tipo: 'Bar de Ambiente',
    intro: 'Bar HAKUNA es el lugar donde la gente se relaja, disfruta y repite. Una presencia online potente les permitirá llegar a más gente y llenar mesas con mucha menos fricción.',
    incluye: [
      'Landing animada con personalidad y energía propia del bar',
      'Menú digital QR: los clientes escanean y ven la carta al instante',
      'Panel de administración para actualizar carta y precios en tiempo real',
      'Galería de fotos de ambiente y platos',
      'Sección de eventos especiales y noches temáticas',
      'Botón de reservas por WhatsApp integrado'
    ],
    precios: [['Diseño y desarrollo web completo', '797 €'], ['Mantenimiento mensual (admin incluido)', '49 €/mes']],
    cta: 'Con una web que transmite la energía de HAKUNA, los clientes llegan predispuestos a pasarlo bien. Es marketing 24/7 sin esfuerzo.'
  },
  {
    folder: '03_Bar_La_Espuela', file: 'PROPUESTA_BAR_LA_ESPUELA.docx',
    nombre: 'Bar La Espuela', tipo: 'Bar Tradicional',
    intro: 'Bar La Espuela es ese lugar de siempre, de los que tienen parroquianos y buen ambiente. Con una web sencilla y efectiva, nuevos clientes podrán descubrirlo y repetir.',
    incluye: [
      'Landing page limpia y directa con identidad del bar',
      'Carta digital siempre actualizada',
      'Mapa, dirección y horarios claros para que nadie se pierda',
      'Galería de fotos de tapas y ambiente',
      'Botón de contacto por WhatsApp'
    ],
    precios: [['Diseño y desarrollo web', '497 €'], ['Mantenimiento mensual', '39 €/mes']],
    cta: 'Una web bien hecha es el escaparate más barato que existe. La Espuela lo merece.'
  },
  {
    folder: '04_Bar_Ryky', file: 'PROPUESTA_BAR_RYKY.docx',
    nombre: 'Bar Ryky', tipo: 'Bar de Tapas — Castilleja de la Cuesta',
    intro: 'Bar Ryky es el punto de encuentro de Castilleja de la Cuesta. Con una web moderna que refleje su carta y su ambiente, los clientes podrán conocerlo antes de entrar por la puerta.',
    incluye: [
      'Landing moderna con diseño atractivo y fotografías del local',
      'Carta de tapas con categorías (frías, calientes, raciones)',
      'Menú del día actualizable semana a semana',
      'Galería de platos y fotos del local',
      'Reservas por WhatsApp directo desde la web',
      'Panel de administración para gestionar carta y menú del día'
    ],
    precios: [['Diseño y desarrollo web completo', '797 €'], ['Mantenimiento mensual (admin incluido)', '49 €/mes']],
    cta: 'Bar Ryky ya tiene fama en Castilleja. Con una web, esa fama llega a todos los alrededores.'
  },
  {
    folder: '05_Bodega_Mairena', file: 'PROPUESTA_BODEGA_MAIRENA.docx',
    nombre: 'Bodega Mairena', tipo: 'Restaurante Asador — Horno Josper',
    intro: 'Bodega Mairena es un restaurante con identidad propia: la brasa, el Josper, la calidad del producto. Su web debe estar a la altura de la experiencia que ofrecen a sus comensales.',
    incluye: [
      'Landing premium e impactante centrada en la brasa y el producto de calidad',
      'Carta completa de asados, carnes, pescados y vinos',
      'Módulo de reservas online integrado',
      'Galería gastronómica de alta calidad',
      'Sección especial para el horno Josper y técnicas de cocción',
      'Panel de administración CRUD completo para gestionar toda la web'
    ],
    precios: [['Diseño y desarrollo web premium', '997 €'], ['Mantenimiento mensual (admin incluido)', '59 €/mes']],
    cta: 'Un restaurante con horno Josper merece una web que haga salivar antes de llegar. Bodega Mairena tiene el producto; nosotros ponemos la vitrina.'
  },
  {
    folder: '06_Bonnet_Cocktail_Bar', file: 'PROPUESTA_BONNET_COCKTAIL_BAR.docx',
    nombre: 'Bonnet Cocktail Bar', tipo: 'Cocktail Bar Premium',
    intro: 'Bonnet Cocktail Bar es un espacio sofisticado donde la mixología y la noche se encuentran. Su presencia digital debe transmitir esa misma exclusividad y experiencia.',
    incluye: [
      'Web sofisticada con diseño oscuro, elegante y de alta gama',
      'Carta de cocktails con descripción, ingredientes y fotografía',
      'Sección de eventos: música en directo, noches especiales, reservas de grupo',
      'Galería de ambiente nocturno y creaciones de barra',
      'Panel de administración para actualizar carta y eventos sin esfuerzo',
      'Integración de redes sociales (Instagram prioritario)'
    ],
    precios: [['Diseño y desarrollo web premium', '997 €'], ['Mantenimiento mensual (admin incluido)', '59 €/mes']],
    cta: 'Los clientes de cocktail bars eligen el sitio por cómo los hace sentir antes de entrar. La web de Bonnet hace exactamente eso.'
  },
  {
    folder: '07_Chantarela', file: 'PROPUESTA_CHANTARELA.docx',
    nombre: 'Chantarela', tipo: 'Parrilla — Mairena del Aljarafe',
    intro: 'Chantarela es la parrilla de referencia del Aljarafe. Calidad, brasas y producto. Con una web que cuente esa historia, los comensales llegarán con ganas de disfrutar.',
    incluye: [
      'Landing con la imagen de la parrilla y la brasa como protagonistas',
      'Carta de carnes, pescados y guarniciones con fotos',
      'Módulo de reservas online sincronizado en tiempo real',
      'Galería de platos y momentos del local',
      'Panel de administración para actualizar carta y gestionar reservas',
      'Integración con Google Maps y reseñas'
    ],
    precios: [['Diseño y desarrollo web completo', '997 €'], ['Mantenimiento mensual (admin incluido)', '49 €/mes']],
    cta: 'El boca a boca ya funciona para Chantarela. La web multiplica ese efecto y llega a quien todavía no sabe lo que se está perdiendo.'
  },
  {
    folder: '08_Dichoso', file: 'PROPUESTA_DICHOSO.docx',
    nombre: 'Dichoso', tipo: 'Restaurante de Tapas y Arroces',
    intro: 'Dichoso es ese restaurante al que vas una vez y vuelves siempre. Sus tapas, sus arroces y su ambiente merecen que el mundo los conozca. Esto es lo que les proponemos.',
    incluye: [
      'Landing moderna con carta diferenciada por secciones: tapas, arroces, postres',
      'Menú del día online actualizable',
      'Sistema de reservas integrado',
      'Galería gastronómica de alta calidad',
      'Admin CRUD completo: añadir, editar y eliminar platos y fotos desde el móvil',
      'Sincronización en tiempo real entre admin y la web pública'
    ],
    precios: [['Diseño y desarrollo web completo', '997 €'], ['Mantenimiento mensual (admin incluido)', '49 €/mes']],
    cta: 'Dichoso ya tiene los mejores arroces de la zona. Con la web, todos lo sabrán.'
  },
  {
    folder: '09_El_Rinconcito_Pirata', file: 'PROPUESTA_EL_RINCONCITO_PIRATA.docx',
    nombre: 'El Rinconcito Pirata', tipo: 'Bar Temático de Tapas',
    intro: 'El Rinconcito Pirata no es un bar cualquiera. Tiene personalidad, carácter y un punto irreverente que lo hace único. Su web tiene que transmitir exactamente eso.',
    incluye: [
      'Web con personalidad pirata: diseño audaz, divertido y diferente',
      'Carta de tapas con nombres y descripciones temáticas',
      'Galería de ambiente, decoración y platos del bar',
      'Sección de eventos y noches especiales',
      'Admin para actualizar carta y eventos sin complicaciones',
      'Botón de contacto por WhatsApp integrado'
    ],
    precios: [['Diseño y desarrollo web completo', '797 €'], ['Mantenimiento mensual (admin incluido)', '49 €/mes']],
    cta: 'Un bar con esta personalidad no puede tener una web genérica. El Rinconcito Pirata merece una web que haga que la gente quiera ir solo por curiosidad.'
  },
  {
    folder: '10_La_Dama_Canina', file: 'PROPUESTA_LA_DAMA_CANINA.docx',
    nombre: 'La Dama Canina', tipo: 'Peluquería Canina',
    intro: 'La Dama Canina cuida a los perros como si fueran personas. Sus dueños merecen encontrarla fácilmente en internet y reservar cita sin complicaciones.',
    incluye: [
      'Landing con diseño fresco, moderno y orientado al bienestar animal',
      'Sección de servicios detallada: baño, corte, estética, tratamientos',
      'Galería de antes/después con los resultados del trabajo',
      'Tarifas claras por raza y tamaño',
      'Sistema de reservas de cita online',
      'Integración de redes sociales e Instagram'
    ],
    precios: [['Diseño y desarrollo web completo', '797 €'], ['Mantenimiento mensual', '39 €/mes']],
    cta: 'Los dueños de mascotas buscan en Google antes de confiar a alguien a su perro. La Dama Canina debe ser la primera que encuentren.'
  },
  {
    folder: '11_Las_Palmeras', file: 'PROPUESTA_LAS_PALMERAS.docx',
    nombre: 'Las Palmeras', tipo: 'Hostelería Local',
    intro: 'Las Palmeras es un negocio local con su propio carácter y clientela. Una web sencilla, rápida y bien hecha es todo lo que necesitan para ganar presencia digital.',
    incluye: [
      'Landing page limpia y profesional con identidad propia',
      'Sección de servicios y lo que ofrecen',
      'Galería de fotos del local y ambiente',
      'Mapa, dirección y horarios visibles',
      'Botón de contacto por WhatsApp o teléfono'
    ],
    precios: [['Diseño y desarrollo web', '497 €'], ['Mantenimiento mensual', '39 €/mes']],
    cta: 'Estar en internet es obligatorio hoy. Las Palmeras lo hará de forma sencilla, rápida y sin complicaciones técnicas para el negocio.'
  },
  {
    folder: '12_Pandy_Shop', file: 'PROPUESTA_PANDY_SHOP.docx',
    nombre: 'Pandy Shop', tipo: 'Tienda Online y Física',
    intro: 'Pandy Shop necesita una presencia digital que convierta visitas en ventas. Un catálogo bien organizado y un canal directo de compra es la clave.',
    incluye: [
      'Web con catálogo de productos por categorías y filtros',
      'Fichas de producto con fotos, descripción y precio',
      'Canal de compra directo por WhatsApp o formulario',
      'Galería de novedades y destacados',
      'Panel de administración para añadir y gestionar productos sin programar',
      'Integración de redes sociales e Instagram Shopping'
    ],
    precios: [['Diseño y desarrollo web completo', '997 €'], ['Mantenimiento mensual (admin incluido)', '49 €/mes']],
    cta: 'Con un catálogo online bien hecho, Pandy Shop vende mientras duerme. Esto es exactamente lo que le falta ahora mismo.'
  },
  {
    folder: '13_Comandalia', file: 'PROPUESTA_COMANDALIA.docx',
    nombre: 'Comandalia', tipo: 'Sistema SaaS para Restaurantes — Proyecto Premium',
    intro: 'Comandalia no es una web: es un sistema completo de gestión para restaurantes. Una plataforma que digitaliza todo el proceso de pedidos, cocina y administración en tiempo real.',
    incluye: [
      'QR en mesas: los clientes escanean y hacen el pedido desde su móvil',
      'Panel de cocina en tiempo real: los camareros y cocineros ven los pedidos al instante',
      'Backoffice de gestión: historial, facturación, control de mesas',
      'Compatible con múltiples restaurantes o franquicias',
      'Sistema de alertas por Telegram para el responsable',
      'Actualización de carta, precios y disponibilidad desde el admin',
      'Arquitectura robusta: Node.js + WebSockets para tiempo real garantizado'
    ],
    precios: [
      ['Sistema completo Comandalia (instalación)', 'desde 1.997 €'],
      ['Mantenimiento mensual + soporte técnico', '99 €/mes'],
      ['Módulo adicional por restaurante extra', '297 €']
    ],
    cta: 'Comandalia es el salto definitivo de la hostelería al siglo XXI. Un sistema que paga solo con la eficiencia que genera. Ideal para restaurantes con volumen de mesas o cadenas.'
  },
  {
    folder: '14_Sideralbar', file: 'PROPUESTA_SIDERALBAR.docx',
    nombre: 'Sideralbar', tipo: 'Bar de Fusión Internacional',
    intro: 'Sideralbar fusiona sabores del mundo en un solo espacio. Su web debe ser tan atrevida y cosmopolita como su carta, y atraer a la clientela que busca experiencias diferentes.',
    incluye: [
      'Landing impactante con diseño internacional y moderno',
      'Menú de fusión organizado por regiones o categorías',
      'Galería de platos y ambiente del bar',
      'Integración de redes sociales (Instagram y Facebook)',
      'Botón de reserva por WhatsApp y horarios claros',
      'Sección de novedades y platos de temporada'
    ],
    precios: [['Diseño y desarrollo web', '497 €'], ['Mantenimiento mensual', '39 €/mes']],
    cta: 'La gente que busca fusión está acostumbrada a investigar antes de ir. Si Sideralbar no aparece en internet, les deja el sitio libre a la competencia.'
  }
];

async function makeProposal(biz) {
  const doc = new Document({
    numbering: buildNumbering(),
    styles: buildStyles(),
    sections: [{
      properties: { page: { margin: { top: 1440, right: 1260, bottom: 1260, left: 1260 } } },
      headers: { default: buildHeader() },
      footers: { default: buildFooter(biz.nombre) },
      children: [
        spacer(),
        // Hero block
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 160, after: 80 },
          children: [new TextRun({ text: 'PROPUESTA WEB PARA', size: 20, color: MID, font: 'Calibri', bold: true })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: biz.nombre.toUpperCase(), bold: true, size: 52, color: NAVY, font: 'Calibri' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ text: biz.tipo, size: 24, color: BLUE, italics: true, font: 'Calibri' })]
        }),
        divider(), spacer(),

        // Intro
        h1('Sobre el negocio'),
        body(biz.intro),
        spacer(),

        // Que incluye
        h1('¿Qué incluye su web?'),
        ...biz.incluye.map(item => bullet(item)),
        spacer(),

        // Precios
        h1('Inversión'),
        body('Transparencia total. Sin sorpresas ni costes ocultos:'),
        spacer(),
        priceTable(biz.precios),
        spacer(),

        // Beneficios
        h1('¿Por qué Agental.iA?'),
        bullet('Entregamos la web en 7-10 días hábiles, no en meses.'),
        bullet('Diseño personalizado para el negocio, no una plantilla genérica.'),
        bullet('Panel de administración que cualquier persona puede manejar desde el móvil.'),
        bullet('Soporte en español, cercano y rápido.'),
        bullet('Precio fijo sin sorpresas: sabéis lo que pagáis desde el principio.'),
        spacer(),

        // CTA
        h1('El siguiente paso'),
        infoBox([
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [new TextRun({ text: biz.cta, size: 24, color: NAVY, font: 'Calibri', bold: true })]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 0 },
            children: [new TextRun({ text: 'Contacta ahora: info@agental.ia  |  agental.ia', size: 22, color: BLUE, font: 'Calibri' })]
          })
        ], 'EFF6FF'),
        spacer(), spacer(),

        // Firma / validez
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: 'Esta propuesta tiene una validez de 30 días naturales desde la fecha de emisión.', size: 18, color: MID, italics: true, font: 'Calibri' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: 'Fecha de emisión: ' + new Date().toLocaleDateString('es-ES'), size: 18, color: MID, font: 'Calibri' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: 'Presentada por: Alejandro — Agente Comercial Agental.iA', size: 18, color: MID, font: 'Calibri' })]
        }),
        spacer(),

        // Aceptacion
        new Table({
          columnWidths: [4320, 480, 4560],
          margins: { top: 120, bottom: 120, left: 0, right: 0 },
          rows: [new TableRow({
            children: [
              new TableCell({
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                width: { size: 4320, type: WidthType.DXA },
                children: [
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CLIENTE', bold: true, size: 22, color: NAVY, font: 'Calibri' })] }),
                  spacer(),
                  new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 1, color: NAVY } }, spacing: { before: 500, after: 80 }, children: [new TextRun({ text: 'Firma y nombre', size: 18, color: MID, italics: true, font: 'Calibri' })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Fecha: _______________', size: 20, color: DARK, font: 'Calibri' })] })
                ]
              }),
              new TableCell({
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                width: { size: 480, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun('')] })]
              }),
              new TableCell({
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                width: { size: 4560, type: WidthType.DXA },
                children: [
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'AGENTE COMERCIAL', bold: true, size: 22, color: NAVY, font: 'Calibri' })] }),
                  spacer(),
                  new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 1, color: NAVY } }, spacing: { before: 500, after: 80 }, children: [new TextRun({ text: 'Alejandro — Agental.iA', size: 18, color: MID, italics: true, font: 'Calibri' })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Fecha: _______________', size: 20, color: DARK, font: 'Calibri' })] })
                ]
              })
            ]
          })]
        })
      ]
    }]
  });
  await save(doc, path.join(BASE, biz.folder, biz.file));
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. CONTRATO DE SERVICIO WEB — PARA EL CLIENTE
// ═══════════════════════════════════════════════════════════════════════════════
async function makeContratoCliente() {
  const doc = new Document({
    numbering: buildNumbering(),
    styles: buildStyles(),
    sections: [{
      properties: { page: { margin: { top: 1440, right: 1260, bottom: 1260, left: 1260 } } },
      headers: { default: buildHeader() },
      footers: { default: buildFooter('Documento confidencial') },
      children: [
        spacer(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 80 },
          children: [new TextRun({ text: 'CONTRATO DE SERVICIO WEB', bold: true, size: 44, color: NAVY, font: 'Calibri' })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [new TextRun({ text: 'Agental.iA — Diseño, Desarrollo y Mantenimiento Web', size: 24, color: BLUE, font: 'Calibri', italics: true })]
        }),
        divider(), spacer(),

        // PARTES
        h1('1. Partes del Contrato'),
        h2('Prestador del servicio'),
        infoBox([
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'Empresa: ', bold: true, size: 22, color: NAVY, font: 'Calibri' }), new TextRun({ text: 'Agental.iA', size: 22, color: DARK, font: 'Calibri' })] }),
          new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'CIF: ', bold: true, size: 22, color: NAVY, font: 'Calibri' }), new TextRun({ text: '[pendiente de registro]', size: 22, color: MID, italics: true, font: 'Calibri' })] }),
          new Paragraph({ spacing: { after: 0  }, children: [new TextRun({ text: 'Contacto: ', bold: true, size: 22, color: NAVY, font: 'Calibri' }), new TextRun({ text: 'info@agental.ia  |  agental.ia', size: 22, color: DARK, font: 'Calibri' })] })
        ]),
        spacer(),
        h2('Cliente'),
        ...field('Nombre o razón social del negocio', 'Nombre completo del cliente o empresa'),
        ...field('CIF / DNI del titular', 'Número de identificación fiscal'),
        ...field('Dirección fiscal', 'Calle, número, localidad, código postal'),
        ...field('Teléfono de contacto', 'Número de teléfono'),
        ...field('Email', 'correo@negocio.com'),
        ...field('Persona de contacto (si es empresa)', 'Nombre y cargo'),
        spacer(),

        // OBJETO
        h1('2. Objeto del Contrato'),
        body('Agental.iA se compromete a diseñar, desarrollar y entregar un sitio web profesional para el CLIENTE según las especificaciones acordadas y detalladas en el presente contrato.'),
        spacer(),
        ...field('Nombre del proyecto / web', 'Ej.: Web oficial de Bar La Espuela'),
        ...field('Dominio web (si ya existe o se desea)', 'Ej.: www.barlaespuela.com'),
        spacer(),

        // ALCANCE DEL SERVICIO
        h1('3. Alcance del Servicio Contratado'),
        body('El servicio incluye los siguientes elementos (marcar los aplicables):'),
        spacer(),
        new Table({
          columnWidths: [720, 8640],
          margins: { top: 80, bottom: 80, left: 160, right: 160 },
          rows: [
            ['Landing page / página de inicio', true],
            ['Galería de fotos del negocio', true],
            ['Carta / menú digital', false],
            ['Panel de administración (admin) para gestionar contenido', false],
            ['Módulo de reservas por WhatsApp', false],
            ['Formulario de contacto', false],
            ['Integración con Google Maps y horarios', false],
            ['Sección de eventos / noticias', false],
            ['Catálogo de productos', false],
            ['Integración de redes sociales', false],
            ['Menú QR (código QR para carta digital en mesas)', false],
            ['Sistema completo de gestión (SaaS — Comandalia)', false],
            ['Otros:', false]
          ].map(([item, checked]) => new TableRow({
            children: [
              new TableCell({
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                width: { size: 720, type: WidthType.DXA },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: checked ? '\u2610' : '\u2610', size: 22, font: 'Calibri', color: DARK })] })]
              }),
              new TableCell({
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                width: { size: 8640, type: WidthType.DXA },
                children: [new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: String(item), size: 22, color: DARK, font: 'Calibri' })] })]
              })
            ]
          }))
        }),
        spacer(),
        ...field('Descripción adicional del servicio contratado', 'Especificaciones adicionales acordadas con el cliente'),
        spacer(),

        // PRECIO Y FORMA DE PAGO
        h1('4. Precio y Forma de Pago'),
        spacer(),
        priceTable([
          ['Precio del desarrollo web (pago único)', '___________  €'],
          ['Cuota de mantenimiento mensual (opcional)', '___________  €/mes'],
          ['Total primer pago (incluye desarrollo + 1 mes)', '___________  €']
        ]),
        spacer(),
        h2('Condiciones de pago'),
        bullet('50% al firmar este contrato (inicio del proyecto).'),
        bullet('50% restante en la entrega y publicación de la web.'),
        bullet('La cuota de mantenimiento se abona mensualmente a partir del mes siguiente a la entrega.'),
        spacer(),
        ...field('Forma de pago acordada', 'Ej.: Transferencia bancaria / Bizum / Tarjeta'),
        spacer(),
        infoBox([
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [
            new TextRun({ text: 'IBAN Agental.iA: ', bold: true, size: 22, color: NAVY, font: 'Calibri' }),
            new TextRun({ text: '[pendiente — se facilitará al cliente antes del primer pago]', size: 22, color: MID, italics: true, font: 'Calibri' })
          ]})
        ], 'EFF6FF'),
        spacer(),

        // PLAZOS DE ENTREGA
        h1('5. Plazos de Entrega'),
        bullet('Fecha de inicio del proyecto: a partir de la recepción del primer pago.'),
        bullet('Plazo de entrega estimado: 7 a 10 días hábiles desde el inicio.'),
        bullet('El CLIENTE se compromete a facilitar el material necesario (fotos, textos, logo) en un plazo máximo de 3 días desde el inicio. Retrasos en la entrega de material pueden ampliar el plazo de entrega.'),
        spacer(),
        ...field('Fecha acordada de inicio', 'DD/MM/AAAA'),
        ...field('Fecha estimada de entrega', 'DD/MM/AAAA'),
        spacer(),

        // REVISIONES
        h1('6. Revisiones y Cambios'),
        bullet('El precio incluye hasta 2 rondas de revisiones sobre el diseño y contenido entregado.'),
        bullet('Cambios adicionales fuera del alcance acordado se presupuestarán aparte.'),
        bullet('Una vez el CLIENTE apruebe la web y se publique, se considera el proyecto entregado y aceptado.'),
        spacer(),

        // PROPIEDAD Y DERECHOS
        h1('7. Propiedad y Derechos'),
        bullet('El dominio web (si lo gestiona Agental.iA) es propiedad del CLIENTE desde el momento del pago completo.'),
        bullet('El código y diseño desarrollados son propiedad de Agental.iA hasta el pago íntegro del servicio, momento en que se ceden al CLIENTE.'),
        bullet('El CLIENTE es responsable de que las fotografías, textos y marcas que facilite no infrinjan derechos de terceros.'),
        spacer(),

        // MANTENIMIENTO
        h1('8. Servicio de Mantenimiento (si contratado)'),
        body('El servicio de mantenimiento mensual incluye:'),
        bullet('Actualizaciones técnicas de seguridad y rendimiento.'),
        bullet('Soporte para modificaciones de contenido (carta, horarios, fotos, precios).'),
        bullet('Disponibilidad del panel de administración operativo.'),
        bullet('Atención por WhatsApp/email en horario laboral (lunes a viernes, 9h-18h).'),
        spacer(),
        body('El mantenimiento puede cancelarse con 30 días de preaviso por escrito. Agental.iA también podrá cancelarlo si la cuota lleva más de 60 días impagada.'),
        spacer(),

        // CONFIDENCIALIDAD
        h1('9. Confidencialidad'),
        body('Ambas partes se comprometen a mantener la confidencialidad sobre los datos, precios y acuerdos contenidos en este contrato. Agental.iA no cederá datos del CLIENTE a terceros.'),
        spacer(),

        // RESPONSABILIDADES
        h1('10. Limitación de Responsabilidad'),
        bullet('Agental.iA no se responsabiliza del contenido publicado por el CLIENTE en su web.'),
        bullet('Agental.iA no garantiza posicionamiento en buscadores (SEO orgánico), aunque la web se construirá con buenas prácticas técnicas.'),
        bullet('En caso de fuerza mayor (caídas de hosting externo, etc.), Agental.iA actuará con la mayor diligencia posible para restablecer el servicio.'),
        spacer(),

        // RESOLUCIÓN
        h1('11. Resolución de Conflictos'),
        body('Ante cualquier discrepancia, ambas partes se comprometen a buscar primero una solución amistosa. En caso de no llegar a acuerdo, se someterán a los Juzgados y Tribunales del domicilio del CLIENTE, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.'),
        spacer(),

        // ACEPTACIÓN
        h1('12. Aceptación del Contrato'),
        body('Las partes, de mutuo acuerdo y en plena capacidad jurídica, aceptan y firman el presente contrato:'),
        spacer(),
        ...field('Firmado en la ciudad de', 'Ciudad'),
        ...field('Fecha de firma', 'DD / MM / AAAA'),
        spacer(), spacer(),

        // Bloque de firma
        new Table({
          columnWidths: [4320, 480, 4560],
          margins: { top: 120, bottom: 120, left: 0, right: 0 },
          rows: [new TableRow({
            children: [
              new TableCell({
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                width: { size: 4320, type: WidthType.DXA },
                children: [
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'EL CLIENTE', bold: true, size: 22, color: NAVY, font: 'Calibri' })] }),
                  spacer(),
                  new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 1, color: NAVY } }, spacing: { before: 600, after: 80 }, children: [new TextRun({ text: 'Firma y nombre', size: 18, color: MID, italics: true, font: 'Calibri' })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CIF/DNI: _______________', size: 20, color: DARK, font: 'Calibri' })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Fecha: _______________', size: 20, color: DARK, font: 'Calibri' })] })
                ]
              }),
              new TableCell({
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                width: { size: 480, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun('')]})],
              }),
              new TableCell({
                borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                width: { size: 4560, type: WidthType.DXA },
                children: [
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'AGENTAL.IA', bold: true, size: 22, color: NAVY, font: 'Calibri' })] }),
                  spacer(),
                  new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 1, color: NAVY } }, spacing: { before: 600, after: 80 }, children: [new TextRun({ text: 'Firma del agente comercial', size: 18, color: MID, italics: true, font: 'Calibri' })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Alejandro — Agente Comercial', size: 20, color: DARK, font: 'Calibri' })] }),
                  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Fecha: _______________', size: 20, color: DARK, font: 'Calibri' })] })
                ]
              })
            ]
          })]
        }),
        spacer(),
        infoBox([
          new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [
            new TextRun({ text: 'Al firmar este documento, el CLIENTE acepta expresamente todas las condiciones descritas. ', size: 18, color: MID, italics: true, font: 'Calibri' }),
            new TextRun({ text: 'Se recomienda guardar una copia firmada por ambas partes.', size: 18, color: MID, italics: true, font: 'Calibri' })
          ]})
        ], 'EFF6FF')
      ]
    }]
  });
  await save(doc, path.join(BASE, 'CONTRATO_SERVICIO_WEB_CLIENTE.docx'));
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log('\n⚡ Generando documentos Agental.iA para Alejandro...\n');
  await makeContrato();
  await makeContratoCliente();
  for (const biz of businesses) {
    await makeProposal(biz);
  }
  console.log('\n✅ Todos los documentos generados correctamente.\n');
})();
