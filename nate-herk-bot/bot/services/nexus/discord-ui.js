// bot/services/nexus/discord-ui.js
// Handles Discord embeds for Nexus pipeline approval and button interactions.
// Call init(client) once from ready.js before any other function is used.
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
 * Initialise with the live Discord client. Must be called from ready.js.
 * @param {import('discord.js').Client} client
 */
export function init(client) {
  _client = client;
}

// ── Approval message ──────────────────────────────────────────────────────────

/**
 * Post an approval embed with Approve / Reject / Re-research buttons.
 * Saves the Discord message ID back to the pipeline run row.
 *
 * @param {object} run - pipeline run row (must have .id, .research_output, .draft_output)
 */
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
      { name: '📌 Topic', value: String(run.topic ?? 'N/A').slice(0, 256), inline: true },
      { name: '🎯 Tool detectada', value: String(run.tool_detected ?? 'N/A').slice(0, 256), inline: true },
      { name: '⚡ Urgencia', value: String(run.urgency ?? 'N/A').slice(0, 256), inline: true },
    );

  if (research.keywords?.length) {
    embed.addFields({ name: '🔑 Keywords', value: research.keywords.join(', ').slice(0, 500) });
  }
  if (research.content_angle) {
    embed.addFields({ name: '🎥 Ángulo de contenido', value: String(research.content_angle).slice(0, 500) });
  }
  if (draft.suggested_title) {
    embed.addFields({ name: '📺 Título sugerido', value: `"${draft.suggested_title}"`.slice(0, 500) });
  }
  if (draft.preset_used) {
    embed.addFields({ name: '🎚️ Preset usado', value: String(draft.preset_used).slice(0, 256), inline: true });
  }

  embed.setFooter({ text: `Run ID: ${run.id}` }).setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`nexus_approve_${run.id}`)
      .setLabel('Aprobar')
      .setEmoji('✅')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`nexus_reject_${run.id}`)
      .setLabel('Rechazar')
      .setEmoji('❌')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(`nexus_reresearch_${run.id}`)
      .setLabel('Re-research')
      .setEmoji('🔁')
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

/**
 * Handle a button interaction whose customId starts with 'nexus_'.
 * @param {import('discord.js').ButtonInteraction} interaction
 */
export async function handleInteraction(interaction) {
  const { customId } = interaction;

  if (customId.startsWith('nexus_approve_')) {
    const runId = customId.replace('nexus_approve_', '');
    try {
      await updateRunStatus(runId, 'approved', { approved_at: new Date().toISOString() });
      await interaction.reply({ content: 'Aprobado ✅', ephemeral: true });
      await postStatusUpdate(`✅ Run \`${runId}\` aprobado por <@${interaction.user.id}>`);
    } catch (err) {
      console.error('[nexus-ui] approve error:', err.message);
      await interaction.reply({ content: `Error al aprobar: ${err.message}`, ephemeral: true }).catch(() => {});
    }
    return;
  }

  if (customId.startsWith('nexus_reject_')) {
    const runId = customId.replace('nexus_reject_', '');
    try {
      await updateRunStatus(runId, 'rejected', { rejected_at: new Date().toISOString() });
      await interaction.reply({ content: 'Rechazado ❌', ephemeral: true });
      await postStatusUpdate(`❌ Run \`${runId}\` rechazado por <@${interaction.user.id}>`);
    } catch (err) {
      console.error('[nexus-ui] reject error:', err.message);
      await interaction.reply({ content: `Error al rechazar: ${err.message}`, ephemeral: true }).catch(() => {});
    }
    return;
  }

  if (customId.startsWith('nexus_reresearch_')) {
    const runId = customId.replace('nexus_reresearch_', '');
    try {
      await interaction.reply({ content: '🔁 Relanzando research...', ephemeral: true });

      // Dynamic import to avoid circular dependency at module load time
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
      console.error('[nexus-ui] re-research error:', err.message);
      await logError(runId, 'discord.reresearch_failed', { message: err.message }, {});
      await interaction.followUp({ content: `Error en re-research: ${err.message}`, ephemeral: true }).catch(() => {});
    }
    return;
  }
}

// ── Status channel helper ─────────────────────────────────────────────────────

/**
 * Post a plain-text message to the Nexus pipeline status channel.
 * Silently no-ops if channel ID is not configured.
 * @param {string} message
 */
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
  return 0x4caf50; // 🟢
}
