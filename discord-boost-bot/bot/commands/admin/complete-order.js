const { SlashCommandBuilder } = require('discord.js');
const orderManager = require('../../handlers/orderManager');
const boosterManager = require('../../handlers/boosterManager');
const { isAdmin } = require('../../utils/permissions');
const { orderEmbed, successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('complete-order')
    .setDescription('Marcar un pedido como completado')
    .addIntegerOption(opt =>
      opt.setName('id')
        .setDescription('ID del pedido')
        .setRequired(true)),

  async execute(interaction) {
    if (!isAdmin(interaction.member)) {
      return interaction.reply({ embeds: [errorEmbed('Sin permisos', 'Solo admins.')], ephemeral: true });
    }

    const orderId = interaction.options.getInteger('id');
    const order = orderManager.completeOrder(orderId);

    if (!order) {
      return interaction.reply({ embeds: [errorEmbed('Error', 'Pedido no encontrado.')], ephemeral: true });
    }

    // Update booster stats
    if (order.boosterId) {
      boosterManager.incrementBoosterStats(order.boosterId, order.price);
    }

    // Notify in ticket
    if (order.ticketChannelId) {
      try {
        const channel = await interaction.guild.channels.fetch(order.ticketChannelId);
        await channel.send({
          content: `✅ **Pedido #${order.id} completado!** Este canal se archivara pronto.`,
          embeds: [orderEmbed(order)],
        });
      } catch (e) { /* channel may not exist */ }
    }

    // Notify client via DM
    try {
      const client = await interaction.client.users.fetch(order.clientId);
      await client.send({ embeds: [successEmbed('Pedido completado', `Tu pedido **#${order.id}** (${order.serviceName}) ha sido completado. Gracias!`)] });
    } catch (e) { /* DMs closed */ }

    await interaction.reply({
      embeds: [successEmbed('Pedido completado', `Pedido **#${orderId}** marcado como completado.`)],
    });
  },
};
