import { NextResponse } from "next/server";
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Stripe webhook — procesa eventos de subscription lifecycle
 * Eventos importantes:
 * - checkout.session.completed    → crear academy_users nuevo + enviar credenciales
 * - customer.subscription.updated → actualizar tier/is_active
 * - customer.subscription.deleted → is_active=false
 */
export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 503 });
  }

  const stripe = new Stripe(stripeKey);
  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Firma faltante" }, { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `Firma inválida: ${msg}` }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_email || session.customer_details?.email;
        if (!email) break;

        // Generar credenciales
        let nick = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
        const password = crypto.randomBytes(9).toString("base64").replace(/[+/=]/g, "").slice(0, 12);
        const passwordHash = await bcrypt.hash(password, 12);

        // Nick uniqueness check — if nick already exists for a different email, append 4-digit suffix
        const { data: existingNick } = await supabase
          .from("academy_users")
          .select("id")
          .eq("nick", nick)
          .maybeSingle();
        if (existingNick) {
          nick = nick.slice(0, 16) + Math.floor(Math.random() * 9000 + 1000).toString();
        }

        // Upsert user
        const { error } = await supabase.from("academy_users").upsert(
          {
            email,
            nick,
            name: session.customer_details?.name ?? null,
            password_hash: passwordHash,
            tier: "premium",
            is_active: true,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string
          },
          { onConflict: "email" }
        );
        if (error) throw new Error(error.message);

        // F1.5: enviar email con credenciales via Resend
        if (process.env.RESEND_API_KEY) {
          try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
              from: "CortesIA Academy <hola@cortesia.ai>",
              to: email,
              subject: "Tus credenciales de CortesIA Academy",
              html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tus credenciales de CortesIA Academy</title>
</head>
<body style="margin:0;padding:0;background-color:#0D1117;font-family:'Segoe UI',Arial,sans-serif;color:#E6EDF3;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D1117;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#161B22;border-radius:12px;border:1px solid #30363D;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#0D1117;padding:32px 40px;border-bottom:2px solid #C9A84C;text-align:center;">
              <p style="margin:0;font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;font-weight:600;">CortesIA Academy</p>
              <h1 style="margin:10px 0 0;font-size:26px;font-weight:700;color:#E6EDF3;">Bienvenido/a a la academia</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#8B949E;">
                Tu acceso premium está activo. A continuación encontrarás tus credenciales para entrar a la plataforma.
              </p>
              <!-- Credentials box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D1117;border:1px solid #30363D;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 16px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;font-weight:600;">Tus credenciales</p>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;width:90px;">
                          <span style="font-size:13px;color:#8B949E;font-weight:500;">Usuario</span>
                        </td>
                        <td style="padding:6px 0;">
                          <span style="font-size:15px;color:#E6EDF3;font-weight:700;letter-spacing:0.5px;">${nick}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;width:90px;">
                          <span style="font-size:13px;color:#8B949E;font-weight:500;">Contraseña</span>
                        </td>
                        <td style="padding:6px 0;">
                          <span style="font-size:15px;color:#E6EDF3;font-weight:700;letter-spacing:1px;font-family:monospace;">${password}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:13px;color:#8B949E;">Guarda estas credenciales en un lugar seguro. Puedes cambiar tu contraseña desde el perfil una vez dentro.</p>
              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td style="background-color:#C9A84C;border-radius:8px;">
                    <a href="https://cortesia-academy.vercel.app/login" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#0D1117;text-decoration:none;letter-spacing:0.5px;">Acceder a la academia</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #30363D;text-align:center;">
              <p style="margin:0;font-size:12px;color:#484F58;">
                Si no realizaste esta compra, ignora este correo o escríbenos a
                <a href="mailto:hola@cortesia.ai" style="color:#C9A84C;text-decoration:none;">hola@cortesia.ai</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
            });
            console.log("[stripe] credenciales enviadas por email a:", email);
          } catch (emailErr) {
            // El email falla silenciosamente — el usuario ya tiene cuenta creada
            console.error("[stripe] error enviando email de credenciales:", emailErr);
          }
        } else {
          // Sin RESEND_API_KEY configurada — solo log local
          console.log("[stripe] new premium user (email omitido — sin RESEND_API_KEY):", { email, nick, password });
        }
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const active = sub.status === "active" || sub.status === "trialing";
        await supabase
          .from("academy_users")
          .update({ is_active: active, tier: active ? "premium" : "free" })
          .eq("stripe_subscription_id", sub.id);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await supabase
          .from("academy_users")
          .update({ is_active: false, tier: "free" })
          .eq("stripe_subscription_id", sub.id);
        break;
      }
    }
  } catch (e) {
    console.error("[stripe webhook] error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
