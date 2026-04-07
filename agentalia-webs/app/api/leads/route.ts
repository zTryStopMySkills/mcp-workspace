import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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

    // Notify all admin agents
    try {
      const { data: admins } = await supabaseAdmin
        .from("agents")
        .select("id")
        .eq("role", "admin")
        .eq("is_active", true);

      if (admins && admins.length > 0) {
        const notifications = admins.map((admin) => ({
          agent_id: admin.id,
          type: "system",
          title: `Nuevo lead: ${business_name.trim()}`,
          body: `${contact_name.trim()} · ${phone.trim()}${sector ? ` · ${sector}` : ""}`,
          href: "/admin/leads",
        }));

        await supabaseAdmin.from("notifications").insert(notifications);
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
