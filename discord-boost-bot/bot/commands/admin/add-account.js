const { SlashCommandBuilder } = require('discord.js');
const catalogManager = require('../../handlers/catalogManager');
const { isAdmin } = require('../../utils/permissions');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-account')
    .setDescription('Poner una cuenta en venta')
    .addStringOption(opt =>
      opt.setName('titulo')
        .setDescription('Titulo de la cuenta (ej: Cuenta Iridescent)')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('rango')
        .setDescription('Rango de la cuenta')
        .setRequired(true))
    .addNumberOption(opt =>
      opt.setName('precio')
        .setDescription('Precio en euros')
        .setRequired(true)
        .setMinValue(1))
    .addStringOption(opt =>
      opt.setName('detalles')
        .setDescription('Detalles adicionales (camos, stats, etc.)')
        .setRequired(false)),

  async execute(interaction) {
    if (!isAdmin(interaction.member)) {
      return interaction.reply({ embeds: [errorEmbed('Sin permisos', 'Solo admins.')], ephemeral: true });
    }

    const title = interaction.options.getString('titulo');
    const rank = interaction.options.getString('rango');
    const price = interaction.options.getNumber('precio');
    const details = interaction.options.getString('detalles') || '';

    const account = catalogManager.addAccount(title, rank, price, details);

    await interaction.reply({
      embeds: [successEmbed('Cuenta anadida', `🎯 **${title}** (${rank}) — **${price}€**${details ? `\n_${details}_` : ''}`)],
    });
  },
};
