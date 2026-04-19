import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
  const baseUrl =
    process.env.NEXTAUTH_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  if (!stripeKey || !priceId) {
    return NextResponse.json(
      {
        error:
          "Stripe no configurado aún. Añade STRIPE_SECRET_KEY y NEXT_PUBLIC_STRIPE_PRICE_ID en las env vars de Vercel."
      },
      { status: 503 }
    );
  }
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email válido requerido" }, { status: 400 });
  }

  const stripe = new Stripe(stripeKey);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/pago/confirmacion?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?canceled=1`,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: { email, source: "academy_landing" }
      }
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `Stripe: ${msg}` }, { status: 500 });
  }
}
