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
