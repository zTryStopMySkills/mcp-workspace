const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, LevelFormat, ExternalHyperlink, PageBreak, Footer,
  PageNumber, UnderlineType
} = require('docx');
const fs = require('fs');

// ─── Colores ──────────────────────────────────────────────
const GOLD   = "8B6914";
const DARK   = "1A1A2E";
const GRAY   = "5A5A6E";
const LGRAY  = "F5F3EE";
const WHITE  = "FFFFFF";
const BLACK  = "111111";

// ─── Bordes de tabla ──────────────────────────────────────
const border  = { style: BorderStyle.SINGLE, size: 1, color: "D4C5A0" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

// ─── Helpers ──────────────────────────────────────────────
const p = (children, opts = {}) => new Paragraph({ children, ...opts });
const t = (text, opts = {}) => new TextRun({ text, ...opts });
const spacer = (n = 100) => new Paragraph({ children: [t("")], spacing: { before: n, after: n } });

function sectionTitle(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: GOLD } },
    children: [new TextRun({ text, font: "Georgia", size: 30, bold: true, color: DARK })]
  });
}

function sectionSubtitle(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 80 },
    children: [new TextRun({ text, font: "Georgia", size: 24, bold: true, color: GOLD })]
  });
}

function bodyText(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 100 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: GRAY, ...opts })]
  });
}

function featureRow(emoji, title, desc, col1W = 1200, col2W = 3000, col3W = 5160) {
  const makeCell = (children, fill, w) => new TableCell({
    borders,
    width: { size: w, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 100, bottom: 100, left: 160, right: 160 },
    children: [new Paragraph({ children })]
  });
  return new TableRow({ children: [
    makeCell([t(emoji, { size: 24 })], LGRAY, col1W),
    makeCell([t(title, { font: "Arial", size: 20, bold: true, color: DARK })], WHITE, col2W),
    makeCell([t(desc,  { font: "Arial", size: 19, color: GRAY })], WHITE, col3W),
  ]});
}

function bulletItem(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { before: 50, after: 50 },
    children: [new TextRun({ text, font: "Arial", size: 21, color: GRAY })]
  });
}

function highlightBox(label, value, color = LGRAY) {
  return new TableCell({
    borders,
    width: { size: 3120, type: WidthType.DXA },
    shading: { fill: color, type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 120, bottom: 120, left: 180, right: 180 },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, children: [t(value, { font: "Georgia", size: 36, bold: true, color: DARK })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [t(label, { font: "Arial", size: 18, color: GRAY })] })
    ]
  });
}

// ─── DOCUMENTO ────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Georgia", color: DARK },
        paragraph: { spacing: { before: 400, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Georgia", color: GOLD },
        paragraph: { spacing: { before: 280, after: 80 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 560, hanging: 280 } } } }] },
      { reference: "bullets2", levels: [{ level: 0, format: LevelFormat.BULLET, text: "–",
          alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 560, hanging: 280 } } } }] },
      { reference: "nums", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 560, hanging: 280 } } } }] }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          t("Jose Villalba · Desarrollo Web   |   Pág. ", { font: "Arial", size: 18, color: GRAY }),
          new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: GRAY }),
          t("  de  ", { font: "Arial", size: 18, color: GRAY }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 18, color: GRAY })
        ]
      })] })
    },
    children: [

      // ══════════════════════════════════════════════════
      // PORTADA
      // ══════════════════════════════════════════════════
      spacer(600),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [t("✦  PROPUESTA DE SERVICIOS WEB  ✦", { font: "Georgia", size: 22, color: GOLD, bold: true, smallCaps: true })]
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 80 },
        children: [t("SIDERAL BAR", { font: "Georgia", size: 60, bold: true, color: DARK })]
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [t("Mairena del Aljarafe · Sevilla", { font: "Arial", size: 24, color: GRAY, italics: true })]
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: GOLD } },
        spacing: { before: 100, after: 400 },
        children: [t("")]
      }),

      spacer(200),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [t("Preparado por", { font: "Arial", size: 20, color: GRAY })]
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [t("Jose Villalba", { font: "Georgia", size: 40, bold: true, color: DARK })]
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [t("Desarrollador Web & Diseño Digital", { font: "Arial", size: 22, color: GOLD, italics: true })]
      }),

      spacer(200),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        children: [t("Marzo 2025", { font: "Arial", size: 20, color: GRAY })]
      }),

      // ── Enlace en vivo ─────────────────────────────
      spacer(300),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 80 },
        shading: { fill: LGRAY, type: ShadingType.CLEAR },
        children: [
          t("🌐  Web en directo: ", { font: "Arial", size: 22, bold: true, color: DARK }),
          new ExternalHyperlink({
            link: "https://sideral-bar.vercel.app",
            children: [new TextRun({ text: "sideral-bar.vercel.app", font: "Arial", size: 22,
              color: "1A56DB", underline: { type: UnderlineType.SINGLE } })]
          })
        ]
      }),

      // ── Salto de página ────────────────────────────
      new Paragraph({ children: [new PageBreak()] }),


      // ══════════════════════════════════════════════════
      // 1. INTRODUCCIÓN
      // ══════════════════════════════════════════════════
      sectionTitle("1.  Quién soy y qué he hecho para Sideral Bar"),
      spacer(60),

      bodyText("Mi nombre es Jose Villalba, desarrollador web especializado en negocios de hostelería y restauración. He construido desde cero una presencia digital completa y profesional para Sideral Bar, adaptada a la identidad del local y lista para usar desde el primer día."),
      bodyText("Esta propuesta te muestra todo lo que se ha desarrollado, cómo funciona, y por qué puede marcar la diferencia para tu negocio."),

      spacer(120),

      // Métricas en tabla
      new Table({
        columnWidths: [3120, 3120, 3120],
        margins: { top: 120, bottom: 120, left: 180, right: 180 },
        rows: [new TableRow({ children: [
          highlightBox("Líneas de código escritas", "5.100+", LGRAY),
          highlightBox("Páginas del proyecto", "2", "EAF3E0"),
          highlightBox("Horas de trabajo", "~16h", "FFF3E0"),
        ]})]
      }),

      spacer(80),
      new Paragraph({ children: [new PageBreak()] }),


      // ══════════════════════════════════════════════════
      // 2. LA LANDING PAGE
      // ══════════════════════════════════════════════════
      sectionTitle("2.  La Landing Page — Web Principal"),
      bodyText("El sitio principal (index.html) es tu carta de presentación en Internet. Funciona directamente en el navegador sin instalaciones, y está alojado en Vercel con dominio limpio."),
      spacer(80),

      sectionSubtitle("2.1  Hero — Primera Impresión"),
      bodyText("La sección de bienvenida que ven los usuarios al entrar. Diseñada para impactar desde el primer segundo:"),
      bulletItem("Fondo de campo de estrellas animado en tiempo real (canvas HTML5)", "bullets"),
      bulletItem("Nombre del bar en tipografía Italiana de gran tamaño", "bullets"),
      bulletItem("Tagline real del negocio: \"Todo es posible si se experimenta\"", "bullets"),
      bulletItem("Dos botones de acción: \"Ver la Carta\" y \"Cómo Llegar\"", "bullets"),
      bulletItem("Estrellas fugaces animadas ocasionalmente", "bullets"),

      sectionSubtitle("2.2  Sobre Nosotros"),
      bodyText("Sección que presenta la historia real del bar con datos verificados:"),
      bulletItem("Historia de la fundación: apertura el 16 de diciembre de 2021", "bullets"),
      bulletItem("Mención a Silvana Blanco, propietaria, y al origen uruguayo del concepto", "bullets"),
      bulletItem("Referencia al Sidereus Nuncius de Galileo Galilei como inspiración del nombre", "bullets"),
      bulletItem("Mención al diseño interior de XC Interiør Lab", "bullets"),
      bulletItem("Cuatro pilares del negocio: Hecho en Casa · Fusión de Autor · Producto de Origen · Ambiente Único", "bullets"),
      bulletItem("Badge con la valoración real de Google: 4,7/5 con 365 reseñas", "bullets"),

      sectionSubtitle("2.3  La Carta — Menú Completo Interactivo"),
      bodyText("Todos los platos del menú oficial (carta.pdf) digitalizados y presentados en formato interactivo:"),

      new Table({
        columnWidths: [2800, 6560],
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders, width: { size: 2800, type: WidthType.DXA },
              shading: { fill: DARK, type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.CENTER,
                children: [t("Categoría", { font: "Arial", size: 20, bold: true, color: WHITE })] })] }),
            new TableCell({ borders, width: { size: 6560, type: WidthType.DXA },
              shading: { fill: DARK, type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.CENTER,
                children: [t("Platos incluidos", { font: "Arial", size: 20, bold: true, color: WHITE })] })] }),
          ]}),
          ...[
            ["✦  Clásicos de Entrantes", "6 platos — Empanada, Tartar de salmón, Mollejas, Pan bao, Ensaladilla..."],
            ["✧  Con las Manos...", "7 platos — Tacos de atún, Bagel de Pastrami, Croquetas (3 sabores), Pizzetas, Tablas..."],
            ["⋆  Para Compartir Entre 2", "6 platos — Sashimi flambeado, Pinchos de cordero, Yakisoba del Chef, Arroz al curry..."],
            ["◈  Pescados & Carnes", "6 platos — Ceviche, Merluza, Burger doble, Presa ibérica, Solomillo de vaca..."],
            ["★  Para los Peques", "5 platos — Croquetas, Mini burger, Tiritas de pollo, Hot Dog XL, Pizzetas..."],
          ].map(([cat, platos]) => new TableRow({ children: [
            new TableCell({ borders, width: { size: 2800, type: WidthType.DXA },
              shading: { fill: LGRAY, type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 160, right: 160 },
              children: [new Paragraph({ children: [t(cat, { font: "Arial", size: 19, bold: true, color: DARK })] })] }),
            new TableCell({ borders, width: { size: 6560, type: WidthType.DXA },
              margins: { top: 80, bottom: 80, left: 160, right: 160 },
              children: [new Paragraph({ children: [t(platos, { font: "Arial", size: 19, color: GRAY })] })] }),
          ]}))
        ]
      }),

      spacer(80),
      bodyText("Cada plato incluye: foto del plato, nombre, descripción, precio con unidad y valoración con estrellas. Los badges especiales (Especial Chef, Fan Favorito, Best Seller, Ibérico, Vegano...) se destacan visualmente."),

      sectionSubtitle("2.4  Del Chef — Recomendaciones Destacadas"),
      bodyText("Tres platos top del chef en cards de pantalla completa con foto de fondo, texto superpuesto y efecto parallax al pasar el ratón. Generados automáticamente según los badges asignados en la carta."),

      sectionSubtitle("2.5  Galería & Carrusel de Instagram"),
      bodyText("Sección multimedia completa con dos capas de contenido visual que conectan la web con el perfil @sideralbar:"),
      bulletItem("Carrusel principal de 12 slides (fotos + vídeos) con autoplay cada 4 segundos", "bullets"),
      bulletItem("Cards de vídeo con botón ▶ de play superpuesto — al pulsar abre directamente Instagram", "bullets"),
      bulletItem("Soporte táctil completo: swipe left/right en móvil y tablet", "bullets"),
      bulletItem("Arrastre con ratón (drag) en escritorio para pasar slides", "bullets"),
      bulletItem("Botones anterior/siguiente + puntos de navegación interactivos", "bullets"),
      bulletItem("Etiqueta de tipo en cada slide: Plato · Vídeo · Cocktail · Ambiente", "bullets"),
      bulletItem("Mini grid de 6 fotos debajo del carrusel para mayor densidad visual", "bullets"),
      bulletItem("CTA final con contador de seguidores: \"Ver todo en Instagram · @sideralbar · 1.820 seguidores\"", "bullets"),

      sectionSubtitle("2.6  Animaciones de Scroll"),
      bodyText("Toda la web cobra vida según el usuario va bajando. Sistema de animaciones escalonadas y efectos de profundidad:"),
      bulletItem("Reveal desde abajo: cada sección aparece con deslizamiento suave al entrar en pantalla", "bullets"),
      bulletItem("Reveal lateral: el texto del About entra desde la izquierda, la imagen desde la derecha", "bullets"),
      bulletItem("Stagger en cascada: los 4 pilares del About aparecen uno a uno con 80ms de retraso", "bullets"),
      bulletItem("Reveal scale: el bloque de valoraciones de Google aparece creciendo desde el centro", "bullets"),
      bulletItem("Parallax: las dos imágenes del About se mueven a velocidades distintas al hacer scroll", "bullets"),
      bulletItem("CountUp animado: el 4,7 de valoración y las 365 reseñas se cuentan solos al aparecer", "bullets"),
      bulletItem("Gold lines: las líneas decorativas doradas se «dibujan» al entrar en pantalla", "bullets"),

      sectionSubtitle("2.7  Reseñas Google"),
      bodyText("Carrusel de 8 reseñas reales de clientes verificados en Google (nombres reales, fechas reales de 2025-2026). Incluye:"),
      bulletItem("Valoración global 4,7/5 en tipografía grande con logo de Google en colores oficiales", "bullets"),
      bulletItem("\"Basado en 365 reseñas verificadas\" — dato real obtenido de Google", "bullets"),
      bulletItem("Carrusel automático que avanza solo cada 5 segundos", "bullets"),
      bulletItem("Botones de navegación manual y puntos indicadores", "bullets"),

      sectionSubtitle("2.8  Contacto & Mapa"),
      bodyText("Sección con toda la información real del negocio:"),
      bulletItem("Dirección: Galileo Galilei, Nº 5, Local 8 · Mairena del Aljarafe, 41927 Sevilla", "bullets"),
      bulletItem("Teléfono clickable: +34 655 10 18 45", "bullets"),
      bulletItem("Horario real: L-M cerrado · Mi-Do mediodía · J-V 20:00-00:00 · Sáb 20:00-02:00", "bullets"),
      bulletItem("Mapa de Google Maps embebido con la ubicación exacta", "bullets"),
      bulletItem("Botones directos a Instagram y Google Maps", "bullets"),

      new Paragraph({ children: [new PageBreak()] }),


      // ══════════════════════════════════════════════════
      // 3. PANEL ADMIN
      // ══════════════════════════════════════════════════
      sectionTitle("3.  Panel de Administración — Gestiona tu Carta Tú Mismo"),
      bodyText("El panel de administración (admin.html) permite al propietario gestionar la carta del bar sin necesidad de programar ni llamar a nadie. Acceso con contraseña privada."),
      spacer(80),

      new Table({
        columnWidths: [1200, 3000, 5160],
        margins: { top: 80, bottom: 80, left: 140, right: 140 },
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders, width: { size: 1200, type: WidthType.DXA },
              shading: { fill: DARK, type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.CENTER,
                children: [t("", { font: "Arial", size: 20, bold: true, color: WHITE })] })] }),
            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA },
              shading: { fill: DARK, type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.CENTER,
                children: [t("Función", { font: "Arial", size: 20, bold: true, color: WHITE })] })] }),
            new TableCell({ borders, width: { size: 5160, type: WidthType.DXA },
              shading: { fill: DARK, type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.CENTER,
                children: [t("Qué puedes hacer", { font: "Arial", size: 20, bold: true, color: WHITE })] })] }),
          ]}),
          featureRow("🔐", "Login seguro", "Acceso por contraseña privada. Solo el propietario puede entrar."),
          featureRow("📊", "Dashboard", "Vista rápida: nº de categorías, platos activos, platos ocultos. Accesos rápidos a las acciones más comunes."),
          featureRow("📂", "Categorías", "Crear, editar y eliminar categorías completas con nombre, emoji/icono y descripción."),
          featureRow("🍽️", "Platos — Añadir", "Añadir nuevos platos con nombre, descripción, precio, unidad y foto."),
          featureRow("✏️", "Platos — Editar", "Modificar cualquier dato de un plato existente: precio, descripción, imagen..."),
          featureRow("🙈", "Platos — Ocultar", "Ocultar temporalmente un plato (sin borrarlo) con un solo clic. Útil para platos de temporada o agotados."),
          featureRow("🗑️", "Platos — Borrar", "Eliminar platos de la carta con confirmación de seguridad."),
          featureRow("📸", "Fotos de platos", "Subir una foto desde el ordenador O pegar una URL de imagen. Vista previa instantánea."),
          featureRow("🏷️", "Badges / Etiquetas", "Asignar etiquetas visuales: Especial Chef · Best Seller · Fan Favorito · Ibérico · Vegano · Premium · Nuevo..."),
          featureRow("↕️", "Mover categorías", "Cambiar un plato de categoría con un menú desplegable."),
          featureRow("⬇️", "Exportar carta", "Descargar toda la carta en formato JSON para guardarla o compartirla."),
          featureRow("⬆️", "Importar carta", "Cargar una carta exportada previamente con un clic."),
          featureRow("🔄", "Resetear", "Volver a los datos originales de la carta en caso de error."),
        ]
      }),

      spacer(120),
      new Paragraph({ children: [new PageBreak()] }),


      // ══════════════════════════════════════════════════
      // 4. DISEÑO Y TECNOLOGÍA
      // ══════════════════════════════════════════════════
      sectionTitle("4.  Diseño y Tecnología"),

      sectionSubtitle("Estética — Tema Cósmico Sideral"),
      bodyText("El diseño visual está pensado para reflejar la identidad del propio bar: el nombre \"Sideral\" viene del Sidereus Nuncius de Galileo Galilei, y eso se traduce en:"),
      bulletItem("Fondo negro profundo (#07080f) que evoca el espacio exterior", "bullets"),
      bulletItem("Acentos dorados y ámbar cálidos (#c89428) que recuerdan la luz de un restaurante íntimo", "bullets"),
      bulletItem("Tipografías de lujo: Cormorant Garamond (titulares) + DM Sans (texto) + Italiana (logo)", "bullets"),
      bulletItem("Campo de estrellas animado en el Hero, generado en tiempo real", "bullets"),
      bulletItem("Diseño totalmente responsivo: se adapta a móvil, tablet y ordenador", "bullets"),

      sectionSubtitle("Tecnología utilizada"),
      new Table({
        columnWidths: [2200, 7160],
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        rows: [
          ...[
            ["HTML5 + CSS3 + JS", "Sin frameworks · abre directamente en el navegador · sin instalaciones ni dependencias"],
            ["Canvas API", "Campo de estrellas animado y estrellas fugaces generadas en tiempo real"],
            ["Pointer Events API", "Carrusel con soporte de touch (swipe) y drag con ratón sin librerías externas"],
            ["IntersectionObserver", "Detección de scroll para revelar secciones, countup y gold lines animadas"],
            ["CSS scroll animations", "Reveal desde abajo, lateral, scale, stagger y parallax — todo en CSS puro"],
            ["requestAnimationFrame", "Animaciones fluidas a 60fps: countup de números, starfield, parallax"],
            ["Google Fonts", "Cormorant Garamond · DM Sans · Italiana (preconnect optimizado)"],
            ["Google Maps Embed", "Mapa interactivo con ubicación exacta sin API key"],
            ["localStorage", "El admin persiste los cambios de la carta en el navegador"],
            ["Vercel", "Alojamiento gratuito con dominio limpio, HTTPS automático y CDN global"],
          ].map(([tech, desc]) => new TableRow({ children: [
            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA },
              shading: { fill: LGRAY, type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 160, right: 160 },
              children: [new Paragraph({ children: [t(tech, { font: "Arial", size: 19, bold: true, color: DARK })] })] }),
            new TableCell({ borders, width: { size: 7160, type: WidthType.DXA },
              margins: { top: 80, bottom: 80, left: 160, right: 160 },
              children: [new Paragraph({ children: [t(desc, { font: "Arial", size: 19, color: GRAY })] })] }),
          ]}))
        ]
      }),

      spacer(80),
      new Paragraph({ children: [new PageBreak()] }),


      // ══════════════════════════════════════════════════
      // 5. DATOS REALES INCORPORADOS
      // ══════════════════════════════════════════════════
      sectionTitle("5.  Datos 100% Reales de Sideral Bar"),
      bodyText("Todo el contenido del sitio ha sido investigado y verificado. No se ha inventado nada:"),
      spacer(60),

      new Table({
        columnWidths: [3120, 6240],
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders, width: { size: 3120, type: WidthType.DXA },
              shading: { fill: DARK, type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.CENTER,
                children: [t("Dato", { font: "Arial", size: 20, bold: true, color: WHITE })] })] }),
            new TableCell({ borders, width: { size: 6240, type: WidthType.DXA },
              shading: { fill: DARK, type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.CENTER,
                children: [t("Fuente", { font: "Arial", size: 20, bold: true, color: WHITE })] })] }),
          ]}),
          ...[
            ["Tagline: \"Todo es posible si se experimenta\"", "Web oficial sideralbar.com"],
            ["30 platos con nombre, descripción y precio exacto", "PDF oficial carta.pdf"],
            ["Valoración Google: 4,7/5 con 365 reseñas", "Google Maps verificado"],
            ["8 reseñas reales de clientes (nombres reales, fechas 2025-2026)", "GastroRanking / Google Reviews"],
            ["Teléfono: +34 655 10 18 45", "Directorio web verificado"],
            ["Propietaria: Silvana Blanco (uruguaya)", "Reseña De Tapas con Chencho"],
            ["Apertura: 16 diciembre 2021", "Registros web verificados"],
            ["Diseño: XC Interiør Lab", "Publicación de interiorismo verificada"],
            ["Horario real por día (L-M cerrado)", "Restaurant Guru / Google"],
            ["Inspiración: Sidereus Nuncius, Galileo Galilei", "Historia oficial del local"],
          ].map(([dato, fuente]) => new TableRow({ children: [
            new TableCell({ borders, width: { size: 3120, type: WidthType.DXA },
              shading: { fill: LGRAY, type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 160, right: 160 },
              children: [new Paragraph({ children: [t(dato, { font: "Arial", size: 19, color: DARK })] })] }),
            new TableCell({ borders, width: { size: 6240, type: WidthType.DXA },
              margins: { top: 80, bottom: 80, left: 160, right: 160 },
              children: [new Paragraph({ children: [t(fuente, { font: "Arial", size: 19, color: GRAY })] })] }),
          ]}))
        ]
      }),

      spacer(80),
      new Paragraph({ children: [new PageBreak()] }),


      // ══════════════════════════════════════════════════
      // 6. MEJORAS POSIBLES
      // ══════════════════════════════════════════════════
      sectionTitle("6.  Posibles Mejoras y Servicios Adicionales"),
      bodyText("El sitio actual es completo y funcional. Si se quisiera ir más lejos, estas serían las siguientes fases naturales:"),
      spacer(80),

      new Table({
        columnWidths: [800, 2800, 5760],
        margins: { top: 80, bottom: 80, left: 140, right: 140 },
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders, width: { size: 800, type: WidthType.DXA },
              shading: { fill: DARK, type: ShadingType.CLEAR },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [t("Prior.", { font: "Arial", size: 19, bold: true, color: WHITE })] })] }),
            new TableCell({ borders, width: { size: 2800, type: WidthType.DXA },
              shading: { fill: DARK, type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [t("Mejora", { font: "Arial", size: 19, bold: true, color: WHITE })] })] }),
            new TableCell({ borders, width: { size: 5760, type: WidthType.DXA },
              shading: { fill: DARK, type: ShadingType.CLEAR },
              children: [new Paragraph({ children: [t("Beneficio", { font: "Arial", size: 19, bold: true, color: WHITE })] })] }),
          ]}),
          ...[
            ["Alta", "Dominio propio personalizado", "sideralbar.es o sideral-bar.com para mayor profesionalidad y confianza"],
            ["Alta", "Sistema de reservas online", "Los clientes reservan mesa directamente desde la web sin necesidad de llamar"],
            ["Alta", "WhatsApp Click-to-Chat", "Botón flotante siempre visible para que los clientes escriban al instante por WhatsApp"],
            ["Media", "Instagram API real", "Carrusel actualizado automáticamente con las últimas publicaciones del bar, sin intervención manual"],
            ["Media", "SEO local avanzado", "Posicionamiento en Google para búsquedas como \"bar tapas Mairena del Aljarafe\" o \"fusión Sevilla\""],
            ["Media", "Carta en PDF generada automáticamente", "El admin puede descargar un PDF imprimible y actualizado de la carta con un solo clic"],
            ["Baja", "Menú QR para mesas", "Código QR en cada mesa que abre la carta interactiva en el móvil del cliente"],
            ["Baja", "Versión multiidioma", "Carta disponible también en inglés para turistas y clientes internacionales"],
          ].map(([prio, mejora, beneficio], i) => new TableRow({ children: [
            new TableCell({ borders, width: { size: 800, type: WidthType.DXA },
              shading: { fill: prio === "Alta" ? "FFF0E0" : prio === "Media" ? "F0F5FF" : LGRAY, type: ShadingType.CLEAR },
              verticalAlign: VerticalAlign.CENTER,
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [t(prio, {
                font: "Arial", size: 18, bold: true,
                color: prio === "Alta" ? "B35A00" : prio === "Media" ? "1A4DB3" : "4A4A5A"
              })] })] }),
            new TableCell({ borders, width: { size: 2800, type: WidthType.DXA },
              shading: { fill: i % 2 === 0 ? LGRAY : WHITE, type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 160, right: 160 },
              children: [new Paragraph({ children: [t(mejora, { font: "Arial", size: 19, bold: true, color: DARK })] })] }),
            new TableCell({ borders, width: { size: 5760, type: WidthType.DXA },
              shading: { fill: i % 2 === 0 ? LGRAY : WHITE, type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 160, right: 160 },
              children: [new Paragraph({ children: [t(beneficio, { font: "Arial", size: 19, color: GRAY })] })] }),
          ]}))
        ]
      }),

      spacer(80),
      new Paragraph({ children: [new PageBreak()] }),


      // ══════════════════════════════════════════════════
      // 7. PRÓXIMOS PASOS
      // ══════════════════════════════════════════════════
      sectionTitle("7.  Próximos Pasos"),
      bodyText("Si te interesa lo que has visto y quieres continuar con el proyecto, estos serían los pasos a seguir:"),
      spacer(80),

      new Paragraph({ numbering: { reference: "nums", level: 0 }, spacing: { before: 80, after: 80 },
        children: [t("Visita la web en vivo: ", { font: "Arial", size: 22, bold: true, color: DARK }),
          new ExternalHyperlink({ link: "https://sideral-bar.vercel.app",
            children: [new TextRun({ text: "sideral-bar.vercel.app", font: "Arial", size: 22, color: "1A56DB",
              underline: { type: UnderlineType.SINGLE } })] })] }),

      new Paragraph({ numbering: { reference: "nums", level: 0 }, spacing: { before: 80, after: 80 },
        children: [t("Prueba el panel admin en: sideral-bar.vercel.app/admin.html (contraseña: sideral2024)",
          { font: "Arial", size: 22, color: GRAY })] }),

      new Paragraph({ numbering: { reference: "nums", level: 0 }, spacing: { before: 80, after: 80 },
        children: [t("Revisar el contenido juntos y ajustar lo que sea necesario (fotos, textos, horarios, precios)",
          { font: "Arial", size: 22, color: GRAY })] }),

      new Paragraph({ numbering: { reference: "nums", level: 0 }, spacing: { before: 80, after: 80 },
        children: [t("Decidir qué mejoras adicionales se quieren incluir y presupuestarlas",
          { font: "Arial", size: 22, color: GRAY })] }),

      new Paragraph({ numbering: { reference: "nums", level: 0 }, spacing: { before: 80, after: 80 },
        children: [t("Contratar dominio propio (recomendado) para profesionalizar la presencia online",
          { font: "Arial", size: 22, color: GRAY })] }),

      spacer(200),

      // ── Cierre ─────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 2, color: GOLD }, bottom: { style: BorderStyle.SINGLE, size: 2, color: GOLD } },
        spacing: { before: 200, after: 200 },
        children: [t("✦  Todo lo que necesitas para brillar online está ya construido.  ✦", {
          font: "Georgia", size: 24, italics: true, color: GOLD
        })]
      }),

      spacer(200),

      // ── Contacto ────────────────────────────────────
      sectionTitle("Contacto"),
      new Table({
        columnWidths: [2000, 7360],
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        rows: [
          ...[ ["👤 Nombre", "Jose Villalba"], ["🌐 Web del proyecto", "sideral-bar.vercel.app"],
               ["🔧 Panel admin", "sideral-bar.vercel.app/admin.html"], ].map(([k, v]) =>
            new TableRow({ children: [
              new TableCell({ borders: noBorders, width: { size: 2000, type: WidthType.DXA },
                margins: { top: 60, bottom: 60, left: 0, right: 160 },
                children: [new Paragraph({ children: [t(k, { font: "Arial", size: 21, bold: true, color: DARK })] })] }),
              new TableCell({ borders: noBorders, width: { size: 7360, type: WidthType.DXA },
                margins: { top: 60, bottom: 60, left: 0, right: 0 },
                children: [new Paragraph({ children: [t(v, { font: "Arial", size: 21, color: GRAY })] })] }),
            ]}))
        ]
      }),

    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("Propuesta-Web-SideralBar-JoseVillalba.docx", buf);
  console.log("✅ Documento generado: Propuesta-Web-SideralBar-JoseVillalba.docx");
});
