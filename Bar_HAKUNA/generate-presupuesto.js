const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, Header, Footer,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, PageNumber, PageBreak, ExternalHyperlink, TabStopType, TabStopPosition } = require('docx');

const GOLD = "D4A847";
const DARK = "1A1A1A";
const GRAY = "4A4A4A";
const LIGHT_GRAY = "888888";
const WHITE = "FFFFFF";
const GOLD_BG = "FDF8ED";
const GRAY_BG = "F5F5F5";

const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" };
const thinBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const goldBottomBorder = { top: noBorder, left: noBorder, right: noBorder, bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD } };

function emptyLine(size = 200) {
  return new Paragraph({ spacing: { before: size, after: 0 }, children: [] });
}

function sectionTitle(num, text) {
  return new Paragraph({
    spacing: { before: 360, after: 200 },
    children: [
      new TextRun({ text: `${num}. `, color: GOLD, size: 28, bold: true, font: "Georgia" }),
      new TextRun({ text: text.toUpperCase(), color: DARK, size: 28, bold: true, font: "Georgia" }),
    ]
  });
}

function subSectionTitle(num, text) {
  return new Paragraph({
    spacing: { before: 280, after: 160 },
    children: [
      new TextRun({ text: `${num} `, color: GOLD, size: 24, bold: true, font: "Georgia" }),
      new TextRun({ text, color: DARK, size: 24, bold: true, font: "Georgia" }),
    ]
  });
}

function bodyText(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, color: GRAY, size: 21, font: "Arial" })],
  });
}

function bulletItem(text, ref = "bullet-list") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, color: GRAY, size: 21, font: "Arial" })],
  });
}

function goldDivider() {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: GOLD, space: 1 } },
    children: [],
  });
}

// --- Pricing table helper ---
function pricingRow(concept, price, isBold = false, isHeader = false, isGold = false) {
  const bg = isHeader ? GOLD : isGold ? GOLD_BG : WHITE;
  const textColor = isHeader ? WHITE : isBold ? DARK : GRAY;
  const sz = isHeader ? 22 : 21;
  return new TableRow({
    children: [
      new TableCell({
        borders: thinBorders,
        width: { size: 6800, type: WidthType.DXA },
        shading: { fill: bg, type: ShadingType.CLEAR },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text: concept, bold: isBold || isHeader, color: textColor, size: sz, font: "Arial" })]
        })]
      }),
      new TableCell({
        borders: thinBorders,
        width: { size: 2560, type: WidthType.DXA },
        shading: { fill: bg, type: ShadingType.CLEAR },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          spacing: { before: 80, after: 80 },
          children: [new TextRun({ text: price, bold: isBold || isHeader, color: textColor, size: sz, font: "Arial" })]
        })]
      }),
    ]
  });
}

// ============ BUILD DOCUMENT ============
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22, color: GRAY } } },
  },
  numbering: {
    config: [
      { reference: "bullet-list", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-list-2", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-list-3", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-list-4", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-list-5", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullet-list-6", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [
    // ===================== PORTADA =====================
    {
      properties: {
        page: {
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        }
      },
      children: [
        emptyLine(2000),
        // Developer brand
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
          children: [
            new TextRun({ text: "JOSE ", color: DARK, size: 24, bold: true, font: "Arial", characterSpacing: 200 }),
            new TextRun({ text: "DEVELOPER", color: GOLD, size: 24, bold: true, font: "Arial", characterSpacing: 200 }),
          ]
        }),
        // Gold line
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 1 } },
          children: [],
        }),
        // Title
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "PROPUESTA DE DESARROLLO WEB", color: DARK, size: 40, bold: true, font: "Georgia" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "HAKUNA BAR", color: GOLD, size: 56, bold: true, font: "Georgia" })],
        }),
        // Gold line
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 600 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 1 } },
          children: [],
        }),
        // Subtitle
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [new TextRun({ text: "Presupuesto y Condiciones del Proyecto", color: LIGHT_GRAY, size: 24, italics: true, font: "Georgia" })],
        }),
        emptyLine(600),
        // Info block
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "Cliente: ", color: LIGHT_GRAY, size: 20, font: "Arial" }),
            new TextRun({ text: "Hakuna Bar", color: DARK, size: 20, bold: true, font: "Arial" }),
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "Ubicación: ", color: LIGHT_GRAY, size: 20, font: "Arial" }),
            new TextRun({ text: "Mairena del Aljarafe, Sevilla", color: DARK, size: 20, font: "Arial" }),
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "Fecha: ", color: LIGHT_GRAY, size: 20, font: "Arial" }),
            new TextRun({ text: "Marzo 2026", color: DARK, size: 20, font: "Arial" }),
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "Referencia: ", color: LIGHT_GRAY, size: 20, font: "Arial" }),
            new TextRun({ text: "PRE-2026-HAKUNA-001", color: DARK, size: 20, font: "Arial" }),
          ]
        }),
      ]
    },
    // ===================== CONTENIDO =====================
    {
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({ text: "Presupuesto Hakuna Bar", color: LIGHT_GRAY, size: 16, font: "Arial", italics: true }),
              new TextRun({ text: "  |  ", color: "DDDDDD", size: 16, font: "Arial" }),
              new TextRun({ text: "PRE-2026-HAKUNA-001", color: GOLD, size: 16, font: "Arial" }),
            ]
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD", space: 4 } },
            spacing: { before: 100 },
            children: [
              new TextRun({ text: "Jose Developer", color: GOLD, size: 16, bold: true, font: "Arial" }),
              new TextRun({ text: "  |  Página ", color: LIGHT_GRAY, size: 16, font: "Arial" }),
              new TextRun({ children: [PageNumber.CURRENT], color: LIGHT_GRAY, size: 16, font: "Arial" }),
              new TextRun({ text: " de ", color: LIGHT_GRAY, size: 16, font: "Arial" }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], color: LIGHT_GRAY, size: 16, font: "Arial" }),
            ]
          })]
        })
      },
      children: [
        // ===== 1. INTRODUCCIÓN =====
        sectionTitle("1", "Introducción"),
        goldDivider(),
        bodyText("Estimado cliente,"),
        bodyText("Nos complace presentarle la propuesta de desarrollo web para Hakuna Bar. Se ha diseñado y desarrollado una solución web completa y a medida, compuesta por dos plataformas independientes:"),
        bulletItem("Una web pública (landing page) orientada al cliente final, diseñada para captar la esencia y el carácter de su establecimiento.", "bullet-list"),
        bulletItem("Un panel de administración privado que permite la gestión integral del negocio de forma autónoma, sin necesidad de conocimientos técnicos.", "bullet-list"),
        bodyText("Ambas plataformas han sido desarrolladas con tecnologías de última generación, garantizando un rendimiento óptimo, una experiencia de usuario excepcional y la máxima facilidad de uso para la gestión diaria del negocio."),

        // ===== 2. ALCANCE =====
        sectionTitle("2", "Alcance del Proyecto"),
        goldDivider(),

        // 2.1 Landing
        subSectionTitle("2.1", "Landing Page Pública"),
        bodyText("Plataforma web accesible desde cualquier dispositivo, diseñada para transmitir la identidad de Hakuna Bar y facilitar que los clientes conozcan su oferta gastronómica. Características incluidas:"),
        new Paragraph({
          spacing: { before: 100, after: 60 },
          children: [new TextRun({ text: "Diseño y experiencia visual", color: DARK, size: 21, bold: true, font: "Arial" })]
        }),
        bulletItem("Diseño premium responsive adaptado a móvil, tablet y escritorio", "bullet-list-2"),
        bulletItem("Animaciones de scroll profesionales con tecnología Framer Motion", "bullet-list-2"),
        bulletItem("Carrusel de imágenes a pantalla completa con transiciones suaves", "bullet-list-2"),
        bulletItem("Galería de fotos interactiva con efectos hover", "bullet-list-2"),
        new Paragraph({
          spacing: { before: 160, after: 60 },
          children: [new TextRun({ text: "Carta digital", color: DARK, size: 21, bold: true, font: "Arial" })]
        }),
        bulletItem("Carta completa con más de 40 platos organizados en 9 categorías", "bullet-list-3"),
        bulletItem("Filtros interactivos por categoría", "bullet-list-3"),
        bulletItem("Ficha detallada de cada plato: fotografía, precio, descripción, valoración con estrellas y badges", "bullet-list-3"),
        bulletItem("Indicador visual de alérgenos conforme al Reglamento UE 1169/2011", "bullet-list-3"),
        bulletItem("Indicador de platos agotados en tiempo real", "bullet-list-3"),
        bulletItem("Sección de recomendaciones del chef en carrusel horizontal", "bullet-list-3"),
        new Paragraph({
          spacing: { before: 160, after: 60 },
          children: [new TextRun({ text: "Información y contacto", color: DARK, size: 21, bold: true, font: "Arial" })]
        }),
        bulletItem("Sección \"Sobre Nosotros\" con horarios y valoración de Google", "bullet-list-4"),
        bulletItem("Reseñas reales de clientes con diseño estilo Google Reviews", "bullet-list-4"),
        bulletItem("Sección de contacto con mapa Google Maps integrado", "bullet-list-4"),
        bulletItem("Enlaces directos a Instagram y Facebook del establecimiento", "bullet-list-4"),
        bulletItem("Optimización SEO básica para posicionamiento en buscadores", "bullet-list-4"),
        bulletItem("Certificado SSL incluido (conexión segura HTTPS)", "bullet-list-4"),

        // 2.2 Admin
        new Paragraph({ children: [new PageBreak()] }),
        subSectionTitle("2.2", "Panel de Administración"),
        bodyText("Plataforma privada de gestión que permite al propietario administrar todos los aspectos de su presencia web de forma autónoma. Funcionalidades incluidas:"),
        new Paragraph({
          spacing: { before: 100, after: 60 },
          children: [new TextRun({ text: "Gestión de la carta", color: DARK, size: 21, bold: true, font: "Arial" })]
        }),
        bulletItem("Dashboard con estadísticas en tiempo real: total de platos, categorías activas, precio medio y platos agotados", "bullet-list-5"),
        bulletItem("CRUD completo de platos: crear, editar, eliminar con vista de tabla y cuadrícula", "bullet-list-5"),
        bulletItem("Gestión de categorías: crear, editar, reordenar y eliminar", "bullet-list-5"),
        bulletItem("Sistema de alérgenos integrado con los 14 alérgenos del reglamento europeo", "bullet-list-5"),
        bulletItem("Toggle de \"Plato agotado\" instantáneo desde el dashboard", "bullet-list-5"),
        bulletItem("Subida de imágenes directa desde el dispositivo móvil", "bullet-list-5"),
        new Paragraph({
          spacing: { before: 160, after: 60 },
          children: [new TextRun({ text: "Gestión del negocio", color: DARK, size: 21, bold: true, font: "Arial" })]
        }),
        bulletItem("Menú del Día configurable: primeros, segundos, postres, precio, extras (bebida/pan) y notas", "bullet-list-6"),
        bulletItem("Datos del negocio editables: horarios, teléfono, email, WhatsApp, redes sociales y dirección", "bullet-list-6"),
        bulletItem("Gestión de galería fotográfica: subir, reordenar, activar/desactivar imágenes", "bullet-list-6"),
        bulletItem("Gestión de reseñas: aprobar, ocultar, destacar y crear reseñas manualmente", "bullet-list-6"),
        bulletItem("Generador de códigos QR para mesas: carta completa, menú del día y contacto", "bullet-list-6"),
        bulletItem("Interfaz intuitiva diseñada para uso sin conocimientos técnicos", "bullet-list-6"),
        bulletItem("Acceso protegido por contraseña", "bullet-list-6"),

        // ===== 3. TECNOLOGÍAS =====
        sectionTitle("3", "Tecnologías Utilizadas"),
        goldDivider(),
        bodyText("El proyecto ha sido desarrollado con un stack tecnológico de última generación que garantiza rendimiento, escalabilidad y mantenibilidad:"),
        new Table({
          columnWidths: [3000, 6360],
          rows: [
            new TableRow({
              children: [
                new TableCell({ borders: noBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "Next.js 14 (React)", bold: true, color: DARK, size: 21, font: "Arial" })] })] }),
                new TableCell({ borders: noBorders, width: { size: 6360, type: WidthType.DXA }, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "Framework de desarrollo web de última generación por Vercel", color: GRAY, size: 21, font: "Arial" })] })] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: noBorders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: GRAY_BG, type: ShadingType.CLEAR }, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "TypeScript", bold: true, color: DARK, size: 21, font: "Arial" })] })] }),
                new TableCell({ borders: noBorders, width: { size: 6360, type: WidthType.DXA }, shading: { fill: GRAY_BG, type: ShadingType.CLEAR }, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "Código tipado para mayor robustez y mantenibilidad", color: GRAY, size: 21, font: "Arial" })] })] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: noBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "Tailwind CSS", bold: true, color: DARK, size: 21, font: "Arial" })] })] }),
                new TableCell({ borders: noBorders, width: { size: 6360, type: WidthType.DXA }, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "Sistema de diseño responsive de alto rendimiento", color: GRAY, size: 21, font: "Arial" })] })] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: noBorders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: GRAY_BG, type: ShadingType.CLEAR }, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "Framer Motion", bold: true, color: DARK, size: 21, font: "Arial" })] })] }),
                new TableCell({ borders: noBorders, width: { size: 6360, type: WidthType.DXA }, shading: { fill: GRAY_BG, type: ShadingType.CLEAR }, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "Animaciones profesionales y transiciones fluidas", color: GRAY, size: 21, font: "Arial" })] })] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: noBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "Vercel", bold: true, color: DARK, size: 21, font: "Arial" })] })] }),
                new TableCell({ borders: noBorders, width: { size: 6360, type: WidthType.DXA }, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "Hosting de alto rendimiento con CDN global y SSL incluido", color: GRAY, size: 21, font: "Arial" })] })] }),
              ]
            }),
          ]
        }),

        // ===== 4. DESGLOSE ECONÓMICO =====
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("4", "Desglose Económico"),
        goldDivider(),

        // Highlight box
        new Paragraph({
          spacing: { before: 200, after: 200 },
          shading: { fill: GOLD_BG, type: ShadingType.CLEAR },
          border: { left: { style: BorderStyle.SINGLE, size: 12, color: GOLD, space: 8 } },
          indent: { left: 200 },
          children: [
            new TextRun({ text: "  Inversión total del proyecto: ", color: GRAY, size: 22, font: "Arial" }),
            new TextRun({ text: "250,00 €", color: DARK, size: 28, bold: true, font: "Georgia" }),
            new TextRun({ text: "  (pago único)", color: LIGHT_GRAY, size: 20, font: "Arial" }),
          ]
        }),

        subSectionTitle("4.1", "Desarrollo del Proyecto (pago único)"),
        new Table({
          columnWidths: [6800, 2560],
          rows: [
            pricingRow("Concepto", "Precio", true, true),
            pricingRow("Desarrollo de Landing Page Pública", "150,00 €"),
            pricingRow("Desarrollo de Panel de Administración", "100,00 €"),
            pricingRow("TOTAL DESARROLLO", "250,00 €", true, false, true),
          ]
        }),
        new Paragraph({
          spacing: { before: 80, after: 200 },
          children: [new TextRun({ text: "* IVA no incluido. Precios en euros.", color: LIGHT_GRAY, size: 18, italics: true, font: "Arial" })],
        }),

        subSectionTitle("4.2", "Servicio de Mantenimiento Anual (opcional)"),
        bodyText("Si desea despreocuparse de la gestión técnica, ofrecemos un servicio de mantenimiento integral que incluye:"),
        new Table({
          columnWidths: [6800, 2560],
          rows: [
            pricingRow("Servicio", "Incluido", true, true),
            pricingRow("Gestión y renovación de dominios personalizados", "Incluido"),
            pricingRow("Mantenimiento técnico y corrección de errores", "Incluido"),
            pricingRow("Actualizaciones de seguridad y dependencias", "Incluido"),
            pricingRow("Soporte técnico por email y WhatsApp", "Incluido"),
            pricingRow("Hosting y certificado SSL", "Incluido"),
            pricingRow("TOTAL MANTENIMIENTO ANUAL", "70,00 €/año", true, false, true),
          ]
        }),
        new Paragraph({
          spacing: { before: 80, after: 200 },
          children: [new TextRun({ text: "* Facturación anual anticipada. IVA no incluido.", color: LIGHT_GRAY, size: 18, italics: true, font: "Arial" })],
        }),

        subSectionTitle("4.3", "Sin Servicio de Mantenimiento"),
        bodyText("Si el cliente decide no contratar el servicio de mantenimiento anual, se aplicarán las siguientes condiciones:"),
        new Paragraph({
          spacing: { before: 100, after: 100 },
          shading: { fill: "FFF5F5", type: ShadingType.CLEAR },
          border: { left: { style: BorderStyle.SINGLE, size: 12, color: "CC4444", space: 8 } },
          indent: { left: 200 },
          children: [
            new TextRun({ text: "  Importante: ", color: "CC4444", size: 21, bold: true, font: "Arial" }),
            new TextRun({ text: "Sin mantenimiento contratado, el cliente asume la responsabilidad total de la gestión técnica.", color: GRAY, size: 21, font: "Arial" }),
          ]
        }),
        bulletItem("El cliente será responsable de la gestión y renovación de sus propios dominios"),
        bulletItem("El cliente será responsable de la administración de los servicios de hosting"),
        bulletItem("Las correcciones de errores o cambios técnicos no estarán incluidos"),
        bulletItem("La asistencia técnica puntual se facturará por separado a una tarifa de 30,00 €/hora"),

        // ===== 5. CONDICIONES DE ENTREGA =====
        sectionTitle("5", "Condiciones de Entrega"),
        goldDivider(),
        bulletItem("El proyecto se entrega completamente funcional y desplegado en producción"),
        bulletItem("Se proporcionan las URLs de acceso a ambas plataformas"),
        bulletItem("Se incluye una sesión de formación presencial u online sobre el uso del panel de administración"),
        bulletItem("Se entrega documentación básica de uso del panel de administración"),
        bulletItem("El código fuente queda en propiedad del desarrollador, salvo acuerdo específico por escrito"),

        // ===== 6. FORMA DE PAGO =====
        sectionTitle("6", "Forma de Pago"),
        goldDivider(),
        new Table({
          columnWidths: [5000, 2200, 2160],
          rows: [
            new TableRow({
              children: [
                new TableCell({ borders: thinBorders, width: { size: 5000, type: WidthType.DXA }, shading: { fill: GOLD, type: ShadingType.CLEAR }, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "Concepto", bold: true, color: WHITE, size: 21, font: "Arial" })] })] }),
                new TableCell({ borders: thinBorders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: GOLD, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "Momento", bold: true, color: WHITE, size: 21, font: "Arial" })] })] }),
                new TableCell({ borders: thinBorders, width: { size: 2160, type: WidthType.DXA }, shading: { fill: GOLD, type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "Importe", bold: true, color: WHITE, size: 21, font: "Arial" })] })] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: thinBorders, width: { size: 5000, type: WidthType.DXA }, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "Primer pago (50%)", color: GRAY, size: 21, font: "Arial" })] })] }),
                new TableCell({ borders: thinBorders, width: { size: 2200, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "Al inicio", color: GRAY, size: 21, font: "Arial" })] })] }),
                new TableCell({ borders: thinBorders, width: { size: 2160, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "125,00 €", color: DARK, bold: true, size: 21, font: "Arial" })] })] }),
              ]
            }),
            new TableRow({
              children: [
                new TableCell({ borders: thinBorders, width: { size: 5000, type: WidthType.DXA }, children: [new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "Segundo pago (50%)", color: GRAY, size: 21, font: "Arial" })] })] }),
                new TableCell({ borders: thinBorders, width: { size: 2200, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "A la entrega", color: GRAY, size: 21, font: "Arial" })] })] }),
                new TableCell({ borders: thinBorders, width: { size: 2160, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 80, after: 80 }, children: [new TextRun({ text: "125,00 €", color: DARK, bold: true, size: 21, font: "Arial" })] })] }),
              ]
            }),
          ]
        }),
        bodyText(""),
        bodyText("El servicio de mantenimiento anual, en caso de contratarse, se factura por adelantado cada 12 meses a partir de la fecha de entrega del proyecto."),

        // ===== 7. GARANTÍA =====
        sectionTitle("7", "Garantía"),
        goldDivider(),
        bulletItem("Se ofrecen 30 días de garantía para la corrección de bugs o errores técnicos desde la fecha de entrega"),
        bulletItem("La garantía no cubre cambios de diseño, nuevas funcionalidades ni modificaciones del alcance original"),
        bulletItem("Las nuevas funcionalidades o ampliaciones se presupuestarán por separado bajo solicitud"),
        bulletItem("La garantía se aplica únicamente sobre las funcionalidades descritas en la sección 2 de este documento"),

        // ===== 8. URLs =====
        sectionTitle("8", "URLs del Proyecto"),
        goldDivider(),
        bodyText("Las plataformas del proyecto están desplegadas y accesibles en las siguientes direcciones:"),
        new Paragraph({
          spacing: { before: 120, after: 60 },
          children: [
            new TextRun({ text: "Web pública:  ", color: DARK, size: 21, bold: true, font: "Arial" }),
            new ExternalHyperlink({
              children: [new TextRun({ text: "https://hakuna-bar.vercel.app", color: GOLD, size: 21, font: "Arial", underline: { type: "single" } })],
              link: "https://hakuna-bar.vercel.app"
            }),
          ]
        }),
        new Paragraph({
          spacing: { before: 60, after: 200 },
          children: [
            new TextRun({ text: "Panel admin:  ", color: DARK, size: 21, bold: true, font: "Arial" }),
            new ExternalHyperlink({
              children: [new TextRun({ text: "https://hakuna-admin.vercel.app", color: GOLD, size: 21, font: "Arial", underline: { type: "single" } })],
              link: "https://hakuna-admin.vercel.app"
            }),
          ]
        }),

        // ===== 9. ACEPTACIÓN =====
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("9", "Aceptación del Presupuesto"),
        goldDivider(),
        bodyText("La firma del presente documento implica la aceptación de todas las condiciones, precios y plazos descritos en esta propuesta."),
        emptyLine(600),

        // Signature blocks
        new Table({
          columnWidths: [4500, 360, 4500],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: noBorders,
                  width: { size: 4500, type: WidthType.DXA },
                  children: [
                    new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Por el desarrollador:", color: LIGHT_GRAY, size: 18, font: "Arial" })] }),
                    emptyLine(800),
                    new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: DARK, space: 1 } }, children: [] }),
                    new Paragraph({ spacing: { before: 60, after: 40 }, children: [new TextRun({ text: "Firma", color: LIGHT_GRAY, size: 18, font: "Arial" })] }),
                    emptyLine(200),
                    new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Nombre: ________________________________", color: GRAY, size: 20, font: "Arial" })] }),
                    new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "DNI/NIF: ________________________________", color: GRAY, size: 20, font: "Arial" })] }),
                    new Paragraph({ children: [new TextRun({ text: "Fecha: ____ / ____ / ________", color: GRAY, size: 20, font: "Arial" })] }),
                  ]
                }),
                new TableCell({ borders: noBorders, width: { size: 360, type: WidthType.DXA }, children: [new Paragraph({ children: [] })] }),
                new TableCell({
                  borders: noBorders,
                  width: { size: 4500, type: WidthType.DXA },
                  children: [
                    new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Por el cliente (Hakuna Bar):", color: LIGHT_GRAY, size: 18, font: "Arial" })] }),
                    emptyLine(800),
                    new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: DARK, space: 1 } }, children: [] }),
                    new Paragraph({ spacing: { before: 60, after: 40 }, children: [new TextRun({ text: "Firma", color: LIGHT_GRAY, size: 18, font: "Arial" })] }),
                    emptyLine(200),
                    new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "Nombre: ________________________________", color: GRAY, size: 20, font: "Arial" })] }),
                    new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: "DNI/NIF: ________________________________", color: GRAY, size: 20, font: "Arial" })] }),
                    new Paragraph({ children: [new TextRun({ text: "Fecha: ____ / ____ / ________", color: GRAY, size: 20, font: "Arial" })] }),
                  ]
                }),
              ]
            })
          ]
        }),

        emptyLine(600),
        // Final note
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
          children: [new TextRun({ text: "Este presupuesto tiene una validez de 30 días desde la fecha de emisión.", color: LIGHT_GRAY, size: 18, italics: true, font: "Arial" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100 },
          children: [
            new TextRun({ text: "Jose Developer", color: GOLD, size: 18, bold: true, font: "Arial" }),
            new TextRun({ text: "  —  Desarrollo Web Profesional", color: LIGHT_GRAY, size: 18, font: "Arial" }),
          ]
        }),
      ]
    }
  ]
});

const outPath = "C:\\Users\\jose2\\OneDrive\\Escritorio\\Bar_HAKUNA\\Presupuesto_HakunaBar_2026.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("Documento generado: " + outPath);
});
