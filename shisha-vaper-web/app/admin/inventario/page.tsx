"use client";
import { useEffect, useState } from "react";
import { getContent, saveContent, formatPrice } from "@/lib/utils";
import { AlertTriangle, Package, CheckCircle } from "lucide-react";
import defaultContent from "@/data/content.json";

type ContentData = typeof defaultContent;

export default function AdminInventario() {
  const [data, setData] = useState<ContentData | null>(null);
  const [editing, setEditing] = useState<Record<string, number>>({});

  useEffect(() => { setData(getContent()); }, []);

  function updateStock(id: string, value: number) {
    setEditing((prev) => ({ ...prev, [id]: value }));
  }

  function saveStock(id: string) {
    if (!data) return;
    const newStock = editing[id];
    if (newStock === undefined) return;
    const productos = data.productos.map((p) =>
      p.id === id ? { ...p, stock: newStock } : p
    );
    const updated = { ...data, productos };
    setData(updated);
    saveContent(updated);
    setEditing((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  if (!data) return null;

  const sinStock = data.productos.filter((p) => p.activo && p.stock === 0);
  const stockBajo = data.productos.filter((p) => p.activo && p.stock > 0 && p.stock <= 3);
  const stockOk = data.productos.filter((p) => p.activo && p.stock > 3);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-[clamp(28px,5vw,42px)] text-white leading-none mb-1"
          style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}>
          INVENTARIO
        </h1>
        <p className="text-sm text-[rgba(245,240,232,0.45)]">Gestión de stock por producto</p>
      </div>

      {/* Status summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Sin stock", count: sinStock.length, icon: AlertTriangle, color: "text-red-400", border: "border-red-500/20" },
          { label: "Stock bajo (≤3)", count: stockBajo.length, icon: AlertTriangle, color: "text-orange-400", border: "border-orange-500/20" },
          { label: "Stock OK", count: stockOk.length, icon: CheckCircle, color: "text-emerald-400", border: "border-emerald-500/20" },
        ].map(({ label, count, icon: Icon, color, border }) => (
          <div key={label} className={`p-4 border ${border} bg-[#0D0D0D]`}>
            <div className="flex items-center gap-2 mb-1">
              <Icon size={15} className={color} />
              <span className="text-xs text-[rgba(245,240,232,0.4)]" style={{ fontFamily: "var(--font-cinzel)" }}>{label}</span>
            </div>
            <p className={`text-3xl font-bold ${color}`} style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}>{count}</p>
          </div>
        ))}
      </div>

      {/* Full stock table */}
      <div className="bg-[#0D0D0D] border border-[rgba(245,192,26,0.12)] rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(245,192,26,0.1)]">
              {["Producto", "SKU", "Categoría", "Precio", "Stock actual", "Editar stock"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] text-[rgba(245,192,26,0.6)] tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-cinzel)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.productos.filter((p) => p.activo).map((p) => {
              const pending = editing[p.id];
              const stockColor =
                p.stock === 0 ? "text-red-400" : p.stock <= 3 ? "text-orange-400" : "text-emerald-400";
              return (
                <tr key={p.id} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(245,192,26,0.02)]">
                  <td className="px-4 py-3 text-[rgba(245,240,232,0.85)]">{p.nombre}</td>
                  <td className="px-4 py-3 text-[rgba(245,240,232,0.35)] text-xs">{p.sku || "—"}</td>
                  <td className="px-4 py-3 text-[rgba(245,240,232,0.45)] text-xs">
                    {data.categorias.find((c) => c.id === p.categoria)?.nombre}
                  </td>
                  <td className="px-4 py-3 text-[#F5C01A]" style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}>
                    {formatPrice(p.precio)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-lg font-bold ${stockColor}`} style={{ fontFamily: "var(--font-bebas)" }}>
                      {p.stock}
                    </span>
                    {p.stock === 0 && (
                      <span className="ml-2 text-[10px] text-red-400 tracking-wider uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>Agotado</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={pending !== undefined ? pending : p.stock}
                        onChange={(e) => updateStock(p.id, parseInt(e.target.value) || 0)}
                        className="w-20 bg-[#111] border border-[rgba(245,192,26,0.2)] text-[rgba(245,240,232,0.8)] px-2 py-1 text-sm focus:outline-none focus:border-[rgba(245,192,26,0.4)]"
                      />
                      {pending !== undefined && (
                        <button
                          onClick={() => saveStock(p.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-[#F5C01A] text-[#0D0D0D] text-xs font-semibold hover:bg-[#FFD84A] transition-colors"
                          style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}
                        >
                          <Package size={12} />
                          OK
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
