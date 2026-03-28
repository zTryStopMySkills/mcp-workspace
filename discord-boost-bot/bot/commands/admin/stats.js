const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const orderManager = require('../../handlers/orderManager');
const boosterManager = require('../../handlers/boosterManager');
const catalogManager = require('../../handlers/catalogManager');
const { isAdmin } = require('../../utils/permissions');
const { statsEmbed, errorEmbed, COLORS } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Ver estadisticas del servidor de boosting'),

  async execute(interaction) {
    if (!isAdmin(interaction.member)) {
      return interaction.reply({ embeds: [errorEmbed('Sin permisos', 'Solo admins.')], ephemeral: true });
    }

    const orderStats = orderManager.getStats();
    const boosters = boosterManager.getAllBoosters();
    const services = catalogManager.getServices();

    const stats = {
      ...orderStats,
      activeBoosters: boosters.length,
      accountsForSale: services.accounts.length,
    };

    const embeds = [statsEmbed(stats)];

    // Top boosters
    if (boosters.length > 0) {
      const sorted = [...boosters].sort((a, b) => b.ordersCompleted - a.ordersCompleted);
      const topLines = sorted.slice(0, 5).map((b, i) =>
        `**${i + 1}.** <@${b.userId}> — ${b.ordersCompleted} pedidos — ${b.totalEarned}€`
      );

      const topEmbed = new EmbedBuilder()
        .setColor(COLORS.gold)
        .setTitle('🏆 TOP BOOSTERS')
        .setDescription(topLines.join('\n'));

      embeds.push(topEmbed);
    }

    await interaction.reply({ embeds, ephemeral: true });
  },
};
