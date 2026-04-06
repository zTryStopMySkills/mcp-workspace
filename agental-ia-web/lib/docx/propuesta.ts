import type { TarificadorData } from "@/components/tarificador/TarificadorClient";

export async function generarPropuesta(data: TarificadorData, agentName: string) {
  const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType
  } = await import("docx");

  const fecha = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });

  function borderNone() {
    return { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  }
  function borderBottom(color = "e2e8f0") {
    return { style: BorderStyle.SINGLE, size: 1, color };
  }

  function metaRow(label: string, value: string) {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          borders: { top: borderNone(), bottom: borderBottom(), left: borderNone(), right: borderNone() },
          children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, color: "64748b", size: 20 })] })],
        }),
        new TableCell({
          width: { size: 70, type: WidthType.PERCENTAGE },
          borders: { top: borderNone(), bottom: borderBottom(), left: borderNone(), right: borderNone() },
          children: [new Paragraph({ children: [new TextRun({ text: value, size: 20 })] })],
        }),
      ],
    });
  }

  // Tabla cliente
  const clienteRows = [
    metaRow("Empresa / Cliente", data.cliente.empresa),
    metaRow("Sector", data.cliente.sector),
    metaRow("Email", data.cliente.email || "—"),
    metaRow("Teléfono", data.cliente.telefono || "—"),
    metaRow("Web actual", data.cliente.tieneWeb ? (data.cliente.urlWeb || "Sí") : "No tiene"),
  ];

  // Tabla servicios
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serviciosRows: any[] = [];

  serviciosRows.push(new TableRow({
    children: [
      new TableCell({
        width: { size: 60, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.SOLID, color: "0f172a" },
        borders: { top: borderNone(), bottom: borderNone(), left: borderNone(), right: borderNone() },
        children: [new Paragraph({ children: [new TextRun({ text: "SERVICIO", bold: true, color: "94a3b8", size: 18 })] })],
      }),
      new TableCell({
        width: { size: 40, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.SOLID, color: "0f172a" },
        borders: { top: borderNone(), bottom: borderNone(), left: borderNone(), right: borderNone() },
        children: [new Paragraph({ children: [new TextRun({ text: "PRECIO", bold: true, color: "94a3b8", size: 18 })], alignment: AlignmentType.RIGHT })],
      }),
    ],
  }));

  // Plan web
  serviciosRows.push(new TableRow({
    children: [
      new TableCell({
        borders: { top: borderNone(), bottom: borderBottom(), left: borderNone(), right: borderNone() },
        children: [new Paragraph({ children: [new TextRun({ text: `Plan ${data.plan.nombre}`, size: 22 })] })],
      }),
      new TableCell({
        borders: { top: borderNone(), bottom: borderBottom(), left: borderNone(), right: borderNone() },
        children: [new Paragraph({ children: [new TextRun({ text: `${data.plan.precio.toLocaleString("es-ES")} €`, size: 22, bold: true })], alignment: AlignmentType.RIGHT })],
      }),
    ],
  }));

  // Extras
  for (const extra of data.extras) {
    serviciosRows.push(new TableRow({
      children: [
        new TableCell({
          borders: { top: borderNone(), bottom: borderBottom(), left: borderNone(), right: borderNone() },
          children: [new Paragraph({ children: [new TextRun({ text: extra.nombre, size: 20 })] })],
        }),
        new TableCell({
          borders: { top: borderNone(), bottom: borderBottom(), left: borderNone(), right: borderNone() },
          children: [new Paragraph({ children: [new TextRun({ text: `${extra.precio.toLocaleString("es-ES")} €`, size: 20 })], alignment: AlignmentType.RIGHT })],
        }),
      ],
    }));
  }

  // Servicios mensuales
  for (const svc of data.servicios) {
    serviciosRows.push(new TableRow({
      children: [
        new TableCell({
          borders: { top: borderNone(), bottom: borderBottom(), left: borderNone(), right: borderNone() },
          children: [new Paragraph({ children: [new TextRun({ text: `${svc.nombre} (mensual)`, size: 20, italics: true })] })],
        }),
        new TableCell({
          borders: { top: borderNone(), bottom: borderBottom(), left: borderNone(), right: borderNone() },
          children: [new Paragraph({ children: [new TextRun({ text: `${svc.precio.toLocaleString("es-ES")} €/mes`, size: 20, italics: true })], alignment: AlignmentType.RIGHT })],
        }),
      ],
    }));
  }

  const totalUnico = data.plan.precio + data.extras.reduce((s, e) => s + e.precio, 0);
  const totalMensual = data.servicios.reduce((s, sv) => s + sv.precio, 0);

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, bottom: 720, left: 900, right: 900 }
        }
      },
      children: [
        // Cabecera
        new Paragraph({
          children: [new TextRun({ text: "AGENTAL.IA", bold: true, size: 48, color: "00D4AA" })],
          spacing: { after: 80 },
        }),
        new Paragraph({
          children: [new TextRun({ text: "Propuesta Comercial Interna", size: 24, color: "64748b" })],
          spacing: { after: 40 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `Agente: `, size: 20, color: "94a3b8" }),
            new TextRun({ text: agentName, size: 20, bold: true, color: "e2e8f0" }),
            new TextRun({ text: `   ·   Fecha: ${fecha}`, size: 20, color: "94a3b8" }),
          ],
          spacing: { after: 400 },
        }),

        // Datos cliente
        new Paragraph({ children: [new TextRun({ text: "DATOS DEL CLIENTE", bold: true, size: 24, color: "00D4AA" })], spacing: { after: 160 } }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: borderNone(), bottom: borderNone(), left: borderNone(), right: borderNone(), insideHorizontal: borderNone(), insideVertical: borderNone() },
          rows: clienteRows,
        }),
        new Paragraph({ text: "", spacing: { after: 400 } }),

        // Servicios contratados
        new Paragraph({ children: [new TextRun({ text: "SERVICIOS CONTRATADOS", bold: true, size: 24, color: "00D4AA" })], spacing: { after: 160 } }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: borderNone(), bottom: borderNone(), left: borderNone(), right: borderNone(), insideHorizontal: borderNone(), insideVertical: borderNone() },
          rows: serviciosRows,
        }),
        new Paragraph({ text: "", spacing: { after: 200 } }),

        // Totales
        new Paragraph({
          children: [
            new TextRun({ text: "TOTAL PAGO ÚNICO: ", bold: true, size: 28, color: "C9A84C" }),
            new TextRun({ text: `${totalUnico.toLocaleString("es-ES")} €`, bold: true, size: 32, color: "C9A84C" }),
          ],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 80 },
        }),
        ...(totalMensual > 0 ? [
          new Paragraph({
            children: [
              new TextRun({ text: "TOTAL MENSUAL: ", bold: true, size: 24, color: "94a3b8" }),
              new TextRun({ text: `${totalMensual.toLocaleString("es-ES")} €/mes`, bold: true, size: 24, color: "94a3b8" }),
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 400 },
          }),
        ] : [new Paragraph({ text: "", spacing: { after: 400 } })]),

        // Nota interna
        ...(data.notaInterna ? [
          new Paragraph({ children: [new TextRun({ text: "NOTA INTERNA", bold: true, size: 20, color: "f59e0b" })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: data.notaInterna, size: 20, color: "fbbf24", italics: true })], spacing: { after: 400 } }),
        ] : []),

        // Pie
        new Paragraph({
          children: [new TextRun({ text: `Propuesta generada por Agental.IA · ${fecha} · Uso interno`, size: 16, color: "475569", italics: true })],
          alignment: AlignmentType.CENTER,
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: `Propuesta_${data.cliente.empresa.replace(/[^a-z0-9áéíóúüñ ]/gi, "_")}_${new Date().toISOString().slice(0, 10)}.docx`
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
