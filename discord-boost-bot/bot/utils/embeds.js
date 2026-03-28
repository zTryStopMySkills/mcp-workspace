const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const COLORS = {
  primary: 0x1a1a2e,
  success: 0x00ff88,
  warning: 0xffa500,
  error: 0xff4444,
  gold: 0xffd700,
  boost: 0x7c3aed,
  cod: 0xe85d04,
};

function catalogEmbed(services) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.cod)
    .setTitle('🎮 CALL OF DUTY — SERVICIOS DE BOOSTING')
    .setDescription('Selecciona el servicio que necesitas. Pago seguro por PayPal o Bizum.')
    .setThumbnail('https://i.imgur.com/0X0X0X0.png')
    .setTimestamp()
    .setFooter({ text: 'CoD Boost Services | Precios actualizados' });

  if (services.ranked_boost && services.ranked_boost.length > 0) {
    const rankedLines = services.ranked_boost.map(
      s => `${s.emoji} **${s.name}** — \`${s.price}€\``
    );
    embed.addFields({
      name: '🏆 RANKED BOOST',
      value: rankedLines.join('\n'),
      inline: false,
    });
  }

  if (services.accounts && services.accounts.length > 0) {
    const accountLines = services.accounts.map(
      a => `🎯 **${a.title}** (${a.rank}) — \`${a.price}€\``
    );
    embed.addFields({
      name: '👤 CUENTAS EN VENTA',
      value: accountLines.join('\n'),
      inline: false,
    });
  } else {
    embed.addFields({
      name: '👤 CUENTAS EN VENTA',
      value: '_No hay cuentas disponibles actualmente._',
      inline: false,
    });
  }

  embed.addFields({
    name: '💳 METODOS DE PAGO',
    value: '`PayPal` · `Bizum`',
    inline: true,
  }, {
    name: '⚡ GARANTIA',
    value: 'Servicio seguro y confidencial',
    inline: true,
  });

  return embed;
}

function orderEmbed(order, client) {
  const statusEmojis = {
    pendiente: '🟡',
    asignado: '🔵',
    en_progreso: '🟠',
    completado: '✅',
    cancelado: '❌',
  };

  const embed = new EmbedBuilder()
    .setColor(order.status === 'completado' ? COLORS.success : COLORS.boost)
    .setTitle(`📋 Pedido #${order.id}`)
    .addFields(
      { name: '🎮 Servicio', value: order.serviceName, inline: true },
      { name: '💰 Precio', value: `${order.price}€`, inline: true },
      { name: `${statusEmojis[order.status] || '⚪'} Estado`, value: order.status.toUpperCase(), inline: true },
      { name: '👤 Cliente', value: `<@${order.clientId}>`, inline: true },
    );

  if (order.boosterId) {
    embed.addFields({ name: '🚀 Booster', value: `<@${order.boosterId}>`, inline: true });
  }

  if (order.notes) {
    embed.addFields({ name: '📝 Notas', value: order.notes, inline: false });
  }

  embed.setTimestamp(new Date(order.createdAt));
  embed.setFooter({ text: `Pedido creado` });

  return embed;
}

function orderButtons(order) {
  const rows = [];

  if (order.status === 'pendiente') {
    rows.push(new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`claim_${order.id}`)
        .setLabel('🙋 Reclamar pedido')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`cancel_${order.id}`)
        .setLabel('❌ Cancelar')
        .setStyle(ButtonStyle.Danger),
    ));
  }

  if (order.status === 'asignado' || order.status === 'en_progreso') {
    rows.push(new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`confirm_payment_${order.id}`)
        .setLabel('💳 Confirmar pago')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`complete_${order.id}`)
        .setLabel('✅ Completar')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`cancel_${order.id}`)
        .setLabel('❌ Cancelar')
        .setStyle(ButtonStyle.Danger),
    ));
  }

  return rows;
}

function statsEmbed(stats) {
  return new EmbedBuilder()
    .setColor(COLORS.gold)
    .setTitle('📊 ESTADISTICAS DEL SERVIDOR')
    .addFields(
      { name: '📦 Pedidos totales', value: `${stats.totalOrders}`, inline: true },
      { name: '✅ Completados', value: `${stats.completedOrders}`, inline: true },
      { name: '🟡 Pendientes', value: `${stats.pendingOrders}`, inline: true },
      { name: '💰 Ingresos totales', value: `${stats.totalRevenue}€`, inline: true },
      { name: '🚀 Boosters activos', value: `${stats.activeBoosters}`, inline: true },
      { name: '👤 Cuentas en venta', value: `${stats.accountsForSale}`, inline: true },
    )
    .setTimestamp()
    .setFooter({ text: 'Actualizado' });
}

function successEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(COLORS.success)
    .setTitle(`✅ ${title}`)
    .setDescription(description);
}

function errorEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(COLORS.error)
    .setTitle(`❌ ${title}`)
    .setDescription(description);
}

module.exports = {
  COLORS,
  catalogEmbed,
  orderEmbed,
  orderButtons,
  statsEmbed,
  successEmbed,
  errorEmbed,
};
