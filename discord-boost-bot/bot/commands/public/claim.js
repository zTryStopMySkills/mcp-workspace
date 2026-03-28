const { SlashCommandBuilder } = require('discord.js');
const orderManager = require('../../handlers/orderManager');
const boosterManager = require('../../handlers/boosterManager');
const { isAdmin, isBooster } = require('../../utils/permissions');
const { orderEmbed, successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('claim')
    .setDescription('Reclamar un pedido como booster')
    .addIntegerOption(opt =>
      opt.setName('id')
        .setDescription('ID del pedido')
        .setRequired(true)),

  async execute(interaction) {
    const booster = boosterManager.getBooster(interaction.user.id);
    if (!booster && !isAdmin(interaction.member)) {
      return interaction.reply({ embeds: [errorEmbed('Sin permisos', 'No estas registrado como booster. Contacta con un admin.')], ephemeral: true });
    }

    const orderId = interaction.options.getInteger('id');
    const order = orderManager.claimOrder(orderId, interaction.user.id);

    if (!order) {
      return interaction.reply({ embeds: [errorEmbed('Error', 'Este pedido no existe o ya fue reclamado.')], ephemeral: true });
    }

    // Add booster to ticket channel
    if (order.ticketChannelId) {
      try {
        const channel = await interaction.guild.channels.fetch(order.ticketChannelId);
        await channel.permissionOverwrites.create(interaction.user.id, {
          ViewChannel: true,
          SendMessages: true,
        });
        await channel.send({
          content: `🚀 <@${interaction.user.id}> ha reclamado este pedido!`,
          embeds: [orderEmbed(order)],
        });
      } catch (e) {
        console.error('Error actualizando permisos del ticket:', e.message);
      }
    }

    await interaction.reply({
      embeds: [successEmbed('Pedido reclamado', `Has reclamado el pedido **#${orderId}** (${order.serviceName}).`)],
      ephemeral: true,
    });
  },
};
