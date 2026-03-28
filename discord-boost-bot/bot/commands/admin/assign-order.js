const { SlashCommandBuilder } = require('discord.js');
const orderManager = require('../../handlers/orderManager');
const { isAdmin } = require('../../utils/permissions');
const { orderEmbed, successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('assign-order')
    .setDescription('Asignar un pedido a un booster')
    .addIntegerOption(opt =>
      opt.setName('id')
        .setDescription('ID del pedido')
        .setRequired(true))
    .addUserOption(opt =>
      opt.setName('booster')
        .setDescription('Booster a asignar')
        .setRequired(true)),

  async execute(interaction) {
    if (!isAdmin(interaction.member)) {
      return interaction.reply({ embeds: [errorEmbed('Sin permisos', 'Solo admins.')], ephemeral: true });
    }

    const orderId = interaction.options.getInteger('id');
    const booster = interaction.options.getUser('booster');

    const order = orderManager.assignOrder(orderId, booster.id);
    if (!order) {
      return interaction.reply({ embeds: [errorEmbed('Error', 'Pedido no encontrado.')], ephemeral: true });
    }

    // Add booster to ticket
    if (order.ticketChannelId) {
      try {
        const channel = await interaction.guild.channels.fetch(order.ticketChannelId);
        await channel.permissionOverwrites.create(booster.id, {
          ViewChannel: true,
          SendMessages: true,
        });
        await channel.send({
          content: `🚀 <@${booster.id}> ha sido asignado a este pedido por un admin.`,
          embeds: [orderEmbed(order)],
        });
      } catch (e) { /* channel may not exist */ }
    }

    await interaction.reply({
      embeds: [successEmbed('Pedido asignado', `Pedido **#${orderId}** asignado a ${booster}.`)],
    });
  },
};
