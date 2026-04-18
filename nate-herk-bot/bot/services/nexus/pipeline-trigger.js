// bot/services/nexus/pipeline-trigger.js
// Called after every Claude analysis to decide how to handle it:
//   🔴 Urgent  → fire executePipeline immediately (async, non-blocking)
//   🟡 Medium  → queue in nexus_events with event_type 'pipeline.queued'
//   🟢 Low     → record in nexus_events with event_type 'pipeline.low_priority'
import { executePipeline } from './orchestrator.js';
import { supabase } from '../../db/supabase.js';

/**
 * Evaluate a Claude analysis result and trigger the appropriate pipeline action.
 *
 * @param {object} analysis - JSON returned by claude.js (may be empty object on parse failure)
 * @param {'rss'|'youtube'|'twitter'} sourceType
 */
export async function evaluate(analysis, sourceType) {
  if (!analysis || typeof analysis !== 'object') return;

  const urgency = analysis.urgencia ?? '';

  if (/🔴/.test(urgency)) {
    console.log(`[nexus-trigger] 🔴 Urgent — firing pipeline immediately (${sourceType})`);
    // Fire-and-forget: don't block the caller (RSS/YouTube scan loop)
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

  // 🟢 Low priority or urgency field absent/empty
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
