"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 bg-[#00D4AA] text-black text-sm font-semibold rounded-xl shadow-lg hover:bg-[#00b894] transition-colors"
    >
      Imprimir / Guardar PDF
    </button>
  );
}
