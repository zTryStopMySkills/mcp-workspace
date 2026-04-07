"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, ToggleLeft, ToggleRight, Loader2, Eye, EyeOff, ShieldCheck, UserCheck, UserX, KeyRound, X, Target } from "lucide-react";
import type { Agent } from "@/types";
import { formatDate, initials } from "@/lib/utils";

interface AgentesClientProps {
  initialAgents: Agent[];
}

export function AgentesClient({ initialAgents }: AgentesClientProps) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({ nick: "", name: "", password: "", role: "agent" as "agent" | "admin" });
  const [resetPasswordId, setResetPasswordId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [targetAgentId, setTargetAgentId] = useState<string | null>(null);
  const [targetInput, setTargetInput] = useState("");
  const [savingTarget, setSavingTarget] = useState(false);

  async function createAgent(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "No se pudo crear el agente. Inténtalo de nuevo.");
      return;
    }

    setAgents((prev) => [data, ...prev]);
    setForm({ nick: "", name: "", password: "", role: "agent" });
    setShowForm(false);
    setSuccess(`✓ Agente @${data.nick} creado. Ya puede acceder con su nick y contraseña.`);
    setTimeout(() => setSuccess(""), 6000);
  }

  async function toggleActive(agent: Agent) {
    setTogglingId(agent.id);
    setError("");

    const res = await fetch(`/api/agents/${agent.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !agent.is_active })
    });

    setTogglingId(null);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "No se pudo cambiar el estado del agente.");
      return;
    }

    const updated = await res.json();
    setAgents((prev) => prev.map((a) => (a.id === agent.id ? { ...a, is_active: updated.is_active } : a)));
    setSuccess(`${agent.name} ${updated.is_active ? "activado" : "desactivado"} correctamente.`);
    setTimeout(() => setSuccess(""), 4000);
  }

  async function resetPassword(agentId: string) {
    if (newPassword.length < 6) return;
    setResetLoading(true);
    try {
      const res = await fetch(`/api/agents/${agentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword })
      });
      if (res.ok) {
        setResetPasswordId(null);
        setNewPassword("");
        setSuccess("Contraseña actualizada correctamente.");
        setTimeout(() => setSuccess(""), 4000);
      } else {
        const data = await res.json();
        setError(data.error ?? "Error al cambiar la contraseña.");
      }
    } catch {
      setError("Error de red. Inténtalo de nuevo.");
    } finally {
      setResetLoading(false);
    }
  }

  async function saveTarget(agentId: string) {
    const val = parseInt(targetInput);
    if (!val || val <= 0) return;
    setSavingTarget(true);
    try {
      await fetch("/api/targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_amount: val, agent_id: agentId }),
      });
      setTargetAgentId(null);
      setTargetInput("");
      setSuccess("Objetivo mensual fijado correctamente.");
      setTimeout(() => setSuccess(""), 4000);
    } catch {
      setError("Error al guardar el objetivo.");
    } finally {
      setSavingTarget(false);
    }
  }

  const activeCount = agents.filter((a) => a.is_active).length;

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-amber-400 text-sm font-medium mb-1">Administración</p>
          <h1 className="text-3xl font-bold text-white">Gestión de Agentes</h1>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(""); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus size={16} />
          Crear agente
        </button>
      </div>
      <p className="text-slate-400 text-sm mb-2">
        Crea y gestiona las cuentas de acceso de tus agentes comerciales.
      </p>
      <p className="text-xs text-slate-600 mb-8">
        {activeCount} agente{activeCount !== 1 ? "s" : ""} activo{activeCount !== 1 ? "s" : ""} · {agents.length} en total
      </p>

      {/* Formulario de creación */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            className="bg-white/5 border border-indigo-500/20 rounded-2xl p-6 mb-6"
          >
            <h2 className="font-semibold text-white mb-1">Nuevo agente</h2>
            <p className="text-xs text-slate-400 mb-5">
              El agente podrá acceder con el nick y contraseña que definas aquí.
            </p>
            <form onSubmit={createAgent} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nombre completo" hint="Nombre que verán los demás en el chat">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: María García"
                  required
                  className="input-base"
                />
              </Field>
              <Field label="Nick (nombre de usuario)" hint="Único, sin espacios, solo minúsculas">
                <input
                  type="text"
                  value={form.nick}
                  onChange={(e) => setForm({ ...form, nick: e.target.value.toLowerCase().replace(/\s/g, "_") })}
                  placeholder="Ej: maria_garcia"
                  required
                  minLength={3}
                  className="input-base"
                />
              </Field>
              <Field label="Contraseña" hint="Mínimo 6 caracteres">
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Contraseña segura"
                    required
                    minLength={6}
                    className="input-base pr-10"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>
              <Field label="Tipo de cuenta" hint="Los admins pueden subir documentos y crear agentes">
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "agent" | "admin" })} className="input-base">
                  <option value="agent">Agente (acceso estándar)</option>
                  <option value="admin">Administrador (acceso completo)</option>
                </select>
              </Field>

              {error && (
                <div className="sm:col-span-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                  ⚠️ {error}
                </div>
              )}

              <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => { setShowForm(false); setError(""); }} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {loading ? "Creando..." : "Crear agente"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mensajes globales */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
            {success}
          </motion.div>
        )}
        {error && !showForm && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            ⚠️ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de agentes */}
      {agents.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Users size={36} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium mb-1">No hay agentes registrados</p>
          <p className="text-sm">Crea el primer agente con el botón de arriba.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {agents.map((agent) => (
            <div key={agent.id} className="space-y-0">
            <div className={`flex items-center gap-4 p-4 border rounded-xl transition-colors ${
              resetPasswordId === agent.id ? "rounded-b-none border-b-0 border-indigo-500/30" :
              agent.is_active ? "bg-white/[0.04] border-white/10" : "bg-white/[0.02] border-white/5 opacity-60"
            }`}>
              <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                agent.is_active
                  ? "bg-indigo-600/30 border-indigo-500/30 text-indigo-300"
                  : "bg-slate-700/30 border-slate-600/30 text-slate-500"
              }`}>
                {initials(agent.name)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-white">{agent.name}</p>
                  {agent.role === "admin" && (
                    <span className="flex items-center gap-1 text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      <ShieldCheck size={10} /> Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">@{agent.nick} · Creado el {formatDate(agent.created_at)}</p>
              </div>

              {/* Estado */}
              <span className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border shrink-0 ${
                agent.is_active
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-slate-500/20 text-slate-400 border-slate-500/30"
              }`}>
                {agent.is_active ? <UserCheck size={11} /> : <UserX size={11} />}
                {agent.is_active ? "Activo" : "Inactivo"}
              </span>

              {/* Fijar objetivo */}
              <button
                onClick={() => { setTargetAgentId(targetAgentId === agent.id ? null : agent.id); setTargetInput(""); setResetPasswordId(null); }}
                className={`transition-colors shrink-0 ${targetAgentId === agent.id ? "text-[#00D4AA]" : "text-slate-500 hover:text-[#00D4AA]"}`}
                title="Fijar objetivo mensual"
              >
                <Target size={16} />
              </button>

              {/* Reset password */}
              <button
                onClick={() => { setResetPasswordId(resetPasswordId === agent.id ? null : agent.id); setNewPassword(""); setTargetAgentId(null); }}
                className={`transition-colors shrink-0 ${resetPasswordId === agent.id ? "text-indigo-400" : "text-slate-500 hover:text-indigo-400"}`}
                title="Cambiar contraseña"
              >
                <KeyRound size={16} />
              </button>

              {/* Toggle */}
              <button
                onClick={() => toggleActive(agent)}
                disabled={togglingId === agent.id}
                className="text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                title={agent.is_active ? "Desactivar acceso" : "Activar acceso"}
              >
                {togglingId === agent.id
                  ? <Loader2 size={20} className="animate-spin" />
                  : agent.is_active
                    ? <ToggleRight size={22} className="text-green-400" />
                    : <ToggleLeft size={22} className="text-slate-500" />
                }
              </button>
            </div>
            {/* Inline target form */}
            <AnimatePresence>
              {targetAgentId === agent.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#00D4AA]/5 border border-[#00D4AA]/25 border-t-0 rounded-b-xl">
                    <Target size={14} className="text-[#00D4AA] shrink-0" />
                    <span className="text-xs text-slate-400 shrink-0">Objetivo este mes para {agent.name}:</span>
                    <input
                      type="number"
                      value={targetInput}
                      onChange={e => setTargetInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && saveTarget(agent.id)}
                      placeholder="ej. 5000"
                      min={1}
                      className="w-28 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D4AA]/50 transition-colors"
                    />
                    <span className="text-slate-500 text-sm">€</span>
                    <button
                      onClick={() => saveTarget(agent.id)}
                      disabled={savingTarget || !targetInput}
                      className="px-4 py-2 bg-[#00D4AA] hover:bg-[#00D4AA]/80 disabled:opacity-40 text-black font-semibold rounded-lg text-xs transition-colors shrink-0"
                    >
                      {savingTarget ? <Loader2 size={13} className="animate-spin" /> : "Guardar"}
                    </button>
                    <button onClick={() => { setTargetAgentId(null); setTargetInput(""); }} className="text-slate-500 hover:text-white transition-colors shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Inline password reset form */}
            <AnimatePresence>
              {resetPasswordId === agent.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 px-4 py-3 bg-indigo-500/5 border border-indigo-500/30 border-t-0 rounded-b-xl">
                    <KeyRound size={14} className="text-indigo-400 shrink-0" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nueva contraseña (mín. 6 caracteres)"
                      minLength={6}
                      className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button
                      onClick={() => resetPassword(agent.id)}
                      disabled={resetLoading || newPassword.length < 6}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition-colors shrink-0"
                    >
                      {resetLoading ? <Loader2 size={13} className="animate-spin" /> : "Guardar"}
                    </button>
                    <button onClick={() => { setResetPasswordId(null); setNewPassword(""); }} className="text-slate-500 hover:text-white transition-colors shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .input-base {
          width: 100%;
          padding: 10px 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: white;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-base:focus { border-color: #4F46E5; }
        .input-base::placeholder { color: #475569; }
        select.input-base option { background: #1e293b; }
      `}</style>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-300 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  );
}
