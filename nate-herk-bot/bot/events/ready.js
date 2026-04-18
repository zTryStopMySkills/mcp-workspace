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
