"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ShoppingCart, TrendingUp, Trash2 } from "lucide-react";
import { getContent, saveContent, genId, formatPrice } from "@/lib/utils";
import defaultContent from "@/data/content.json";

type ContentData = typeof defaultContent;

interface Venta {
  id: string;
  producto: string;
  productoId?: string;
  cantidad: number;
  precioUnit: number;
  total: number;
  fecha: string;
  nota?: string;
}

export default function AdminVentas() {
  const [data, setData] = useState<ContentData | null>(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ productoId: "", cantidad: 1, nota: "" });

  useEffect(() => { setData(getContent()); }, []);

  function save(updated: ContentData) {
    setData(updated);
    saveContent(updated);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    const prod = data.productos.find((p) => p.id === form.productoId);
    if (!prod) return;
    const venta: Venta = {
      id: genId(),
      producto: prod.nombre,
      productoId: prod.id,
      cantidad: form.cantidad,
      precioUnit: prod.precio,
      total: prod.precio * form.cantidad,
      fecha: new Date().toLocaleDateString("es-ES"),
      nota: form.nota || undefined,
    };
    // Decrease stock
    const productos = data.productos.map((p) =>
      p.id === prod.id ? { ...p, stock: Math.max(0, p.stock - form.cantidad) } : p
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    save({ ...data, productos, ventas: [...(data.ventas as Venta[]), venta] as any });
    setForm({ productoId: "", cantidad: 1, nota: "" });
    setModal(false);
  }

  function handleDelete(id: string) {
    if (!data) return;
    if (!confirm("¿Eliminar esta venta del registro?")) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    save({ ...data, ventas: (data.ventas as Venta[]).filter((v) => v.id !== id) as any });
  }

  if (!data) return null;
  const ventas = (data.ventas as Venta[]).slice().reverse();
  const totalIngresos = (data.ventas as Venta[]).reduce((s, v) => s + v.total, 0);
  const totalUnidades = (data.ventas as Venta[]).reduce((s, v) => s + v.cantidad, 0);

  const selectedProduct = data.productos.find((p) => p.id === form.productoId);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-[clamp(28px,5vw,42px)] text-white leading-none mb-1"
            style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}
          >
            VENTAS
          </h1>
          <p className="text-sm text-[rgba(245,240,232,0.45)]">Registro de ventas y pedidos</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#F5C01A] text-[#0D0D0D] hover:bg-[#FFD84A] transition-colors font-semibold"
          style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: "0.06em" }}
        >
          <Plus size={16} />
          REGISTRAR VENTA
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Total ingresos", value: formatPrice(totalIngresos), icon: TrendingUp, color: "text-[#F5C01A]" },
          { label: "Ventas registradas", value: ventas.length, icon: ShoppingCart, color: "text-blue-400" },
          { label: "Unidades vendidas", value: totalUnidades, icon: ShoppingCart, color: "text-emerald-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 border border-[rgba(245,192,26,0.12)] bg-[#0D0D0D]">
            <div className="flex items-center gap-3 mb-1">
              <Icon size={16} className={color} />
              <span className="text-xs text-[rgba(245,240,232,0.4)]" style={{ fontFamily: "var(--font-cinzel)" }}>{label}</span>
            </div>
            <p className={`text-2xl font-bold ${color}`} style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0D0D0D] border border-[rgba(245,192,26,0.12)] rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(245,192,26,0.1)]">
              {["Fecha", "Producto", "Cant.", "Precio/ud.", "Total", "Nota", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[10px] text-[rgba(245,192,26,0.6)] tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-cinzel)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ventas.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-[rgba(245,240,232,0.3)] text-sm">
                  No hay ventas registradas todavía
                </td>
              </tr>
            ) : (
              ventas.map((v) => (
                <tr key={v.id} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(245,192,26,0.02)]">
                  <td className="px-4 py-3 text-[rgba(245,240,232,0.45)] text-xs">{v.fecha}</td>
                  <td className="px-4 py-3 text-[rgba(245,240,232,0.8)]">{v.producto}</td>
                  <td className="px-4 py-3 text-[rgba(245,240,232,0.6)]">{v.cantidad}</td>
                  <td className="px-4 py-3 text-[rgba(245,240,232,0.55)]">{formatPrice(v.precioUnit)}</td>
                  <td className="px-4 py-3 text-[#F5C01A] font-semibold" style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}>
                    {formatPrice(v.total)}
                  </td>
                  <td className="px-4 py-3 text-xs text-[rgba(245,240,232,0.35)]">{v.nota ?? "—"}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(v.id)} className="p-1 text-[rgba(245,240,232,0.3)] hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-[#111] border border-[rgba(245,192,26,0.2)] rounded-sm p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl text-white" style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.06em" }}>
                  REGISTRAR VENTA
                </h2>
                <button onClick={() => setModal(false)} className="text-[rgba(245,240,232,0.4)] hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-[rgba(245,192,26,0.6)] tracking-widest uppercase mb-2" style={{ fontFamily: "var(--font-cinzel)" }}>
                    Producto
                  </label>
                  <select
                    required
                    value={form.productoId}
                    onChange={(e) => setForm({ ...form, productoId: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-[rgba(245,192,26,0.18)] text-sm text-[rgba(245,240,232,0.8)] px-3 py-2.5 outline-none focus:border-[rgba(245,192,26,0.4)]"
                  >
                    <option value="">Seleccionar producto...</option>
                    {data.productos.filter((p) => p.activo).map((p) => (
                      <option key={p.id} value={p.id} style={{ background: "#111" }}>
                        {p.nombre} — {formatPrice(p.precio)} (stock: {p.stock})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-[rgba(245,192,26,0.6)] tracking-widest uppercase mb-2" style={{ fontFamily: "var(--font-cinzel)" }}>
                      Cantidad
                    </label>
                    <input
                      type="number" min="1"
                      max={selectedProduct?.stock ?? 999}
                      required
                      value={form.cantidad}
                      onChange={(e) => setForm({ ...form, cantidad: parseInt(e.target.value) || 1 })}
                      className="w-full bg-[#0D0D0D] border border-[rgba(245,192,26,0.18)] text-sm text-[rgba(245,240,232,0.8)] px-3 py-2.5 outline-none focus:border-[rgba(245,192,26,0.4)]"
                    />
                  </div>
                  <div className="flex flex-col justify-end pb-1">
                    {selectedProduct && (
                      <div className="text-right">
                        <p className="text-[10px] text-[rgba(245,240,232,0.35)] uppercase tracking-wider mb-1" style={{ fontFamily: "var(--font-cinzel)" }}>Total</p>
                        <p className="text-2xl text-[#F5C01A]" style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}>
                          {formatPrice(selectedProduct.precio * form.cantidad)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-[rgba(245,192,26,0.6)] tracking-widest uppercase mb-2" style={{ fontFamily: "var(--font-cinzel)" }}>
                    Nota (opcional)
                  </label>
                  <input
                    type="text"
                    value={form.nota}
                    onChange={(e) => setForm({ ...form, nota: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-[rgba(245,192,26,0.18)] text-sm text-[rgba(245,240,232,0.8)] px-3 py-2.5 outline-none focus:border-[rgba(245,192,26,0.4)]"
                    placeholder="Nombre cliente, observaciones..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)}
                    className="flex-1 py-2.5 border border-[rgba(245,192,26,0.2)] text-[rgba(245,240,232,0.5)] hover:text-[rgba(245,240,232,0.8)] text-sm transition-colors"
                    style={{ fontFamily: "var(--font-cinzel)" }}>
                    Cancelar
                  </button>
                  <button type="submit"
                    className="flex-1 py-2.5 bg-[#F5C01A] text-[#0D0D0D] hover:bg-[#FFD84A] transition-colors font-semibold"
                    style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: "0.06em" }}>
                    REGISTRAR
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
