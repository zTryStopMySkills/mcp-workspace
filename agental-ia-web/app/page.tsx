"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, FolderOpen, Users, ArrowRight, Zap, Shield, Bell, Download, Smartphone, Share } from "lucide-react";
import { useState, useEffect } from "react";

// ── PWA Install Banner ──────────────────────────────────────────────────────
function InstallBanner() {
  const [prompt, setPrompt] = useState<Event | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as Record<string, unknown>).MSStream;
    setIsIOS(ios);

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (installed) return null;

  if (isIOS) {
    return (
      <button
        onClick={() => setShowIOSHint(!showIOSHint)}
        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#00D4AA]/40 text-[#00D4AA] text-sm font-medium hover:bg-[#00D4AA]/10 transition-all"
      >
        <Smartphone size={16} />
        Instalar en iPhone/iPad
      </button>
    );
  }

  if (!prompt) return null;

  return (
    <button
      onClick={() => {
        if (prompt && "prompt" in prompt) {
          (prompt as { prompt: () => void }).prompt();
        }
      }}
      className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#00D4AA]/40 text-[#00D4AA] text-sm font-medium hover:bg-[#00D4AA]/10 transition-all"
    >
      <Download size={16} />
      Instalar App
    </button>
  );
}

// ── Features data ────────────────────────────────────────────────────────────
const features = [
  {
    icon: MessageCircle,
    title: "Chat Privado",
    description: "Comunícate en tiempo real con el resto del equipo en un canal seguro y exclusivo.",
    colorClass: "bg-[#00D4AA]/20 border-[#00D4AA]/30 text-[#00D4AA]"
  },
  {
    icon: FolderOpen,
    title: "Documentos Centralizados",
    description: "Accede a catálogos, contratos y materiales enviados directamente por el administrador.",
    colorClass: "bg-[#C9A84C]/20 border-[#C9A84C]/30 text-[#C9A84C]"
  },
  {
    icon: Bell,
    title: "Notificaciones Inmediatas",
    description: "Recibe alertas cuando haya nuevos documentos o comunicados importantes.",
    colorClass: "bg-[#8B5CF6]/20 border-[#8B5CF6]/30 text-[#8B5CF6]"
  },
  {
    icon: Shield,
    title: "Acceso Seguro",
    description: "Tu cuenta personal con sesión persistente. Solo los agentes registrados pueden acceder.",
    colorClass: "bg-[#3D8B7A]/20 border-[#3D8B7A]/30 text-[#2DD4BF]"
  },
  {
    icon: Users,
    title: "Comunidad de Agentes",
    description: "Conéctate con tus compañeros, comparte ideas y coordina estrategias en equipo.",
    colorClass: "bg-[#00D4AA]/15 border-[#00D4AA]/25 text-[#2DD4BF]"
  },
  {
    icon: Zap,
    title: "Siempre Actualizado",
    description: "Información en tiempo real. Sin emails, sin WhatsApp. Todo en un solo lugar.",
    colorClass: "bg-[#C9A84C]/15 border-[#C9A84C]/25 text-[#C9A84C]"
  }
];

// ── Main Landing ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-[#F1F5F9] overflow-x-hidden">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#00D4AA]/8 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#8B5CF6]/6 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-[600px] h-[400px] bg-[#C9A84C]/5 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#00D4AA]/30 bg-[#0D1117] flex items-center justify-center shrink-0">
            <Image
              src="/logo.jpg"
              alt="Agental.IA"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="font-bold text-xl tracking-tight">
            <span className="text-[#C9A84C]">Agental</span>
            <span className="text-[#00D4AA]">.IA</span>
          </span>
        </div>
        <Link
          href="/login"
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#00D4AA] hover:bg-[#2DD4BF] text-[#0D1117] font-semibold text-sm transition-all hover:scale-105"
        >
          Acceder <ArrowRight size={15} />
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 text-center px-6 pt-20 pb-28 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/25 text-[#00D4AA] text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
            Portal exclusivo para agentes
          </div>

          {/* H1 */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Tu hub de trabajo
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4AA] via-[#2DD4BF] to-[#C9A84C]">
              todo en uno
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#8B95A9] max-w-2xl mx-auto mb-10 leading-relaxed">
            Chat privado, documentos centralizados y comunidad de agentes.
            La plataforma interna de{" "}
            <span className="text-[#C9A84C] font-medium">Agental.IA</span>{" "}
            para coordinarte con tu equipo.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#00D4AA] hover:bg-[#2DD4BF] text-[#0D1117] font-bold text-base transition-all hover:scale-105 shadow-lg shadow-[#00D4AA]/25"
            >
              Acceder al portal <ArrowRight size={18} />
            </Link>
            <InstallBanner />
          </div>
        </motion.div>

        {/* Mock dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-20 relative"
        >
          {/* Glow under the card */}
          <div className="absolute inset-0 bg-[#00D4AA]/5 blur-2xl rounded-3xl -z-10" />
          <div className="bg-white/[0.04] border border-[#00D4AA]/15 rounded-2xl p-4 max-w-3xl mx-auto backdrop-blur-sm">
            {/* Traffic lights */}
            <div className="flex gap-1.5 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <div className="flex gap-3 h-40">
              {/* Sidebar mock */}
              <div className="w-36 bg-white/[0.04] rounded-xl p-3 space-y-2">
                {["Dashboard", "Chat", "Documentos"].map((item) => (
                  <div
                    key={item}
                    className={`text-xs px-2 py-1.5 rounded-lg ${
                      item === "Dashboard"
                        ? "bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/20"
                        : "text-[#8B95A9]"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
              {/* Stats mock */}
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/20 rounded-xl p-3">
                  <p className="text-xs text-[#8B95A9]">Documentos nuevos</p>
                  <p className="text-2xl font-bold text-[#00D4AA] mt-1">3</p>
                </div>
                <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl p-3">
                  <p className="text-xs text-[#8B95A9]">Mensajes</p>
                  <p className="text-2xl font-bold text-[#C9A84C] mt-1">12</p>
                </div>
                <div className="col-span-2 bg-white/[0.04] rounded-xl p-3">
                  <p className="text-xs text-[#8B95A9] mb-2">Último documento</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📄</span>
                    <div>
                      <p className="text-xs text-white font-medium">Catálogo Q2 2025</p>
                      <p className="text-xs text-[#8B95A9]">Hace 2 horas</p>
                    </div>
                    <span className="ml-auto text-xs bg-[#00D4AA]/20 text-[#00D4AA] px-2 py-0.5 rounded-full border border-[#00D4AA]/20">
                      NUEVO
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features grid */}
      <section className="relative z-10 px-6 py-20 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Todo lo que necesitas{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4AA] to-[#C9A84C]">
              en un lugar
            </span>
          </h2>
          <p className="text-[#8B95A9] max-w-xl mx-auto">
            Diseñado específicamente para los agentes de Agental.IA. Sin complicaciones.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] hover:border-[#00D4AA]/20 transition-all group"
              >
                <div className={`inline-flex w-10 h-10 rounded-xl items-center justify-center border ${feature.colorClass} mb-4`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-white text-base mb-2 group-hover:text-[#F1F5F9] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#8B95A9] text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* PWA Section */}
      <section className="relative z-10 px-6 py-20 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white/[0.03] border border-[#00D4AA]/20 rounded-3xl p-10 text-center"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-[#00D4AA]/3 blur-3xl rounded-3xl -z-10" />

          <div className="inline-flex w-14 h-14 rounded-2xl bg-[#00D4AA]/15 border border-[#00D4AA]/25 items-center justify-center mb-6">
            <Smartphone size={26} className="text-[#00D4AA]" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Disponible como App
          </h2>
          <p className="text-[#8B95A9] max-w-lg mx-auto mb-8 leading-relaxed">
            Instala el portal directamente en tu móvil para acceder al instante, sin navegador. Funciona en iOS y Android.
          </p>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-left">
            <div className="bg-white/[0.04] rounded-2xl p-5 border border-white/8">
              <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/20 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] font-bold text-sm mb-3">
                1
              </div>
              <p className="text-sm font-medium text-white mb-1">Abre en Safari / Chrome</p>
              <p className="text-xs text-[#8B95A9]">Accede a esta página desde el navegador de tu dispositivo.</p>
            </div>
            <div className="bg-white/[0.04] rounded-2xl p-5 border border-white/8">
              <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/20 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] font-bold text-sm mb-3">
                2
              </div>
              <p className="text-sm font-medium text-white mb-1 flex items-center gap-1">
                Pulsa <Share size={13} className="text-[#00D4AA]" /> o el menú
              </p>
              <p className="text-xs text-[#8B95A9]">iOS: botón compartir abajo. Android: menú de 3 puntos arriba.</p>
            </div>
            <div className="bg-white/[0.04] rounded-2xl p-5 border border-white/8">
              <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/20 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] font-bold text-sm mb-3">
                3
              </div>
              <p className="text-sm font-medium text-white mb-1">Añadir a pantalla inicio</p>
              <p className="text-xs text-[#8B95A9]">Selecciona "Añadir a inicio" y confirma. Listo.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <InstallBanner />
            <span className="text-xs text-[#8B95A9]">
              También disponible vía Safari → Compartir → Añadir a inicio
            </span>
          </div>
        </motion.div>
      </section>

      {/* CTA final */}
      <section className="relative z-10 px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#00D4AA]/30 bg-[#0D1117]">
              <Image
                src="/logo.jpg"
                alt="Agental.IA"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para entrar?
          </h2>
          <p className="text-[#8B95A9] mb-8">
            Si ya tienes cuenta, accede con tu nick y contraseña.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#00D4AA] hover:bg-[#2DD4BF] text-[#0D1117] font-bold text-base transition-all hover:scale-105 shadow-lg shadow-[#00D4AA]/25"
          >
            Ir al login <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/8 py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded overflow-hidden">
            <Image src="/logo.jpg" alt="" width={20} height={20} className="object-contain" />
          </div>
          <span className="text-[#8B95A9] text-sm font-medium">
            <span className="text-[#C9A84C]">Agental</span>
            <span className="text-[#00D4AA]">.IA</span>
          </span>
        </div>
        <p className="text-[#8B95A9]/50 text-xs">
          © {new Date().getFullYear()} Agental.IA — Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
}
