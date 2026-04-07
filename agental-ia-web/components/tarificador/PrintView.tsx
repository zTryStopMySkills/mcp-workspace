"use client";

import Link from "next/link";
import { Printer, ArrowLeft } from "lucide-react";
import type { Quotation } from "@/types";

interface Props {
  quotation: Quotation;
  agentName: string;
  agentNick: string;
}

export function PrintView({ quotation: q, agentName, agentNick }: Props) {
  const fecha = new Date(q.created_at).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const extras = (q.extras ?? []) as { id: string; nombre: string; precio: number }[];
  const services = (q.services ?? []) as { id: string; nombre: string; precio: number }[];

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: #1e293b !important; }
          .print-shell { padding-top: 0 !important; background: white !important; min-height: auto !important; }
          .print-card { box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; margin: 0 !important; }
        }
        @page { margin: 14mm; size: A4; }
      `}</style>

      {/* Toolbar — hidden on print */}
      <div
        className="no-print fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
        style={{ background: "#0A0F1A", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/tarificador/historial"
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: "#8B95A9" }}
          >
            <ArrowLeft size={14} />
            Historial
          </Link>
          <span style={{ color: "#334155" }}>|</span>
          <div>
            <p className="text-xs" style={{ color: "#64748b" }}>Propuesta comercial</p>
            <p className="text-sm font-semibold" style={{ color: "white" }}>{q.client_name}</p>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-opacity hover:opacity-80"
          style={{ background: "#00D4AA", color: "#000" }}
        >
          <Printer size={14} />
          Imprimir / Guardar PDF
        </button>
      </div>

      {/* Shell */}
      <div
        className="print-shell"
        style={{ paddingTop: "64px", background: "#0A0F1A", minHeight: "100vh" }}
      >
        {/* A4-like card */}
        <div
          className="print-card"
          style={{
            maxWidth: "794px",
            margin: "32px auto 48px",
            padding: "48px 52px",
            background: "white",
            color: "#1e293b",
            fontFamily: "Inter, system-ui, sans-serif",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "32px",
              paddingBottom: "24px",
              borderBottom: "2px solid #00D4AA",
            }}
          >
            <div>
              <div style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>
                Agentalia<span style={{ color: "#00D4AA" }}>-webs</span>
              </div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                Soluciones web para negocios locales
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  color: "#0f172a",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Propuesta
              </div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>Comercial</div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "10px" }}>Fecha: {fecha}</div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                Agente: {agentName}{agentNick ? ` (@${agentNick})` : ""}
              </div>
            </div>
          </div>

          {/* Client info */}
          <div style={{ marginBottom: "28px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#00D4AA",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                marginBottom: "12px",
              }}
            >
              Datos del cliente
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <tbody>
                {(
                  [
                    ["Empresa / Cliente", q.client_name],
                    q.client_sector ? ["Sector", q.client_sector] : null,
                    q.client_email ? ["Email", q.client_email] : null,
                    q.client_phone ? ["Teléfono", q.client_phone] : null,
                    ["Web actual", q.has_web ? (q.client_web_url || "Tiene web") : "No tiene web actualmente"],
                  ] as ([string, string] | null)[]
                )
                  .filter(Boolean)
                  .map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td
                        style={{ padding: "9px 0", color: "#64748b", fontWeight: "600", width: "35%" }}
                      >
                        {row![0]}
                      </td>
                      <td style={{ padding: "9px 0", color: "#0f172a" }}>{row![1]}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Services table */}
          <div style={{ marginBottom: "28px" }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#00D4AA",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                marginBottom: "12px",
              }}
            >
              Propuesta económica
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#0f172a" }}>
                  <th
                    style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      color: "#94a3b8",
                      fontWeight: "600",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Servicio
                  </th>
                  <th
                    style={{
                      padding: "10px 14px",
                      textAlign: "right",
                      color: "#94a3b8",
                      fontWeight: "600",
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Precio
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Plan base */}
                <tr style={{ borderBottom: "1px solid #f1f5f9", background: "#fafafa" }}>
                  <td style={{ padding: "13px 14px", color: "#0f172a", fontWeight: "600" }}>
                    Plan web {q.plan_name}
                  </td>
                  <td
                    style={{
                      padding: "13px 14px",
                      textAlign: "right",
                      color: "#0f172a",
                      fontWeight: "700",
                    }}
                  >
                    {q.plan_price.toLocaleString("es-ES")} €
                  </td>
                </tr>

                {/* Extras */}
                {extras.map((e, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={{ padding: "10px 14px", color: "#334155", paddingLeft: "28px" }}>
                      + {e.nombre}
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "right", color: "#334155" }}>
                      {e.precio.toLocaleString("es-ES")} €
                    </td>
                  </tr>
                ))}

                {/* Monthly services header */}
                {services.length > 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      style={{
                        padding: "14px 14px 6px",
                        fontSize: "11px",
                        color: "#C9A84C",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderTop: "1px solid #e2e8f0",
                      }}
                    >
                      Servicios mensuales
                    </td>
                  </tr>
                )}

                {services.map((s, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={{ padding: "10px 14px", color: "#334155", paddingLeft: "28px" }}>
                      + {s.nombre}
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "right", color: "#C9A84C", fontWeight: "600" }}>
                      {s.precio.toLocaleString("es-ES")} €/mes
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: "2px solid #0f172a" }}>
                  <td
                    style={{
                      padding: "14px",
                      fontWeight: "800",
                      color: "#0f172a",
                      fontSize: "14px",
                    }}
                  >
                    TOTAL PROYECTO (pago único)
                  </td>
                  <td
                    style={{
                      padding: "14px",
                      textAlign: "right",
                      fontWeight: "800",
                      color: "#00D4AA",
                      fontSize: "20px",
                    }}
                  >
                    {q.total_once.toLocaleString("es-ES")} €
                  </td>
                </tr>
                {q.total_monthly > 0 && (
                  <tr>
                    <td
                      style={{ padding: "2px 14px 12px", color: "#64748b", fontSize: "12px" }}
                    >
                      Servicios recurrentes mensuales
                    </td>
                    <td
                      style={{
                        padding: "2px 14px 12px",
                        textAlign: "right",
                        color: "#C9A84C",
                        fontWeight: "700",
                        fontSize: "14px",
                      }}
                    >
                      + {q.total_monthly.toLocaleString("es-ES")} €/mes
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
          </div>

          {/* Notes */}
          {q.notes && (
            <div
              style={{
                marginBottom: "28px",
                padding: "16px 20px",
                background: "#f8fafc",
                borderRadius: "8px",
                borderLeft: "3px solid #00D4AA",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "8px",
                }}
              >
                Notas adicionales
              </div>
              <p style={{ fontSize: "13px", color: "#334155", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                {q.notes}
              </p>
            </div>
          )}

          {/* Conditions */}
          <div
            style={{
              marginBottom: "28px",
              padding: "14px 18px",
              background: "#f8fafc",
              borderRadius: "8px",
              fontSize: "11px",
              color: "#64748b",
              lineHeight: "2",
            }}
          >
            <div style={{ fontWeight: "700", marginBottom: "4px", color: "#475569" }}>
              Condiciones generales
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li>• Presupuesto válido por 30 días desde la fecha de emisión.</li>
              <li>• El proyecto comienza tras confirmación y abono del 50% inicial.</li>
              <li>• El saldo restante se abona en la entrega del proyecto.</li>
              <li>• Los servicios mensuales se facturan de forma recurrente.</li>
            </ul>
          </div>

          {/* Footer */}
          <div
            style={{
              paddingTop: "20px",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>
              <div style={{ fontWeight: "700", color: "#475569", marginBottom: "2px" }}>
                {agentName}
              </div>
              <div>Agente comercial — Agentalia-webs</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>
                Agentalia<span style={{ color: "#00D4AA" }}>-webs</span>
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                Tu web, tu negocio
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
