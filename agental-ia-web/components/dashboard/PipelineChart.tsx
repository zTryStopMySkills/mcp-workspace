"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

interface ChartEntry {
  mes: string;
  creadas: number;
  cerradas: number;
  volumen: number;
}

interface Props {
  data: ChartEntry[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 shadow-xl text-xs" style={{ background: "#161B22", border: "1px solid #ffffff15" }}>
      <p className="text-slate-400 mb-2 font-medium uppercase tracking-wide">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="font-semibold text-white">
            {p.name === "Volumen" ? `${p.value.toLocaleString("es-ES")} €` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PipelineChart({ data }: Props) {
  const hasData = data.some(d => d.creadas > 0 || d.cerradas > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
        Sin datos de los últimos 6 meses
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barGap={4} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
        <XAxis
          dataKey="mes"
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: "#6b7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#ffffff06" }} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "#6b7280", paddingTop: 8 }}
          iconType="circle"
          iconSize={8}
        />
        <Bar dataKey="creadas" name="Creadas" fill="#334155" radius={[3, 3, 0, 0]} maxBarSize={28} />
        <Bar dataKey="cerradas" name="Cerradas" fill="#00D4AA" radius={[3, 3, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
