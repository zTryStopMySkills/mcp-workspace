const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, Header, Footer,
  AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType, VerticalAlign,
  PageNumber, PageBreak, ExternalHyperlink } = require('docx');

const GOLD = "D4A847";
const DARK = "1A1A1A";
const GRAY = "4A4A4A";
const LIGHT_GRAY = "888888";
const WHITE = "FFFFFF";
const GOLD_BG = "FDF8ED";
const GRAY_BG = "F5F5F5";
const BLUE_BG = "EBF5FF";
const GREEN_BG = "ECFDF5";

const noBorder = { style: BorderStyle.NONE, size: 0, color: WHITE };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" };
const thinBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

let bulletRefCount = 0;
function newBulletRef() { return `bl-${++bulletRefCount}`; }
const bulletRefs = [];
for (let i = 0; i < 40; i++) {
  bulletRefs.push({ reference: `bl-${i+1}`, levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] });
}
let numberedRefCount = 0;
function newNumberRef() { return `nl-${++numberedRefCount}`; }
const numberedRefs = [];
for (let i = 0; i < 20; i++) {
  numberedRefs.push({ reference: `nl-${i+1}`, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] });
}

function emptyLine(s = 200) { return new Paragraph({ spacing: { before: s, after: 0 }, children: [] }); }
function sectionTitle(num, text) {
  return new Paragraph({ spacing: { before: 360, after: 100 }, children: [
    new TextRun({ text: `${num}. `, color: GOLD, size: 30, bold: true, font: "Georgia" }),
    new TextRun({ text: text.toUpperCase(), color: DARK, size: 30, bold: true, font: "Georgia" }),
  ] });
}
function subTitle(text) {
  return new Paragraph({ spacing: { before: 280, after: 120 }, children: [
    new TextRun({ text, color: DARK, size: 24, bold: true, font: "Georgia" }),
  ] });
}
function goldDivider() {
  return new Paragraph({ spacing: { before: 60, after: 120 }, border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: GOLD, space: 1 } }, children: [] });
}
function body(text) {
  return new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text, color: GRAY, size: 21, font: "Arial" })] });
}
function bullet(text, ref) {
  return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 50 }, children: [new TextRun({ text, color: GRAY, size: 21, font: "Arial" })] });
}
function step(num, text, ref) {
  return new Paragraph({ numbering: { reference: ref, level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text, color: GRAY, size: 21, font: "Arial" })] });
}
function tipBox(text, bgColor = GOLD_BG, borderColor = GOLD, label = "Consejo") {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    shading: { fill: bgColor, type: ShadingType.CLEAR },
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: borderColor, space: 8 } },
    indent: { left: 200 },
    children: [
      new TextRun({ text: `  ${label}: `, color: borderColor, size: 21, bold: true, font: "Arial" }),
      new TextRun({ text, color: GRAY, size: 21, font: "Arial" }),
    ]
  });
}

// ============ BUILD ============
const doc = new Document({
  styles: { default: { document: { run: { font: "Arial", size: 22, color: GRAY } } } },
  numbering: { config: [...bulletRefs, ...numberedRefs] },
  sections: [
    // ====== PORTADA ======
    {
      properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: [
        emptyLine(2400),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [
          new TextRun({ text: "HAKUNA BAR", color: GOLD, size: 52, bold: true, font: "Georgia" }),
        ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 1 } }, children: [] }),
        emptyLine(200),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [
          new TextRun({ text: "GUÍA DE USO", color: DARK, size: 40, bold: true, font: "Georgia" }),
        ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [
          new TextRun({ text: "Panel de Administración", color: LIGHT_GRAY, size: 26, italics: true, font: "Georgia" }),
        ] }),
        emptyLine(800),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [
          new TextRun({ text: "Versión 1.0  —  Marzo 2026", color: LIGHT_GRAY, size: 20, font: "Arial" }),
        ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 }, children: [
          new ExternalHyperlink({ children: [new TextRun({ text: "https://hakuna-admin.vercel.app", color: GOLD, size: 20, font: "Arial", underline: { type: "single" } })], link: "https://hakuna-admin.vercel.app" }),
        ] }),
      ]
    },
    // ====== CONTENIDO ======
    {
      properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      headers: {
        default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
          new TextRun({ text: "Guía de Uso — Hakuna Bar Admin", color: LIGHT_GRAY, size: 16, italics: true, font: "Arial" }),
        ] })] })
      },
      footers: {
        default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD", space: 4 } }, spacing: { before: 100 }, children: [
          new TextRun({ text: "Hakuna Bar", color: GOLD, size: 16, bold: true, font: "Arial" }),
          new TextRun({ text: "  |  Página ", color: LIGHT_GRAY, size: 16, font: "Arial" }),
          new TextRun({ children: [PageNumber.CURRENT], color: LIGHT_GRAY, size: 16 }),
          new TextRun({ text: " de ", color: LIGHT_GRAY, size: 16, font: "Arial" }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], color: LIGHT_GRAY, size: 16 }),
        ] })] })
      },
      children: [
        // === ÍNDICE ===
        sectionTitle("", "Índice de Contenidos"),
        goldDivider(),
        ...[
          ["1", "Acceso al Panel de Administración"],
          ["2", "Dashboard — Vista General"],
          ["3", "Gestión de la Carta (Platos)"],
          ["4", "Gestión de Categorías"],
          ["5", "Menú del Día"],
          ["6", "Datos del Negocio"],
          ["7", "Gestión de la Galería"],
          ["8", "Gestión de Reseñas"],
          ["9", "Generador de Códigos QR"],
          ["10", "Preguntas Frecuentes"],
        ].map(([n, t]) => new Paragraph({
          spacing: { after: 60 },
          tabStops: [{ type: "right", position: 9000 }],
          children: [
            new TextRun({ text: `${n}.  `, color: GOLD, size: 22, bold: true, font: "Arial" }),
            new TextRun({ text: t, color: DARK, size: 22, font: "Arial" }),
          ]
        })),

        // =============================================
        // 1. ACCESO
        // =============================================
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("1", "Acceso al Panel de Administración"),
        goldDivider(),
        body("Para acceder al panel de administración de Hakuna Bar, siga estos pasos:"),
        (() => { const r = newNumberRef(); return [
          step(1, "Abra su navegador web (Chrome, Safari, Firefox o Edge) desde cualquier dispositivo (ordenador, móvil o tablet).", r),
          step(2, "Escriba en la barra de direcciones: https://hakuna-admin.vercel.app", r),
          step(3, "Introduzca su usuario y contraseña en la pantalla de inicio de sesión.", r),
          step(4, "Pulse \"Entrar al panel\" para acceder.", r),
        ]; })().flat(),
        tipBox("Guarde la dirección en los favoritos de su navegador para acceder más rápidamente."),
        tipBox("Puede acceder desde su teléfono móvil en cualquier momento y lugar.", GREEN_BG, "10B981", "Recuerde"),

        // =============================================
        // 2. DASHBOARD
        // =============================================
        sectionTitle("2", "Dashboard — Vista General"),
        goldDivider(),
        body("El Dashboard es la primera pantalla que verá al acceder. Muestra un resumen completo del estado de su negocio digital:"),
        subTitle("Tarjetas de estadísticas"),
        (() => { const r = newBulletRef(); return [
          bullet("Total de Platos: número total de platos en su carta", r),
          bullet("Categorías Activas: cuántas categorías están visibles para los clientes", r),
          bullet("Platos Recomendados: cuántos platos tienen la marca de \"Recomendado por el chef\"", r),
          bullet("Precio Medio: la media de precios de toda su carta", r),
          bullet("Platos Agotados: cuántos platos están marcados como no disponibles", r),
          bullet("Menú del Día: si el menú del día está activo o inactivo", r),
        ]; })().flat(),
        subTitle("Panel de platos agotados"),
        body("Si hay platos marcados como agotados, aparecerá una sección especial con un botón \"Reponer\" junto a cada uno. Pulse ese botón para volver a marcar el plato como disponible."),
        subTitle("Acciones rápidas"),
        body("Desde el dashboard puede acceder directamente a: Añadir un nuevo plato, Gestionar la carta o Gestionar categorías."),

        // =============================================
        // 3. GESTIÓN DE LA CARTA
        // =============================================
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("3", "Gestión de la Carta (Platos)"),
        goldDivider(),
        body("Esta es la sección principal donde gestiona todos los platos de su carta. Acceda desde el menú lateral pulsando \"Platos\"."),

        subTitle("Añadir un nuevo plato"),
        (() => { const r = newNumberRef(); return [
          step(1, "Pulse el botón dorado \"Añadir plato\" en la esquina superior derecha.", r),
          step(2, "Rellene los campos del formulario:", r),
        ]; })().flat(),
        (() => { const r = newBulletRef(); return [
          bullet("Nombre del plato (obligatorio)", r),
          bullet("Categoría: seleccione de la lista desplegable (obligatorio)", r),
          bullet("Descripción: ingredientes y forma de preparación (obligatorio)", r),
          bullet("Precio en euros (obligatorio)", r),
          bullet("Imagen: pegue una URL de imagen o pulse \"Subir imagen\" para elegir una foto de su móvil/ordenador", r),
          bullet("Valoración: mueva el deslizador entre 0 y 5 estrellas", r),
          bullet("Nivel de picante: seleccione de 0 (sin picante) a 3 (muy picante)", r),
          bullet("Alérgenos: pulse sobre cada alérgeno que contenga el plato (los 14 del reglamento europeo)", r),
        ]; })().flat(),
        (() => { const r = newNumberRef(); return [
          step(3, "Active las opciones que desee: Recomendado por el chef, Novedad, Activo, Agotado temporalmente.", r),
          step(4, "Pulse \"Crear plato\" para guardarlo.", r),
        ]; })().flat(),
        tipBox("Las fotos subidas desde el móvil se redimensionan automáticamente. Para mejores resultados, use fotos horizontales."),

        subTitle("Editar un plato existente"),
        body("En la lista de platos, pulse el icono del lápiz junto al plato que desee modificar. Se abrirá el mismo formulario con los datos actuales. Modifique lo que necesite y pulse \"Guardar cambios\"."),

        subTitle("Marcar plato como agotado"),
        body("Esta es la función más usada en el día a día. Cuando se agote un plato durante el servicio:"),
        (() => { const r = newNumberRef(); return [
          step(1, "En la lista de platos (vista tabla), busque el plato.", r),
          step(2, "Pulse el botón \"Disponible\" en la columna \"Agotado\".", r),
          step(3, "Cambiará a rojo \"AGOTADO\" y los clientes verán el plato marcado como no disponible en la web.", r),
        ]; })().flat(),
        tipBox("También puede reponer platos desde el Dashboard: en el panel de \"Platos agotados\", pulse \"Reponer\".", GREEN_BG, "10B981", "Atajo"),

        subTitle("Eliminar un plato"),
        body("Pulse el icono de la papelera junto al plato. Aparecerá una ventana de confirmación. Pulse \"Eliminar\" para confirmar. Esta acción no se puede deshacer."),

        subTitle("Alérgenos (obligatorio por ley)"),
        body("Al crear o editar un plato, verá una cuadrícula con los 14 alérgenos regulados por la normativa europea (Reglamento UE 1169/2011). Pulse sobre cada alérgeno que contenga el plato para activarlo (se pondrá en dorado). Los alérgenos seleccionados se mostrarán como iconos en la ficha del plato en la web pública."),
        tipBox("Es obligatorio por ley informar de los alérgenos de cada plato. Asegúrese de mantener esta información actualizada.", "FFF5F5", "CC4444", "Importante legal"),

        // =============================================
        // 4. CATEGORÍAS
        // =============================================
        sectionTitle("4", "Gestión de Categorías"),
        goldDivider(),
        body("Las categorías organizan su carta (Entrantes, Carnes, Postres, etc.). Acceda desde \"Categorías\" en el menú lateral."),
        subTitle("Crear categoría"),
        (() => { const r = newNumberRef(); return [
          step(1, "Pulse \"Nueva categoría\".", r),
          step(2, "Introduzca: nombre, descripción breve, y seleccione un emoji como icono.", r),
          step(3, "Active o desactive según necesite.", r),
          step(4, "Pulse \"Crear categoría\".", r),
        ]; })().flat(),
        subTitle("Reordenar categorías"),
        body("Use las flechas arriba/abajo a la izquierda de cada categoría para cambiar el orden en que aparecen en la carta del cliente."),
        subTitle("Editar o eliminar"),
        body("Pulse el lápiz para editar o la papelera para eliminar. Si una categoría tiene platos asignados, recibirá un aviso antes de poder eliminarla."),

        // =============================================
        // 5. MENÚ DEL DÍA
        // =============================================
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("5", "Menú del Día"),
        goldDivider(),
        body("Configure el menú del día que se mostrará a sus clientes. Acceda desde \"Menú del Día\" en el menú lateral."),
        subTitle("Configurar el menú"),
        (() => { const r = newNumberRef(); return [
          step(1, "Active el menú con el interruptor \"Menú del día activo\".", r),
          step(2, "Seleccione la fecha (por defecto es el día de hoy).", r),
          step(3, "Establezca el precio del menú completo.", r),
          step(4, "Añada los platos en cada sección: Primeros, Segundos y Postres.", r),
          step(5, "Para añadir un plato: escriba el nombre y opcionalmente una descripción, y pulse el botón +.", r),
          step(6, "Active o desactive \"Incluye bebida\" e \"Incluye pan\" según corresponda.", r),
          step(7, "Añada notas opcionales (ej: \"Disponible de 13:00 a 16:00\").", r),
          step(8, "Pulse \"Guardar menú del día\".", r),
        ]; })().flat(),
        tipBox("Puede desactivar el menú del día los fines de semana o días que no lo ofrezca sin borrar la configuración."),
        subTitle("Vista previa"),
        body("Pulse \"Ver vista previa\" para ver cómo se mostrará el menú a los clientes en la web."),

        // =============================================
        // 6. DATOS DEL NEGOCIO
        // =============================================
        sectionTitle("6", "Datos del Negocio"),
        goldDivider(),
        body("Desde esta sección puede actualizar toda la información de contacto y horarios de su establecimiento. Acceda desde \"Datos del Negocio\" en el menú lateral."),
        subTitle("Información editable"),
        (() => { const r = newBulletRef(); return [
          bullet("Información básica: nombre del bar, eslogan, descripción y dirección", r),
          bullet("Contacto: teléfono, email y número de WhatsApp", r),
          bullet("Redes sociales: enlaces a Instagram, Facebook y Google Maps", r),
          bullet("Valoración Google: puntuación y número total de reseñas (para mostrar en la web)", r),
          bullet("Horarios: horario de apertura y cierre para cada día de la semana", r),
        ]; })().flat(),
        body("Después de realizar cambios, pulse \"Guardar cambios\" y verá una confirmación verde."),
        tipBox("Recuerde actualizar los horarios en días festivos o períodos especiales (Navidad, Semana Santa, verano)."),

        // =============================================
        // 7. GALERÍA
        // =============================================
        sectionTitle("7", "Gestión de la Galería"),
        goldDivider(),
        body("Gestione las fotos que se muestran en la galería de la web pública. Acceda desde \"Galería\" en el menú lateral."),
        subTitle("Añadir fotos"),
        (() => { const r = newNumberRef(); return [
          step(1, "Pulse \"Añadir imagen\" para abrir el formulario.", r),
          step(2, "Opción A: pegue la URL de una imagen de internet.", r),
          step(3, "Opción B: pulse \"Subir archivo\" y seleccione una foto de su dispositivo.", r),
          step(4, "Escriba una descripción breve (ej: \"Terraza en verano\").", r),
          step(5, "Pulse \"Añadir\" para guardarla.", r),
        ]; })().flat(),
        subTitle("Gestionar fotos existentes"),
        (() => { const r = newBulletRef(); return [
          bullet("Reordenar: use las flechas arriba/abajo para cambiar el orden de las fotos", r),
          bullet("Activar/Desactivar: oculte fotos temporalmente sin eliminarlas", r),
          bullet("Editar descripción: pulse el lápiz para cambiar el texto descriptivo", r),
          bullet("Eliminar: pulse la papelera (se pedirá confirmación)", r),
        ]; })().flat(),
        tipBox("Use fotos horizontales de buena calidad. Las fotos del ambiente, la comida y los eventos funcionan mejor."),

        // =============================================
        // 8. RESEÑAS
        // =============================================
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("8", "Gestión de Reseñas"),
        goldDivider(),
        body("Controle qué reseñas se muestran en la web pública y destaque las mejores. Acceda desde \"Reseñas\" en el menú lateral."),
        subTitle("Acciones disponibles"),
        (() => { const r = newBulletRef(); return [
          bullet("Visible/Oculta: controle si una reseña aparece en la web pública", r),
          bullet("Destacada: las reseñas destacadas aparecen de forma prominente en la web", r),
          bullet("Añadir reseña: puede crear reseñas manualmente (útil para trasladar reseñas de Google)", r),
          bullet("Eliminar: borre reseñas que ya no desee mantener", r),
          bullet("Filtrar: vea todas las reseñas, solo las visibles, las ocultas o las destacadas", r),
        ]; })().flat(),
        subTitle("Añadir una reseña nueva"),
        (() => { const r = newNumberRef(); return [
          step(1, "Pulse \"Nueva reseña\".", r),
          step(2, "Introduzca: nombre del autor, valoración (1-5 estrellas), texto de la reseña y fecha.", r),
          step(3, "Pulse \"Crear reseña\" para guardarla.", r),
        ]; })().flat(),
        tipBox("Copie las mejores reseñas de Google Maps y añádalas aquí para mostrarlas en su web."),

        // =============================================
        // 9. CÓDIGO QR
        // =============================================
        sectionTitle("9", "Generador de Códigos QR"),
        goldDivider(),
        body("Genere códigos QR para colocar en las mesas de su establecimiento. Los clientes podrán escanearlos con el móvil para ver la carta directamente. Acceda desde \"Código QR\" en el menú lateral."),
        subTitle("Tipos de QR disponibles"),
        (() => { const r = newBulletRef(); return [
          bullet("Carta completa: enlaza a la web principal con toda la carta", r),
          bullet("Menú del Día: enlaza directamente a la sección del menú del día", r),
          bullet("Contacto: enlaza a la sección de contacto con mapa y teléfono", r),
          bullet("URL personalizada: introduzca cualquier dirección web", r),
        ]; })().flat(),
        subTitle("Imprimir y descargar"),
        (() => { const r = newNumberRef(); return [
          step(1, "Seleccione el tipo de QR que desea generar.", r),
          step(2, "El código QR aparecerá en pantalla automáticamente.", r),
          step(3, "Pulse \"Descargar QR\" para guardar la imagen en su dispositivo.", r),
          step(4, "Pulse \"Imprimir\" para imprimir directamente el código QR.", r),
        ]; })().flat(),
        tipBox("Imprima el QR en tamaño mediano (8x8 cm mínimo) y plastifíquelo para mayor durabilidad en las mesas."),
        tipBox("Coloque el QR en un lugar visible de cada mesa: en el centro, junto al servilletero o en un soporte vertical.", GREEN_BG, "10B981", "Recomendación"),

        // =============================================
        // 10. PREGUNTAS FRECUENTES
        // =============================================
        new Paragraph({ children: [new PageBreak()] }),
        sectionTitle("10", "Preguntas Frecuentes"),
        goldDivider(),

        ...[
          ["¿Puedo acceder desde el móvil?", "Sí, el panel de administración es totalmente responsive. Puede gestionarlo todo desde su teléfono móvil, tablet u ordenador."],
          ["¿Los cambios se ven inmediatamente en la web?", "Los cambios realizados en el panel de administración se guardan en su navegador. Para que sean visibles en la web pública, se requiere sincronización con el servidor (incluido en el servicio de mantenimiento)."],
          ["¿Qué pasa si borro un plato por error?", "La eliminación de platos es permanente. Le recomendamos desactivar el plato en lugar de eliminarlo si tiene dudas. Puede reactivarlo en cualquier momento."],
          ["¿Puedo subir fotos desde el móvil?", "Sí. Al crear o editar un plato, pulse \"Subir imagen\" y seleccione una foto de la galería de su teléfono o tome una foto nueva con la cámara."],
          ["¿Tengo que rellenar los alérgenos de cada plato?", "Sí, es obligatorio por la normativa europea (Reglamento UE 1169/2011). Es su responsabilidad legal mantener la información de alérgenos actualizada y correcta."],
          ["¿Cómo desactivo el menú del día los fines de semana?", "Acceda a \"Menú del Día\" y desactive el interruptor \"Menú del día activo\". La configuración se mantendrá guardada para cuando vuelva a activarlo."],
          ["¿Puedo tener varias personas gestionando el panel?", "Sí, pueden acceder desde distintos dispositivos con las mismas credenciales. Los datos se guardan en cada navegador de forma independiente."],
          ["¿Necesito conocimientos técnicos?", "No. El panel está diseñado para ser lo más intuitivo posible. Si tiene dudas, consulte esta guía o contacte con soporte técnico."],
        ].map(([q, a]) => [
          new Paragraph({ spacing: { before: 200, after: 60 }, children: [new TextRun({ text: q, color: DARK, size: 22, bold: true, font: "Arial" })] }),
          new Paragraph({ spacing: { after: 100 }, indent: { left: 200 }, children: [new TextRun({ text: a, color: GRAY, size: 21, font: "Arial" })] }),
        ]).flat(),

        // ====== CONTACTO SOPORTE ======
        emptyLine(300),
        new Paragraph({
          spacing: { before: 200, after: 200 },
          shading: { fill: GOLD_BG, type: ShadingType.CLEAR },
          border: { left: { style: BorderStyle.SINGLE, size: 12, color: GOLD, space: 8 } },
          indent: { left: 200 },
          children: [
            new TextRun({ text: "  ¿Necesita ayuda? ", color: DARK, size: 22, bold: true, font: "Arial" }),
            new TextRun({ text: "Contacte con soporte técnico a través de email o WhatsApp. Estaremos encantados de ayudarle.", color: GRAY, size: 21, font: "Arial" }),
          ]
        }),
        emptyLine(200),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [
          new TextRun({ text: "Jose Developer", color: GOLD, size: 20, bold: true, font: "Arial" }),
          new TextRun({ text: "  —  Soporte técnico para Hakuna Bar", color: LIGHT_GRAY, size: 18, font: "Arial" }),
        ] }),
      ]
    }
  ]
});

const outPath = "C:\\Users\\jose2\\OneDrive\\Escritorio\\Bar_HAKUNA\\Guia_Uso_HakunaBar_Admin.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("Guía generada: " + outPath);
});
