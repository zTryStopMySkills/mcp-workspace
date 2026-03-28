const { SlashCommandBuilder } = require('discord.js');
const catalogManager = require('../../handlers/catalogManager');
const { catalogEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('catalog')
    .setDescription('Ver el catalogo de servicios de boosting y cuentas'),

  async execute(interaction) {
    const services = catalogManager.getServices();
    const embed = catalogEmbed(services);
    await interaction.reply({ embeds: [embed] });
  },
};
