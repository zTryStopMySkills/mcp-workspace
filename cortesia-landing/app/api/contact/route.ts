import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
  const { name, email, message, service } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.log("[contact form]", { name, email, service, message });
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: "Web CortesIA <hola@cortesia.ai>",
    to: "hola@cortesia.ai",
    replyTo: email,
    subject: `[Contacto Web] ${service ? `[${service}] ` : ""}${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0D1117; color: #E6EDF3; padding: 32px; border-radius: 12px;">
        <h2 style="color: #C9A84C; margin: 0 0 24px;">Nuevo mensaje desde cortesia.io</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #8B95A9; width: 100px;">Nombre</td><td style="padding: 8px 0; color: #E6EDF3;">${name}</td></tr>
          <tr><td style="padding: 8px 0; color: #8B95A9;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #7DD3FC;">${email}</a></td></tr>
          ${service ? `<tr><td style="padding: 8px 0; color: #8B95A9;">Servicio</td><td style="padding: 8px 0; color: #E6EDF3;">${service}</td></tr>` : ""}
        </table>
        <div style="margin-top: 24px; padding: 20px; background: #161B22; border-radius: 8px; border: 1px solid #30363D;">
          <p style="margin: 0; color: #E6EDF3; line-height: 1.6;">${message.replace(/\n/g, "<br>")}</p>
        </div>
      </div>
    `
  });

  if (error) {
    console.error("[contact form] resend error:", error);
    return NextResponse.json({ error: "Error al enviar el mensaje" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
