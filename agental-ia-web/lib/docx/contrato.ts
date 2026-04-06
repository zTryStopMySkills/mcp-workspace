import type { TarificadorData } from "@/components/tarificador/TarificadorClient";

export async function generarContrato(data: TarificadorData, agentName: string) {
  const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    HeadingLevel, AlignmentType, BorderStyle, WidthType, PageBreak
  } = await import("docx");

  const fecha = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });

  function borderNone() {
    return { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  }
  function borderBottom(color = "e2e8f0") {
    return { style: BorderStyle.SINGLE, size: 1, color };
  }

  const totalUnico = data.plan.precio + data.extras.reduce((s, e) => s + e.precio, 0);
  const totalMensual = data.servicios.reduce((s, sv) => s + sv.precio, 0);

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 900, bottom: 900, left: 1100, right: 1100 }
        }
      },
      children: [
        // ── PORTADA ──
        new Paragraph({ text: "", spacing: { after: 800 } }),
        new Paragraph({
          children: [new TextRun({ text: "AGENTAL.IA", bold: true, size: 64, color: "00D4AA" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Propuesta de Servicios Digitales", size: 32, color: "334155" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `Preparada para: ${data.cliente.empresa}`, size: 26, color: "475569", italics: true })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({ text: fecha, size: 22, color: "94a3b8" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 1200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `Agente comercial: ${agentName}`, size: 20, color: "64748b" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "agental-ia-web.vercel.app", size: 20, color: "00D4AA" })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 0 },
        }),

        // Salto de página
        new Paragraph({ children: [new PageBreak()], spacing: { after: 400 } }),

        // ── PRESENTACIÓN ──
        new Paragraph({ children: [new TextRun({ text: "Sobre Agental.IA", bold: true, size: 32, color: "0f172a" })], heading: HeadingLevel.HEADING_1, spacing: { after: 200 } }),
        new Paragraph({
          children: [new TextRun({
            text: "Agental.IA es una agencia especializada en la transformación digital de negocios locales. Diseñamos, desarrollamos y mantenemos presencias digitales profesionales que generan nuevos clientes, fidelizan a los existentes y dan visibilidad en Google a negocios que antes no existían en internet.",
            size: 22, color: "334155"
          })],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({
            text: "Nuestro equipo combina diseño de alto nivel, desarrollo web moderno y estrategia digital para ofrecer resultados medibles: más visitas, más contactos y más ventas.",
            size: 22, color: "334155"
          })],
          spacing: { after: 600 },
        }),

        // ── DATOS DEL CLIENTE ──
        new Paragraph({ children: [new TextRun({ text: "Datos del cliente", bold: true, size: 28, color: "0f172a" })], heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: borderNone(), bottom: borderNone(), left: borderNone(), right: borderNone(), insideHorizontal: borderNone(), insideVertical: borderNone() },
          rows: [
            new TableRow({ children: [
              new TableCell({ width: { size: 35, type: WidthType.PERCENTAGE }, borders: { top: borderNone(), bottom: borderBottom(), left: borderNone(), right: borderNone() }, children: [new Paragraph({ children: [new TextRun({ text: "Empresa / Cliente", bold: true, size: 20, color: "64748b" })] })] }),
              new TableCell({ width: { size: 65, type: WidthType.PERCENTAGE }, borders: { top: borderNone(), bottom: borderBottom(), left: borderNone(), right: borderNone() }, children: [new Paragraph({ children: [new TextRun({ text: data.cliente.empresa, size: 20 })] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders: { top: borderNone(), bottom: borderBottom(), left: borderNone(), right: borderNone() }, children: [new Paragraph({ children: [new TextRun({ text: "Sector", bold: true, size: 20, color: "64748b" })] })] }),
              new TableCell({ borders: { top: borderNone(), bottom: borderBottom(), left: borderNone(), right: borderNone() }, children: [new Paragraph({ children: [new TextRun({ text: data.cliente.sector, size: 20 })] })] }),
            ]}),
            ...(data.cliente.email ? [new TableRow({ children: [
              new TableCell({ borders: { top: borderNone(), bottom: borderBottom(), left: borderNone(), right: borderNone() }, children: [new Paragraph({ children: [new TextRun({ text: "Email", bold: true, size: 20, color: "64748b" })] })] }),
              new TableCell({ borders: { top: borderNone(), bottom: borderBottom(), left: borderNone(), right: borderNone() }, children: [new Paragraph({ children: [new TextRun({ text: data.cliente.email, size: 20 })] })] }),
            ]})] : []),
            ...(data.cliente.telefono ? [new TableRow({ children: [
              new TableCell({ borders: { top: borderNone(), bottom: borderBottom(), left: borderNone(), right: borderNone() }, children: [new Paragraph({ children: [new TextRun({ text: "Teléfono", bold: true, size: 20, color: "64748b" })] })] }),
              new TableCell({ borders: { top: borderNone(), bottom: borderBottom(), left: borderNone(), right: borderNone() }, children: [new Paragraph({ children: [new TextRun({ text: data.cliente.telefono, size: 20 })] })] }),
            ]})] : []),
          ],
        }),
        new Paragraph({ text: "", spacing: { after: 400 } }),

        // ── SERVICIOS ──
        new Paragraph({ children: [new TextRun({ text: "Servicios contratados", bold: true, size: 28, color: "0f172a" })], heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),

        // Plan
        new Paragraph({ children: [new TextRun({ text: `Plan ${data.plan.nombre}`, bold: true, size: 24, color: "334155" })], spacing: { after: 100 } }),
        new Paragraph({ children: [new TextRun({ text: data.plan.descripcion, size: 20, color: "475569" })], spacing: { after: 200 } }),

        // Extras
        ...(data.extras.length > 0 ? [
          new Paragraph({ children: [new TextRun({ text: "Servicios adicionales (pago único)", bold: true, size: 22, color: "334155" })], spacing: { after: 100 } }),
          ...data.extras.map(e => new Paragraph({
            children: [
              new TextRun({ text: "  ·  ", size: 20, color: "00D4AA" }),
              new TextRun({ text: e.nombre, size: 20, color: "334155" }),
            ],
            spacing: { after: 60 },
          })),
          new Paragraph({ text: "", spacing: { after: 200 } }),
        ] : []),

        // Servicios mensuales
        ...(data.servicios.length > 0 ? [
          new Paragraph({ children: [new TextRun({ text: "Servicios de mantenimiento y marketing (mensual)", bold: true, size: 22, color: "334155" })], spacing: { after: 100 } }),
          ...data.servicios.map(s => new Paragraph({
            children: [
              new TextRun({ text: "  ·  ", size: 20, color: "00D4AA" }),
              new TextRun({ text: s.nombre, size: 20, color: "334155" }),
            ],
            spacing: { after: 60 },
          })),
          new Paragraph({ text: "", spacing: { after: 200 } }),
        ] : []),

        // Totales
        new Paragraph({
          children: [
            new TextRun({ text: "Inversión total (pago único): ", size: 24, color: "334155" }),
            new TextRun({ text: `${totalUnico.toLocaleString("es-ES")} €`, bold: true, size: 28, color: "0f172a" }),
          ],
          spacing: { after: 80 },
        }),
        ...(totalMensual > 0 ? [
          new Paragraph({
            children: [
              new TextRun({ text: "Cuota mensual de servicios: ", size: 22, color: "334155" }),
              new TextRun({ text: `${totalMensual.toLocaleString("es-ES")} €/mes`, bold: true, size: 24, color: "0f172a" }),
            ],
            spacing: { after: 600 },
          }),
        ] : [new Paragraph({ text: "", spacing: { after: 600 } })]),

        // ── CONDICIONES ──
        new Paragraph({ children: [new TextRun({ text: "Condiciones del servicio", bold: true, size: 28, color: "0f172a" })], heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
        ...[
          "1. El presupuesto tiene una validez de 30 días naturales desde la fecha de emisión.",
          "2. El inicio del proyecto se producirá una vez formalizado el contrato y recibido el pago acordado.",
          "3. La entrega del proyecto se realizará en el plazo estimado una vez recibidos todos los materiales necesarios (textos, imágenes, logotipos, etc.) por parte del cliente.",
          "4. Los servicios de mantenimiento mensual se facturarán el primer día de cada mes mediante domiciliación bancaria o transferencia.",
          "5. El cliente es propietario de todos los contenidos que aporte. Agental.IA conserva los derechos sobre el código y el diseño.",
          "6. Cualquier modificación fuera del alcance del plan contratado se presupuestará por separado.",
          "7. Para cualquier consulta o incidencia, el cliente dispondrá de un canal directo con su agente comercial asignado.",
        ].map(cond => new Paragraph({
          children: [new TextRun({ text: cond, size: 20, color: "475569" })],
          spacing: { after: 120 },
        })),

        new Paragraph({ text: "", spacing: { after: 600 } }),

        // ── FIRMA ──
        new Paragraph({ children: [new TextRun({ text: "Aceptación de la propuesta", bold: true, size: 28, color: "0f172a" })], heading: HeadingLevel.HEADING_2, spacing: { after: 200 } }),
        new Paragraph({
          children: [new TextRun({ text: "La firma del presente documento implica la aceptación de los servicios y condiciones descritos en esta propuesta.", size: 20, color: "475569" })],
          spacing: { after: 600 },
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: borderNone(), bottom: borderNone(), left: borderNone(), right: borderNone(), insideHorizontal: borderNone(), insideVertical: borderNone() },
          rows: [
            new TableRow({ children: [
              new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: { top: borderNone(), bottom: borderNone(), left: borderNone(), right: borderNone() }, children: [
                new Paragraph({ children: [new TextRun({ text: "Firma del cliente:", bold: true, size: 20, color: "334155" })], spacing: { after: 120 } }),
                new Paragraph({ children: [new TextRun({ text: "_________________________________", size: 20, color: "94a3b8" })], spacing: { after: 80 } }),
                new Paragraph({ children: [new TextRun({ text: "Nombre y apellidos:", size: 18, color: "64748b" })], spacing: { after: 120 } }),
                new Paragraph({ children: [new TextRun({ text: "_________________________________", size: 20, color: "94a3b8" })], spacing: { after: 80 } }),
                new Paragraph({ children: [new TextRun({ text: "DNI / NIF:", size: 18, color: "64748b" })], spacing: { after: 120 } }),
                new Paragraph({ children: [new TextRun({ text: "_________________________________", size: 20, color: "94a3b8" })], spacing: { after: 80 } }),
                new Paragraph({ children: [new TextRun({ text: "Fecha:", size: 18, color: "64748b" })], spacing: { after: 120 } }),
                new Paragraph({ children: [new TextRun({ text: "_________________________________", size: 20, color: "94a3b8" })], spacing: { after: 0 } }),
              ] }),
              new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, borders: { top: borderNone(), bottom: borderNone(), left: borderNone(), right: borderNone() }, children: [
                new Paragraph({ children: [new TextRun({ text: "Por parte de Agental.IA:", bold: true, size: 20, color: "334155" })], spacing: { after: 120 } }),
                new Paragraph({ children: [new TextRun({ text: "_________________________________", size: 20, color: "94a3b8" })], spacing: { after: 80 } }),
                new Paragraph({ children: [new TextRun({ text: `Agente: ${agentName}`, size: 18, color: "64748b" })], spacing: { after: 120 } }),
                new Paragraph({ children: [new TextRun({ text: "_________________________________", size: 20, color: "94a3b8" })], spacing: { after: 80 } }),
                new Paragraph({ children: [new TextRun({ text: "Fecha:", size: 18, color: "64748b" })], spacing: { after: 120 } }),
                new Paragraph({ children: [new TextRun({ text: "_________________________________", size: 20, color: "94a3b8" })], spacing: { after: 0 } }),
              ] }),
            ]}),
          ],
        }),

        new Paragraph({ text: "", spacing: { after: 600 } }),

        // Pie
        new Paragraph({
          children: [new TextRun({ text: `Agental.IA · agental-ia-web.vercel.app · Propuesta generada el ${fecha}`, size: 16, color: "94a3b8", italics: true })],
          alignment: AlignmentType.CENTER,
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: `Contrato_${data.cliente.empresa.replace(/[^a-z0-9áéíóúüñ ]/gi, "_")}_${new Date().toISOString().slice(0, 10)}.docx`
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
