"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";

interface QuotationData {
  client_name: string;
  client_sector?: string | null;
  has_web: boolean;
  client_web_url?: string | null;
  client_email?: string | null;
  client_phone?: string | null;
  plan_id: string;
  plan_name: string;
  plan_price: number;
  extras: { id: string; nombre: string; precio: number }[];
  services: { id: string; nombre: string; precio: number }[];
  notes?: string | null;
  agent_name?: string;
}

export function DownloadDocxButton({ quotation }: { quotation: QuotationData }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const { generarPropuesta } = await import("@/lib/docx/propuesta");
      await generarPropuesta({
        cliente: {
          empresa: quotation.client_name,
          sector: quotation.client_sector ?? "",
          tieneWeb: quotation.has_web,
          urlWeb: quotation.client_web_url ?? "",
          email: quotation.client_email ?? "",
          telefono: quotation.client_phone ?? "",
        },
        plan: {
          id: quotation.plan_id,
          nombre: quotation.plan_name,
          precio: quotation.plan_price,
          descripcion: "",
          color: "#00D4AA",
          incluye: [],
        },
        extras: (quotation.extras ?? []).map((e: { id: string; nombre: string; precio: number; icono?: string }) => ({ ...e, icono: e.icono ?? "" })),
        servicios: (quotation.services ?? []).map((s: { id: string; nombre: string; precio: number; icono?: string; descripcion?: string }) => ({ ...s, icono: s.icono ?? "", descripcion: s.descripcion ?? "" })),
        notaInterna: "",
      }, quotation.agent_name ?? "Agental.IA");
    } catch {
      alert("Error al generar el documento");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="no-print flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
      {loading ? "Generando..." : "Descargar Word"}
    </button>
  );
}
