# Nexus Orchestration Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Nexus pipeline orchestration system to nate-herk-bot so that every Claude analysis automatically triggers a multi-phase research → draft → Discord-approval workflow stored in Supabase.

**Architecture:** When `claude.js` returns an analysis, `pipeline-trigger.js` evaluates urgency and either fires the pipeline immediately (🔴) or queues it in `nexus_events` (🟡/🟢). The orchestrator (`orchestrator.js`) calls external services (Cortesia for research, SonarForge for drafts), stores all state in Supabase, and posts an embed with approval buttons to a dedicated Discord channel. Button interactions are routed through `ready.js`.

**Tech Stack:** Node.js 18+ ESM, discord.js v14, @supabase/supabase-js, native fetch (Node 18 global), node-cron

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `bot/db/nexus-schema.sql` | Supabase DDL for all Nexus tables |
| Create | `bot/db/supabase.js` | Supabase client singleton |
| Create | `bot/services/nexus/http-client.js` | Authenticated fetch with 3-retry exponential backoff |
| Create | `bot/services/nexus/orchestrator.js` | Pipeline CRUD + phase execution logic |
| Create | `bot/services/nexus/pipeline-trigger.js` | Urgency evaluator called after every Claude analysis |
| Create | `bot/services/nexus/discord-ui.js` | Approval embeds + button interaction handler |
| Modify | `bot/config.js` | Add 8 new env vars for Nexus |
| Modify | `bot/services/claude.js` | Call `nexusEvaluate` after each analysis |
| Modify | `bot/events/ready.js` | Route `nexus_*` button interactions + 08:00 digest cron |
| Modify | `package.json` (root) | Add `@supabase/supabase-js` dependency |

---

## Task 1: Supabase schema SQL

**Files:**
- Create: `bot/db/nexus-schema.sql`

- [ ] **Step 1: Create the db directory and schema file**

```sql
-- bot/db/nexus-schema.sql

-- pipeline runs
CREATE TABLE IF NOT EXISTS nexus_pipeline_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  triggered_by TEXT NOT NULL,
  source_item JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  urgency TEXT,
  topic TEXT,
  tool_detected TEXT,
  research_output JSONB,
  draft_output JSONB,
  discord_message_id TEXT,
  discord_channel_id TEXT,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  exported_at TIMESTAMPTZ,
  export_url TEXT,
  duration_ms INTEGER
);

-- event bus (polling-based)
CREATE TABLE IF NOT EXISTS nexus_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_type TEXT NOT NULL,
  pipeline_run_id UUID REFERENCES nexus_pipeline_runs(id),
  payload JSONB NOT NULL DEFAULT '{}',
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  source TEXT
);

-- long-term memory
CREATE TABLE IF NOT EXISTS nexus_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  memory_type TEXT NOT NULL,
  topic_cluster TEXT,
  content JSONB NOT NULL,
  confidence FLOAT DEFAULT 0.5,
  confirmation_count INTEGER DEFAULT 0,
  last_confirmed_at TIMESTAMPTZ,
  source_run_ids UUID[]
);

-- user feedback
CREATE TABLE IF NOT EXISTS nexus_user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pipeline_run_id UUID NOT NULL REFERENCES nexus_pipeline_runs(id),
  feedback_type TEXT NOT NULL,
  original_value JSONB,
  user_value JSONB,
  discord_user_id TEXT,
  notes TEXT
);

-- detected patterns
CREATE TABLE IF NOT EXISTS nexus_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pattern_type TEXT NOT NULL,
  description TEXT NOT NULL,
  trigger_data JSONB,
  action_data JSONB,
  occurrence_count INTEGER DEFAULT 1,
  last_seen_at TIMESTAMPTZ,
  suggested_to_user BOOLEAN DEFAULT false,
  user_accepted BOOLEAN
);

-- error log for self-improvement
CREATE TABLE IF NOT EXISTS nexus_error_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pipeline_run_id UUID REFERENCES nexus_pipeline_runs(id),
  error_type TEXT NOT NULL,
  error_detail JSONB,
  context JSONB,
  resolved BOOLEAN DEFAULT false,
  resolution TEXT,
  avoidance_rule TEXT
);

-- indexes
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_status ON nexus_pipeline_runs(status);
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_created ON nexus_pipeline_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_unprocessed ON nexus_events(processed, created_at) WHERE processed = false;
CREATE INDEX IF NOT EXISTS idx_memory_type_cluster ON nexus_memory(memory_type, topic_cluster);
```

- [ ] **Step 2: Commit**

```bash
git add bot/db/nexus-schema.sql
git commit -m "feat(nexus): add Supabase schema SQL for all Nexus tables"
```

---

## Task 2: Add @supabase/supabase-js to package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

Run from `C:/Users/jose2/OneDrive/Escritorio/mcp/nate-herk-bot/`:
```bash
npm install @supabase/supabase-js
```

Expected output: `added N packages` with `@supabase/supabase-js` appearing in `node_modules`.

- [ ] **Step 2: Verify package.json now has the dependency**

Check `package.json` → `dependencies` should include `"@supabase/supabase-js": "^x.x.x"`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @supabase/supabase-js dependency"
```

---

## Task 3: Extend config.js with Nexus env vars

**Files:**
- Modify: `bot/config.js`

Current file exports a default object. We add 8 new keys at the bottom of that object.

- [ ] **Step 1: Edit bot/config.js**

Replace the export default block with:

```javascript
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config as loadDotenv } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
loadDotenv({ path: join(__dirname, '..', '.env') });

export default {
  token: process.env.BOT_TOKEN,
  guildId: process.env.DISCORD_GUILD_ID,
  youtubeApiKey: process.env.YOUTUBE_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  cronSchedule: process.env.CRON_SCHEDULE || '0 9 * * *',
  dataPath: join(__dirname, '..', 'data'),
  // Nexus
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
  nexusInternalSecret: process.env.NEXUS_INTERNAL_SECRET,
  cortesiaBaseUrl: process.env.CORTESIA_BASE_URL,
  sonarforgeBaseUrl: process.env.SONARFORGE_BASE_URL,
  nexusApprovalChannelId: process.env.NEXUS_APPROVAL_CHANNEL_ID,
  nexusPipelineChannelId: process.env.NEXUS_PIPELINE_CHANNEL_ID,
  nexusLearningChannelId: process.env.NEXUS_LEARNING_CHANNEL_ID,
};
```

- [ ] **Step 2: Commit**

```bash
git add bot/config.js
git commit -m "feat(nexus): extend config with Supabase + Nexus env vars"
```

---

## Task 4: Supabase client singleton

**Files:**
- Create: `bot/db/supabase.js`

- [ ] **Step 1: Create the file**

```javascript
// bot/db/supabase.js
import { createClient } from '@supabase/supabase-js';
import config from '../config.js';

export const supabase = createClient(
  config.supabaseUrl,
  config.supabaseServiceKey,
);
```

- [ ] **Step 2: Commit**

```bash
git add bot/db/supabase.js
git commit -m "feat(nexus): add Supabase client singleton"
```

---

## Task 5: HTTP client with retry

**Files:**
- Create: `bot/services/nexus/http-client.js`

- [ ] **Step 1: Create the directory and file**

```javascript
// bot/services/nexus/http-client.js
import config from '../../config.js';

const RETRY_DELAYS = [1000, 2000, 4000];

/**
 * Authenticated fetch to internal Nexus services (Cortesia, SonarForge).
 * Retries up to 3 times with exponential backoff on network/5xx errors.
 *
 * @param {string} url
 * @param {object} body - will be JSON-serialised
 * @returns {Promise<object>} parsed JSON response
 */
export async function nexusFetch(url, body) {
  let lastError;

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-nexus-secret': config.nexusInternalSecret,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '(no body)');
        throw new Error(`HTTP ${res.status} from ${url}: ${text}`);
      }

      return await res.json();
    } catch (err) {
      lastError = err;

      if (attempt < RETRY_DELAYS.length) {
        console.warn(`[nexus-http] attempt ${attempt + 1} failed, retrying in ${RETRY_DELAYS[attempt]}ms:`, err.message);
        await new Promise(r => setTimeout(r, RETRY_DELAYS[attempt]));
      }
    }
  }

  const detail = {
    url,
    attempts: RETRY_DELAYS.length + 1,
    message: lastError?.message,
    stack: lastError?.stack,
  };
  const error = new Error(`nexusFetch failed after all retries: ${lastError?.message}`);
  error.detail = detail;
  throw error;
}
```

- [ ] **Step 2: Commit**

```bash
git add bot/services/nexus/http-client.js
git commit -m "feat(nexus): add HTTP client with 3-retry exponential backoff"
```

---

## Task 6: Orchestrator

**Files:**
- Create: `bot/services/nexus/orchestrator.js`

- [ ] **Step 1: Create the file**

```javascript
// bot/services/nexus/orchestrator.js
import { supabase } from '../../db/supabase.js';
import { nexusFetch } from './http-client.js';
import config from '../../config.js';

// ── DB helpers ────────────────────────────────────────────────────────────────

export async function createPipelineRun(sourceItem, triggeredBy) {
  const { data, error } = await supabase
    .from('nexus_pipeline_runs')
    .insert({
      source_item: sourceItem,
      triggered_by: triggeredBy,
      status: 'pending',
      urgency: sourceItem?.urgencia ?? null,
      topic: sourceItem?.herramienta_protagonista ?? sourceItem?.que_han_lanzado ?? null,
      tool_detected: sourceItem?.herramienta_protagonista ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(`createPipelineRun: ${error.message}`);
  return data;
}

export async function updateRunStatus(runId, status, extraFields = {}) {
  const { error } = await supabase
    .from('nexus_pipeline_runs')
    .update({ status, ...extraFields })
    .eq('id', runId);

  if (error) throw new Error(`updateRunStatus(${runId}): ${error.message}`);
}

export async function emitEvent(type, runId, payload = {}, source = null) {
  const { error } = await supabase
    .from('nexus_events')
    .insert({
      event_type: type,
      pipeline_run_id: runId,
      payload,
      source,
    });

  if (error) console.warn(`[nexus] emitEvent(${type}) error:`, error.message);
}

export async function logError(runId, errorType, errorDetail, context = {}) {
  const { error } = await supabase
    .from('nexus_error_log')
    .insert({
      pipeline_run_id: runId ?? null,
      error_type: errorType,
      error_detail: errorDetail,
      context,
    });

  if (error) console.warn(`[nexus] logError failed:`, error.message);
}

// ── Pipeline phases ───────────────────────────────────────────────────────────

export async function runResearchPhase(run) {
  await updateRunStatus(run.id, 'researching');
  await emitEvent('phase.research.start', run.id, {}, 'orchestrator');

  const researchOutput = await nexusFetch(
    `${config.cortesiaBaseUrl}/api/nexus/research`,
    { sourceItem: run.source_item, runId: run.id },
  );

  await updateRunStatus(run.id, 'research_done', { research_output: researchOutput });
  await emitEvent('phase.research.done', run.id, { researchOutput }, 'orchestrator');

  return { ...run, status: 'research_done', research_output: researchOutput };
}

export async function runDraftPhase(run) {
  await updateRunStatus(run.id, 'drafting');
  await emitEvent('phase.draft.start', run.id, {}, 'orchestrator');

  const draftOutput = await nexusFetch(
    `${config.sonarforgeBaseUrl}/api/nexus/draft`,
    { researchOutput: run.research_output, runId: run.id },
  );

  await updateRunStatus(run.id, 'draft_done', { draft_output: draftOutput });
  await emitEvent('phase.draft.done', run.id, { draftOutput }, 'orchestrator');

  return { ...run, status: 'draft_done', draft_output: draftOutput };
}

// ── Main entry point ──────────────────────────────────────────────────────────

export async function executePipeline(sourceItem, triggeredBy) {
  const startedAt = Date.now();
  let run;

  try {
    run = await createPipelineRun(sourceItem, triggeredBy);
    await emitEvent('pipeline.start', run.id, { triggeredBy }, 'orchestrator');
    console.log(`[nexus] Pipeline started: ${run.id} (${triggeredBy})`);
  } catch (err) {
    console.error('[nexus] Failed to create pipeline run:', err.message);
    await logError(null, 'pipeline.create_failed', { message: err.message }, { triggeredBy, sourceItem });
    return;
  }

  try {
    run = await runResearchPhase(run);
  } catch (err) {
    console.error(`[nexus] Research phase failed for run ${run.id}:`, err.message);
    await logError(run.id, 'phase.research.failed', err.detail ?? { message: err.message }, { sourceItem });
    await updateRunStatus(run.id, 'failed');
    await emitEvent('pipeline.failed', run.id, { phase: 'research', error: err.message }, 'orchestrator');
    return;
  }

  try {
    run = await runDraftPhase(run);
  } catch (err) {
    console.error(`[nexus] Draft phase failed for run ${run.id}:`, err.message);
    await logError(run.id, 'phase.draft.failed', err.detail ?? { message: err.message }, { researchOutput: run.research_output });
    await updateRunStatus(run.id, 'failed');
    await emitEvent('pipeline.failed', run.id, { phase: 'draft', error: err.message }, 'orchestrator');
    return;
  }

  try {
    // lazy import to avoid circular dependency at module load time
    const { postApprovalMessage } = await import('./discord-ui.js');
    await postApprovalMessage(run);
  } catch (err) {
    console.error(`[nexus] Discord approval post failed for run ${run.id}:`, err.message);
    await logError(run.id, 'discord.post_failed', { message: err.message }, {});
    // Don't mark as failed — the pipeline data is safely stored, Discord is best-effort
  }

  const durationMs = Date.now() - startedAt;
  await updateRunStatus(run.id, 'awaiting_approval', { duration_ms: durationMs });
  await emitEvent('pipeline.awaiting_approval', run.id, { durationMs }, 'orchestrator');
  console.log(`[nexus] Pipeline ${run.id} ready for approval (${durationMs}ms)`);
}
```

- [ ] **Step 2: Commit**

```bash
git add bot/services/nexus/orchestrator.js
git commit -m "feat(nexus): add orchestrator with pipeline CRUD + research/draft phases"
```

---

## Task 7: Pipeline trigger (urgency evaluator)

**Files:**
- Create: `bot/services/nexus/pipeline-trigger.js`

- [ ] **Step 1: Create the file**

```javascript
// bot/services/nexus/pipeline-trigger.js
import { executePipeline } from './orchestrator.js';
import { supabase } from '../../db/supabase.js';

/**
 * Evaluate a Claude analysis result and decide how to handle it.
 *
 * @param {object} analysis - JSON returned by claude.js
 * @param {'rss'|'youtube'|'twitter'} sourceType
 */
export async function evaluate(analysis, sourceType) {
  if (!analysis || typeof analysis !== 'object') return;

  const urgency = analysis.urgencia ?? '';

  if (/🔴/.test(urgency)) {
    // Fire immediately
    console.log(`[nexus-trigger] 🔴 Urgent — firing pipeline immediately (${sourceType})`);
    // Don't await — let it run async so it doesn't block the caller
    executePipeline(analysis, sourceType).catch(err =>
      console.error('[nexus-trigger] executePipeline error:', err.message),
    );
    return;
  }

  if (/🟡/.test(urgency)) {
    console.log(`[nexus-trigger] 🟡 Medium — queuing pipeline (${sourceType})`);
    await queueEvent('pipeline.queued', analysis, sourceType);
    return;
  }

  // 🟢 Low priority or no urgency
  console.log(`[nexus-trigger] 🟢 Low priority — recording event (${sourceType})`);
  await queueEvent('pipeline.low_priority', analysis, sourceType);
}

async function queueEvent(eventType, analysis, sourceType) {
  const { error } = await supabase
    .from('nexus_events')
    .insert({
      event_type: eventType,
      payload: analysis,
      processed: false,
      source: sourceType,
    });

  if (error) {
    console.warn(`[nexus-trigger] Failed to queue event (${eventType}):`, error.message);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add bot/services/nexus/pipeline-trigger.js
git commit -m "feat(nexus): add pipeline trigger — urgency evaluator after each Claude analysis"
```

---

## Task 8: Discord UI (approval embeds + button handler)

**Files:**
- Create: `bot/services/nexus/discord-ui.js`

Note: this module needs the Discord client instance. We pass it via `init(client)` so there's no circular import with index.js.

- [ ] **Step 1: Create the file**

```javascript
// bot/services/nexus/discord-ui.js
import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import config from '../../config.js';
import { updateRunStatus, runResearchPhase, logError } from './orchestrator.js';

let _client = null;

/**
 * Must be called once from ready.js after the Discord client is available.
 * @param {import('discord.js').Client} client
 */
export function init(client) {
  _client = client;
}

// ── Approval message ──────────────────────────────────────────────────────────

export async function postApprovalMessage(run) {
  if (!_client) {
    console.warn('[nexus-ui] Discord client not initialised — call init(client) first');
    return;
  }
  if (!config.nexusApprovalChannelId) {
    console.warn('[nexus-ui] NEXUS_APPROVAL_CHANNEL_ID not set — skipping Discord post');
    return;
  }

  const channel = await _client.channels.fetch(config.nexusApprovalChannelId).catch(() => null);
  if (!channel) {
    console.warn(`[nexus-ui] Approval channel ${config.nexusApprovalChannelId} not found`);
    return;
  }

  const research = run.research_output ?? {};
  const draft = run.draft_output ?? {};

  const embed = new EmbedBuilder()
    .setColor(urgencyColor(run.urgency))
    .setTitle('🧠 Nexus — Pipeline listo para aprobación')
    .addFields(
      { name: '📌 Topic', value: run.topic ?? 'N/A', inline: true },
      { name: '🎯 Tool detectada', value: run.tool_detected ?? 'N/A', inline: true },
      { name: '⚡ Urgencia', value: run.urgency ?? 'N/A', inline: true },
    );

  if (research.keywords?.length) {
    embed.addFields({ name: '🔑 Keywords', value: research.keywords.join(', ').slice(0, 500) });
  }
  if (research.content_angle) {
    embed.addFields({ name: '🎥 Ángulo de contenido', value: research.content_angle.slice(0, 500) });
  }
  if (draft.suggested_title) {
    embed.addFields({ name: '📺 Título sugerido', value: `"${draft.suggested_title}"`.slice(0, 500) });
  }
  if (draft.preset_used) {
    embed.addFields({ name: '🎚️ Preset usado', value: draft.preset_used, inline: true });
  }

  embed.setFooter({ text: `Run ID: ${run.id}` }).setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`nexus_approve_${run.id}`)
      .setLabel('✅ Aprobar')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`nexus_reject_${run.id}`)
      .setLabel('❌ Rechazar')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(`nexus_reresearch_${run.id}`)
      .setLabel('🔁 Re-research')
      .setStyle(ButtonStyle.Secondary),
  );

  try {
    const message = await channel.send({ embeds: [embed], components: [row] });
    await updateRunStatus(run.id, run.status, {
      discord_message_id: message.id,
      discord_channel_id: String(config.nexusApprovalChannelId),
    });
    console.log(`[nexus-ui] Approval message posted: ${message.id}`);
  } catch (err) {
    console.error('[nexus-ui] Failed to post approval message:', err.message);
    await logError(run.id, 'discord.post_failed', { message: err.message }, {});
  }
}

// ── Button interaction handler ────────────────────────────────────────────────

export async function handleInteraction(interaction) {
  const { customId } = interaction;

  if (customId.startsWith('nexus_approve_')) {
    const runId = customId.replace('nexus_approve_', '');
    await updateRunStatus(runId, 'approved', { approved_at: new Date().toISOString() });
    await interaction.reply({ content: 'Aprobado ✅', ephemeral: true });
    await postStatusUpdate(`✅ Run \`${runId}\` aprobado por <@${interaction.user.id}>`);
    return;
  }

  if (customId.startsWith('nexus_reject_')) {
    const runId = customId.replace('nexus_reject_', '');
    await updateRunStatus(runId, 'rejected', { rejected_at: new Date().toISOString() });
    await interaction.reply({ content: 'Rechazado ❌', ephemeral: true });
    await postStatusUpdate(`❌ Run \`${runId}\` rechazado por <@${interaction.user.id}>`);
    return;
  }

  if (customId.startsWith('nexus_reresearch_')) {
    const runId = customId.replace('nexus_reresearch_', '');
    await interaction.reply({ content: '🔁 Relanzando research...', ephemeral: true });

    try {
      // Fetch current run from DB
      const { supabase } = await import('../../db/supabase.js');
      const { data: run, error } = await supabase
        .from('nexus_pipeline_runs')
        .select('*')
        .eq('id', runId)
        .single();

      if (error || !run) {
        await interaction.followUp({ content: `Error: run \`${runId}\` no encontrado`, ephemeral: true });
        return;
      }

      const updatedRun = await runResearchPhase(run);
      await postApprovalMessage(updatedRun);
    } catch (err) {
      console.error('[nexus-ui] Re-research failed:', err.message);
      await logError(runId, 'discord.reresearch_failed', { message: err.message }, {});
      await interaction.followUp({ content: `Error en re-research: ${err.message}`, ephemeral: true });
    }
    return;
  }
}

// ── Status updates ────────────────────────────────────────────────────────────

export async function postStatusUpdate(message) {
  if (!_client || !config.nexusPipelineChannelId) return;

  try {
    const channel = await _client.channels.fetch(config.nexusPipelineChannelId).catch(() => null);
    if (channel) await channel.send(message);
  } catch (err) {
    console.warn('[nexus-ui] postStatusUpdate error:', err.message);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function urgencyColor(urgency) {
  if (!urgency) return 0x808080;
  if (/🔴/.test(urgency)) return 0xff1744;
  if (/🟡/.test(urgency)) return 0xffc107;
  return 0x4caf50;
}
```

- [ ] **Step 2: Commit**

```bash
git add bot/services/nexus/discord-ui.js
git commit -m "feat(nexus): add Discord UI — approval embeds + button interaction handler"
```

---

## Task 9: Modify claude.js — call nexusEvaluate after analyses

**Files:**
- Modify: `bot/services/claude.js`

The file has two exported functions: `summarizeVideo` (sourceType `youtube`) and `summarizeNewsItem` (sourceType `rss`). Twitter tweets are not analysed by Claude in the current code (they go straight to Discord), so no change needed there.

Key: import must be dynamic (top-level static import would create a circular dependency chain through orchestrator → discord-ui → orchestrator). We use top-level static import — it's safe here since pipeline-trigger only imports from orchestrator and supabase, neither of which import claude.js.

- [ ] **Step 1: Edit bot/services/claude.js**

```javascript
import Anthropic from '@anthropic-ai/sdk';
import config from '../config.js';
import { evaluate as nexusEvaluate } from './nexus/pipeline-trigger.js';

const client = new Anthropic({ apiKey: config.anthropicApiKey });

const VIDEO_SYSTEM = 'Eres un scout de contenido para un creador de YouTube del nicho IA. Tu misión: detectar qué herramientas/lanzamientos/novedades aparecen en vídeos de otros canales para que tu creador grabe SU vídeo el primero. Siempre prioriza la velocidad sobre la profundidad. Responde SOLO en JSON válido.';
const NEWS_SYSTEM = 'Eres un scout de lanzamientos de IA para un creador de YouTube que quiere ser el primero en enseñar herramientas nuevas. Tu misión: identificar si esto es un LANZAMIENTO NUEVO (herramienta, modelo, feature) y dar al creador el título de vídeo listo para grabar HOY. Responde SOLO en JSON válido.';

export async function summarizeVideo(title, transcript) {
  const hasTranscript = transcript && transcript.length > 100;
  const prompt = hasTranscript
    ? `Título: "${title}"\nTranscripción:\n${transcript}\n\nAnaliza si esto cubre una herramienta/lanzamiento nuevo que tu creador deba grabar. Responde en JSON:\n{\n  "es_lanzamiento": true/false,\n  "herramienta_protagonista": "nombre exacto de la herramienta/modelo/feature nuevo (o null si es contenido general)",\n  "resumen_ejecutivo": "2-3 frases de qué es y qué hace nuevo",\n  "puntos_clave": ["punto 1","punto 2","punto 3","punto 4","punto 5"],\n  "herramientas_mencionadas": ["tool1"],\n  "angulo_primer_video": "El ángulo EXACTO que debe tomar tu creador para ser el primero (demo práctica, comparativa, caso de uso real…)",\n  "titulo_video_sugerido": "Título listo para publicar en YouTube que genere CTR en el nicho IA",\n  "urgencia": "🔴 Urgente (grabar hoy) / 🟡 Media (esta semana) / 🟢 Baja (evergreen)"\n}`
    : `Título: "${title}"\nSin transcripción. Estima en JSON:\n{\n  "es_lanzamiento": true/false,\n  "herramienta_protagonista": null,\n  "resumen_ejecutivo": "Estimación basada en el título",\n  "puntos_clave": ["estimado 1","estimado 2","estimado 3"],\n  "herramientas_mencionadas": [],\n  "angulo_primer_video": "Ver el vídeo completo primero",\n  "titulo_video_sugerido": "",\n  "urgencia": "🟢 Baja"\n}`;

  const analysis = await callClaude(VIDEO_SYSTEM, prompt, 1024);
  await nexusEvaluate(analysis, 'youtube').catch(err =>
    console.warn('[nexus] evaluate(youtube) error:', err.message),
  );
  return analysis;
}

export async function summarizeNewsItem(source, title, summary) {
  const prompt = `Fuente: ${source}\nTítulo: "${title}"\nDescripción: ${summary}\n\nDetermina si esto es un LANZAMIENTO nuevo de herramienta/modelo/feature de IA. Responde en JSON:\n{\n  "es_lanzamiento": true/false,\n  "que_han_lanzado": "Nombre exacto + 1 frase de qué hace (o null si no es lanzamiento)",\n  "por_que_importa": "Por qué es relevante para el nicho de creadores IA",\n  "angulo_primer_video": "El ángulo exacto que debes tomar para ser el primero en YouTube",\n  "titulo_video_sugerido": "Título listo para grabar HOY si aplica",\n  "urgencia": "🔴 Urgente (grabar en <24h) / 🟡 Media (esta semana) / 🟢 Baja"\n}`;

  const analysis = await callClaude(NEWS_SYSTEM, prompt, 512);
  await nexusEvaluate(analysis, 'rss').catch(err =>
    console.warn('[nexus] evaluate(rss) error:', err.message),
  );
  return analysis;
}

async function callClaude(systemText, userPrompt, maxTokens) {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
    system: [{ type: 'text', text: systemText, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userPrompt }],
  });
  const text = message.content[0]?.type === 'text' ? message.content[0].text : '{}';
  const match = text.match(/\{[\s\S]*\}/);
  try { return match ? JSON.parse(match[0]) : {}; }
  catch { return {}; }
}
```

- [ ] **Step 2: Commit**

```bash
git add bot/services/claude.js
git commit -m "feat(nexus): hook nexusEvaluate into summarizeVideo + summarizeNewsItem"
```

---

## Task 10: Modify events/ready.js — add interaction router + 08:00 digest cron

**Files:**
- Modify: `bot/events/ready.js`

Changes needed:
1. Import `handleInteraction` and `init` from `discord-ui.js`
2. Register `interactionCreate` listener that routes `nexus_*` buttons
3. Add `08:00` cron for daily digest log

Note: `ready.js` is loaded as an event handler by `index.js` using `event.default`. The event `clientReady` fires once with the client. We need to register the `interactionCreate` listener on the client object received in `execute(client)`.

- [ ] **Step 1: Edit bot/events/ready.js** — add the two imports at the top and the two new blocks inside `execute(client)`:

Add after existing imports:
```javascript
import { handleInteraction, init as initDiscordUI } from '../services/nexus/discord-ui.js';
```

Add at the start of `execute(client)` (before guild fetch):
```javascript
    // Initialise Nexus Discord UI with the live client
    initDiscordUI(client);

    // Route Nexus button interactions
    client.on('interactionCreate', async interaction => {
      try {
        if (interaction.isButton() && interaction.customId.startsWith('nexus_')) {
          await handleInteraction(interaction);
        }
      } catch (err) {
        console.error('[nexus] interactionCreate error:', err.message);
      }
    });
```

Add after the existing cron.schedule calls (before `console.log`):
```javascript
    // Nexus daily digest — Phase 2 placeholder
    cron.schedule('0 8 * * *', () => {
      console.log('[nexus] Daily digest: próximamente en Fase 2');
    });
```

Full resulting file for reference:
```javascript
import { EmbedBuilder, ChannelType } from 'discord.js';
import cron from 'node-cron';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import config from '../config.js';
import { AI_CHANNELS, getLatestVideosFromChannel } from '../services/youtube.js';
import { getTranscript } from '../services/transcript.js';
import { AI_NEWS_FEEDS, AI_TWITTER_ACCOUNTS, getLatestNewsFromFeed, getLatestTweets } from '../services/rss.js';
import { summarizeVideo, summarizeNewsItem } from '../services/claude.js';
import { handleInteraction, init as initDiscordUI } from '../services/nexus/discord-ui.js';

const STATE_PATH = join(config.dataPath, 'last_seen.json');

function readState() {
  try { return JSON.parse(readFileSync(STATE_PATH, 'utf-8')); }
  catch { return {}; }
}

function writeState(data) {
  writeFileSync(STATE_PATH, JSON.stringify(data, null, 2));
}

// ── Canal helpers ─────────────────────────────────────────────────────────────

async function getOrCreate(guild, name, topic) {
  const existing = guild.channels.cache.find(c => c.name === name && c.type === ChannelType.GuildText);
  if (existing) return existing;
  const ch = await guild.channels.create({ name, type: ChannelType.GuildText, topic });
  console.log(`Canal creado: #${name}`);
  return ch;
}

// ── YouTube embeds ────────────────────────────────────────────────────────────

function videoEmbed(video, summary) {
  const isLaunch = summary.es_lanzamiento === true;
  const embed = new EmbedBuilder()
    .setColor(isLaunch ? 0xff1744 : 0xff0000)
    .setTitle(`${isLaunch ? '🚨' : '🎬'} ${video.title}`)
    .setURL(video.url)
    .setThumbnail(video.thumbnail)
    .setAuthor({ name: video.channelTitle })
    .setDescription(summary.resumen_ejecutivo || 'Sin resumen.')
    .setTimestamp(new Date(video.publishedAt))
    .setFooter({ text: 'AI YouTube Scout' });

  if (summary.herramienta_protagonista) {
    embed.addFields({ name: '🎯 Herramienta protagonista', value: summary.herramienta_protagonista.slice(0, 500), inline: true });
  }
  if (summary.urgencia) {
    embed.addFields({ name: '⚡ Urgencia', value: summary.urgencia.slice(0, 100), inline: true });
  }
  if (summary.puntos_clave?.length) {
    embed.addFields({ name: '💡 Qué enseña', value: summary.puntos_clave.map((p, i) => `${i + 1}. ${p}`).join('\n').slice(0, 1024) });
  }
  if (summary.herramientas_mencionadas?.length) {
    embed.addFields({ name: '🛠️ Tools mencionadas', value: summary.herramientas_mencionadas.join(', ').slice(0, 500), inline: false });
  }
  if (summary.angulo_primer_video) {
    embed.addFields({ name: '🎥 Ángulo para tu vídeo', value: summary.angulo_primer_video.slice(0, 500) });
  }
  if (summary.titulo_video_sugerido) {
    embed.addFields({ name: '📺 Título sugerido', value: `"${summary.titulo_video_sugerido}"`.slice(0, 500) });
  }
  return embed;
}

// ── News embeds ───────────────────────────────────────────────────────────────

function newsEmbed(feedMeta, item, analysis) {
  const isLaunch = analysis.es_lanzamiento === true;
  const embed = new EmbedBuilder()
    .setColor(feedMeta.color)
    .setTitle(`${isLaunch ? '🚨' : feedMeta.emoji} ${item.title}`)
    .setURL(item.link)
    .setAuthor({ name: feedMeta.name })
    .setTimestamp(new Date(item.pubDate))
    .setFooter({ text: 'AI News Scout' });

  if (analysis.que_han_lanzado) embed.setDescription(analysis.que_han_lanzado.slice(0, 400));
  if (analysis.por_que_importa) embed.addFields({ name: '📊 Por qué importa', value: analysis.por_que_importa.slice(0, 500) });
  if (analysis.angulo_primer_video) embed.addFields({ name: '🎥 Ángulo primer vídeo', value: analysis.angulo_primer_video.slice(0, 500) });
  if (analysis.titulo_video_sugerido) embed.addFields({ name: '📺 Título sugerido', value: `"${analysis.titulo_video_sugerido}"`.slice(0, 500) });
  if (analysis.urgencia) embed.addFields({ name: '⚡ Urgencia', value: analysis.urgencia, inline: true });

  return embed;
}

// ── Twitter embeds ────────────────────────────────────────────────────────────

function tweetEmbed(account, tweet) {
  return new EmbedBuilder()
    .setColor(0x1da1f2)
    .setTitle(`${account.emoji} ${account.name}`)
    .setURL(tweet.link)
    .setDescription(tweet.text.slice(0, 1000))
    .setTimestamp(new Date(tweet.pubDate))
    .setFooter({ text: 'AI Twitter Monitor' });
}

// ── Check logic ───────────────────────────────────────────────────────────────

function isUrgentLaunch(summary) {
  return summary?.es_lanzamiento === true && /🔴/.test(summary?.urgencia || '');
}

async function checkYouTube(channel, launchesChannel) {
  const state = readState();
  const ytState = state.youtube || {};

  for (const ch of AI_CHANNELS) {
    try {
      const videos = await getLatestVideosFromChannel(ch.handle, 3);
      if (!videos.length) continue;

      const lastId = ytState[ch.handle] || '';
      const newVideos = !lastId ? [videos[0]] : videos.filter(v =>
        new Date(v.publishedAt) > new Date(videos.find(x => x.id === lastId)?.publishedAt || 0)
      );

      for (const video of newVideos.reverse()) {
        console.log(`[YT] Nuevo: ${video.channelTitle} — ${video.title}`);
        const transcript = await getTranscript(video.id);
        const summary = await summarizeVideo(video.title, transcript);
        const embed = videoEmbed(video, summary);
        await channel.send({ embeds: [embed] });
        if (isUrgentLaunch(summary) && launchesChannel) {
          await launchesChannel.send({ content: `🚨 **LANZAMIENTO URGENTE detectado en YouTube** — grabar HOY`, embeds: [embed] });
        }
      }

      ytState[ch.handle] = videos[0].id;
    } catch (err) {
      console.warn(`[YT] Error con ${ch.handle}:`, err.message);
    }

    await new Promise(r => setTimeout(r, 1500));
  }

  state.youtube = ytState;
  writeState(state);
}

async function checkNews(channel, launchesChannel) {
  const state = readState();
  const newsState = state.news || {};

  for (const feed of AI_NEWS_FEEDS) {
    try {
      const items = await getLatestNewsFromFeed(feed.url);
      if (!items.length) continue;

      const lastLink = newsState[feed.name] || '';
      const newItems = !lastLink ? [items[0]] : items.filter(i => i.link !== lastLink && new Date(i.pubDate) > new Date(items.find(x => x.link === lastLink)?.pubDate || 0));

      for (const item of newItems.reverse()) {
        console.log(`[RSS] Nuevo: ${feed.name} — ${item.title}`);
        const analysis = await summarizeNewsItem(feed.name, item.title, item.summary);
        const embed = newsEmbed(feed, item, analysis);
        await channel.send({ embeds: [embed] });
        if (isUrgentLaunch(analysis) && launchesChannel) {
          await launchesChannel.send({ content: `🚨 **LANZAMIENTO URGENTE de IA detectado** — grabar en <24h`, embeds: [embed] });
        }
      }

      if (items[0]) newsState[feed.name] = items[0].link;
    } catch (err) {
      console.warn(`[RSS] Error con ${feed.name}:`, err.message);
    }
  }

  state.news = newsState;
  writeState(state);
}

async function checkTwitter(channel) {
  const state = readState();
  const twState = state.twitter || {};

  for (const account of AI_TWITTER_ACCOUNTS) {
    try {
      const tweets = await getLatestTweets(account.handle);
      if (!tweets.length) continue;

      const lastLink = twState[account.handle] || '';
      const newTweets = !lastLink ? [tweets[0]] : tweets.filter(t => t.link !== lastLink);

      for (const tweet of newTweets.reverse()) {
        console.log(`[Twitter] Nuevo: @${account.handle}`);
        await channel.send({ embeds: [tweetEmbed(account, tweet)] });
      }

      if (tweets[0]) twState[account.handle] = tweets[0].link;
    } catch (err) {
      console.warn(`[Twitter] Error con @${account.handle}:`, err.message);
    }
  }

  state.twitter = twState;
  writeState(state);
}

// ── Ready event ───────────────────────────────────────────────────────────────

export default {
  name: 'clientReady',
  once: true,
  async execute(client) {
    console.log(`Bot conectado como ${client.user.tag}`);

    // Initialise Nexus Discord UI with the live client
    initDiscordUI(client);

    // Route Nexus button interactions
    client.on('interactionCreate', async interaction => {
      try {
        if (interaction.isButton() && interaction.customId.startsWith('nexus_')) {
          await handleInteraction(interaction);
        }
      } catch (err) {
        console.error('[nexus] interactionCreate error:', err.message);
      }
    });

    const guild = await client.guilds.fetch(config.guildId);

    const [launchesChannel, ytChannel, newsChannel, twitterChannel] = await Promise.all([
      getOrCreate(guild, 'ai-launches', '🚨 SOLO lanzamientos urgentes detectados — grabar vídeo YA'),
      getOrCreate(guild, 'ai-youtube',  'Nuevos vídeos de referentes del nicho IA — scout automático'),
      getOrCreate(guild, 'ai-noticias', 'Todas las noticias y lanzamientos de Anthropic, OpenAI, Google, etc.'),
      getOrCreate(guild, 'ai-twitter',  'Tweets de los CEOs y researchers más influyentes de IA'),
    ]);

    // Checks iniciales
    checkYouTube(ytChannel, launchesChannel).catch(e => console.error('[YT init]', e.message));
    checkNews(newsChannel, launchesChannel).catch(e => console.error('[RSS init]', e.message));
    checkTwitter(twitterChannel).catch(e => console.error('[Twitter init]', e.message));

    cron.schedule('0 9,18 * * *', () => checkYouTube(ytChannel, launchesChannel).catch(e => console.error('[YT cron]', e.message)));
    cron.schedule('0 */2 * * *',  () => checkNews(newsChannel, launchesChannel).catch(e => console.error('[RSS cron]', e.message)));
    cron.schedule('0 * * * *',    () => checkTwitter(twitterChannel).catch(e => console.error('[Twitter cron]', e.message)));

    // Nexus daily digest — Phase 2 placeholder
    cron.schedule('0 8 * * *', () => {
      console.log('[nexus] Daily digest: próximamente en Fase 2');
    });

    console.log('Monitores activos: 🚨 Launches (auto) · YouTube (9h/18h) · Noticias (2h) · Twitter (1h) · Nexus (activo)');
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add bot/events/ready.js
git commit -m "feat(nexus): route nexus_* button interactions + 08:00 digest cron in ready.js"
```

---

## Post-implementation checklist

- [ ] All 6 new files exist and have no syntax errors (`node --check`)
- [ ] `bot/config.js` exports all 8 new Nexus keys
- [ ] `bot/services/claude.js` calls `nexusEvaluate` in both exported functions
- [ ] `bot/events/ready.js` registers the `interactionCreate` handler and imports `initDiscordUI`
- [ ] `package.json` includes `@supabase/supabase-js`
- [ ] `.env` has placeholder entries (document required vars but do NOT commit actual values)

Required `.env` additions (tell user):
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
NEXUS_INTERNAL_SECRET=your-secret-here
CORTESIA_BASE_URL=https://cortesia.yourdomain.com
SONARFORGE_BASE_URL=https://sonarforge.yourdomain.com
NEXUS_APPROVAL_CHANNEL_ID=123456789012345678
NEXUS_PIPELINE_CHANNEL_ID=123456789012345679
NEXUS_LEARNING_CHANNEL_ID=123456789012345680
```
