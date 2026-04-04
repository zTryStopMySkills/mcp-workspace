/**
 * reset-joselito.mjs
 * Verifica y resetea la contraseña del agente Joselito
 * Uso: NEXT_PUBLIC_SUPABASE_URL="..." SUPABASE_SERVICE_ROLE_KEY="..." node scripts/reset-joselito.mjs
 */

import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Faltan env vars. Ejecuta con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// Listar todos los agentes para ver qué hay
console.log("\n🔍 Agentes en la base de datos:");
const { data: agents, error } = await supabase
  .from("agents")
  .select("id, nick, name, role, is_active")
  .order("created_at");

if (error) {
  console.error("❌ Error al listar agentes:", error.message);
  process.exit(1);
}

agents.forEach(a => {
  console.log(`  [${a.is_active ? "✓" : "✗"}] @${a.nick} — ${a.name} (${a.role}) id:${a.id}`);
});

// Resetear contraseña de joselito
const NEW_PASSWORD = "1Ñ4zum411%";
const hash = await bcrypt.hash(NEW_PASSWORD, 12);

const joselito = agents.find(a => a.nick === "joselito");

if (!joselito) {
  console.log("\n⚠️  No se encontró @joselito. Creando...");
  const { data: created, error: createErr } = await supabase
    .from("agents")
    .insert({
      nick: "joselito",
      name: "Joselito",
      password_hash: hash,
      role: "admin",
      is_active: true
    })
    .select("id, nick, name")
    .single();

  if (createErr) {
    console.error("❌ Error al crear:", createErr.message);
    process.exit(1);
  }
  console.log(`✓ Agente creado: @${created.nick} (${created.name})`);
} else {
  const { error: updateErr } = await supabase
    .from("agents")
    .update({ password_hash: hash, is_active: true })
    .eq("nick", "joselito");

  if (updateErr) {
    console.error("❌ Error al resetear:", updateErr.message);
    process.exit(1);
  }
  console.log(`\n✓ Contraseña reseteada para @joselito`);
}

console.log("\n✅ Credenciales actualizadas:");
console.log("  Nick:       joselito");
console.log(`  Contraseña: ${NEW_PASSWORD}`);
console.log("  Rol:        admin\n");
