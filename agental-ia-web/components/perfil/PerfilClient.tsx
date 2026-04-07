"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Camera, Save, Lock, User, Mail, CheckCircle, XCircle, Loader2, TrendingUp, Phone } from "lucide-react";
import { initials } from "@/lib/utils";

interface PerfilData {
  nick: string;
  name: string;
  role: string;
  avatar_url: string | null;
  created_at: string;
  email?: string | null;
}

interface Props {
  perfil: PerfilData;
  agentStats?: { total: number; closed: number; totalBilled: number; closeRate: number };
  waTemplate?: string | null;
}

const DEFAULT_WA_TEMPLATE = "Hola {cliente}, te escribo de Agentalia-webs en relación a tu propuesta. ¿Tienes un momento para hablar?";

export function PerfilClient({ perfil, agentStats, waTemplate: initialWaTemplate }: Props) {
  const { update } = useSession();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(perfil.name);
  const [email, setEmail] = useState(perfil.email ?? "");
  const [avatarUrl, setAvatarUrl] = useState(perfil.avatar_url);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [waTemplateText, setWaTemplateText] = useState(initialWaTemplate ?? DEFAULT_WA_TEMPLATE);
  const [savingWa, setSavingWa] = useState(false);
  const [waMsg, setWaMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/agents/me/avatar", { method: "POST", body: fd });
    const data = await res.json();
    setUploadingAvatar(false);

    if (res.ok) {
      setAvatarUrl(data.avatar_url);
    } else {
      setProfileMsg({ ok: false, text: data.error ?? "Error al subir el avatar" });
    }
  };

  const handleSaveWaTemplate = async () => {
    if (!waTemplateText.trim()) return;
    setSavingWa(true);
    setWaMsg(null);
    const res = await fetch("/api/agents/me/whatsapp-template", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_text: waTemplateText.trim() }),
    });
    setSavingWa(false);
    if (res.ok) {
      setWaMsg({ ok: true, text: "Plantilla guardada correctamente" });
    } else {
      const data = await res.json();
      setWaMsg({ ok: false, text: data.error ?? "Error al guardar" });
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) return;
    setSavingProfile(true);
    setProfileMsg(null);

    const res = await fetch("/api/agents/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim() || null })
    });
    const data = await res.json();
    setSavingProfile(false);

    if (res.ok) {
      setProfileMsg({ ok: true, text: "Perfil actualizado correctamente" });
      await update({ name: name.trim() });
    } else {
      setProfileMsg({ ok: false, text: data.error ?? "Error al guardar" });
    }
  };

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ ok: false, text: "Rellena todos los campos" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ ok: false, text: "Las contraseñas no coinciden" });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ ok: false, text: "La contraseña debe tener al menos 6 caracteres" });
      return;
    }

    setSavingPassword(true);
    setPasswordMsg(null);

    const res = await fetch("/api/agents/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
    });
    const data = await res.json();
    setSavingPassword(false);

    if (res.ok) {
      setPasswordMsg({ ok: true, text: "Contraseña cambiada correctamente" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordMsg({ ok: false, text: data.error ?? "Error al cambiar la contraseña" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
        <p className="text-[#8B95A9] text-sm mt-1">Gestiona tu información y seguridad</p>
      </div>

      {/* Avatar + datos básicos */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.03] border border-white/8 rounded-2xl p-6"
      >
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#00D4AA]/30 bg-[#00D4AA]/10 flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-[#00D4AA]">{initials(name)}</span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#00D4AA] text-black flex items-center justify-center shadow-lg hover:bg-[#00b894] transition-colors disabled:opacity-50"
              title="Cambiar avatar"
            >
              {uploadingAvatar ? <Loader2 size={13} className="animate-spin" /> : <Camera size={13} />}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Info fija */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-semibold text-white truncate">{name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                perfil.role === "admin"
                  ? "bg-[#C9A84C]/20 text-[#C9A84C]"
                  : "bg-[#00D4AA]/15 text-[#00D4AA]"
              }`}>
                {perfil.role === "admin" ? "Admin" : "Agente"}
              </span>
            </div>
            <p className="text-[#8B95A9] text-sm">@{perfil.nick}</p>
            <p className="text-[#8B95A9]/60 text-xs mt-1">
              Miembro desde {new Date(perfil.created_at).toLocaleDateString("es-ES", { year: "numeric", month: "long" })}
            </p>
          </div>
        </div>

        {/* Nombre editable */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#8B95A9] mb-1.5">
              <User size={13} className="inline mr-1.5" />
              Nombre completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00D4AA]/50 focus:bg-white/[0.07] transition-all"
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8B95A9] mb-1.5">
              <Mail size={13} className="inline mr-1.5" />
              Email de notificaciones
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={200}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#00D4AA]/50 focus:bg-white/[0.07] transition-all"
              placeholder="tu@gmail.com"
            />
            <p className="text-xs text-slate-500 mt-1.5">Recibirás un email cuando llegue un nuevo lead desde la landing</p>
          </div>

          {profileMsg && (
            <div className={`flex items-center gap-2 text-sm ${profileMsg.ok ? "text-emerald-400" : "text-red-400"}`}>
              {profileMsg.ok ? <CheckCircle size={15} /> : <XCircle size={15} />}
              {profileMsg.text}
            </div>
          )}

          <button
            onClick={handleSaveProfile}
            disabled={savingProfile || !name.trim() || (name === perfil.name && email.trim() === (perfil.email ?? ""))}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00D4AA] text-black font-semibold text-sm rounded-xl hover:bg-[#00b894] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {savingProfile ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Guardar nombre
          </button>
        </div>
      </motion.div>

      {agentStats && agentStats.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="bg-white/[0.03] border border-white/8 rounded-2xl p-6"
        >
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#00D4AA]" />
            Mi rendimiento
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Propuestas", value: agentStats.total, color: "text-white" },
              { label: "Cerradas", value: agentStats.closed, color: "text-[#00D4AA]" },
              { label: "Tasa cierre", value: `${agentStats.closeRate}%`, color: "text-[#C9A84C]" },
              { label: "Facturado", value: `${agentStats.totalBilled.toLocaleString("es-ES")} €`, color: "text-[#00D4AA]" },
            ].map(s => (
              <div key={s.label} className="text-center p-3 bg-white/[0.03] rounded-xl">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-[#8B95A9] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Plantilla WhatsApp */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/[0.03] border border-white/8 rounded-2xl p-6"
      >
        <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
          <Phone size={16} className="text-[#25D366]" />
          Plantilla de WhatsApp
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Variables disponibles: <code className="text-[#00D4AA] bg-[#00D4AA]/10 px-1 rounded">{"{cliente}"}</code>{" "}
          <code className="text-[#00D4AA] bg-[#00D4AA]/10 px-1 rounded">{"{plan}"}</code>{" "}
          <code className="text-[#00D4AA] bg-[#00D4AA]/10 px-1 rounded">{"{precio}"}</code>
        </p>
        <textarea
          value={waTemplateText}
          onChange={e => setWaTemplateText(e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#25D366]/50 focus:bg-white/[0.07] transition-all resize-none"
          placeholder={DEFAULT_WA_TEMPLATE}
        />
        <div className="flex items-center justify-between mt-3">
          <div>
            {waMsg && (
              <div className={`flex items-center gap-2 text-sm ${waMsg.ok ? "text-emerald-400" : "text-red-400"}`}>
                {waMsg.ok ? <CheckCircle size={14} /> : <XCircle size={14} />}
                {waMsg.text}
              </div>
            )}
          </div>
          <button
            onClick={handleSaveWaTemplate}
            disabled={savingWa || !waTemplateText.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-black font-semibold text-sm rounded-xl hover:bg-[#1fb855] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {savingWa ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Guardar plantilla
          </button>
        </div>
      </motion.div>

      {/* Cambiar contraseña */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="bg-white/[0.03] border border-white/8 rounded-2xl p-6"
      >
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Lock size={16} className="text-[#C9A84C]" />
          Cambiar contraseña
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#8B95A9] mb-1.5">Contraseña actual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-all"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#8B95A9] mb-1.5">Nueva contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-all"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#8B95A9] mb-1.5">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-all"
              placeholder="Repite la nueva contraseña"
            />
          </div>

          {passwordMsg && (
            <div className={`flex items-center gap-2 text-sm ${passwordMsg.ok ? "text-emerald-400" : "text-red-400"}`}>
              {passwordMsg.ok ? <CheckCircle size={15} /> : <XCircle size={15} />}
              {passwordMsg.text}
            </div>
          )}

          <button
            onClick={handleSavePassword}
            disabled={savingPassword}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A84C] text-black font-semibold text-sm rounded-xl hover:bg-[#b8963e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {savingPassword ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
            Cambiar contraseña
          </button>
        </div>
      </motion.div>
    </div>
  );
}
