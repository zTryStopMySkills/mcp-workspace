const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, ExternalHyperlink,
  TableOfContents, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak } = require("docx");

// Colors
const AMBER = "C8956E";
const DARK = "1A120C";
const BURGUNDY = "8B2252";
const CREAM = "F2E8DC";
const MUTED = "6B5C4E";
const WHITE = "FFFFFF";
const BLACK = "000000";

// Borders
const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "D9D0C7" };
const cellBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

// Helpers
const sp = (before = 0, after = 0) => ({ before, after });
const txt = (text, opts = {}) => new TextRun({ text, font: "Arial", size: 22, ...opts });
const txtB = (text, opts = {}) => txt(text, { bold: true, ...opts });
const heading = (text, level, opts = {}) => new Paragraph({ heading: level, spacing: sp(360, 200), ...opts, children: [txt(text, { bold: true })] });
const p = (children, opts = {}) => new Paragraph({ spacing: sp(80, 80), ...opts, children: Array.isArray(children) ? children : [children] });
const blank = () => new Paragraph({ spacing: sp(60, 60), children: [] });
const divider = () => new Paragraph({
  spacing: sp(200, 200), alignment: AlignmentType.CENTER,
  children: [txt("─────────────────────────────────", { color: AMBER, size: 18 })]
});

// Bullet & numbered list configs
const bulletRef = "main-bullets";
const numberedRefs = {};
let numRefCounter = 0;
function getNumRef(name) {
  if (!numberedRefs[name]) { numberedRefs[name] = `num-${numRefCounter++}`; }
  return numberedRefs[name];
}

const bullet = (text, opts = {}) => new Paragraph({
  numbering: { reference: bulletRef, level: 0 },
  spacing: sp(40, 40),
  children: [txt(text, opts)]
});

const numbered = (text, ref, opts = {}) => new Paragraph({
  numbering: { reference: ref, level: 0 },
  spacing: sp(40, 40),
  children: Array.isArray(text) ? text : [txt(text, opts)]
});

// Build all numbered references
const allNumRefs = [];
for (let i = 0; i < 15; i++) {
  allNumRefs.push({
    reference: `num-${i}`,
    levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DOCUMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 56, bold: true, color: DARK, font: "Georgia" },
        paragraph: { spacing: sp(240, 120), alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, color: DARK, font: "Georgia" },
        paragraph: { spacing: sp(400, 200), outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: BURGUNDY, font: "Georgia" },
        paragraph: { spacing: sp(300, 160), outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: MUTED, font: "Georgia" },
        paragraph: { spacing: sp(200, 120), outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: bulletRef,
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      ...allNumRefs,
    ]
  },
  sections: [
    // ════════════════════════════════════════════════════════════════════════════
    // PORTADA
    // ════════════════════════════════════════════════════════════════════════════
    {
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      children: [
        blank(), blank(), blank(), blank(), blank(), blank(),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: sp(0, 100),
          children: [txt("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", { color: AMBER, size: 16 })]
        }),
        blank(),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: sp(0, 60),
          children: [txt("TABERNA", { font: "Georgia", size: 28, bold: true, color: MUTED, characterSpacing: 400 })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: sp(0, 80),
          children: [txt("Alambique", { font: "Georgia", size: 72, bold: true, italics: true, color: DARK })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: sp(0, 60),
          children: [txt("MAIRENA DEL ALJARAFE", { size: 20, color: AMBER, characterSpacing: 300 })]
        }),
        blank(),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: sp(0, 100),
          children: [txt("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", { color: AMBER, size: 16 })]
        }),
        blank(), blank(),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: sp(0, 60),
          children: [txt("PRESENTACIÓN COMERCIAL", { size: 26, bold: true, color: BURGUNDY, characterSpacing: 200 })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: sp(0, 40),
          children: [txt("&", { size: 22, color: MUTED })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: sp(0, 100),
          children: [txt("MANUAL DE INSTRUCCIONES", { size: 26, bold: true, color: BURGUNDY, characterSpacing: 200 })]
        }),
        blank(), blank(), blank(),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: sp(0, 40),
          children: [txt("Preparado para", { size: 20, color: MUTED })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: sp(0, 40),
          children: [txt("Alejandro Villaverde del Tesoro", { size: 24, bold: true, color: DARK, font: "Georgia" })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: sp(0, 40),
          children: [txt("Agente Comercial", { size: 20, color: MUTED })]
        }),
        blank(), blank(),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: sp(0, 40),
          children: [txt("Marzo 2026", { size: 20, color: MUTED })]
        }),
      ]
    },

    // ════════════════════════════════════════════════════════════════════════════
    // ÍNDICE
    // ════════════════════════════════════════════════════════════════════════════
    {
      properties: {
        page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      headers: {
        default: new Header({ children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [txt("Taberna Alambique Mairena", { size: 16, color: MUTED, italics: true })]
        })] })
      },
      footers: {
        default: new Footer({ children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [txt("Página ", { size: 16, color: MUTED }), new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: MUTED }), txt(" de ", { size: 16, color: MUTED }), new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 16, color: MUTED })]
        })] })
      },
      children: [
        heading("Índice", HeadingLevel.HEADING_1),
        blank(),
        new TableOfContents("Tabla de Contenidos", { hyperlink: true, headingStyleRange: "1-3" }),
        new Paragraph({ children: [new PageBreak()] }),

        // ══════════════════════════════════════════════════════════════════════
        // PARTE 1 - PRESENTACIÓN COMERCIAL
        // ══════════════════════════════════════════════════════════════════════
        heading("PARTE 1: Presentación Comercial", HeadingLevel.HEADING_1),
        blank(),

        // --- Resumen ejecutivo ---
        heading("Resumen del Proyecto", HeadingLevel.HEADING_2),
        p([
          txt("Se ha desarrollado una "),
          txtB("plataforma web profesional completa"),
          txt(" para Taberna Alambique Mairena, compuesta por dos productos independientes:"),
        ]),
        blank(),
        new Table({
          columnWidths: [4680, 4680],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: cellBorders, width: { size: 4680, type: WidthType.DXA },
                  shading: { fill: "F5EDE3", type: ShadingType.CLEAR },
                  children: [
                    p([txtB("Landing Page Pública", { color: DARK, size: 24 })], { alignment: AlignmentType.CENTER }),
                    p([txt("Página web del restaurante visible para todos los clientes", { size: 20 })], { alignment: AlignmentType.CENTER }),
                    blank(),
                    p([new ExternalHyperlink({
                      children: [txt("taberna-alambique.vercel.app", { color: BURGUNDY, underline: { type: "single" }, size: 20 })],
                      link: "https://taberna-alambique.vercel.app"
                    })], { alignment: AlignmentType.CENTER }),
                  ]
                }),
                new TableCell({
                  borders: cellBorders, width: { size: 4680, type: WidthType.DXA },
                  shading: { fill: "F5EDE3", type: ShadingType.CLEAR },
                  children: [
                    p([txtB("Panel de Administración", { color: DARK, size: 24 })], { alignment: AlignmentType.CENTER }),
                    p([txt("Panel privado para que el dueño gestione la carta del restaurante", { size: 20 })], { alignment: AlignmentType.CENTER }),
                    blank(),
                    p([new ExternalHyperlink({
                      children: [txt("taberna-alambique.vercel.app/admin", { color: BURGUNDY, underline: { type: "single" }, size: 20 })],
                      link: "https://taberna-alambique.vercel.app/admin"
                    })], { alignment: AlignmentType.CENTER }),
                  ]
                }),
              ]
            })
          ]
        }),
        blank(),

        // --- Datos del negocio ---
        heading("Datos del Negocio", HeadingLevel.HEADING_2),
        new Table({
          columnWidths: [2800, 6560],
          rows: [
            ["Nombre", "Taberna Alambique Mairena"],
            ["Dirección", "Avda. del Jardinillo 29, Local 4, 41927 Mairena del Aljarafe, Sevilla"],
            ["Teléfono", "+34 954 586 874"],
            ["Email", "alambiquemairena@grupoalambique.com"],
            ["Instagram", "@tabernaalambiquemairena"],
            ["NIF", "B90240300"],
            ["Valoración Google", "4.6 / 5 estrellas (2365+ opiniones)"],
            ["Web de reservas", "alambiquemairena.makro.bar"],
          ].map(([label, value]) => new TableRow({
            children: [
              new TableCell({
                borders: cellBorders, width: { size: 2800, type: WidthType.DXA },
                shading: { fill: "F5EDE3", type: ShadingType.CLEAR },
                children: [p([txtB(label, { size: 20 })])]
              }),
              new TableCell({
                borders: cellBorders, width: { size: 6560, type: WidthType.DXA },
                children: [p([txt(value, { size: 20 })])]
              }),
            ]
          }))
        }),
        blank(),

        // --- Funcionalidades Landing ---
        heading("Funcionalidades de la Landing Page", HeadingLevel.HEADING_2),
        p([txt("La página web pública incluye las siguientes secciones y funcionalidades profesionales:")]),
        blank(),

        heading("Hero Principal", HeadingLevel.HEADING_3),
        bullet("Pantalla completa con imagen real de fondo del restaurante"),
        bullet("Efecto parallax al hacer scroll (la imagen se mueve a distinta velocidad)"),
        bullet("Partículas flotantes animadas simulando ambiente cálido de taberna"),
        bullet("Orbes de luz pulsantes en segundo plano"),
        bullet("Título \"Alambique\" con tipografía elegante y degradado dorado"),
        bullet("Badge de valoración Google: 4.6★ con 2365+ opiniones"),
        bullet("Botones de acción: \"Ver Carta\" y \"Reservar Mesa\""),
        bullet("Indicador de scroll animado"),
        blank(),

        heading("Sección Sobre Nosotros", HeadingLevel.HEADING_3),
        bullet("Texto descriptivo del restaurante con su esencia andaluza"),
        bullet("Imagen real del interior del local con marco decorativo"),
        bullet("Estadísticas destacadas: 4.6★ valoración, 2365+ opiniones, 88+ platos"),
        bullet("Tarjetas de características: Terraza, Climatizado, Accesible, Para llevar, Reservas online, Pago con tarjeta"),
        bullet("Animaciones de entrada al hacer scroll"),
        blank(),

        heading("Carta Digital Interactiva", HeadingLevel.HEADING_3),
        p([txt("Esta es la funcionalidad estrella de la web. Se ha digitalizado la "), txtB("carta completa del restaurante"), txt(" directamente desde su PDF original:")]),
        blank(),
        bullet("13 categorías completas con 88 platos reales"),
        bullet("Categorías: Chacinas, Quesos Don Apolonio, Tablas, Tapas Frías, Ensaladas, Para los Niños, Para Empezar, Pescados, Carnes, A la Brasa, Postres, Bebidas, Vinos"),
        bullet("Cada plato muestra: nombre, descripción, precios (tapa/plato), iconos de alérgenos, valoración y badge \"Popular\""),
        bullet("23 vinos con precios copa/botella, denominación de origen y tipo de uva"),
        bullet("Buscador en tiempo real que filtra platos instantáneamente"),
        bullet("Filtro por categorías con pestañas horizontales deslizables"),
        bullet("Layout especial adaptado para la carta de vinos y bebidas"),
        bullet("Imágenes reales por categoría (jamón, quesos, pescados, carnes, postres...)"),
        bullet("Animaciones de entrada escalonadas en las tarjetas de platos"),
        blank(),

        heading("Sección de Recomendados", HeadingLevel.HEADING_3),
        bullet("Carrusel automático con los platos más populares del restaurante"),
        bullet("Cada plato recomendado muestra imagen, nombre, descripción, precio y valoración"),
        bullet("Navegación con flechas y puntos de paginación"),
        bullet("Pausa automática al pasar el ratón sobre un plato"),
        blank(),

        heading("Reseñas de Google", HeadingLevel.HEADING_3),
        bullet("Puntuación general destacada: 4.6/5 con logo de Google"),
        bullet("Carrusel de reseñas reales de clientes"),
        bullet("Cada reseña: avatar, nombre, estrellas, fecha y texto completo"),
        bullet("Auto-scroll con pausa al interactuar"),
        blank(),

        heading("Galería de Fotos", HeadingLevel.HEADING_3),
        bullet("9 imágenes reales del restaurante, platos y ambiente"),
        bullet("Grid responsive con imágenes de distintos tamaños (anchas, altas, normales)"),
        bullet("Efecto zoom al pasar el ratón"),
        bullet("Lightbox: al hacer clic se amplía la imagen a pantalla completa"),
        bullet("Enlace directo al Instagram del restaurante"),
        blank(),

        heading("Contacto y Ubicación", HeadingLevel.HEADING_3),
        bullet("Dirección completa, teléfono clickeable (llama directamente), email"),
        bullet("Tabla de horarios completa (Lunes a Jueves / Viernes / Sábado y Domingo)"),
        bullet("Mapa de Google Maps embebido con la ubicación exacta"),
        bullet("Enlaces a Instagram y Facebook"),
        bullet("Botón destacado para reservar mesa online"),
        blank(),

        heading("Footer", HeadingLevel.HEADING_3),
        bullet("Navegación rápida a todas las secciones"),
        bullet("Datos de contacto resumidos"),
        bullet("Enlaces a redes sociales y Google Maps"),
        bullet("Datos legales: NIF B90240300"),
        blank(),

        // --- Características técnicas ---
        heading("Características Técnicas", HeadingLevel.HEADING_2),
        blank(),
        new Table({
          columnWidths: [3200, 6160],
          rows: [
            ["Diseño Responsive", "Se adapta perfectamente a móvil, tablet y escritorio. Optimizado especialmente para uso desde el móvil."],
            ["Animaciones Profesionales", "Animaciones de scroll con Framer Motion: parallax, fade-in, partículas flotantes, grain texture, orbes de luz pulsantes."],
            ["SEO Optimizado", "Metadatos Open Graph, título y descripción optimizados para Google. Mejora la visibilidad en búsquedas locales."],
            ["Velocidad", "Carga ultra-rápida gracias a Next.js 16, CDN global de Vercel y optimización automática de imágenes."],
            ["Seguridad", "Certificado SSL incluido (HTTPS). Hosting en Vercel con protección DDoS."],
            ["Hosting", "Desplegado en Vercel: hosting gratuito, CDN global, deploys automáticos, dominio personalizable."],
            ["Tecnologías", "Next.js 16, TypeScript, Tailwind CSS, Framer Motion, Swiper.js"],
          ].map(([label, value]) => new TableRow({
            children: [
              new TableCell({
                borders: cellBorders, width: { size: 3200, type: WidthType.DXA },
                shading: { fill: "F5EDE3", type: ShadingType.CLEAR },
                verticalAlign: VerticalAlign.CENTER,
                children: [p([txtB(label, { size: 20 })])]
              }),
              new TableCell({
                borders: cellBorders, width: { size: 6160, type: WidthType.DXA },
                children: [p([txt(value, { size: 20 })])]
              }),
            ]
          }))
        }),
        blank(),

        // --- Valor para el negocio ---
        heading("Valor para el Negocio", HeadingLevel.HEADING_2),
        p([txt("Esta plataforma aporta beneficios tangibles e inmediatos al restaurante:")]),
        blank(),
        (() => {
          const ref = getNumRef("valor");
          return [
            numbered([txtB("Presencia digital profesional: "), txt("El restaurante pasa de no tener web propia a tener una landing page de nivel premium que transmite calidad y confianza.")], ref),
            numbered([txtB("Carta siempre actualizada: "), txt("El dueño puede modificar platos, precios y categorías sin depender de nadie, desde cualquier dispositivo.")], ref),
            numbered([txtB("Más reservas: "), txt("Botón de reserva visible en toda la web que conecta directamente con su sistema de reservas actual.")], ref),
            numbered([txtB("Mejor posicionamiento en Google: "), txt("SEO optimizado para búsquedas locales como \"restaurante Mairena del Aljarafe\" o \"tapas Sevilla\".")], ref),
            numbered([txtB("Confianza del cliente: "), txt("Las reseñas reales de Google y la valoración 4.6/5 generan confianza inmediata en nuevos clientes.")], ref),
            numbered([txtB("Accesibilidad: "), txt("Los clientes pueden consultar la carta completa desde su móvil antes de ir, decidir qué pedir y conocer los alérgenos.")], ref),
            numbered([txtB("Imagen de marca: "), txt("Diseño profesional con colores y estética que reflejan la identidad del negocio: taberna andaluza moderna y acogedora.")], ref),
          ];
        })(),

        new Paragraph({ children: [new PageBreak()] }),

        // ══════════════════════════════════════════════════════════════════════
        // PARTE 2 - MANUAL DE INSTRUCCIONES
        // ══════════════════════════════════════════════════════════════════════
        heading("PARTE 2: Manual de Instrucciones del Panel Admin", HeadingLevel.HEADING_1),
        blank(),
        p([txt("Este manual explica paso a paso cómo utilizar el panel de administración para gestionar la carta del restaurante. "), txtB("No se necesitan conocimientos técnicos.")]),
        blank(),

        // --- Acceso ---
        heading("Acceso al Panel de Administración", HeadingLevel.HEADING_2),
        (() => {
          const ref = getNumRef("acceso");
          return [
            numbered("Abra el navegador de su móvil, tablet u ordenador.", ref),
            numbered([txt("Escriba la dirección: "), txtB("taberna-alambique.vercel.app/admin")], ref),
            numbered([txt("Introduzca la contraseña: "), txtB("alambique2024")], ref),
            numbered("Pulse el botón \"Iniciar Sesión\".", ref),
            numbered("Será redirigido al panel de control (Dashboard).", ref),
          ];
        })(),
        blank(),
        p([txt("Nota: ", { bold: true, color: BURGUNDY }), txt("La contraseña se puede cambiar contactando con el equipo técnico. Se recomienda no compartirla con personas no autorizadas.")]),
        blank(),

        // --- Dashboard ---
        heading("Panel de Control (Dashboard)", HeadingLevel.HEADING_2),
        p([txt("Al iniciar sesión, verá el Dashboard con un resumen de su carta:")]),
        blank(),
        bullet("Total de categorías en la carta"),
        bullet("Total de platos registrados"),
        bullet("Número de platos marcados como \"Popular\""),
        bullet("Valoración media de todos los platos"),
        blank(),
        p([txt("Desde aquí puede acceder directamente a la gestión de la carta pulsando el enlace correspondiente o usando el menú lateral.")]),
        blank(),

        // --- Gestión de la carta ---
        heading("Gestión de la Carta", HeadingLevel.HEADING_2),
        p([txt("Esta es la sección principal. Acceda desde el menú lateral: "), txtB("Carta"), txt(". Aquí podrá gestionar todas las categorías y platos del restaurante.")]),
        blank(),

        heading("Ver Categorías y Platos", HeadingLevel.HEADING_3),
        p([txt("Al entrar en la sección Carta, verá todas las categorías listadas. Cada categoría se puede expandir o contraer haciendo clic en ella para ver los platos que contiene.")]),
        blank(),

        heading("Añadir una Nueva Categoría", HeadingLevel.HEADING_3),
        (() => {
          const ref = getNumRef("addcat");
          return [
            numbered("Pulse el botón \"Añadir Categoría\" en la parte superior.", ref),
            numbered("Escriba el nombre de la categoría (ejemplo: \"Entrantes Especiales\").", ref),
            numbered("Seleccione un emoji representativo (ejemplo: 🥘).", ref),
            numbered("Pulse \"Guardar\".", ref),
          ];
        })(),
        blank(),

        heading("Editar una Categoría", HeadingLevel.HEADING_3),
        (() => {
          const ref = getNumRef("editcat");
          return [
            numbered("Localice la categoría que desea modificar.", ref),
            numbered("Pulse el icono de lápiz (editar) junto al nombre.", ref),
            numbered("Modifique el nombre o el emoji.", ref),
            numbered("Pulse \"Guardar\" para confirmar los cambios.", ref),
          ];
        })(),
        blank(),

        heading("Eliminar una Categoría", HeadingLevel.HEADING_3),
        p([txt("Atención: ", { bold: true, color: BURGUNDY }), txt("Al eliminar una categoría, se eliminan TODOS los platos que contenga. Esta acción no se puede deshacer.")]),
        blank(),
        (() => {
          const ref = getNumRef("delcat");
          return [
            numbered("Pulse el icono de papelera junto a la categoría.", ref),
            numbered("Aparecerá un mensaje de confirmación indicando cuántos platos se van a eliminar.", ref),
            numbered("Pulse \"Confirmar\" para eliminar o \"Cancelar\" para mantenerla.", ref),
          ];
        })(),
        blank(),

        heading("Añadir un Nuevo Plato", HeadingLevel.HEADING_3),
        (() => {
          const ref = getNumRef("addplato");
          return [
            numbered("Dentro de la categoría deseada, pulse el botón \"Añadir Plato\".", ref),
            numbered("Se abrirá un formulario con los siguientes campos:", ref),
          ];
        })(),
        blank(),
        new Table({
          columnWidths: [2600, 2200, 4560],
          rows: [
            new TableRow({
              children: [
                new TableCell({ borders: cellBorders, width: { size: 2600, type: WidthType.DXA }, shading: { fill: "F5EDE3", type: ShadingType.CLEAR }, children: [p([txtB("Campo", { size: 20 })])] }),
                new TableCell({ borders: cellBorders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: "F5EDE3", type: ShadingType.CLEAR }, children: [p([txtB("Obligatorio", { size: 20 })])] }),
                new TableCell({ borders: cellBorders, width: { size: 4560, type: WidthType.DXA }, shading: { fill: "F5EDE3", type: ShadingType.CLEAR }, children: [p([txtB("Descripción", { size: 20 })])] }),
              ]
            }),
            ...([
              ["Nombre", "Sí", "Nombre del plato tal como aparecerá en la carta"],
              ["Descripción", "No", "Breve descripción de los ingredientes o preparación"],
              ["Precio Tapa (€)", "No*", "Precio en formato tapa. Ejemplo: 3.00"],
              ["Precio Plato (€)", "No*", "Precio en formato plato. Ejemplo: 6.00"],
              ["Precio Copa (€)", "No", "Solo para vinos. Precio por copa"],
              ["Precio Botella (€)", "No", "Solo para vinos. Precio por botella"],
              ["Alérgenos", "No", "Seleccione todos los alérgenos que apliquen (14 opciones)"],
              ["Popular", "No", "Marque si es un plato destacado (aparecerá en Recomendados)"],
              ["Valoración", "No", "Puntuación del 1 al 5 (aparece como estrellas)"],
              ["URL de imagen", "No", "Dirección web de una foto del plato"],
            ].map(([campo, obligatorio, desc]) => new TableRow({
              children: [
                new TableCell({ borders: cellBorders, width: { size: 2600, type: WidthType.DXA }, children: [p([txt(campo, { size: 20 })])] }),
                new TableCell({ borders: cellBorders, width: { size: 2200, type: WidthType.DXA }, children: [p([txt(obligatorio, { size: 20 })])] }),
                new TableCell({ borders: cellBorders, width: { size: 4560, type: WidthType.DXA }, children: [p([txt(desc, { size: 20 })])] }),
              ]
            })))
          ]
        }),
        blank(),
        p([txt("* Al menos uno de los precios (Tapa o Plato) debe tener valor.", { size: 20, italics: true, color: MUTED })]),
        blank(),
        (() => {
          const ref = getNumRef("addplato2");
          return [
            numbered("Rellene los campos necesarios.", ref),
            numbered("Pulse \"Guardar\" para añadir el plato a la carta.", ref),
            numbered("El plato aparecerá inmediatamente en la lista de su categoría.", ref),
          ];
        })(),
        blank(),

        heading("Editar un Plato Existente", HeadingLevel.HEADING_3),
        (() => {
          const ref = getNumRef("editplato");
          return [
            numbered("Localice el plato dentro de su categoría.", ref),
            numbered("Pulse el botón \"Editar\".", ref),
            numbered("Se abrirá el mismo formulario con los datos actuales del plato.", ref),
            numbered("Modifique los campos que necesite.", ref),
            numbered("Pulse \"Guardar\" para aplicar los cambios.", ref),
          ];
        })(),
        blank(),

        heading("Eliminar un Plato", HeadingLevel.HEADING_3),
        (() => {
          const ref = getNumRef("delplato");
          return [
            numbered("Localice el plato dentro de su categoría.", ref),
            numbered("Pulse el botón \"Eliminar\".", ref),
            numbered("Confirme la eliminación en el diálogo que aparece.", ref),
            numbered("El plato desaparecerá de la carta.", ref),
          ];
        })(),
        blank(),

        heading("Buscar Platos", HeadingLevel.HEADING_3),
        p([txt("En la parte superior de la sección Carta encontrará una "), txtB("barra de búsqueda"), txt(". Escriba el nombre de cualquier plato y el sistema filtrará automáticamente en todas las categorías, mostrando solo los resultados coincidentes.")]),
        blank(),

        // --- Cerrar sesión ---
        heading("Cerrar Sesión", HeadingLevel.HEADING_2),
        p([txt("Para cerrar sesión, pulse el botón "), txtB("\"Cerrar sesión\""), txt(" en la barra lateral (escritorio) o en la navegación inferior (móvil). Será redirigido a la pantalla de inicio de sesión.")]),
        blank(),

        // --- Nota importante ---
        heading("Nota Importante sobre Persistencia", HeadingLevel.HEADING_2),
        new Table({
          columnWidths: [9360],
          rows: [new TableRow({
            children: [new TableCell({
              borders: {
                top: { style: BorderStyle.SINGLE, size: 2, color: BURGUNDY },
                bottom: { style: BorderStyle.SINGLE, size: 2, color: BURGUNDY },
                left: { style: BorderStyle.SINGLE, size: 2, color: BURGUNDY },
                right: { style: BorderStyle.SINGLE, size: 2, color: BURGUNDY },
              },
              width: { size: 9360, type: WidthType.DXA },
              shading: { fill: "FDF2F2", type: ShadingType.CLEAR },
              children: [
                p([txtB("⚠ INFORMACIÓN IMPORTANTE", { color: BURGUNDY, size: 22 })]),
                blank(),
                p([txt("El panel de administración funciona correctamente para gestionar la carta. Sin embargo, el hosting actual (Vercel) utiliza un sistema serverless donde los archivos de datos se regeneran en cada actualización del servidor.", { size: 20 })]),
                blank(),
                p([txt("Para garantizar que los cambios realizados desde el panel admin ", { size: 20 }), txtB("persistan permanentemente", { size: 20 }), txt(", se recomienda migrar la base de datos a un servicio externo (Supabase, PlanetScale, etc.). ", { size: 20 }), txtB("Esto se puede configurar como un servicio adicional.", { size: 20 })]),
              ]
            })]
          })]
        }),
        blank(),

        divider(),
        blank(),

        // --- Contacto y soporte ---
        heading("Contacto y Soporte", HeadingLevel.HEADING_2),
        p([txt("Para cualquier consulta, modificación o soporte técnico relacionado con la web:")]),
        blank(),
        bullet("Contacte con su agente comercial: Alejandro Villaverde del Tesoro"),
        blank(), blank(),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: sp(200, 100),
          children: [txt("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", { color: AMBER, size: 16 })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: sp(60, 60),
          children: [txt("Taberna Alambique Mairena", { font: "Georgia", size: 24, bold: true, italics: true, color: MUTED })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER, spacing: sp(0, 100),
          children: [txt("Tapas & Vinos · Mairena del Aljarafe", { size: 18, color: MUTED })]
        }),
      ].flat()
    },
  ]
});

// Generate
const outputPath = "C:/Users/jose2/OneDrive/Escritorio/Alambique/Taberna_Alambique_Presentacion_y_Manual.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log("Documento generado: " + outputPath);
});
