const { isAdmin, isBooster } = require('../utils/permissions');
const orderManager = require('../handlers/orderManager');
const boosterManager = require('../handlers/boosterManager');
const { orderEmbed, orderButtons, successEmbed, errorEmbed } = require('../utils/embeds');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error ejecutando /${interaction.commandName}:`, error);
        const reply = { embeds: [errorEmbed('Error', 'Hubo un error ejecutando el comando.')], ephemeral: true };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(reply);
        } else {
          await interaction.reply(reply);
        }
      }
      return;
    }

    // Handle button interactions
    if (interaction.isButton()) {
      const [action, orderId] = interaction.customId.split('_').length === 2
        ? interaction.customId.split('_')
        : [interaction.customId.replace(/_\d+$/, '').replace(/_/g, '_'), interaction.customId.match(/_(\d+)$/)?.[1]];

      const parsedId = parseInt(orderId);
      if (isNaN(parsedId)) return;

      const customId = interaction.customId;

      // Claim order
      if (customId.startsWith('claim_')) {
        const booster = boosterManager.getBooster(interaction.user.id);
        if (!booster && !isAdmin(interaction.member)) {
          return interaction.reply({ embeds: [errorEmbed('Sin permisos', 'No estas registrado como booster.')], ephemeral: true });
        }
        const order = orderManager.claimOrder(parsedId, interaction.user.id);
        if (!order) {
          return interaction.reply({ embeds: [errorEmbed('Error', 'Este pedido ya no esta disponible.')], ephemeral: true });
        }
        await interaction.update({ embeds: [orderEmbed(order)], components: orderButtons(order) });
        return;
      }

      // Confirm payment (admin only)
      if (customId.startsWith('confirm_payment_')) {
        if (!isAdmin(interaction.member)) {
          return interaction.reply({ embeds: [errorEmbed('Sin permisos', 'Solo admins pueden confirmar pagos.')], ephemeral: true });
        }
        const order = orderManager.confirmPayment(parsedId);
        if (!order) {
          return interaction.reply({ embeds: [errorEmbed('Error', 'Pedido no encontrado.')], ephemeral: true });
        }
        await interaction.update({ embeds: [orderEmbed(order)], components: orderButtons(order) });
        return;
      }

      // Complete order
      if (customId.startsWith('complete_')) {
        const order = orderManager.getOrder(parsedId);
        if (!order) {
          return interaction.reply({ embeds: [errorEmbed('Error', 'Pedido no encontrado.')], ephemeral: true });
        }
        if (!isAdmin(interaction.member) && order.boosterId !== interaction.user.id) {
          return interaction.reply({ embeds: [errorEmbed('Sin permisos', 'Solo el booster asignado o un admin puede completar.')], ephemeral: true });
        }
        const updated = orderManager.completeOrder(parsedId);
        if (updated.boosterId) {
          boosterManager.incrementBoosterStats(updated.boosterId, updated.price);
        }
        await interaction.update({ embeds: [orderEmbed(updated)], components: [] });
        // Notify client
        try {
          const clientUser = await interaction.client.users.fetch(updated.clientId);
          await clientUser.send({ embeds: [successEmbed('Pedido completado', `Tu pedido #${updated.id} (${updated.serviceName}) ha sido completado. Gracias por confiar en nosotros!`)] });
        } catch (e) { /* DMs closed */ }
        return;
      }

      // Cancel order
      if (customId.startsWith('cancel_')) {
        if (!isAdmin(interaction.member)) {
          return interaction.reply({ embeds: [errorEmbed('Sin permisos', 'Solo admins pueden cancelar pedidos.')], ephemeral: true });
        }
        const order = orderManager.cancelOrder(parsedId);
        if (!order) {
          return interaction.reply({ embeds: [errorEmbed('Error', 'Pedido no encontrado.')], ephemeral: true });
        }
        await interaction.update({ embeds: [orderEmbed(order)], components: [] });
        return;
      }
    }

    // Handle select menus
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'order_service_select') {
        // Handled in the order command collector
      }
    }
  },
};
