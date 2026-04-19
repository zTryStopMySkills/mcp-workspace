import Link from "next/link";
import { CheckCircle2, Mail, GraduationCap } from "lucide-react";

export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="inline-flex w-20 h-20 rounded-3xl bg-[#00D4AA]/15 border border-[#00D4AA]/30 items-center justify-center mb-6">
          <CheckCircle2 size={36} className="text-[#00D4AA]" />
        </div>
        <h1 className="text-3xl font-bold mb-3">¡Pago recibido!</h1>
        <p className="text-[#8B95A9] mb-6 leading-relaxed">
          Gracias por unirte a CortesIA Academy. Te acabamos de enviar un email con tu
          usuario y contraseña. Revisa tu bandeja de entrada (y la de spam).
        </p>

        <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-5 mb-6 text-left">
          <div className="flex items-center gap-2 mb-2">
            <Mail size={14} className="text-[#7DD3FC]" />
            <p className="text-sm font-semibold">¿No te ha llegado en 5 minutos?</p>
          </div>
          <ol className="text-xs text-[#8B95A9] space-y-1 list-decimal pl-4">
            <li>Comprueba la carpeta spam / no deseados</li>
            <li>Escribe a <span className="text-white">hola@cortesia.ai</span> con tu email</li>
            <li>Te regeneramos las credenciales en &lt;2h</li>
          </ol>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7DD3FC] hover:bg-[#7DD3FC]/90 text-[#0D1117] font-bold text-sm transition-all"
        >
          <GraduationCap size={16} />
          Ir al login
        </Link>
      </div>
    </div>
  );
}
