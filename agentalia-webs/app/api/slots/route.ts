import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const revalidate = 300; // 5 min cache

export async function GET() {
  try {
    const { data } = await supabaseAdmin
      .from("landing_config")
      .select("value")
      .eq("key", "slots_available")
      .single();

    const slots = data ? parseInt(data.value, 10) : 3;
    return NextResponse.json({ slots: isNaN(slots) ? 3 : slots });
  } catch {
    return NextResponse.json({ slots: 3 });
  }
}
