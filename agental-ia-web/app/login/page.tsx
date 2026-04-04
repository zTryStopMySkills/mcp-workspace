"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [nick, setNick] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      nick: nick.trim(),
      password,
      redirect: false
    });

    setLoading(false);

    if (res?.error) {
      if (res.error === "INACTIVE") {
        setError("Tu cuenta está desactivada. Contacta con el administrador.");
      } else {
        setError("Nick o contraseña incorrectos.");
      }
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00D4AA]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] bg-[#C9A84C]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#8B5CF6]/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Logo + Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl overflow-hidden border border-[#00D4AA]/30 bg-[#0D1117] mb-5 shadow-xl shadow-[#00D4AA]/10">
            <Image
              src="/logo.jpg"
              alt="Agental.IA"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-[#C9A84C]">Agental</span>
            <span className="text-[#00D4AA]">.IA</span>
          </h1>
          <p className="text-[#8B95A9] text-sm mt-1">Portal de Agentes</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
          <h2 className="text-lg font-semibold text-white mb-6">Acceder a tu cuenta</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nick */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Nick
              </label>
              <input
                type="text"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                placeholder="tu_nick"
                required
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-[#8B95A9] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA]/50 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-[#8B95A9] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA]/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B95A9] hover:text-slate-200 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
              >
                <span>⚠️</span>
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#00D4AA] hover:bg-[#2DD4BF] disabled:opacity-50 disabled:cursor-not-allowed text-[#0D1117] font-bold transition-all hover:scale-[1.01] shadow-lg shadow-[#00D4AA]/20"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <LogIn size={18} />
              )}
              {loading ? "Accediendo..." : "Entrar"}
            </button>
          </form>
        </div>

        {/* Decorative line */}
        <div className="flex items-center gap-3 my-5 px-2">
          <div className="flex-1 h-px bg-white/5" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]/40" />
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <p className="text-center text-[#8B95A9]/60 text-xs">
          ¿Problemas para acceder? Contacta con el administrador.
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
