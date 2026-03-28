const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const orderManager = require('../../handlers/orderManager');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('my-orders')
    .setDescription('Ver tus pedidos'),

  async execute(interaction) {
    const orders = orderManager.getOrdersByClient(interaction.user.id);

    if (orders.length === 0) {
      return interaction.reply({ content: 'No tienes pedidos.', ephemeral: true });
    }

    const statusEmojis = {
      pendiente: '🟡',
      asignado: '🔵',
      en_progreso: '🟠',
      completado: '✅',
      cancelado: '❌',
    };

    const lines = orders.slice(-10).map(o =>
      `${statusEmojis[o.status] || '⚪'} **#${o.id}** — ${o.serviceName} — \`${o.price}€\` — ${o.status}`
    );

    const embed = new EmbedBuilder()
      .setColor(COLORS.boost)
      .setTitle('📋 Tus Pedidos')
      .setDescription(lines.join('\n'))
      .setFooter({ text: `Mostrando ultimos ${Math.min(orders.length, 10)} de ${orders.length}` });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
