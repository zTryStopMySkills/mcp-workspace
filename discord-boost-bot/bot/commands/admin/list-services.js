const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const catalogManager = require('../../handlers/catalogManager');
const { isAdmin } = require('../../utils/permissions');
const { COLORS, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list-services')
    .setDescription('Ver todos los servicios con sus IDs (para editar/eliminar)'),

  async execute(interaction) {
    if (!isAdmin(interaction.member)) {
      return interaction.reply({ embeds: [errorEmbed('Sin permisos', 'Solo admins.')], ephemeral: true });
    }

    const services = catalogManager.getServices();

    const lines = [];

    if (services.ranked_boost.length > 0) {
      lines.push('**🏆 RANKED BOOST:**');
      for (const s of services.ranked_boost) {
        lines.push(`  ${s.emoji} \`${s.id}\` — ${s.name} — ${s.price}€`);
      }
    }

    if (services.accounts.length > 0) {
      lines.push('');
      lines.push('**👤 CUENTAS:**');
      for (const a of services.accounts) {
        lines.push(`  🎯 \`${a.id}\` — ${a.title} (${a.rank}) — ${a.price}€`);
      }
    }

    if (lines.length === 0) {
      lines.push('_No hay servicios configurados._');
    }

    const embed = new EmbedBuilder()
      .setColor(COLORS.cod)
      .setTitle('🔧 SERVICIOS — PANEL ADMIN')
      .setDescription(lines.join('\n'))
      .setFooter({ text: 'Usa /edit-service <id> o /remove-service <id> para modificar' });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
