const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { COLORS } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Ver todos los comandos disponibles'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(COLORS.cod)
      .setTitle('🎮 COD BOOST BOT — COMANDOS')
      .addFields(
        {
          name: '📋 COMANDOS PUBLICOS',
          value: [
            '`/catalog` — Ver servicios y precios',
            '`/order` — Hacer un pedido',
            '`/my-orders` — Ver tus pedidos',
            '`/help` — Ver esta ayuda',
          ].join('\n'),
        },
        {
          name: '🚀 COMANDOS BOOSTER',
          value: [
            '`/claim <id>` — Reclamar un pedido',
            '`/my-jobs` — Ver tus trabajos activos',
          ].join('\n'),
        },
        {
          name: '🔧 COMANDOS ADMIN',
          value: [
            '`/set-price <servicio> <precio>` — Cambiar precio',
            '`/add-service <nombre> <precio> ...` — Anadir servicio',
            '`/add-booster @usuario` — Registrar booster',
            '`/remove-booster @usuario` — Quitar booster',
            '`/assign-order <id> @booster` — Asignar pedido',
            '`/complete-order <id>` — Completar pedido',
            '`/add-account <titulo> <rango> <precio>` — Vender cuenta',
            '`/stats` — Ver estadisticas',
          ].join('\n'),
        },
        {
          name: '💳 METODOS DE PAGO',
          value: 'PayPal · Bizum',
        }
      )
      .setFooter({ text: 'CoD Boost Services' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
