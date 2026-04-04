/**
 * Seed script: crea documentos DOCX de todos los proyectos web y los organiza
 * en el escritorio del admin con carpetas por categoría.
 *
 * Requiere: npm install docx
 * Uso:
 *   NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co" \
 *   SUPABASE_SERVICE_ROLE_KEY="eyJ..." \
 *   node scripts/seed-workspace-docs.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { Packer } from "docx";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Faltan variables de entorno. Pásalas en la línea de comandos.");
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// ─── Proyectos ────────────────────────────────────────────────────────────────

const PROJECTS = {
  "Hostelería": [
    {
      title: "Chantarela — Parrilla Mairena del Aljarafe",
      sections: [
        { heading: "Descripción", body: "Restaurante de parrilla y brasa en Mairena del Aljarafe. Especialidades: carnes a la brasa, menú del día y eventos privados." },
        { heading: "URL Live", body: "https://chantarela.vercel.app" },
        { heading: "Stack Técnico", body: "Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Vercel" },
        { heading: "Precio", body: "1.200 €" },
        { heading: "Estado", body: "Completado y en producción" },
        { heading: "Observaciones", body: "Diseño dark luxury con tonos tierra y dorado. Galería de fotos, carta digital y formulario de reserva." }
      ]
    },
    {
      title: "Bar Ryky — Tapas Castilleja de la Cuesta",
      sections: [
        { heading: "Descripción", body: "Bar de tapas y raciones en Castilleja de la Cuesta. Ambiente familiar, carta variada y menú diario." },
        { heading: "URL Live", body: "https://bar-ryky-web.vercel.app" },
        { heading: "Stack Técnico", body: "Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Vercel" },
        { heading: "Precio", body: "900 €" },
        { heading: "Estado", body: "Completado y en producción" },
        { heading: "Observaciones", body: "Primera web con Next.js 16 App Router — sentó las bases de los proyectos posteriores." }
      ]
    },
    {
      title: "Las Palmeras — Bar & Restaurante",
      sections: [
        { heading: "Descripción", body: "Bar y restaurante con amplia terraza. Especialidad en arroces, tapas y eventos." },
        { heading: "URL Live", body: "https://las-palmeras-web.vercel.app" },
        { heading: "Stack Técnico", body: "Next.js 16 · TypeScript · Tailwind CSS v4 · Vercel" },
        { heading: "Precio", body: "900 €" },
        { heading: "Estado", body: "Completado y en producción" }
      ]
    },
    {
      title: "Taberna Alambique",
      sections: [
        { heading: "Descripción", body: "Taberna con ambiente castizo, vinos de la tierra y tapas tradicionales." },
        { heading: "URL Live", body: "https://taberna-alambique.vercel.app" },
        { heading: "Stack Técnico", body: "Next.js 16 · TypeScript · Tailwind CSS v4 · Vercel" },
        { heading: "Precio", body: "900 €" },
        { heading: "Estado", body: "Completado y en producción" }
      ]
    },
    {
      title: "La Dama — Peluquería Canina",
      sections: [
        { heading: "Descripción", body: "Peluquería canina premium en Sevilla. Servicios de grooming, baño y corte para todas las razas." },
        { heading: "URL Live", body: "https://ladama-web.vercel.app" },
        { heading: "Stack Técnico", body: "Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Vercel" },
        { heading: "Precio", body: "900 €" },
        { heading: "Estado", body: "Completado y en producción" }
      ]
    },
    {
      title: "Bar La Espuela",
      sections: [
        { heading: "Descripción", body: "Bar flamenco y de ambiente andaluz. Tapas, copas y espectáculos en vivo." },
        { heading: "URL Live", body: "https://bar-la-espuela.vercel.app" },
        { heading: "Stack Técnico", body: "Next.js 16 · TypeScript · Tailwind CSS v4 · Vercel" },
        { heading: "Precio", body: "900 €" },
        { heading: "Estado", body: "Completado y en producción" }
      ]
    },
    {
      title: "El Rincón Pirata",
      sections: [
        { heading: "Descripción", body: "Restaurante temático pirata con cocina marinera. Paellas, mariscos y carnes a la brasa." },
        { heading: "URL Live", body: "https://el-rinconcito-pirata.vercel.app" },
        { heading: "Stack Técnico", body: "Next.js 16 · TypeScript · Tailwind CSS v4 · Vercel" },
        { heading: "Precio", body: "900 €" },
        { heading: "Estado", body: "Completado y en producción" }
      ]
    },
    {
      title: "El Rincón de Salteras",
      sections: [
        { heading: "Descripción", body: "Restaurante de brasa en Salteras. Diseño dark luxury con tipografía Playfair Display y tono dorado." },
        { heading: "URL Live", body: "https://rincon-salteras.vercel.app" },
        { heading: "Stack Técnico", body: "Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Vercel" },
        { heading: "Precio", body: "1.200 €" },
        { heading: "Estado", body: "Completado y en producción" }
      ]
    },
    {
      title: "Dichoso — Bar & Cafetería",
      sections: [
        { heading: "Descripción", body: "Bar y cafetería de barrio. Desayunos, tapas, menú diario y ambiente tranquilo." },
        { heading: "URL Live", body: "https://dichoso-web.vercel.app" },
        { heading: "Stack Técnico", body: "Next.js 16 · TypeScript · Tailwind CSS v4 · Vercel" },
        { heading: "Precio", body: "600 €" },
        { heading: "Estado", body: "Completado y en producción" }
      ]
    }
  ],
  "Comercio & Lifestyle": [
    {
      title: "Bodega Mairena",
      sections: [
        { heading: "Descripción", body: "Bodega y tienda de vinos en Mairena del Aljarafe. Vinos artesanales, catas y venta online." },
        { heading: "URL Live", body: "https://bodega-mairena-web.vercel.app" },
        { heading: "Stack Técnico", body: "Next.js 16 · TypeScript · Tailwind CSS v4 · Vercel" },
        { heading: "Precio", body: "900 €" },
        { heading: "Estado", body: "Completado y en producción" }
      ]
    },
    {
      title: "Bodega Zampuzo",
      sections: [
        { heading: "Descripción", body: "Bodega familiar con producción propia. Vinos de la tierra, aceites y conservas artesanales." },
        { heading: "URL Live", body: "https://bodega-zampuzo-web.vercel.app" },
        { heading: "Stack Técnico", body: "Next.js 16 · TypeScript · Tailwind CSS v4 · Vercel" },
        { heading: "Precio", body: "900 €" },
        { heading: "Estado", body: "Completado y en producción" }
      ]
    },
    {
      title: "Bodega Aljarafe",
      sections: [
        { heading: "Descripción", body: "Tienda de vinos del Aljarafe. Selección curada de vinos locales, maridajes y eventos de cata." },
        { heading: "URL Live", body: "https://bodega-aljarafe-web.vercel.app" },
        { heading: "Stack Técnico", body: "Next.js 16 · TypeScript · Tailwind CSS v4 · Vercel" },
        { heading: "Precio", body: "900 €" },
        { heading: "Estado", body: "Completado y en producción" }
      ]
    },
    {
      title: "Shisha Vaper Sevilla",
      sections: [
        { heading: "Descripción", body: "Tienda premium de shishas y vapers en Sevilla. Diseño dark luxury oriental con dorado. Catálogo digital, reseñas y mapa." },
        { heading: "URL Live", body: "https://shisha-vaper-web.vercel.app" },
        { heading: "Stack Técnico", body: "Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Three.js (modelo 3D) · Vercel" },
        { heading: "Precio", body: "1.200 €" },
        { heading: "Estado", body: "En producción — mejoras activas (modelo 3D, HeroScrollGlass)" },
        { heading: "Colores corporativos", body: "Fondo #0D1117 · Dorado #D4A017 · Bebas Neue (headings)" }
      ]
    },
    {
      title: "Bonnet Cocktail Bar",
      sections: [
        { heading: "Descripción", body: "Cocktail bar de autor en Sevilla. Carta de cócteles de temporada, eventos privados y maridajes." },
        { heading: "URL Live", body: "https://bonnet-cocktail-bar.vercel.app" },
        { heading: "Stack Técnico", body: "Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Vercel" },
        { heading: "Precio", body: "1.200 €" },
        { heading: "Estado", body: "Completado y en producción" }
      ]
    }
  ],
  "Tech & Apps": [
    {
      title: "HackQuest — Juego de Ciberseguridad",
      sections: [
        { heading: "Descripción", body: "Juego web educativo y competitivo de ciberseguridad. CTF online con retos progresivos, ranking en tiempo real y sistema de equipos." },
        { heading: "URL Live", body: "https://hackquest.vercel.app" },
        { heading: "Stack Técnico", body: "Next.js · TypeScript · Tailwind CSS v4 · Framer Motion · Supabase (realtime leaderboard) · Vercel" },
        { heading: "Modelo de negocio", body: "SaaS educativo — licencias para institutos y academias de ciberseguridad" },
        { heading: "Estado", body: "Diseño completo cerrado — pendiente de implementación final" }
      ]
    },
    {
      title: "Pixel Agents — Extensión VS Code",
      sections: [
        { heading: "Descripción", body: "Extensión de VS Code con webview React. Agentes Claude animados en una oficina de pixel art que reaccionan al código del desarrollador." },
        { heading: "Repositorio", body: "Interno — no público" },
        { heading: "Stack Técnico", body: "VS Code Extension API · React · Pixel art assets · Claude API · WebSocket (multiplayer)" },
        { heading: "Features", body: "4 agentes animados, roles (dev/manager/designer/QA), reacciones en tiempo real, feed de actividad, stats de equipo" },
        { heading: "Estado", body: "Features multiplayer completadas (2026-03-23)" }
      ]
    },
    {
      title: "Dungeon & Dynasty — Idle RPG",
      sections: [
        { heading: "Descripción", body: "Juego idle híbrido gacha-lite de fantasy RPG. Browser-first con progresión offline, sistema de héroes y dungeons automáticos." },
        { heading: "Stack Técnico", body: "Next.js · TypeScript · Tailwind CSS v4 · Framer Motion · Supabase · Vercel" },
        { heading: "Modelo de negocio", body: "Free-to-play con gacha-lite — premium sin pay-to-win" },
        { heading: "Estado", body: "Diseño completo cerrado — pendiente de implementación" }
      ]
    },
    {
      title: "Discord Boost Bot",
      sections: [
        { heading: "Descripción", body: "Bot de Discord para gestión automática de boosts, roles y recompensas en servidores gaming." },
        { heading: "URL Live", body: "https://discord-boost-bot.vercel.app" },
        { heading: "Stack Técnico", body: "Next.js · TypeScript · Discord.js · Supabase · Vercel" },
        { heading: "Estado", body: "En producción activa" }
      ]
    },
    {
      title: "Proyecto Comandalia — Sistema de Pedidos",
      sections: [
        { heading: "Descripción", body: "Sistema completo de pedidos para restaurante buffet. QR en mesas, panel de cocina en tiempo real (kanban), backoffice de gestión y bot Telegram de alertas." },
        { heading: "Stack Técnico", body: "Node.js · Fastify · SQLite · React (3 frontends: cliente QR, cocina, admin) · WebSockets · Bot Telegram · Vercel" },
        { heading: "Arquitectura", body: "Multi-panel SaaS: frontend cliente (QR), frontend cocina (kanban tiempo real), backoffice admin" },
        { heading: "Estado", body: "En desarrollo activo" }
      ]
    }
  ]
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function buildDocx(title, sections) {
  const children = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 400 }
    })
  ];

  for (const sec of sections) {
    children.push(
      new Paragraph({
        text: sec.heading,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 }
      }),
      new Paragraph({
        children: [new TextRun({ text: sec.body, size: 24 })],
        spacing: { after: 200 }
      })
    );
  }

  const doc = new Document({
    sections: [{ children }]
  });

  return Packer.toBuffer(doc);
}

async function uploadAndCreate({ title, buffer, fileName, description, adminId }) {
  // 1. Upload to storage
  const safeName = fileName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `workspace/${Date.now()}-${safeName}`;
  const { error: upErr } = await sb.storage
    .from("documents")
    .upload(path, buffer, { contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

  if (upErr) throw new Error(`Upload error for ${fileName}: ${upErr.message}`);

  const { data: urlData } = sb.storage.from("documents").getPublicUrl(path);

  // 2. Create document record
  const { data: doc, error: docErr } = await sb
    .from("documents")
    .insert({
      title,
      description,
      file_url: urlData.publicUrl,
      file_name: fileName,
      file_type: "other",
      file_size: buffer.byteLength,
      visibility: "all",
      created_by: adminId
    })
    .select()
    .single();

  if (docErr) throw new Error(`DB error for ${fileName}: ${docErr.message}`);
  return doc;
}

async function getOrCreateFolder(agentId, name, parentId, color = "#00D4AA") {
  const { data: existing } = await sb
    .from("workspace_folders")
    .select("id")
    .eq("agent_id", agentId)
    .eq("name", name)
    .eq("parent_id", parentId ?? "")  // workaround for null
    .maybeSingle();

  // Try with IS NULL if parentId is null
  if (!existing && parentId === null) {
    const { data: existingNull } = await sb
      .from("workspace_folders")
      .select("id")
      .eq("agent_id", agentId)
      .eq("name", name)
      .is("parent_id", null)
      .maybeSingle();

    if (existingNull) return existingNull.id;
  } else if (existing) {
    return existing.id;
  }

  const { data: folder, error } = await sb
    .from("workspace_folders")
    .insert({ agent_id: agentId, name, parent_id: parentId, color, sort_order: 0 })
    .select()
    .single();

  if (error) throw new Error(`Folder error "${name}": ${error.message}`);
  return folder.id;
}

async function addItemToFolder(folderId, agentId, documentId, sentBy) {
  const { error } = await sb
    .from("workspace_items")
    .insert({ folder_id: folderId, agent_id: agentId, document_id: documentId, sent_by: sentBy })
    .single();

  if (error && error.code !== "23505") {
    console.warn(`  ⚠️  item insert warning: ${error.message}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Iniciando seed de documentos de proyectos...\n");

  // Get admin agent
  const { data: adminAgent, error: adminErr } = await sb
    .from("agents")
    .select("id, nick")
    .eq("role", "admin")
    .eq("is_active", true)
    .limit(1)
    .single();

  if (adminErr || !adminAgent) {
    console.error("❌ No se encontró ningún agente admin activo:", adminErr?.message);
    process.exit(1);
  }
  console.log(`✅ Admin encontrado: @${adminAgent.nick} (${adminAgent.id})\n`);

  // Root folder: Proyectos Web Clientes
  const rootColor = "#00D4AA";
  const rootId = await getOrCreateFolder(adminAgent.id, "Proyectos Web Clientes", null, rootColor);
  console.log(`📁 Carpeta raíz creada/encontrada: "Proyectos Web Clientes"\n`);

  const categoryColors = {
    "Hostelería": "#C9A84C",
    "Comercio & Lifestyle": "#8B5CF6",
    "Tech & Apps": "#3B82F6"
  };

  for (const [category, projects] of Object.entries(PROJECTS)) {
    const catColor = categoryColors[category] ?? "#00D4AA";
    const catId = await getOrCreateFolder(adminAgent.id, category, rootId, catColor);
    console.log(`  📁 Subcarpeta: "${category}"`);

    for (const project of projects) {
      const fileName = `${project.title
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // quitar acentos
        .replace(/[^a-zA-Z0-9\s]/g, " ")                   // quitar todo lo que no sea alfanumérico
        .trim().replace(/\s+/g, "_").slice(0, 60)}.docx`;
      process.stdout.write(`    📄 ${project.title}… `);

      try {
        const buffer = await buildDocx(project.title, project.sections);
        const doc = await uploadAndCreate({
          title: project.title,
          buffer,
          fileName,
          description: project.sections[0]?.body ?? "",
          adminId: adminAgent.id
        });
        await addItemToFolder(catId, adminAgent.id, doc.id, adminAgent.id);
        console.log("✓");
      } catch (err) {
        console.log(`❌ ${err.message}`);
      }
    }
    console.log("");
  }

  console.log("✅ Seed completado.");
  console.log("   Accede a /workspace para ver los documentos organizados.");
}

main().catch((err) => { console.error(err); process.exit(1); });
