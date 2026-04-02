"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, ShoppingCart, AlertTriangle, TrendingUp, Star, Clock, ArrowRight } from "lucide-react";
import { getContent, formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  const [data, setData] = useState<ReturnType<typeof getContent> | null>(null);

  useEffect(() => {
    setData(getContent());
  }, []);

  if (!data) return null;

  const totalProductos = data.productos.filter((p) => p.activo).length;
  const stockBajo = data.productos.filter((p) => p.activo && p.stock <= 3).length;
  const totalVentas = (data.ventas as { total?: number }[]).reduce((s, v) => s + (v.total ?? 0), 0);
  const numVentas = data.ventas.length;

  const stats = [
    {
      label: "Productos activos",
      value: totalProductos,
      icon: Package,
      sub: `${stockBajo} con stock bajo`,
      color: "text-[#F5C01A]",
      bg: "bg-[rgba(245,192,26,0.06)]",
      border: "border-[rgba(245,192,26,0.2)]",
    },
    {
      label: "Ventas registradas",
      value: numVentas,
      icon: ShoppingCart,
      sub: `Total: ${formatPrice(totalVentas)}`,
      color: "text-emerald-400",
      bg: "bg-[rgba(52,211,153,0.06)]",
      border: "border-[rgba(52,211,153,0.2)]",
    },
    {
      label: "Stock bajo",
      value: stockBajo,
      icon: AlertTriangle,
      sub: stockBajo > 0 ? "Requieren reposición" : "Todo en orden",
      color: stockBajo > 0 ? "text-orange-400" : "text-[#F5C01A]",
      bg: stockBajo > 0 ? "bg-[rgba(251,146,60,0.06)]" : "bg-[rgba(245,192,26,0.06)]",
      border: stockBajo > 0 ? "border-[rgba(251,146,60,0.2)]" : "border-[rgba(245,192,26,0.2)]",
    },
    {
      label: "Ingresos totales",
      value: formatPrice(totalVentas),
      icon: TrendingUp,
      sub: "Ventas registradas",
      color: "text-blue-400",
      bg: "bg-[rgba(96,165,250,0.06)]",
      border: "border-[rgba(96,165,250,0.2)]",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-7">
      {/* Header */}
      <div>
        <h1
          className="text-[clamp(28px,5vw,42px)] text-white leading-none mb-1"
          style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}
        >
          DASHBOARD
        </h1>
        <p className="text-sm text-[rgba(245,240,232,0.45)]">
          Bienvenido al panel de gestión de Shisha Vaper Sevilla
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`p-5 border ${s.border} ${s.bg} rounded-sm`}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon size={18} className={s.color} />
                <span className={`text-3xl font-bold ${s.color}`} style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}>
                  {s.value}
                </span>
              </div>
              <p className="text-sm text-[rgba(245,240,232,0.8)] mb-1">{s.label}</p>
              <p className="text-xs text-[rgba(245,240,232,0.35)]">{s.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Products with low stock */}
        <div className="bg-[#0D0D0D] border border-[rgba(245,192,26,0.12)] rounded-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg text-white"
              style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.06em" }}
            >
              STOCK BAJO
            </h2>
            <a
              href="/admin/inventario"
              className="flex items-center gap-1 text-[10px] text-[rgba(245,192,26,0.6)] hover:text-[#F5C01A] transition-colors tracking-widest uppercase"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Ver todo <ArrowRight size={12} />
            </a>
          </div>
          {stockBajo === 0 ? (
            <div className="flex items-center gap-3 py-4 text-[rgba(245,240,232,0.35)]">
              <Star size={16} className="text-[#F5C01A]" />
              <span className="text-sm">Todo el stock en niveles normales</span>
            </div>
          ) : (
            <div className="space-y-2">
              {data.productos
                .filter((p) => p.activo && p.stock <= 3)
                .map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-[rgba(255,255,255,0.04)] last:border-0">
                    <span className="text-sm text-[rgba(245,240,232,0.75)]">{p.nombre}</span>
                    <span
                      className={`text-sm font-semibold ${p.stock === 0 ? "text-red-400" : "text-orange-400"}`}
                      style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}
                    >
                      {p.stock === 0 ? "AGOTADO" : `${p.stock} uds.`}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Recent sales */}
        <div className="bg-[#0D0D0D] border border-[rgba(245,192,26,0.12)] rounded-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg text-white"
              style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.06em" }}
            >
              VENTAS RECIENTES
            </h2>
            <a
              href="/admin/ventas"
              className="flex items-center gap-1 text-[10px] text-[rgba(245,192,26,0.6)] hover:text-[#F5C01A] transition-colors tracking-widest uppercase"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Ver todo <ArrowRight size={12} />
            </a>
          </div>
          {numVentas === 0 ? (
            <div className="flex items-center gap-3 py-4 text-[rgba(245,240,232,0.35)]">
              <Clock size={16} className="text-[rgba(245,192,26,0.4)]" />
              <span className="text-sm">Aún no hay ventas registradas</span>
            </div>
          ) : (
            <div className="space-y-2">
              {(data.ventas as { id: string; producto?: string; total?: number; fecha?: string }[])
                .slice(-5)
                .reverse()
                .map((v) => (
                  <div key={v.id} className="flex items-center justify-between py-2.5 border-b border-[rgba(255,255,255,0.04)] last:border-0">
                    <div>
                      <p className="text-sm text-[rgba(245,240,232,0.75)]">{v.producto ?? "Venta"}</p>
                      {v.fecha && (
                        <p className="text-[10px] text-[rgba(245,240,232,0.3)]">{v.fecha}</p>
                      )}
                    </div>
                    <span className="text-sm text-[#F5C01A]" style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}>
                      {formatPrice(v.total ?? 0)}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/admin/productos", label: "Añadir Producto", icon: Package },
          { href: "/admin/ventas", label: "Registrar Venta", icon: ShoppingCart },
          { href: "/admin/galeria", label: "Subir Imagen", icon: AlertTriangle },
          { href: "/admin/configuracion", label: "Configuración", icon: TrendingUp },
        ].map(({ href, label, icon: Icon }) => (
          <a
            key={href}
            href={href}
            className="flex flex-col items-center justify-center gap-2 p-4 border border-[rgba(245,192,26,0.1)] bg-[rgba(245,192,26,0.03)] hover:border-[rgba(245,192,26,0.3)] hover:bg-[rgba(245,192,26,0.06)] transition-all text-center group"
          >
            <Icon size={18} className="text-[rgba(245,192,26,0.5)] group-hover:text-[#F5C01A] transition-colors" />
            <span
              className="text-[10px] text-[rgba(245,240,232,0.5)] group-hover:text-[rgba(245,240,232,0.8)] transition-colors tracking-widest uppercase"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
