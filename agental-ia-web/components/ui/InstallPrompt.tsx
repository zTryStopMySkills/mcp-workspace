"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem("pwa-install-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    sessionStorage.setItem("pwa-install-dismissed", "1");
    setDismissed(true);
    setVisible(false);
  }

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div className="rounded-2xl p-4 shadow-2xl flex items-center gap-3"
        style={{ background: "#161B22", border: "1px solid #00D4AA44" }}>
        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
          <img src="/logo.jpg" alt="Agental.IA" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-tight">Instalar Agental.IA</p>
          <p className="text-xs text-gray-400 mt-0.5">Acceso rápido desde tu móvil</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={handleDismiss} className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1">No</button>
          <button
            onClick={handleInstall}
            className="text-xs font-bold px-3 py-1.5 rounded-lg text-white"
            style={{ background: "linear-gradient(135deg, #00D4AA, #00b894)" }}
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
}
