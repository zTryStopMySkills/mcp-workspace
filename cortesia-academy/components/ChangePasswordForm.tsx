"use client";

import { useState, FormEvent } from "react";
import { KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }
    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error desconocido.");
      } else {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setError("Error de red. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-[#161B22] border border-[#30363D] p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center">
          <KeyRound size={15} className="text-[#C9A84C]" />
        </div>
        <h2 className="text-base font-semibold text-white">Cambiar contraseña</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current password */}
        <div>
          <label className="block text-xs text-[#8B949E] font-medium mb-1.5">
            Contraseña actual
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#484F58] focus:outline-none focus:border-[#C9A84C]/60 transition-colors pr-10"
              placeholder="Tu contraseña actual"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#484F58] hover:text-[#8B949E] transition-colors"
              tabIndex={-1}
            >
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* New password */}
        <div>
          <label className="block text-xs text-[#8B949E] font-medium mb-1.5">
            Nueva contraseña
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#484F58] focus:outline-none focus:border-[#C9A84C]/60 transition-colors pr-10"
              placeholder="Mínimo 8 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#484F58] hover:text-[#8B949E] transition-colors"
              tabIndex={-1}
            >
              {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Confirm new password */}
        <div>
          <label className="block text-xs text-[#8B949E] font-medium mb-1.5">
            Confirmar nueva contraseña
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#484F58] focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
            placeholder="Repite la nueva contraseña"
          />
        </div>

        {/* Feedback */}
        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5">
            <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2.5">
            <CheckCircle2 size={14} className="text-green-400 mt-0.5 shrink-0" />
            <p className="text-xs text-green-400">Contraseña actualizada correctamente.</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#D4B86A] disabled:opacity-60 disabled:cursor-not-allowed text-[#0D1117] font-bold text-sm py-2.5 rounded-lg transition-colors"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Actualizando...
            </>
          ) : (
            "Cambiar contraseña"
          )}
        </button>
      </form>
    </div>
  );
}
