"use client";

import { useState } from "react";

export function AcceptButton({ token }: { token: string }) {
  const [state, setState] = useState<"idle" | "confirming" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleAccept() {
    setState("loading");
    try {
      const res = await fetch(`/api/p/${token}/accept`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "already_accepted") { setState("done"); return; }
        throw new Error(data.error ?? "Error desconocido");
      }
      setState("done");
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Error al procesar");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="mt-10 rounded-2xl p-8 text-center" style={{ background: "linear-gradient(135deg, #f0fdf9, #ecfdf5)", border: "2px solid #00D4AA" }}>
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-xl font-bold text-[#00D4AA] mb-1">Propuesta aceptada</h3>
        <p className="text-sm text-gray-500">Hemos registrado tu aceptación. Tu agente se pondrá en contacto contigo pronto.</p>
      </div>
    );
  }

  return (
    <>
      {/* CTA section */}
      <div className="mt-10 rounded-2xl p-8 text-center" style={{ background: "linear-gradient(135deg, #f0fdf9, #fffbeb)", border: "1px solid #d1fae5" }}>
        <p className="text-sm text-gray-500 mb-4">¿Todo correcto? Acepta la propuesta con un clic y tu agente recibirá la confirmación al instante.</p>
        <button
          onClick={() => setState("confirming")}
          className="px-8 py-3 rounded-xl font-bold text-white text-base transition-all hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(135deg, #00D4AA, #00b894)" }}
        >
          Aceptar propuesta
        </button>
      </div>

      {/* Confirmation modal */}
      {state === "confirming" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center">
            <div className="text-3xl mb-4">🤝</div>
            <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">Confirmar aceptación</h3>
            <p className="text-sm text-gray-500 mb-6">
              Al confirmar, quedará registrada tu aceptación con fecha y hora. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setState("idle")}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAccept}
                disabled={(state as string) === "loading"}
                className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #00D4AA, #00b894)" }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error toast */}
      {state === "error" && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-center">
          <p className="text-sm text-red-600">{errorMsg}</p>
          <button onClick={() => setState("idle")} className="text-xs text-red-400 mt-1 underline">Reintentar</button>
        </div>
      )}
    </>
  );
}
