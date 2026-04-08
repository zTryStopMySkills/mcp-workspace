import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/tarificador/PrintButton";
import { AcceptButton } from "@/components/tarificador/AcceptButton";
import { DownloadDocxButton } from "@/components/tarificador/DownloadDocxButton";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function PublicProposalPage({ params }: PageProps) {
  const { token } = await params;

  const { data: q } = await supabaseAdmin
    .from("quotations")
    .select("*, agent:agent_id(nick, name)")
    .eq("share_token", token)
    .single();

  if (!q) notFound();

  const extras = (q.extras ?? []) as { id: string; nombre: string; precio: number }[];
  const services = (q.services ?? []) as { id: string; nombre: string; precio: number }[];
  const agentName = q.agent?.name ?? "Agental.IA";

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>

      {/* Print toolbar */}
      <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
        <DownloadDocxButton quotation={{
          client_name: q.client_name,
          client_sector: q.client_sector,
          has_web: q.has_web,
          client_web_url: q.client_web_url,
          client_email: q.client_email,
          client_phone: q.client_phone,
          plan_id: q.plan_id,
          plan_name: q.plan_name,
          plan_price: q.plan_price,
          extras,
          services,
          notes: q.notes,
          agent_name: agentName,
        }} />
        <PrintButton />
      </div>

      {/* Accepted banner */}
      {q.status === "closed" && (
        <div className="no-print fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-full text-sm font-semibold text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, #00D4AA, #00b894)" }}>
          ✅ Propuesta aceptada
        </div>
      )}

      {/* Proposal document */}
      <div className="min-h-screen bg-white text-[#1a1a2e] font-sans">
        <div className="max-w-[800px] mx-auto px-10 py-14">

          {/* Header */}
          <div className="flex items-start justify-between mb-12">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "#00D4AA" }}>
                Agental<span style={{ color: "#C9A84C" }}>.IA</span>
              </h1>
              <p className="text-sm text-gray-400 mt-1">Agentes Comerciales · agentalia.com</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Propuesta comercial</p>
              <p className="text-sm font-medium text-gray-600">
                {new Date(q.created_at).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 3, background: "linear-gradient(90deg, #00D4AA, #C9A84C)", borderRadius: 2, marginBottom: 32 }} />

          {/* Client info */}
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-semibold">Preparada para</p>
            <h2 className="text-2xl font-bold text-[#1a1a2e]">{q.client_name}</h2>
            {q.client_sector && <p className="text-gray-500 mt-1">{q.client_sector}</p>}
            {q.client_email && <p className="text-sm text-gray-500 mt-0.5">{q.client_email}</p>}
            {q.client_phone && <p className="text-sm text-gray-500">{q.client_phone}</p>}
            {q.client_web_url && (
              <p className="text-sm text-gray-400 mt-0.5">
                Web actual: <span className="underline">{q.client_web_url}</span>
              </p>
            )}
          </div>

          {/* Plan */}
          <div className="rounded-2xl border-2 border-[#00D4AA]/40 p-7 mb-8">
            <p className="text-xs uppercase tracking-widest text-[#00D4AA] font-bold mb-2">Plan seleccionado</p>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#1a1a2e]">{q.plan_name}</h3>
              <span className="text-2xl font-extrabold" style={{ color: "#00D4AA" }}>
                {q.plan_price.toLocaleString("es-ES")} €
              </span>
            </div>
          </div>

          {/* Extras */}
          {extras.length > 0 && (
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">Extras incluidos</p>
              <div className="space-y-2">
                {extras.map(e => (
                  <div key={e.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-700">{e.nombre}</span>
                    <span className="text-sm font-semibold text-gray-800">+{e.precio.toLocaleString("es-ES")} €</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {services.length > 0 && (
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">Servicios mensuales</p>
              <div className="space-y-2">
                {services.map(s => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-700">{s.nombre}</span>
                    <span className="text-sm font-semibold text-gray-800">{s.precio.toLocaleString("es-ES")} €/mes</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="rounded-2xl p-6 mb-10" style={{ background: "linear-gradient(135deg, #f0fdf9 0%, #fffbeb 100%)", border: "1px solid #d1fae5" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-700">Inversión inicial (pago único)</span>
              <span className="text-2xl font-extrabold" style={{ color: "#00D4AA" }}>
                {q.total_once.toLocaleString("es-ES")} €
              </span>
            </div>
            {q.total_monthly > 0 && (
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Cuota mensual</span>
                <span className="text-xl font-bold" style={{ color: "#C9A84C" }}>
                  {q.total_monthly.toLocaleString("es-ES")} €/mes
                </span>
              </div>
            )}
          </div>

          {/* Notes */}
          {q.notes && (
            <div className="mb-10 p-5 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">Observaciones</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{q.notes}</p>
            </div>
          )}

          {/* Accept button — only if not closed/lost */}
          {!["closed", "lost"].includes(q.status) && (
            <div className="no-print">
              <AcceptButton token={q.share_token} />
            </div>
          )}

          {/* Footer */}
          <div style={{ height: 2, background: "linear-gradient(90deg, #00D4AA, #C9A84C)", borderRadius: 2, marginBottom: 24 }} />
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div>
              <p className="font-semibold text-gray-600">{agentName}</p>
              <p>Agental.IA · Agentes Comerciales</p>
            </div>
            <div className="text-right">
              <p>Esta propuesta tiene validez de 30 días</p>
              <p className="mt-0.5">¿Preguntas? Contacta con tu agente</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
