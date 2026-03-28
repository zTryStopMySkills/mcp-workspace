const { SlashCommandBuilder } = require('discord.js');
const catalogManager = require('../../handlers/catalogManager');
const { isAdmin } = require('../../utils/permissions');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-service')
    .setDescription('Anadir un nuevo servicio de boosting')
    .addStringOption(opt =>
      opt.setName('id')
        .setDescription('ID unico del servicio (ej: gold_master)')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('nombre')
        .setDescription('Nombre visible (ej: Oro → Master)')
        .setRequired(true))
    .addNumberOption(opt =>
      opt.setName('precio')
        .setDescription('Precio en euros')
        .setRequired(true)
        .setMinValue(1))
    .addStringOption(opt =>
      opt.setName('emoji')
        .setDescription('Emoji del servicio (ej: 🏆)')
        .setRequired(false))
    .addStringOption(opt =>
      opt.setName('descripcion')
        .setDescription('Descripcion del servicio')
        .setRequired(false)),

  async execute(interaction) {
    if (!isAdmin(interaction.member)) {
      return interaction.reply({ embeds: [errorEmbed('Sin permisos', 'Solo admins.')], ephemeral: true });
    }

    const id = interaction.options.getString('id');
    const name = interaction.options.getString('nombre');
    const price = interaction.options.getNumber('precio');
    const emoji = interaction.options.getString('emoji') || '🎮';
    const description = interaction.options.getString('descripcion') || `Servicio de ${name}`;

    const service = catalogManager.addService(id, name, emoji, price, description);
    if (!service) {
      return interaction.reply({ embeds: [errorEmbed('Error', `Ya existe un servicio con ID "${id}".`)], ephemeral: true });
    }

    await interaction.reply({
      embeds: [successEmbed('Servicio anadido', `${emoji} **${name}** — **${price}€**\n_${description}_`)],
    });
  },
};
