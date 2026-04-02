const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak
} = require('docx');
const fs = require('fs');
const path = require('path');

// ─── BRAND ───────────────────────────────────────────────────────────────────
const GOLD   = "D4A017";
const DARK   = "111111";
const GRAY   = "666666";
const LGRAY  = "F5F3EE";
const BORDER = "E0D9CC";
const WHITE  = "FFFFFF";

// ─── NUMBERING ───────────────────────────────────────────────────────────────
const numbering = {
  config: [
    {
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 270 }, spacing: { before: 40, after: 40 } } } }]
    },
    ...Array.from({ length: 20 }, (_, i) => ({
      reference: `num${i + 1}`,
      levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 540, hanging: 270 }, spacing: { before: 40, after: 40 } } } }]
    }))
  ]
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = {
  default: { document: { run: { font: "Arial", size: 24, color: DARK } } },
  paragraphStyles: [
    { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
      run: { font: "Arial", size: 36, bold: true, color: GOLD },
      paragraph: { spacing: { before: 480, after: 160 }, outlineLevel: 0 } },
    { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal",
      run: { font: "Arial", size: 28, bold: true, color: DARK },
      paragraph: { spacing: { before: 320, after: 120 }, outlineLevel: 1 } },
    { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal",
      run: { font: "Arial", size: 24, bold: true, color: GRAY },
      paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
    { id: "Body", name: "Body", basedOn: "Normal",
      run: { font: "Arial", size: 24, color: DARK },
      paragraph: { spacing: { before: 60, after: 120 } } },
    { id: "Note", name: "Note", basedOn: "Normal",
      run: { font: "Arial", size: 20, color: GRAY, italics: true },
      paragraph: { spacing: { before: 60, after: 60 }, indent: { left: 360 } } }
  ]
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const h1 = t => new Paragraph({ style: "Heading1", children: [new TextRun(t)] });
const h2 = t => new Paragraph({ style: "Heading2", children: [new TextRun(t)] });
const h3 = t => new Paragraph({ style: "Heading3", children: [new TextRun(t)] });
const p  = (t, bold = false) => new Paragraph({ style: "Body", children: [new TextRun({ text: t, bold })] });
const pMix = (...parts) => new Paragraph({ style: "Body", children: parts.map(x => typeof x === "string" ? new TextRun(x) : x) });
const note = t => new Paragraph({ style: "Note", children: [new TextRun(t)] });
const sp = () => new Paragraph({ children: [new TextRun("")] });
const bullet = t => new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun(t)] });
const bulletBold = (label, rest) => new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun({ text: label, bold: true }), new TextRun(rest)] });
const num = (t, ref) => new Paragraph({ numbering: { reference: ref, level: 0 }, children: [new TextRun(t)] });
const numBold = (label, rest, ref) => new Paragraph({ numbering: { reference: ref, level: 0 }, children: [new TextRun({ text: label, bold: true }), new TextRun(rest)] });

function makeHeader(docName) {
  return new Header({
    children: [new Paragraph({
      alignment: AlignmentType.RIGHT,
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD } },
      spacing: { after: 0 },
      children: [
        new TextRun({ text: "SHISHA VAPER SEVILLA  ·  ", size: 18, color: GRAY, font: "Arial" }),
        new TextRun({ text: docName.toUpperCase(), size: 18, bold: true, color: DARK, font: "Arial" })
      ]
    })]
  });
}

function makeFooter() {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      border: { top: { style: BorderStyle.SINGLE, size: 2, color: BORDER } },
      spacing: { before: 80 },
      children: [
        new TextRun({ text: "Página ", size: 18, color: GRAY, font: "Arial" }),
        new TextRun({ children: [PageNumber.CURRENT], size: 18, color: GRAY, font: "Arial" }),
        new TextRun({ text: " de ", size: 18, color: GRAY, font: "Arial" }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: GRAY, font: "Arial" })
      ]
    })]
  });
}

function titleBlock(title, subtitle = null) {
  const items = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 120 },
      children: [new TextRun({ text: title, font: "Arial", size: 56, bold: true, color: DARK })]
    })
  ];
  if (subtitle) {
    items.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 480 },
      children: [new TextRun({ text: subtitle, font: "Arial", size: 26, color: GRAY })]
    }));
  }
  items.push(sp());
  return items;
}

const cellBord = { style: BorderStyle.SINGLE, size: 1, color: BORDER };
const borders = { top: cellBord, bottom: cellBord, left: cellBord, right: cellBord };

function makeTable(headers, rows, colWidths) {
  const hRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => new TableCell({
      borders,
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill: DARK, type: ShadingType.CLEAR },
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: h, bold: true, size: 21, color: WHITE, font: "Arial" })] })]
    }))
  });
  const dRows = rows.map(row => new TableRow({
    children: row.map((cell, i) => new TableCell({
      borders,
      width: { size: colWidths[i], type: WidthType.DXA },
      children: [new Paragraph({ children: [new TextRun({ text: cell, size: 22, font: "Arial", color: DARK })] })]
    }))
  }));
  return new Table({ columnWidths: colWidths, margins: { top: 80, bottom: 80, left: 160, right: 160 }, rows: [hRow, ...dRows] });
}

function infoBox(lines) {
  const leftBorder = { style: BorderStyle.SINGLE, size: 16, color: GOLD };
  return new Table({
    columnWidths: [9000],
    margins: { top: 120, bottom: 120, left: 240, right: 240 },
    rows: [new TableRow({ children: [new TableCell({
      borders: { top: cellBord, bottom: cellBord, left: leftBorder, right: cellBord },
      width: { size: 9000, type: WidthType.DXA },
      shading: { fill: LGRAY, type: ShadingType.CLEAR },
      children: lines.map(l => typeof l === "string"
        ? new Paragraph({ children: [new TextRun({ text: l, size: 22, font: "Arial", color: DARK })] })
        : l)
    })] })]
  });
}

function section(props) {
  return [{
    ...props,
    headers: { default: makeHeader(props._headerName || "") },
    footers: { default: makeFooter() },
    properties: { page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } }
  }];
}

// ─── DOCUMENT 1: PROPUESTA COMERCIAL ─────────────────────────────────────────
function buildPropuesta() {
  const children = [
    ...titleBlock("Propuesta Comercial", "Web profesional para Shisha Vaper Sevilla"),

    h1("Qué se ha entregado"),
    p("Se ha desarrollado una web completa y funcional en producción, construida desde cero con la identidad visual del negocio: colores, tipografía y estética extraídos directamente del logo real."),
    pMix(new TextRun({ text: "URL de producción: ", bold: true }), new TextRun({ text: "https://shisha-vaper-web.vercel.app", color: GOLD })),
    sp(),

    h1("Desglose de lo incluido"),

    h2("Landing page pública"),
    h3("Hero con glassmorphism"),
    bullet("Fondo oscuro premium con patrón arabesco"),
    bullet("4 tarjetas flotantes con efecto cristal esmerilado mostrando fotos de producto"),
    bullet("Logo del negocio con anillo dorado luminoso y animaciones de humo"),
    bullet("Dos botones de llamada a la acción: ver productos y consultar por WhatsApp"),
    bullet("Efecto parallax al hacer scroll"),

    h3("Catálogo de productos"),
    bullet("10 productos precargados con categorías, precios, descripción e imágenes"),
    bullet("Filtro por categoría en tiempo real: Shishas, Vapers, Mazas, Accesorios, Líquidos, Cargas"),
    bullet("Efecto 3D al mover el ratón (tilt) — en móvil arrastrar para rotar"),
    bullet("Botón «3D ↺»: visor 3D interactivo en Three.js, arrastrable y animado"),
    bullet("Botón «Pedir» que abre WhatsApp con el nombre del producto ya escrito"),

    h3("Galería fotográfica"),
    bullet("Grid masonry con 12 imágenes"),
    bullet("Hover: zoom + degradado + esquinas doradas"),
    bullet("Enlace directo al Instagram del negocio"),

    h3("Secciones adicionales"),
    bullet("Sección About/Historia con valores de marca"),
    bullet("3 testimoniales con nombre y valoración por estrellas"),
    bullet("Formulario de contacto vía WhatsApp, teléfono, dirección, horario y enlace a Google Maps"),
    bullet("Footer completo: logo, navegación, datos de contacto, Instagram, WhatsApp"),

    h2("Panel de administración"),
    bullet("Dashboard con métricas en tiempo real"),
    bullet("Productos: añadir, editar, eliminar, activar/desactivar, subir fotos por URL"),
    bullet("Ventas: registrar ventas con descuento automático de stock"),
    bullet("Inventario: estado del stock con códigos de color rojo/naranja/verde"),
    bullet("Galería: añadir y eliminar fotos de la web"),
    bullet("Configuración: teléfono, WhatsApp, dirección, horario, contraseña, mensaje WA"),

    h2("SEO y técnico"),
    bullet("Metadatos completos: título, descripción, keywords"),
    bullet("Open Graph (preview en WhatsApp, Facebook, Twitter)"),
    bullet("Schema.org Store — Google entiende que es una tienda en Sevilla"),
    bullet("Sitemap.xml automático y Robots.txt (protege el admin)"),
    bullet("Geolocalización Sevilla en metadatos"),

    h2("Identidad visual"),
    bullet("Colores extraídos del logo real: dorado #D4A017, negro #0D0D0D"),
    bullet("Tipografía Anton (misma del logo) para titulares, Cinzel para etiquetas"),
    bullet("Patrón arabesco/damasco como fondo sutil"),
    bullet("Animaciones acordes al sector: humo dorado, brillo, parallax"),

    sp(),
    h1("Argumentos de venta"),

    h2("1. Visibilidad en Google"),
    p("El 80% de los clientes buscan negocios en Google antes de ir. Sin web, no existen para ese 80%. Esta web tiene SEO técnico completo implementado desde el primer día."),

    h2("2. Diferenciación en el sector"),
    p("La mayoría de tiendas de shisha en Sevilla no tienen web o tienen una básica y desactualizada. Esta es de nivel premium — mismo nivel que marcas internacionales."),

    h2("3. El botón de WhatsApp es un generador de leads"),
    p("Cada visitante que pulse «Consúltanos» abre un chat con el mensaje ya escrito. Sin fricción. El cliente solo tiene que enviar."),

    h2("4. El catálogo online funciona 24/7"),
    p("A las 2 de la mañana, cuando la tienda está cerrada, alguien puede ver los productos, los precios y mandar un WhatsApp. El negocio trabaja mientras el dueño duerme."),

    h2("5. El panel admin es para ellos"),
    p("El cliente puede actualizar precios, añadir productos, cambiar fotos y registrar ventas sin necesitar al programador. Independencia total."),

    h2("6. Los modelos 3D son diferenciales únicos"),
    p("Ninguna tienda de shisha en España tiene visor de producto 3D interactivo. Es un argumento «wow» que se recuerda."),

    sp(),
    h1("Checklist de información pendiente del cliente"),
    note("Entregar esta lista al cliente en la reunión de cierre:"),
    sp(),
    bullet("Número de teléfono del negocio"),
    bullet("Número de WhatsApp de negocio (con prefijo +34)"),
    bullet("Dirección exacta: calle, número, código postal"),
    bullet("Horario de apertura: semana y fin de semana"),
    bullet("Email de contacto (si tienen)"),
    bullet("Nombre del Instagram real"),
    bullet("Fotos reales del negocio (mínimo 5-10 del local y productos)"),
    bullet("Lista de productos reales: nombres, precios y descripciones"),
    bullet("Historia real del negocio: quién lo fundó y por qué"),
    bullet("3-5 reseñas reales de Google para los testimoniales"),
    sp(),
    infoBox(["⏱  Tiempo de actualización con esta información: 1-2 horas desde el panel admin."]),

    sp(),
    h1("Próximos pasos opcionales (upsell)"),
    sp(),
    makeTable(
      ["Mejora", "Precio orientativo", "Impacto"],
      [
        ["Dominio propio (.com/.es)", "12-15 €/año", "Profesionalidad, SEO"],
        ["Google Analytics", "80-120 €", "Ver tráfico y comportamiento"],
        ["Base de datos en la nube", "200-400 €", "Datos seguros y multidevice"],
        ["Sistema de citas/reservas", "200-350 €", "Para sesiones de prueba"],
        ["Tienda online con pago", "400-600 €", "Vender sin presencia física"],
        ["Multiidioma (ES + EN)", "200-300 €", "Para turismo internacional"],
        ["Mantenimiento mensual", "50-80 €/mes", "Actualizaciones y soporte"],
      ],
      [3600, 2880, 2880]
    ),
  ];

  return new Document({
    numbering,
    styles,
    sections: [{
      headers: { default: makeHeader("Propuesta Comercial") },
      footers: { default: makeFooter() },
      properties: { page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
      children
    }]
  });
}

// ─── DOCUMENT 2: MANUAL ADMIN ─────────────────────────────────────────────────
function buildManualAdmin() {
  const children = [
    ...titleBlock("Manual de Administración", "Panel de gestión — Shisha Vaper Sevilla"),

    infoBox([
      "Acceso: https://shisha-vaper-web.vercel.app/admin/login",
      "Contraseña inicial: shisha2025",
      "⚠  Cámbiala desde Configuración nada más entrar."
    ]),
    sp(),

    h1("Acceder al panel"),
    num("Ve a https://shisha-vaper-web.vercel.app/admin/login", "num1"),
    num("Introduce la contraseña.", "num1"),
    num("Pulsa ACCEDER.", "num1"),
    p("Funciona desde cualquier móvil, tablet u ordenador. No necesitas instalar nada."),

    h1("Menú principal"),
    sp(),
    makeTable(
      ["Sección", "Para qué sirve"],
      [
        ["Dashboard", "Resumen rápido de todo"],
        ["Productos", "Gestionar tu catálogo"],
        ["Ventas", "Registrar y ver ventas"],
        ["Inventario", "Ver y ajustar stock"],
        ["Galería", "Fotos que aparecen en la web"],
        ["Configuración", "Datos del negocio y contraseña"],
      ],
      [3000, 6360]
    ),

    h1("Dashboard"),
    p("Página de inicio del panel. Muestra de un vistazo:"),
    bullet("Total de ingresos del mes"),
    bullet("Número de ventas registradas"),
    bullet("Productos con stock bajo o agotado"),
    bullet("Últimos movimientos"),

    h1("Productos — Gestionar el catálogo"),

    h2("Añadir un nuevo producto"),
    num("Pulsa el botón amarillo + AÑADIR PRODUCTO (arriba a la derecha).", "num2"),
    num("Rellena el formulario: nombre, SKU, categoría, precio, precio anterior, stock, descripción, URL imagen.", "num2"),
    num("Marca Activo para que aparezca en la web.", "num2"),
    num("Pulsa GUARDAR.", "num2"),

    h2("Editar un producto existente"),
    num("En la tabla de productos, pulsa el icono del lápiz ✏ en la fila del producto.", "num3"),
    num("Modifica lo que necesites.", "num3"),
    num("Pulsa GUARDAR.", "num3"),

    h2("Activar / Desactivar un producto"),
    p("Si un producto está agotado o temporalmente no disponible, edítalo y desmarca la casilla Activo. Seguirá guardado pero no aparecerá en la web."),

    h2("Cómo añadir fotos a los productos"),
    p("Las fotos se añaden mediante URL (enlace directo a la imagen). Tienes tres opciones:"),
    bulletBold("Opción A — Google Drive: ", "Sube la foto → comparte como «Cualquiera con el enlace» → copia el enlace directo → pégalo en el campo URL imagen."),
    bulletBold("Opción B — imgbb.com: ", "Sube la foto → copia el «Direct link»."),
    bulletBold("Opción C — Instagram: ", "Publica la foto → abre en el navegador → clic derecho en la imagen → «Copiar dirección de imagen»."),

    h1("Ventas — Registrar una venta"),

    h2("¿Para qué sirve?"),
    p("Cada vez que vendes algo en tienda, puedes registrarlo aquí. El sistema guarda el historial, descuenta automáticamente el stock y muestra estadísticas de ingresos."),

    h2("Registrar una venta nueva"),
    num("Pulsa + REGISTRAR VENTA.", "num4"),
    num("Selecciona el producto del desplegable (solo aparecen los activos).", "num4"),
    num("Indica la cantidad vendida (máximo = stock disponible).", "num4"),
    num("El total se calcula solo en tiempo real.", "num4"),
    num("Añade una nota opcional (nombre del cliente, observaciones...).", "num4"),
    num("Pulsa REGISTRAR.", "num4"),
    sp(),
    infoBox(["Nota: Eliminar una venta del registro no devuelve el stock al producto. Si fue un error, ajusta el stock manualmente desde el módulo Inventario."]),

    h1("Inventario — Gestionar el stock"),

    h2("Códigos de color"),
    bullet("Rojo — Agotado (stock = 0)"),
    bullet("Naranja — Stock bajo (1-3 unidades)"),
    bullet("Verde — Stock OK (4 o más)"),

    h2("Actualizar el stock"),
    num("En la columna «Editar stock», cambia el número al stock real.", "num5"),
    num("Pulsa el botón OK que aparece junto al número.", "num5"),
    num("El cambio se guarda inmediatamente y se refleja en la web.", "num5"),

    h1("Galería — Fotos de la web"),

    h2("Añadir una foto"),
    num("Pulsa + AÑADIR IMAGEN.", "num6"),
    num("Pega la URL de la imagen (mismo método que en productos).", "num6"),
    num("Añade un texto descriptivo (alt text) — importante para SEO.", "num6"),
    num("Pulsa AÑADIR.", "num6"),
    p("La foto aparece inmediatamente en la sección Galería de la web pública."),

    h2("Recomendaciones"),
    bullet("Usa fotos propias del negocio siempre que puedas"),
    bullet("Fotos horizontales (landscape) quedan mejor en la galería"),
    bullet("Mínimo recomendado: 800 × 600 px"),
    bullet("Contenido ideal: la tienda, productos en uso, el ambiente, detalles de shishas"),

    h1("Configuración — Datos del negocio"),
    sp(),
    makeTable(
      ["Campo", "Ejemplo", "Dónde aparece"],
      [
        ["Teléfono", "955 12 34 56", "Sección contacto, footer"],
        ["WhatsApp", "34612345678", "Botón «Consúltanos» en toda la web"],
        ["Dirección", "Calle Feria 12, Sevilla", "Sección contacto, footer"],
        ["Horario semana", "Lun-Vie: 10:00-21:00", "Sección contacto"],
        ["Horario fin de semana", "Sáb-Dom: 11:00-22:00", "Sección contacto"],
      ],
      [2520, 2880, 3960]
    ),
    sp(),
    infoBox(["⚠  El WhatsApp es el campo más importante. Sin él, el botón «Consúltanos» no abre WhatsApp directamente. Ponlo con prefijo de país: 34612345678 (sin + ni espacios)."]),

    h2("Cambiar la contraseña del admin"),
    num("En el campo «Nueva contraseña admin», escribe la nueva.", "num7"),
    num("Pulsa GUARDAR CONFIGURACIÓN.", "num7"),
    note("Apúntala en un lugar seguro. Si la pierdes, hay que resetearla desde el código."),

    h1("Preguntas frecuentes"),

    h2("¿Puedo usar el panel desde el móvil?"),
    p("Sí. El panel es responsive y funciona desde cualquier dispositivo con navegador."),

    h2("¿Los cambios se ven en la web al momento?"),
    p("Sí. Cualquier cambio guardado aparece en la web pública de forma inmediata."),

    h2("¿Puedo tener varios usuarios admin?"),
    p("Actualmente hay una sola contraseña de acceso. Si necesitas varios usuarios con permisos diferentes, es una mejora que se puede añadir."),

    h2("¿Dónde se guardan los datos?"),
    p("Los datos se guardan en el navegador del dispositivo que uses para administrar. Para una solución con base de datos en la nube, consulta con tu proveedor."),

    h1("Cerrar sesión"),
    p("Pulsa «Cerrar sesión» en la parte inferior del menú lateral. La sesión también expira al cerrar el navegador."),
  ];

  return new Document({
    numbering,
    styles,
    sections: [{
      headers: { default: makeHeader("Manual de Administración") },
      footers: { default: makeFooter() },
      properties: { page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
      children
    }]
  });
}

// ─── DOCUMENT 3: GUÍA CLIENTE ────────────────────────────────────────────────
function buildGuiaCliente() {
  const children = [
    ...titleBlock("Guía para el Cliente", "Tu nueva web — todo lo que necesitas saber"),

    infoBox([
      "Nota importante: lo que estás viendo ahora es una versión de demostración.",
      "Los precios, fotos y textos son de ejemplo. Tu web definitiva se personaliza con tu información real.",
      "Con tus datos, la actualización completa se hace en 1-2 horas desde el panel admin."
    ]),
    sp(),

    h1("Tus accesos"),
    sp(),
    makeTable(
      ["Qué", "Enlace", "Contraseña"],
      [
        ["Tu web (pública)", "https://shisha-vaper-web.vercel.app", "—"],
        ["Panel de gestión", "https://shisha-vaper-web.vercel.app/admin/login", "shisha2025"],
      ],
      [2400, 4560, 2400]
    ),
    sp(),
    infoBox(["Lo primero que debes hacer: entra al panel admin y cambia la contraseña por una tuya. Ve a Configuración → Nueva contraseña admin."]),

    h1("Cómo funciona tu web"),

    h2("1. La web pública (lo que ven tus clientes)"),
    p("Todo el mundo puede verla sin contraseña. Muestra tus productos con fotos y precios, la galería de imágenes, información de contacto y el botón de WhatsApp para que te escriban directamente."),

    h2("2. El panel de administración (solo para ti)"),
    p("Con tu contraseña puedes gestionar todo el negocio: añadir y actualizar productos, registrar ventas, controlar el stock y cambiar fotos, textos e información."),

    h1("Las 5 cosas más importantes que hacer ahora"),

    h2("1. Actualiza tu número de WhatsApp"),
    p("Sin esto, el botón «Consúltanos» no funciona como debería."),
    num("Ve al panel admin.", "num8"),
    num("Entra en Configuración.", "num8"),
    num("En el campo WhatsApp, escribe tu número SIN espacios NI el +: 34612345678", "num8"),
    num("Pulsa Guardar.", "num8"),

    h2("2. Actualiza tu teléfono y dirección"),
    p("Ve a Configuración y rellena todos los campos vacíos: teléfono, dirección, horario."),

    h2("3. Cambia los productos por los reales"),
    num("Ve a Productos en el panel.", "num9"),
    num("Pulsa el ✏ en cada producto para editarlo.", "num9"),
    num("Cambia el nombre, precio, descripción y foto.", "num9"),
    num("Pulsa Guardar.", "num9"),

    h2("4. Añade fotos reales a la galería"),
    num("Haz una foto desde el móvil.", "num10"),
    num("Súbela a imgbb.com (gratis) y copia el enlace directo.", "num10"),
    num("Ve al panel → Galería → + Añadir imagen.", "num10"),
    num("Pega el enlace y guarda.", "num10"),

    h2("5. Empieza a compartir tu web"),
    p("Comparte el enlace en tus redes, añádelo a la bio de Instagram, ponlo en tu firma de email, imprímelo en tarjetas de visita."),

    h1("Cómo registrar una venta"),
    num("Abre el panel admin.", "num11"),
    num("Ve a Ventas.", "num11"),
    num("Pulsa + Registrar venta.", "num11"),
    num("Selecciona el producto vendido.", "num11"),
    num("Indica cuántas unidades.", "num11"),
    num("El sistema descuenta el stock solo.", "num11"),
    num("Pulsa Registrar.", "num11"),

    h1("Cómo añadir un producto nuevo"),
    num("Ve al panel → Productos.", "num12"),
    num("Pulsa + Añadir producto.", "num12"),
    num("Rellena: nombre, categoría, precio, stock y foto (si tienes).", "num12"),
    num("Marca como Activo para que aparezca en la web.", "num12"),
    num("Guarda.", "num12"),

    h1("Pasos siguientes para crecer"),
    p("Tu web ya está funcionando. Estos son los próximos pasos recomendados para que más clientes te encuentren — ordenados por impacto y sencillez."),

    h2("Dominio propio — tu nombre en Google"),
    p("Ahora mismo tu web tiene la dirección shisha-vaper-web.vercel.app. Es funcional, pero para Google y para tus clientes es mucho más profesional tener un dominio propio como:"),
    bullet("shishavapersevilla.com"),
    bullet("shishavaper.es"),
    bullet("cachimbassevilla.es"),
    sp(),
    infoBox([
      "Precio: desde 12 €/año (dominio .es o .com).",
      "Qué incluye: tu nombre propio en Google, en el navegador y en los enlaces que compartes.",
      "Qué NO cambia: el diseño, las funciones ni el panel admin. Solo la dirección.",
      "Gestión: nosotros nos encargamos de todo — compra, configuración y enlace a la web."
    ]),
    p("Con dominio propio, cuando alguien busca tu nombre en Google aparece directamente tu web. Sin él, aparece el dominio técnico de Vercel."),

    h2("Google My Business — aparecer en el mapa de Google"),
    p("Google My Business es la ficha gratuita que aparece cuando alguien busca «shisha sevilla» en Google. Muestra tu negocio en el mapa, con teléfono, horario, fotos y reseñas."),
    infoBox([
      "Es completamente gratuito.",
      "Sin esta ficha, tu negocio no aparece en Google Maps.",
      "Con ella, puedes aparecer en los 3 primeros resultados del mapa cuando alguien busca «shisha sevilla» o «cachimba sevilla»."
    ]),
    p("Pasos para crear tu perfil de Google My Business:"),
    num("Ve a business.google.com desde el ordenador.", "num13"),
    num("Pulsa «Gestionar ahora» e inicia sesión con tu cuenta de Google.", "num13"),
    num("Escribe el nombre de tu negocio.", "num13"),
    num("Añade la dirección, teléfono, horario y categoría («Tienda de tabaco»).", "num13"),
    num("Sube al menos 5-10 fotos del local y los productos.", "num13"),
    num("Verifica el negocio (Google te envía un código por correo o llamada).", "num13"),
    sp(),
    note("Si prefieres que lo hagamos nosotros, pregunta por el servicio de configuración de Google My Business."),

    h2("Consigue tus primeras reseñas en Google"),
    p("Google posiciona más arriba a los negocios con más reseñas recientes y positivas. Un negocio con 20 reseñas a 4,5 estrellas aparece antes que uno con 3 reseñas a 5 estrellas."),
    p("Cómo conseguir reseñas de forma natural:"),
    bullet("Pide a tus clientes habituales que te dejen una reseña en Google (un simple mensaje de WhatsApp funciona muy bien)"),
    bullet("Imprime o guarda el enlace directo a tu ficha de Google y compártelo"),
    bullet("Responde siempre a las reseñas — tanto positivas como negativas — muestra que te importa el cliente"),
    infoBox(["Objetivo mínimo: 10 reseñas en los primeros 3 meses. Con eso ya empiezas a mejorar tu posición en Google."]),

    h2("WhatsApp Business — versión profesional gratuita"),
    p("Si gestionas el WhatsApp del negocio desde tu teléfono personal, te recomendamos pasarte a WhatsApp Business. Es gratuito y añade funcionalidades específicas para negocios:"),
    bullet("Perfil de empresa con dirección, horario y descripción"),
    bullet("Respuestas automáticas cuando estás cerrado o tardas en contestar"),
    bullet("Etiquetas para organizar conversaciones (pedidos, consultas, clientes habituales)"),
    bullet("Catálogo de productos integrado en el chat"),
    p("Descarga WhatsApp Business desde la App Store o Google Play. Puedes usarlo con el mismo número que ya tienes."),

    h1("Preguntas frecuentes"),

    h2("¿Necesito saber informática?"),
    p("No. Si sabes usar WhatsApp o Instagram, puedes gestionar esta web."),

    h2("¿La web se ve bien en el móvil?"),
    p("Sí, perfectamente. Fue diseñada primero para móvil."),

    h2("¿Cuánto cuesta el hosting?"),
    p("El hosting en Vercel es gratuito. Si contratas un dominio propio (.com o .es), ese tiene un coste de unos 12 €/año. No hay ningún otro pago mensual obligatorio."),

    h2("¿Mis clientes pueden comprar directamente?"),
    p("Por ahora no. Los clientes ven los productos y te escriben por WhatsApp. Si quisieras añadir tienda online con carrito y pago, es una mejora que se puede presupuestar."),

    h2("¿Qué pasa si me equivoco al cambiar algo?"),
    p("Siempre puedes volver a cambiar cualquier campo. Nada es irreversible excepto eliminar un producto (pero puedes añadirlo de nuevo)."),

    h2("¿Cómo saben los clientes que mi web existe?"),
    p("De varias formas: cuando buscas en Google (el SEO tarda unos meses en dar resultados), cuando compartes el enlace en Instagram o WhatsApp, y cuando tengas tu ficha de Google My Business activa y aparezcas en el mapa."),

    h1("Checklist de puesta en marcha"),
    p("Marca cada punto cuando lo hayas completado:"),
    sp(),
    p("Paso 1 — Configuración básica (día 1):"),
    bullet("He cambiado la contraseña del admin"),
    bullet("He añadido mi número de WhatsApp en Configuración"),
    bullet("He añadido mi teléfono y dirección en Configuración"),
    bullet("He añadido el horario en Configuración"),
    sp(),
    p("Paso 2 — Contenido real (primera semana):"),
    bullet("He actualizado los productos con los reales (nombres, precios, fotos)"),
    bullet("He añadido fotos reales a la galería"),
    bullet("He compartido el enlace en mis redes sociales"),
    bullet("He añadido el enlace a la bio de Instagram"),
    sp(),
    p("Paso 3 — Crecer en Google (primer mes):"),
    bullet("He contratado un dominio propio (.com o .es) — desde 12 €/año"),
    bullet("He creado mi perfil en Google My Business (gratuito)"),
    bullet("He pedido a mis primeros clientes que dejen una reseña en Google"),
    bullet("He instalado WhatsApp Business en mi teléfono"),
    sp(),
    infoBox([
      "Con los pasos 1 y 2 completados, tu web estará al 100% personalizada.",
      "Con el paso 3, empezarás a aparecer en Google y a atraer clientes nuevos."
    ]),
  ];

  return new Document({
    numbering,
    styles,
    sections: [{
      headers: { default: makeHeader("Guía para el Cliente") },
      footers: { default: makeFooter() },
      properties: { page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
      children
    }]
  });
}

// ─── DOCUMENT 4: PLAN POSICIONAMIENTO GOOGLE ─────────────────────────────────
function buildPlanGoogle() {
  const children = [
    ...titleBlock("Plan de Posicionamiento en Google", "Estrategia de comercialización — Shisha Vaper Sevilla · Abril 2026"),
    infoBox(["Documento para uso interno de Alejandro y presentación al cliente."]),
    sp(),

    h1("Por qué Google es clave para este negocio"),
    p("Cuando alguien en Sevilla quiere una shisha o un vaper, lo primero que hace es buscarlo en Google. No en Instagram. No en TikTok. En Google."),
    p("Búsquedas frecuentes para este negocio:"),
    bullet("«shisha sevilla» — ~200 búsquedas/mes"),
    bullet("«cachimba sevilla» — ~150 búsquedas/mes"),
    bullet("«tienda vaper sevilla» — ~100 búsquedas/mes"),
    bullet("«comprar shisha sevilla» — ~80 búsquedas/mes"),
    bullet("«hookah sevilla» — ~70 búsquedas/mes"),
    bullet("«accesorios shisha sevilla» — ~50 búsquedas/mes"),
    sp(),
    p("Cada una de esas búsquedas es un cliente potencial con intención de compra real. Si el negocio no aparece, ese cliente va a la competencia."),
    p("La web ya tiene SEO técnico implementado. Ese es el punto de partida. Para dominar Google en Sevilla hace falta una estrategia activa en tres pilares."),

    h1("Pilar 1 — Google My Business"),

    h2("Qué es"),
    p("La ficha que aparece en Google cuando alguien busca el negocio: nombre, dirección, teléfono, horario, fotos, reseñas y botón de llamada. Es completamente gratuito y es lo primero que hay que hacer."),
    p("Sin perfil de Google My Business, el negocio no aparece en Google Maps ni en el panel lateral de búsqueda."),

    h2("Qué incluye un perfil bien optimizado"),
    bullet("Nombre, dirección y teléfono verificados"),
    bullet("Horario actualizado (incluyendo festivos)"),
    bullet("Categoría principal: «Tienda de tabaco» / «Tienda de vaporizadores»"),
    bullet("Descripción del negocio con palabras clave"),
    bullet("Mínimo 10 fotos de calidad (interior, exterior, productos)"),
    bullet("Enlace a la web y respuesta activa a reseñas"),

    h2("Impacto esperado"),
    p("Con un perfil bien optimizado, el negocio puede aparecer en el «Local Pack» de Google — los 3 resultados que aparecen en el mapa. Esos 3 resultados se llevan el 70% de los clics."),

    h2("Precios"),
    sp(),
    makeTable(
      ["Servicio", "Precio", "Resultado visible"],
      [
        ["Setup inicial GMB (único)", "150 €", "2-4 semanas"],
        ["GMB Setup + Gestión mensual", "150 € + 80 €/mes", "1-3 meses"],
      ],
      [4500, 2430, 2430]
    ),
    sp(),
    infoBox(["El setup incluye: creación y verificación del perfil, optimización completa, 15-20 fotos optimizadas, integración con la web y guía para responder reseñas."]),

    h1("Pilar 2 — SEO Orgánico"),

    h2("Qué es"),
    p("Trabajar para que la web aparezca en la primera página de Google de forma orgánica (sin publicidad). Una vez posicionado, el tráfico es gratuito y continuo. Tarda entre 3 y 6 meses en dar resultados visibles."),

    h2("La web ya tiene la base técnica"),
    bullet("Schema.org Store — Google entiende que es una tienda física en Sevilla"),
    bullet("Meta tags optimizados: título, descripción, keywords"),
    bullet("Open Graph para compartir en redes"),
    bullet("Sitemap.xml automático y Robots.txt correcto"),
    bullet("Velocidad de carga optimizada con Next.js"),
    bullet("URLs limpias y semánticas"),

    h2("Palabras clave objetivo"),
    sp(),
    makeTable(
      ["Palabra clave", "Búsquedas/mes", "Dificultad"],
      [
        ["shisha sevilla", "~200", "Baja"],
        ["cachimba sevilla", "~150", "Baja"],
        ["tienda vaper sevilla", "~100", "Media"],
        ["comprar shisha sevilla", "~80", "Baja"],
        ["hookah sevilla", "~70", "Baja"],
        ["accesorios shisha sevilla", "~50", "Muy baja"],
        ["maza al fakher sevilla", "~40", "Muy baja"],
      ],
      [3960, 2700, 2700]
    ),
    sp(),
    infoBox(["Las búsquedas locales con «sevilla» tienen poca competencia porque pocas tiendas del sector tienen web optimizada. Es una oportunidad clara."]),

    h2("Planes de SEO orgánico"),
    sp(),
    makeTable(
      ["Plan", "Precio", "Incluye"],
      [
        ["SEO Básico", "200 €/mes", "Auditoría mensual, 2 artículos optimizados/mes, optimización de productos, informe mensual"],
        ["SEO Completo", "350 €/mes", "Todo lo básico + 4 artículos/mes, link building 5 enlaces/mes, páginas de aterrizaje, Google Analytics 4, reunión mensual"],
      ],
      [2520, 1800, 5040]
    ),
    sp(),
    note("Duración mínima recomendada: 6 meses en ambos planes."),

    h1("Pilar 3 — Google Ads"),

    h2("Qué es"),
    p("Anuncios de pago que aparecen en la primera posición de Google de forma inmediata. El negocio paga solo cuando alguien hace clic en el anuncio. Resultados desde el primer día."),

    h2("Estimación de coste por clic (CPC)"),
    sp(),
    makeTable(
      ["Búsqueda", "CPC estimado", "Conversión estimada"],
      [
        ["«shisha sevilla»", "0,30 – 0,80 €", "5-12%"],
        ["«vaper sevilla»", "0,50 – 1,20 €", "4-10%"],
        ["«tienda cachimba sevilla»", "0,25 – 0,60 €", "6-15%"],
        ["«comprar maza shisha»", "0,20 – 0,50 €", "8-18%"],
      ],
      [3240, 2760, 3360]
    ),

    h2("Planes de Google Ads"),
    sp(),
    makeTable(
      ["Plan", "Setup", "Mensual total", "Incluye"],
      [
        ["Básico", "150 €", "~270 €/mes", "Campaña búsqueda local, palabras clave, 3-5 anuncios, seguimiento conversiones, informe quincenal"],
        ["Avanzado", "150 €", "~480 €/mes", "Todo lo básico + remarketing, display, test A/B, optimización semanal, informe semanal"],
      ],
      [1560, 1200, 1800, 4800]
    ),
    sp(),
    note("Básico: 150 € presupuesto + 120 € gestión. Avanzado: 300 € presupuesto + 180 € gestión."),

    h1("Estrategia según presupuesto"),

    h2("Presupuesto ajustado — menos de 200 €/mes"),
    bullet("Google My Business setup (150 € único)"),
    bullet("Resultado: aparece en Google Maps y es visible localmente en 2-4 semanas"),

    h2("Presupuesto medio — 300-400 €/mes"),
    bullet("Mes 1: GMB setup (150 €) + Google Ads básico (150 € presupuesto + 120 € gestión)"),
    bullet("Mes 3 en adelante: mantener Ads + añadir SEO básico (200 €/mes) y reducir Ads gradualmente"),

    h2("Presupuesto óptimo — 500-700 €/mes"),
    bullet("Mes 1: GMB setup + Google Ads avanzado — domina búsquedas locales desde el día 1"),
    bullet("Mes 3-6: mantener Ads (reducir progresivamente) + SEO completo (350 €/mes)"),
    bullet("Resultado final: posicionamiento sólido con coste decreciente al mes 6"),

    h1("ROI estimado"),

    h2("Escenario conservador — presupuesto ajustado"),
    sp(),
    makeTable(
      ["Concepto", "Valor"],
      [
        ["Inversión mensual en Google Ads", "150 €"],
        ["Clics estimados (CPC 0,50 €)", "300 clics"],
        ["Tasa de conversión a consulta", "8% = 24 consultas"],
        ["Tasa de cierre (consulta→venta)", "40% = 10 ventas"],
        ["Ticket medio", "45 €"],
        ["Ingresos atribuibles", "450 €"],
        ["Inversión total (ads + gestión)", "270 €"],
        ["RETORNO", "1,67x ROI"],
      ],
      [5400, 3960]
    ),

    h2("Escenario optimista — presupuesto medio (mes 3)"),
    sp(),
    makeTable(
      ["Concepto", "Valor"],
      [
        ["Inversión mensual en Google Ads", "300 €"],
        ["Clics estimados (CPC 0,45 € opt.)", "667 clics"],
        ["Tasa de conversión", "10% = 67 consultas"],
        ["Tasa de cierre", "45% = 30 ventas"],
        ["Ticket medio", "55 €"],
        ["Ingresos atribuibles", "1.650 €"],
        ["Inversión total (ads + gestión)", "480 €"],
        ["RETORNO", "3,4x ROI"],
      ],
      [5400, 3960]
    ),
    sp(),
    note("Estimaciones orientativas. Los resultados reales se ajustan mes a mes basándose en datos reales."),

    h1("Resumen de precios"),
    sp(),
    makeTable(
      ["Servicio", "Setup", "Mensual", "Tiempo para ver resultados"],
      [
        ["Google My Business (setup)", "150 €", "—", "2-4 semanas"],
        ["GMB Setup + Gestión", "150 €", "80 €", "1-3 meses"],
        ["SEO básico", "—", "200 €", "3-6 meses"],
        ["SEO completo", "—", "350 €", "3-6 meses"],
        ["Google Ads básico", "150 €", "120 € + 150 € presup.", "Inmediato"],
        ["Google Ads avanzado", "150 €", "180 € + 300 € presup.", "Inmediato"],
        ["Pack recomendado inicial", "300 €", "270 €", "Inmediato + largo plazo"],
      ],
      [2880, 1440, 2400, 2640]
    ),
    sp(),
    infoBox([
      "Pack recomendado mes 1:",
      "· Google My Business setup: 150 € (único)",
      "· Google Ads setup: 150 € (único)",
      "· Setup total: 300 €",
      "· Mensual (Ads gestión + presupuesto + GMB): 350 €/mes",
      "A partir del mes 4: añadir SEO básico (+200 €) y reducir Ads progresivamente."
    ]),

    h1("Argumentos para el cliente"),
    h3("«¿Para qué sirve GMB si ya tengo Instagram?»"),
    p("Instagram te muestra a quienes ya te siguen. Google My Business te muestra a personas que en este momento están buscando «tienda shisha sevilla». Son clientes con intención de compra, no seguidores pasivos. Y es gratis."),
    h3("«El SEO tarda mucho»"),
    p("Por eso empezamos con Google Ads para tener resultados inmediatos mientras el SEO crece. Es como plantar un árbol mientras tienes la cosecha del invernadero."),
    h3("«Google Ads es caro»"),
    p("Si gastas 270 €/mes y consigues 10 ventas de 45 € media, estás ganando 450 €. Eso es un 67% de retorno. ¿Conoces otra inversión que te dé un 67% mensual?"),
    h3("«Ya aparezco en Google»"),
    p("Aparecer en la página 3 de Google es como no aparecer. El 92% de los clics van a la primera página. El 67% van a los 3 primeros resultados."),
  ];

  return new Document({
    numbering,
    styles,
    sections: [{
      headers: { default: makeHeader("Plan Posicionamiento Google") },
      footers: { default: makeFooter() },
      properties: { page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
      children
    }]
  });
}

// ─── DOCUMENT 5: PRECIOS ─────────────────────────────────────────────────────
function buildPrecios() {
  const children = [
    ...titleBlock("Precios del Servicio", "Referencia interna — Shisha Vaper Sevilla"),

    h1("Proyecto entregado"),
    sp(),
    makeTable(
      ["Concepto", "Precio"],
      [
        ["Web base: Landing + Admin Panel", "800 €"],
        ["Visor 3D de productos", "+150 €"],
        ["SEO técnico completo", "Incluido"],
        ["Identidad visual desde logo", "Incluido"],
        ["Canal WhatsApp integrado", "Incluido"],
        ["Hosting Vercel", "GRATUITO"],
        ["Dominio Vercel (*.vercel.app)", "GRATUITO"],
        ["TOTAL PROYECTO", "950 € (pago único)"],
      ],
      [6360, 3000]
    ),
    sp(),

    h2("Qué incluye el precio"),
    bullet("Diseño completo de identidad visual desde el logo real del negocio"),
    bullet("Landing page con todas las secciones: hero, productos, galería, about, testimonios, contacto"),
    bullet("Panel de administración completo: productos, ventas, inventario, galería, configuración"),
    bullet("Modelos 3D interactivos de productos (shisha + vaper) en Three.js"),
    bullet("Efectos glassmorphism, parallax, animaciones"),
    bullet("SEO técnico: Schema.org, Open Graph, Sitemap, meta tags"),
    bullet("Botón canal WhatsApp"),
    bullet("Deploy en Vercel (dominio gratuito)"),
    bullet("Documentación completa (este paquete de docs)"),

    h2("Qué NO incluye"),
    bullet("Dominio propio (ej: shishavapersevilla.com) — ~12-15 €/año aparte"),
    bullet("Google Analytics — cotizar aparte"),
    bullet("Cambios de diseño tras la entrega — cotizar aparte"),
    bullet("Base de datos en la nube — cotizar aparte"),

    h1("Mantenimiento mensual (opcional)"),
    sp(),
    makeTable(
      ["Plan", "Precio", "Incluye"],
      [
        ["Básico", "50 €/mes", "Hosting garantizado, actualizaciones técnicas, soporte WhatsApp <24h, 1h de cambios/mes, copia de seguridad mensual"],
        ["Premium", "80 €/mes", "Todo lo básico + 3h de cambios/mes, actualización de productos, reporte mensual de rendimiento, Google Analytics incluido, prioridad en atención"],
      ],
      [1800, 1800, 5760]
    ),
    sp(),
    infoBox(["Sin mantenimiento, el cliente puede gestionar todo desde el admin sin coste. El mantenimiento es para quien quiere delegar completamente."]),

    h1("Extras y ampliaciones"),
    sp(),
    makeTable(
      ["Servicio", "Precio"],
      [
        ["Dominio propio (.com/.es)", "12-15 €/año"],
        ["Google Analytics", "80-120 € (único)"],
        ["Base de datos en la nube (Firebase/Supabase)", "200-400 €"],
        ["Sistema de citas/reservas online", "200-350 €"],
        ["Tienda online sin pasarela de pago", "200-300 €"],
        ["Tienda online con Stripe/PayPal", "400-600 €"],
        ["Multiidioma (español + inglés)", "200-300 €"],
        ["Integración feed Instagram en vivo", "150-250 €"],
        ["Blog/noticias", "150-200 €"],
        ["Cambios de diseño", "40-60 €/hora"],
      ],
      [6360, 3000]
    ),

    h1("Comparativa de valor"),
    sp(),
    makeTable(
      ["Tipo de servicio", "Precio", "Incluye"],
      [
        ["Plantilla Wix/Squarespace", "15-30 €/mes", "Plantilla genérica, sin admin propio, sin 3D"],
        ["Freelance básico", "400-800 €", "Sin admin, sin SEO, sin personalización"],
        ["Agencia digital", "2.000-8.000 €", "Lo mismo que nosotros pero mucho más caro"],
        ["Nosotros", "950 €", "Diseño único, admin completo, 3D, SEO, soporte"],
      ],
      [2880, 1800, 4680]
    ),

    h1("Argumentos para justificar el precio"),

    h2("«950 € es mucho dinero»"),
    p("Un cliente que te encuentra en Google y entra a la tienda vale de media 30-80 € en ticket. Con que la web te traiga 15-30 clientes nuevos al año ya está amortizada."),

    h2("«Con Instagram ya tengo suficiente»"),
    p("Instagram te da visibilidad a quienes ya te siguen. Google te da clientes que aún no te conocen y están buscando exactamente lo que tú vendes en Sevilla ahora mismo."),

    h2("«Puedo hacerlo yo mismo con Wix»"),
    p("Puedes. Pero una web en Wix tiene el logo de Wix, se ve genérica, no tiene admin de inventario, no tiene 3D y no está optimizada para Google. Esta web se ve como una marca premium porque lo es."),
  ];

  return new Document({
    numbering,
    styles,
    sections: [{
      headers: { default: makeHeader("Precios del Servicio") },
      footers: { default: makeFooter() },
      properties: { page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
      children
    }]
  });
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
const outDir = __dirname;

async function main() {
  const docs = [
    { doc: buildPropuesta(),    file: "PROPUESTA_COMERCIAL.docx" },
    { doc: buildManualAdmin(),  file: "MANUAL_ADMIN.docx" },
    { doc: buildGuiaCliente(),  file: "GUIA_CLIENTE.docx" },
    { doc: buildPlanGoogle(),   file: "PLAN_POSICIONAMIENTO_GOOGLE.docx" },
    { doc: buildPrecios(),      file: "PRECIOS.docx" },
  ];

  for (const { doc, file } of docs) {
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(path.join(outDir, file), buffer);
    console.log(`✓ ${file}`);
  }
  console.log("Todos los documentos generados.");
}

main().catch(console.error);
