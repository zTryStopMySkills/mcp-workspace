"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, LayoutDashboard, MessageCircle, FolderOpen, Users, Upload, LogIn, LogOut, Bell, Download, Eye, Shield } from "lucide-react";

const sections = [
  {
    id: "login",
    icon: LogIn,
    color: "indigo",
    title: "Cómo acceder",
    steps: [
      { emoji: "1️⃣", text: "Ve a la página principal y haz clic en **\"Acceder al portal\"**" },
      { emoji: "2️⃣", text: "Introduce tu **nick** (nombre de usuario) y tu **contraseña**" },
      { emoji: "3️⃣", text: "Haz clic en **\"Entrar\"** — serás llevado a tu panel personal" },
      { emoji: "ℹ️", text: "Si no tienes cuenta, contacta con el administrador. No hay registro libre." }
    ]
  },
  {
    id: "dashboard",
    icon: LayoutDashboard,
    color: "indigo",
    title: "Tu panel principal (Dashboard)",
    steps: [
      { emoji: "👋", text: "Al entrar verás un saludo con tu nombre y la hora del día" },
      { emoji: "📊", text: "**Docs sin leer** — cuántos documentos nuevos tienes pendientes de abrir" },
      { emoji: "💬", text: "**Mensajes (24h)** — actividad del chat en las últimas 24 horas" },
      { emoji: "📄", text: "**Documentos recientes** — los últimos archivos que el admin ha compartido contigo" },
      { emoji: "🟢", text: "Los documentos con el badge **NUEVO** son los que aún no has abierto" }
    ]
  },
  {
    id: "chat",
    icon: MessageCircle,
    color: "purple",
    title: "Chat del equipo",
    steps: [
      { emoji: "💬", text: "Haz clic en **\"Chat del Equipo\"** en el menú lateral izquierdo" },
      { emoji: "✍️", text: "Escribe tu mensaje en el campo de abajo y pulsa **Enter** para enviar" },
      { emoji: "↵", text: "Usa **Shift + Enter** para hacer un salto de línea sin enviar" },
      { emoji: "⚡", text: "Los mensajes aparecen **en tiempo real** — todos los agentes los ven al instante" },
      { emoji: "🔵", text: "Tus mensajes aparecen en **azul** (derecha). Los demás en **gris** (izquierda)" }
    ]
  },
  {
    id: "documentos",
    icon: FolderOpen,
    color: "amber",
    title: "Ver documentos",
    steps: [
      { emoji: "📂", text: "Haz clic en **\"Documentos\"** en el menú lateral" },
      { emoji: "🔍", text: "Usa la **barra de búsqueda** para encontrar un documento por nombre" },
      { emoji: "🏷️", text: "Filtra por tipo: **PDF, Imagen, Vídeo, Texto, Otros**" },
      { emoji: "🖱️", text: "Haz clic en cualquier documento para abrirlo y verlo **directamente en la web**" },
      { emoji: "⬇️", text: "Usa el botón **\"Descargar\"** para guardarlo en tu ordenador" },
      { emoji: "🟢", text: "Al abrir un documento, el badge **NUEVO** desaparece automáticamente" }
    ]
  },
  {
    id: "visor",
    icon: Eye,
    color: "green",
    title: "Tipos de documentos que puedes ver en la web",
    steps: [
      { emoji: "📄", text: "**PDF** — se muestra completo en pantalla, página por página" },
      { emoji: "🖼️", text: "**Imágenes** (JPG, PNG, GIF…) — se muestran directamente" },
      { emoji: "🎥", text: "**Vídeos** (MP4, MOV…) — reproductor integrado con controles" },
      { emoji: "🎵", text: "**Audio** (MP3, WAV…) — reproductor de audio" },
      { emoji: "📝", text: "**Word, Excel, PowerPoint** — vista previa via Microsoft Office Online" },
      { emoji: "📋", text: "**Texto, CSV, JSON, código** — se muestra con colores según el tipo" }
    ]
  },
  {
    id: "logout",
    icon: LogOut,
    color: "rose",
    title: "Cerrar sesión",
    steps: [
      { emoji: "👤", text: "En la parte inferior del menú lateral verás tu nombre y nick" },
      { emoji: "🚪", text: "Haz clic en el **icono de salida** (→) para cerrar sesión de forma segura" },
      { emoji: "🔒", text: "Tu sesión dura **7 días** — si no la cierras, seguirás conectado automáticamente" }
    ]
  }
];

const adminSections = [
  {
    id: "crear-agente",
    icon: Users,
    color: "indigo",
    title: "Crear una cuenta de agente",
    steps: [
      { emoji: "1️⃣", text: "Ve a **Admin → Agentes** en el menú lateral" },
      { emoji: "2️⃣", text: "Haz clic en **\"Crear agente\"** (botón azul arriba a la derecha)" },
      { emoji: "3️⃣", text: "Rellena el **nombre completo**, el **nick** (nombre de usuario) y la **contraseña**" },
      { emoji: "4️⃣", text: "Elige el tipo: **Agente** (acceso normal) o **Administrador** (acceso total)" },
      { emoji: "5️⃣", text: "Haz clic en **\"Crear agente\"** — el agente ya puede entrar" },
      { emoji: "🔄", text: "Usa el **interruptor** (toggle) para activar o desactivar el acceso de un agente" }
    ]
  },
  {
    id: "subir-docs",
    icon: Upload,
    color: "amber",
    title: "Subir y compartir documentos",
    steps: [
      { emoji: "1️⃣", text: "Ve a **Admin → Documentos** en el menú lateral" },
      { emoji: "2️⃣", text: "Haz clic en **\"Subir documento\"** (botón dorado arriba a la derecha)" },
      { emoji: "3️⃣", text: "**Arrastra el archivo** al recuadro punteado o haz clic para seleccionarlo" },
      { emoji: "4️⃣", text: "Añade un **título** y una **descripción** opcional para que los agentes entiendan qué es" },
      { emoji: "5️⃣", text: "Elige la visibilidad: **\"Todos los agentes\"** o **\"Agentes específicos\"** (selecciona quiénes)" },
      { emoji: "6️⃣", text: "Haz clic en **\"Compartir documento\"** — aparecerá al instante en el panel de los agentes" },
      { emoji: "✅", text: "Los agentes verán el badge **NUEVO** hasta que lo abran" }
    ]
  },
  {
    id: "gestionar",
    icon: Shield,
    color: "purple",
    title: "Gestionar el equipo",
    steps: [
      { emoji: "👁️", text: "En **Admin → Agentes** ves todos los agentes y su estado (activo/inactivo)" },
      { emoji: "🔴", text: "Para **bloquear el acceso** de un agente, haz clic en el toggle verde — pasará a rojo" },
      { emoji: "🟢", text: "Para **restaurar el acceso**, haz clic de nuevo en el toggle" },
      { emoji: "📊", text: "El **Panel Admin** muestra cuántos agentes activos, documentos y mensajes hay en total" }
    ]
  }
];

const colorMap: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  indigo: { bg: "bg-indigo-600/10", border: "border-indigo-500/20", text: "text-indigo-300", icon: "text-indigo-400" },
  purple: { bg: "bg-purple-600/10", border: "border-purple-500/20", text: "text-purple-300", icon: "text-purple-400" },
  amber:  { bg: "bg-amber-500/10",  border: "border-amber-500/20",  text: "text-amber-300",  icon: "text-amber-400"  },
  green:  { bg: "bg-green-600/10",  border: "border-green-500/20",  text: "text-green-300",  icon: "text-green-400"  },
  rose:   { bg: "bg-rose-600/10",   border: "border-rose-500/20",   text: "text-rose-300",   icon: "text-rose-400"   }
};

function parseText(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
  );
}

function GuideSection({ section, index }: { section: typeof sections[0]; index: number }) {
  const Icon = section.icon;
  const c = colorMap[section.color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={`${c.bg} border ${c.border} rounded-2xl p-6`}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
          <Icon size={20} className={c.icon} />
        </div>
        <h3 className={`font-bold text-lg ${c.text}`}>{section.title}</h3>
      </div>
      <div className="space-y-3">
        {section.steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-lg shrink-0 mt-0.5">{step.emoji}</span>
            <p className="text-slate-300 text-sm leading-relaxed">{parseText(step.text)}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function GuiaPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-slate-200">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Back */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} /> Volver al dashboard
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xl">
              📖
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Guía de uso</h1>
              <p className="text-slate-400 text-sm">Portal de Agentes — Agental.IA</p>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed max-w-2xl">
            Todo lo que necesitas saber para usar el portal. Sigue los pasos de cada sección y cualquier duda consúltala con el administrador.
          </p>
        </motion.div>

        {/* Para todos los agentes */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl">👤</span>
            <h2 className="text-xl font-bold text-white">Para todos los agentes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sections.map((s, i) => <GuideSection key={s.id} section={s} index={i} />)}
          </div>
        </div>

        {/* Solo admin */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">🛡️</span>
            <h2 className="text-xl font-bold text-white">Solo para administradores</h2>
          </div>
          <p className="text-slate-500 text-sm mb-6">Estas opciones solo aparecen si tu cuenta tiene rol de administrador.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {adminSections.map((s, i) => <GuideSection key={s.id} section={s} index={i} />)}
          </div>
        </div>

        {/* Ayuda */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
        >
          <p className="text-2xl mb-3">🙋</p>
          <h3 className="font-semibold text-white mb-2">¿Tienes alguna duda?</h3>
          <p className="text-slate-400 text-sm">
            Contacta con el administrador del portal a través del chat del equipo o por los canales habituales de Agental.IA.
          </p>
          <Link href="/chat" className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-colors">
            <MessageCircle size={16} />
            Ir al chat
          </Link>
        </motion.div>

        <p className="text-center text-slate-700 text-xs mt-8">
          © {new Date().getFullYear()} Agental.IA — Guía de uso v1.0
        </p>
      </div>
    </div>
  );
}
