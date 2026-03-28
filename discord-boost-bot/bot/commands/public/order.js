const {
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require('discord.js');
const catalogManager = require('../../handlers/catalogManager');
const orderManager = require('../../handlers/orderManager');
const { orderEmbed, orderButtons, errorEmbed, COLORS } = require('../../utils/embeds');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('order')
    .setDescription('Hacer un pedido de boosting o comprar una cuenta')
    .addStringOption(opt =>
      opt.setName('notas')
        .setDescription('Notas adicionales (ej: horario disponible, datos cuenta)')
        .setRequired(false)),

  async execute(interaction) {
    const services = catalogManager.getServices();
    const choices = catalogManager.getAllServiceChoices();

    if (choices.length === 0) {
      return interaction.reply({ embeds: [errorEmbed('Sin servicios', 'No hay servicios disponibles.')], ephemeral: true });
    }

    // Build select menu
    const options = choices.slice(0, 25).map(c =>
      new StringSelectMenuOptionBuilder().setLabel(c.name).setValue(c.value)
    );

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('order_service_select')
      .setPlaceholder('Selecciona un servicio...')
      .addOptions(options);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const reply = await interaction.reply({
      content: '🎮 **Selecciona el servicio que quieres contratar:**',
      components: [row],
      ephemeral: true,
    });

    // Wait for selection
    try {
      const selectInteraction = await reply.awaitMessageComponent({
        filter: i => i.user.id === interaction.user.id && i.customId === 'order_service_select',
        time: 60_000,
      });

      const selectedId = selectInteraction.values[0];
      const service = catalogManager.getServiceById(selectedId);
      if (!service) {
        return selectInteraction.update({ content: 'Servicio no encontrado.', components: [] });
      }

      const notes = interaction.options.getString('notas') || '';
      const serviceName = service.name || service.title;
      const price = service.price;

      // Create order
      const order = orderManager.createOrder(
        interaction.user.id,
        selectedId,
        serviceName,
        price,
        notes
      );

      // Create ticket channel
      const guild = interaction.guild;
      const ticketChannel = await guild.channels.create({
        name: `ticket-${order.id}-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: config.channels.categoryTickets || undefined,
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
          },
          ...(config.roles.admin ? [{
            id: config.roles.admin,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels],
          }] : []),
          ...(config.roles.booster ? [{
            id: config.roles.booster,
            allow: [PermissionFlagsBits.ViewChannel],
          }] : []),
        ],
      });

      // Update order with channel
      orderManager.updateOrder(order.id, { ticketChannelId: ticketChannel.id });

      // Send order embed in ticket
      await ticketChannel.send({
        content: `📋 **Nuevo pedido** de <@${interaction.user.id}>`,
        embeds: [orderEmbed(order)],
        components: orderButtons(order),
      });

      // Payment instructions
      await ticketChannel.send({
        content: [
          '**💳 Instrucciones de pago:**',
          '',
          `💰 **Total: ${price}€**`,
          '',
          config.payments.paypal ? `📧 **PayPal:** \`${config.payments.paypal}\`` : '',
          config.payments.bizum ? `📱 **Bizum:** \`${config.payments.bizum}\`` : '',
          '',
          '_Envia el comprobante de pago en este canal. Un admin confirmara el pago._',
        ].filter(Boolean).join('\n'),
      });

      // Post in orders channel for boosters to claim
      if (config.channels.orders) {
        try {
          const ordersChannel = await guild.channels.fetch(config.channels.orders);
          await ordersChannel.send({
            content: '🆕 **Nuevo pedido disponible!**',
            embeds: [orderEmbed(order)],
            components: orderButtons(order),
          });
        } catch (e) {
          console.error('No se pudo publicar en canal de pedidos:', e.message);
        }
      }

      await selectInteraction.update({
        content: `✅ **Pedido #${order.id} creado!** Ve al canal ${ticketChannel} para continuar.`,
        components: [],
      });

    } catch (error) {
      if (error.code === 'InteractionCollectorError') {
        await interaction.editReply({ content: '⏰ Tiempo agotado. Usa `/order` de nuevo.', components: [] });
      } else {
        console.error('Error en /order:', error);
      }
    }
  },
};
