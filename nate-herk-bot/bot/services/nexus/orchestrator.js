// bot/services/nexus/orchestrator.js
// Manages pipeline run lifecycle in Supabase and executes research/draft phases.
import { supabase } from '../../db/supabase.js';
import { nexusFetch } from './http-client.js';
import config from '../../config.js';

// ── DB helpers ────────────────────────────────────────────────────────────────

/**
 * Insert a new pipeline run record in Supabase.
 * @param {object} sourceItem - Claude analysis JSON
 * @param {string} triggeredBy - 'rss' | 'youtube' | 'twitter' | 'manual' | 'cron'
 * @returns {Promise<object>} inserted row
 */
export async function createPipelineRun(sourceItem, triggeredBy) {
  const { data, error } = await supabase
    .from('nexus_pipeline_runs')
    .insert({
      source_item: sourceItem,
      triggered_by: triggeredBy,
      status: 'pending',
      urgency: sourceItem?.urgencia ?? null,
      topic:
        sourceItem?.herramienta_protagonista ??
        sourceItem?.que_han_lanzado ??
        null,
      tool_detected: sourceItem?.herramienta_protagonista ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(`createPipelineRun: ${error.message}`);
  return data;
}

/**
 * Update status (and any extra columns) of an existing run.
 * @param {string} runId - UUID
 * @param {string} status
 * @param {object} extraFields - additional columns to update
 */
export async function updateRunStatus(runId, status, extraFields = {}) {
  const { error } = await supabase
    .from('nexus_pipeline_runs')
    .update({ status, ...extraFields })
    .eq('id', runId);

  if (error) throw new Error(`updateRunStatus(${runId}): ${error.message}`);
}

/**
 * Insert a row into the nexus_events event bus.
 * @param {string} type - event_type string
 * @param {string|null} runId - UUID or null
 * @param {object} payload
 * @param {string|null} source
 */
export async function emitEvent(type, runId, payload = {}, source = null) {
  const { error } = await supabase
    .from('nexus_events')
    .insert({
      event_type: type,
      pipeline_run_id: runId ?? null,
      payload,
      source,
    });

  if (error) console.warn(`[nexus] emitEvent(${type}) error:`, error.message);
}

/**
 * Record an error in nexus_error_log for observability and self-improvement.
 * @param {string|null} runId
 * @param {string} errorType
 * @param {object} errorDetail
 * @param {object} context
 */
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

/**
 * Call Cortesia research endpoint and store the result.
 * @param {object} run - pipeline run row (must have .id and .source_item)
 * @returns {Promise<object>} updated run with research_output
 */
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

/**
 * Call SonarForge draft endpoint and store the result.
 * @param {object} run - pipeline run row (must have .id and .research_output)
 * @returns {Promise<object>} updated run with draft_output
 */
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

/**
 * Full pipeline: create run → research → draft → Discord approval message.
 * Each phase failure is logged and stops the pipeline without throwing.
 *
 * @param {object} sourceItem - Claude analysis JSON
 * @param {string} triggeredBy - source identifier
 */
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
    // Dynamic import avoids circular dependency at module evaluation time
    const { postApprovalMessage } = await import('./discord-ui.js');
    await postApprovalMessage(run);
  } catch (err) {
    console.error(`[nexus] Discord approval post failed for run ${run.id}:`, err.message);
    await logError(run.id, 'discord.post_failed', { message: err.message }, {});
    // Pipeline data is safely in Supabase — Discord failure is not fatal
  }

  const durationMs = Date.now() - startedAt;
  await updateRunStatus(run.id, 'awaiting_approval', { duration_ms: durationMs });
  await emitEvent('pipeline.awaiting_approval', run.id, { durationMs }, 'orchestrator');
  console.log(`[nexus] Pipeline ${run.id} ready for approval (${durationMs}ms)`);
}
