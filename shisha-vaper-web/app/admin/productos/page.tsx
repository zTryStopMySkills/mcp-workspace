"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check, Star, StarOff, ToggleLeft, ToggleRight } from "lucide-react";
import { getContent, saveContent, genId, formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/utils";
import defaultContent from "@/data/content.json";

type ContentData = typeof defaultContent;

const EMPTY: Omit<Product, "id"> = {
  nombre: "",
  categoria: "shishas",
  precio: 0,
  precio_antes: null,
  stock: 0,
  descripcion: "",
  imagen: "",
  activo: true,
  destacado: false,
  sku: "",
};

export default function AdminProductos() {
  const [data, setData] = useState<ContentData | null>(null);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY);
  const [filterCat, setFilterCat] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setData(getContent());
  }, []);

  function save(updated: ContentData) {
    setData(updated);
    saveContent(updated);
  }

  function openNew() {
    setEditing(null);
    setForm(EMPTY);
    setModal(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({ ...p });
    setModal(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    let productos;
    if (editing) {
      productos = data.productos.map((p) =>
        p.id === editing.id ? { ...form, id: editing.id } : p
      );
    } else {
      productos = [...data.productos, { ...form, id: genId() }];
    }
    save({ ...data, productos });
    setModal(false);
  }

  function handleDelete(id: string) {
    if (!data) return;
    if (!confirm("¿Eliminar este producto?")) return;
    save({ ...data, productos: data.productos.filter((p) => p.id !== id) });
  }

  function toggleActive(id: string) {
    if (!data) return;
    save({
      ...data,
      productos: data.productos.map((p) =>
        p.id === id ? { ...p, activo: !p.activo } : p
      ),
    });
  }

  function toggleFeatured(id: string) {
    if (!data) return;
    save({
      ...data,
      productos: data.productos.map((p) =>
        p.id === id ? { ...p, destacado: !p.destacado } : p
      ),
    });
  }

  if (!data) return null;

  const filtered = data.productos.filter((p) => {
    const matchCat = filterCat === "all" || p.categoria === filterCat;
    const matchSearch =
      search === "" ||
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-[clamp(28px,5vw,42px)] text-white leading-none mb-1"
            style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}
          >
            PRODUCTOS
          </h1>
          <p className="text-sm text-[rgba(245,240,232,0.45)]">
            {data.productos.filter((p) => p.activo).length} activos · {data.productos.length} total
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#F5C01A] text-[#0D0D0D] hover:bg-[#FFD84A] transition-colors font-semibold"
          style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: "0.06em" }}
        >
          <Plus size={16} />
          NUEVO PRODUCTO
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[{ id: "all", nombre: "Todos" }, ...data.categorias].map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCat(c.id)}
            className={`px-4 py-1.5 text-xs transition-all ${
              filterCat === c.id
                ? "bg-[#F5C01A] text-[#0D0D0D] font-semibold"
                : "border border-[rgba(245,192,26,0.2)] text-[rgba(245,240,232,0.5)] hover:border-[rgba(245,192,26,0.4)] hover:text-[#F5C01A]"
            }`}
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {c.nombre}
          </button>
        ))}
        <input
          type="text"
          placeholder="Buscar producto o SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto px-4 py-1.5 bg-[#0D0D0D] border border-[rgba(245,192,26,0.15)] text-sm text-[rgba(245,240,232,0.7)] placeholder-[rgba(245,240,232,0.2)] focus:outline-none focus:border-[rgba(245,192,26,0.4)] w-48"
        />
      </div>

      {/* Table */}
      <div className="bg-[#0D0D0D] border border-[rgba(245,192,26,0.12)] rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(245,192,26,0.1)]">
              {["Producto", "Categoría", "Precio", "Stock", "Estado", "Acciones"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[10px] text-[rgba(245,192,26,0.6)] tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[rgba(245,240,232,0.3)] text-sm">
                  No hay productos
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(245,192,26,0.03)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-[rgba(245,240,232,0.85)] font-medium">{p.nombre}</p>
                      {p.sku && <p className="text-[10px] text-[rgba(245,240,232,0.3)]">SKU: {p.sku}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[rgba(245,240,232,0.45)] text-xs">
                    {data.categorias.find((c) => c.id === p.categoria)?.nombre}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[#F5C01A]" style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}>
                      {formatPrice(p.precio)}
                    </span>
                    {p.precio_antes && (
                      <span className="ml-2 text-xs text-[rgba(245,240,232,0.25)] line-through">
                        {formatPrice(p.precio_antes)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-semibold ${
                        p.stock === 0 ? "text-red-400" : p.stock <= 3 ? "text-orange-400" : "text-emerald-400"
                      }`}
                      style={{ fontFamily: "var(--font-bebas)" }}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(p.id)}
                        className={`text-xs flex items-center gap-1 ${p.activo ? "text-emerald-400" : "text-[rgba(245,240,232,0.3)]"}`}
                        title={p.activo ? "Activo" : "Inactivo"}
                      >
                        {p.activo ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      </button>
                      <button
                        onClick={() => toggleFeatured(p.id)}
                        className={p.destacado ? "text-[#F5C01A]" : "text-[rgba(245,240,232,0.2)]"}
                        title={p.destacado ? "Destacado" : "Normal"}
                      >
                        {p.destacado ? <Star size={14} /> : <StarOff size={14} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-1.5 text-[rgba(245,240,232,0.4)] hover:text-[#F5C01A] transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-[rgba(245,240,232,0.4)] hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-[#111] border border-[rgba(245,192,26,0.2)] rounded-sm p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2
                  className="text-xl text-white"
                  style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.06em" }}
                >
                  {editing ? "EDITAR PRODUCTO" : "NUEVO PRODUCTO"}
                </h2>
                <button onClick={() => setModal(false)} className="text-[rgba(245,240,232,0.4)] hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="admin-label">Nombre</label>
                  <input
                    type="text"
                    required
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="admin-input"
                    placeholder="Nombre del producto"
                  />
                </div>

                {/* SKU + Category row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="admin-label">SKU</label>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) => setForm({ ...form, sku: e.target.value })}
                      className="admin-input"
                      placeholder="SHA-001"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Categoría</label>
                    <select
                      value={form.categoria}
                      onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                      className="admin-input"
                    >
                      {data.categorias.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price + Stock row */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="admin-label">Precio (€)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={form.precio}
                      onChange={(e) => setForm({ ...form, precio: parseFloat(e.target.value) || 0 })}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Precio anterior</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.precio_antes ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, precio_antes: e.target.value ? parseFloat(e.target.value) : null })
                      }
                      className="admin-input"
                      placeholder="Opcional"
                    />
                  </div>
                  <div>
                    <label className="admin-label">Stock</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                      className="admin-input"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="admin-label">Descripción</label>
                  <textarea
                    rows={3}
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    className="admin-input resize-none"
                    placeholder="Breve descripción del producto"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="admin-label">URL de imagen</label>
                  <input
                    type="url"
                    value={form.imagen}
                    onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                    className="admin-input"
                    placeholder="https://..."
                  />
                </div>

                {/* Flags */}
                <div className="flex gap-6">
                  {[
                    { key: "activo" as const, label: "Activo (visible en web)" },
                    { key: "destacado" as const, label: "Destacado" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                      <div
                        onClick={() => setForm({ ...form, [key]: !form[key] })}
                        className={`w-5 h-5 border flex items-center justify-center transition-all ${
                          form[key]
                            ? "bg-[#F5C01A] border-[#F5C01A]"
                            : "border-[rgba(245,192,26,0.3)] bg-transparent"
                        }`}
                      >
                        {form[key] && <Check size={12} className="text-[#0D0D0D]" />}
                      </div>
                      <span className="text-xs text-[rgba(245,240,232,0.6)]">{label}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModal(false)}
                    className="flex-1 py-2.5 border border-[rgba(245,192,26,0.2)] text-[rgba(245,240,232,0.5)] hover:text-[rgba(245,240,232,0.8)] transition-colors text-sm"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#F5C01A] text-[#0D0D0D] hover:bg-[#FFD84A] transition-colors font-semibold"
                    style={{ fontFamily: "var(--font-bebas)", fontSize: "16px", letterSpacing: "0.06em" }}
                  >
                    {editing ? "GUARDAR" : "CREAR"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .admin-label {
          display: block;
          font-size: 10px;
          color: rgba(245,192,26,0.6);
          letter-spacing: 0.35em;
          text-transform: uppercase;
          margin-bottom: 6px;
          font-family: var(--font-cinzel);
        }
        .admin-input {
          width: 100%;
          background: #0D0D0D;
          border: 1px solid rgba(245,192,26,0.18);
          color: rgba(245,240,232,0.8);
          padding: 8px 12px;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }
        .admin-input:focus { border-color: rgba(245,192,26,0.4); }
        .admin-input option { background: #111; color: rgba(245,240,232,0.8); }
      `}</style>
    </div>
  );
}
