"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Agental.IA] Fatal error:", error);
  }, [error]);

  return (
    <html lang="es">
      <body style={{ background: "#0A0F1E", margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          textAlign: "center"
        }}>
          <div style={{ maxWidth: "400px" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>⚠️</div>
            <h1 style={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Error crítico
            </h1>
            <p style={{ color: "#8B95A9", fontSize: "0.875rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Se produjo un error grave en la aplicación.
            </p>
            {error.digest && (
              <p style={{ color: "#8B95A9", fontSize: "0.75rem", fontFamily: "monospace", marginBottom: "1.5rem" }}>
                {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                padding: "0.625rem 1.5rem",
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #00D4AA, #2DD4BF)",
                color: "#0D1117",
                border: "none",
                cursor: "pointer"
              }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
