import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { resend } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { business_name, contact_name, phone, email, sector, location, has_web, plan_interest, message } = body;

    // Validate required fields
    if (!business_name?.trim() || !contact_name?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // Save lead to DB
    const { data: lead, error: leadError } = await supabaseAdmin
      .from("public_leads")
      .insert({
        business_name: business_name.trim(),
        contact_name: contact_name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        sector: sector || null,
        location: location?.trim() || null,
        has_web: has_web ?? false,
        plan_interest: plan_interest || null,
        message: message?.trim() || null,
        status: "new",
      })
      .select("id")
      .single();

    if (leadError) {
      console.error("Lead insert error:", leadError);
      return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
    }

    // Notify all admin agents (in-app + email)
    try {
      const { data: admins } = await supabaseAdmin
        .from("agents")
        .select("id, email")
        .eq("role", "admin")
        .eq("is_active", true);

      if (admins && admins.length > 0) {
        // In-app notifications
        const notifications = admins.map((admin) => ({
          agent_id: admin.id,
          type: "system",
          title: `Nuevo lead: ${business_name.trim()}`,
          body: `${contact_name.trim()} · ${phone.trim()}${sector ? ` · ${sector}` : ""}`,
          href: "/admin/leads",
        }));
        await supabaseAdmin.from("notifications").insert(notifications);

        // Email notifications — only to admins with email set
        const adminsWithEmail = admins.filter((a) => a.email);
        if (adminsWithEmail.length > 0 && process.env.RESEND_API_KEY) {
          const emailHtml = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0F1E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#0D1117;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0D1117 0%,#111827 100%);border-bottom:1px solid rgba(0,212,170,0.2);padding:24px 28px;">
      <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#00D4AA;font-weight:600;">Agentalia-webs</p>
      <h1 style="margin:6px 0 0;font-size:20px;font-weight:700;color:#ffffff;">Nuevo lead recibido</h1>
    </div>
    <!-- Body -->
    <div style="padding:28px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
            <span style="font-size:11px;color:#8B95A9;text-transform:uppercase;letter-spacing:1px;">Negocio</span><br>
            <span style="font-size:15px;font-weight:600;color:#ffffff;">${business_name.trim()}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
            <span style="font-size:11px;color:#8B95A9;text-transform:uppercase;letter-spacing:1px;">Contacto</span><br>
            <span style="font-size:15px;font-weight:600;color:#ffffff;">${contact_name.trim()}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
            <span style="font-size:11px;color:#8B95A9;text-transform:uppercase;letter-spacing:1px;">Teléfono</span><br>
            <a href="tel:${phone.trim()}" style="font-size:15px;font-weight:600;color:#00D4AA;text-decoration:none;">${phone.trim()}</a>
          </td>
        </tr>
        ${sector ? `<tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
            <span style="font-size:11px;color:#8B95A9;text-transform:uppercase;letter-spacing:1px;">Sector</span><br>
            <span style="font-size:15px;color:#ffffff;">${sector}</span>
          </td></tr>` : ""}
        ${plan_interest ? `<tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
            <span style="font-size:11px;color:#8B95A9;text-transform:uppercase;letter-spacing:1px;">Plan de interés</span><br>
            <span style="font-size:15px;color:#C9A84C;font-weight:600;">${plan_interest}</span>
          </td></tr>` : ""}
        ${message?.trim() ? `<tr><td style="padding:10px 0;">
            <span style="font-size:11px;color:#8B95A9;text-transform:uppercase;letter-spacing:1px;">Mensaje</span><br>
            <span style="font-size:14px;color:#cbd5e1;line-height:1.5;">${message.trim()}</span>
          </td></tr>` : ""}
      </table>
      <div style="margin-top:24px;text-align:center;">
        <a href="https://agental-ia-web.vercel.app/admin/leads" style="display:inline-block;background:#00D4AA;color:#000000;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;">Ver lead en el portal →</a>
      </div>
    </div>
    <!-- Footer -->
    <div style="padding:16px 28px;border-top:1px solid rgba(255,255,255,0.05);">
      <p style="margin:0;font-size:11px;color:#4B5563;text-align:center;">Agentalia-webs · Solo tú recibes este email porque eres admin</p>
    </div>
  </div>
</body>
</html>`;

          await Promise.allSettled(
            adminsWithEmail.map((admin) =>
              resend.emails.send({
                from: "Agentalia-webs <onboarding@resend.dev>",
                to: admin.email as string,
                subject: `Nuevo lead: ${business_name.trim()} (${phone.trim()})`,
                html: emailHtml,
              })
            )
          );
        }
      }
    } catch (notifError) {
      // Non-blocking — log but don't fail the response
      console.error("Notification error:", notifError);
    }

    return NextResponse.json({ ok: true, id: lead?.id });
  } catch (err) {
    console.error("Leads API error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
