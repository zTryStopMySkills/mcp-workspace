"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { adminLogin } from "@/lib/utils";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setTimeout(() => {
      if (adminLogin(password)) {
        router.push("/admin");
      } else {
        setError(true);
        setLoading(false);
      }
    }, 500);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#0D0D0D" }}
    >
      {/* Background */}
      <div className="absolute inset-0 damask-bg opacity-50" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(245,192,26,0.1) 0%, transparent 60%)" }} />

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        {/* Card */}
        <div className="border border-[rgba(245,192,26,0.2)] bg-[#111] p-8">
          {/* Header */}
          <div className="text-center mb-8">
            {/* Ornament */}
            <div className="flex items-center justify-center mb-5">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="rgba(245,192,26,0.4)" strokeWidth="1" />
                <path
                  d="M20 4 L22 10 L28 8 L24 13 L30 15 L24 17 L27 23 L21 20 L20 27 L19 20 L13 23 L16 17 L10 15 L16 13 L12 8 L18 10Z"
                  fill="rgba(245,192,26,0.7)"
                />
                <circle cx="20" cy="20" r="3" fill="rgba(245,192,26,0.9)" />
              </svg>
            </div>
            <h1
              className="text-3xl text-white mb-1"
              style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.06em" }}
            >
              PANEL ADMIN
            </h1>
            <p
              className="text-[10px] tracking-[0.4em] text-[rgba(245,192,26,0.5)] uppercase"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Shisha Vaper Sevilla
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-[10px] text-[rgba(245,192,26,0.6)] tracking-widest uppercase mb-2"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className={`w-full bg-[#0D0D0D] border text-[rgba(245,240,232,0.8)] placeholder-[rgba(245,240,232,0.2)] px-4 py-3 pr-12 text-sm focus:outline-none transition-colors ${
                    error
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-[rgba(245,192,26,0.2)] focus:border-[rgba(245,192,26,0.5)]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(245,240,232,0.3)] hover:text-[rgba(245,240,232,0.6)] transition-colors"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-xs mt-2 tracking-wider" style={{ fontFamily: "var(--font-cinzel)" }}>
                  Contraseña incorrecta
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#F5C01A] text-[#0D0D0D] font-semibold hover:bg-[#FFD84A] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ fontFamily: "var(--font-bebas)", fontSize: "18px", letterSpacing: "0.08em" }}
            >
              {loading ? (
                <span className="animate-spin inline-block w-4 h-4 border-2 border-[#0D0D0D] border-t-transparent rounded-full" />
              ) : (
                <>
                  <LogIn size={16} />
                  ACCEDER
                </>
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="text-center mt-6">
            <a
              href="/"
              className="text-[10px] text-[rgba(245,240,232,0.3)] hover:text-[rgba(245,240,232,0.6)] transition-colors tracking-widest uppercase"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              ← Volver a la web
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
