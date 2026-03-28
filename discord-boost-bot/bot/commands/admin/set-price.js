const { SlashCommandBuilder } = require('discord.js');
const catalogManager = require('../../handlers/catalogManager');
const { isAdmin } = require('../../utils/permissions');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-price')
    .setDescription('Cambiar el precio de un servicio')
    .addStringOption(opt =>
      opt.setName('servicio')
        .setDescription('ID del servicio (ej: bronze_silver)')
        .setRequired(true)
        .addChoices(
          { name: 'Bronce → Plata', value: 'bronze_silver' },
          { name: 'Plata → Oro', value: 'silver_gold' },
          { name: 'Oro → Platino', value: 'gold_platinum' },
          { name: 'Platino → Diamante', value: 'platinum_diamond' },
          { name: 'Diamante → Crimson', value: 'diamond_crimson' },
          { name: 'Crimson → Iridescent', value: 'crimson_iridescent' },
        ))
    .addNumberOption(opt =>
      opt.setName('precio')
        .setDescription('Nuevo precio en euros')
        .setRequired(true)
        .setMinValue(1)),

  async execute(interaction) {
    if (!isAdmin(interaction.member)) {
      return interaction.reply({ embeds: [errorEmbed('Sin permisos', 'Solo admins pueden cambiar precios.')], ephemeral: true });
    }

    const serviceId = interaction.options.getString('servicio');
    const price = interaction.options.getNumber('precio');

    const updated = catalogManager.setPrice(serviceId, price);
    if (!updated) {
      return interaction.reply({ embeds: [errorEmbed('Error', `Servicio "${serviceId}" no encontrado.`)], ephemeral: true });
    }

    await interaction.reply({
      embeds: [successEmbed('Precio actualizado', `**${updated.name}** ahora cuesta **${price}€**`)],
    });
  },
};
