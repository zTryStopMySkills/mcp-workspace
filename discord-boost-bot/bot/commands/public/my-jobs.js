const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const orderManager = require('../../handlers/orderManager');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('my-jobs')
    .setDescription('Ver tus trabajos activos como booster'),

  async execute(interaction) {
    const orders = orderManager.getOrdersByBooster(interaction.user.id);

    if (orders.length === 0) {
      return interaction.reply({ content: 'No tienes trabajos activos.', ephemeral: true });
    }

    const statusEmojis = {
      asignado: '🔵',
      en_progreso: '🟠',
    };

    const lines = orders.map(o =>
      `${statusEmojis[o.status] || '⚪'} **#${o.id}** — ${o.serviceName} — \`${o.price}€\` — <@${o.clientId}>`
    );

    const embed = new EmbedBuilder()
      .setColor(COLORS.boost)
      .setTitle('🚀 Tus Trabajos Activos')
      .setDescription(lines.join('\n'))
      .setFooter({ text: `${orders.length} trabajo(s) activo(s)` });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
