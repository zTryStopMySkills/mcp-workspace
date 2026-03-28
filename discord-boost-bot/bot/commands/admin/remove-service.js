const { SlashCommandBuilder } = require('discord.js');
const catalogManager = require('../../handlers/catalogManager');
const { isAdmin } = require('../../utils/permissions');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove-service')
    .setDescription('Eliminar un servicio de boosting del catalogo')
    .addStringOption(opt =>
      opt.setName('id')
        .setDescription('ID del servicio a eliminar (usa /catalog para ver los IDs)')
        .setRequired(true)),

  async execute(interaction) {
    if (!isAdmin(interaction.member)) {
      return interaction.reply({ embeds: [errorEmbed('Sin permisos', 'Solo admins.')], ephemeral: true });
    }

    const id = interaction.options.getString('id');
    const removed = catalogManager.removeService(id);

    if (!removed) {
      // Try removing account
      const removedAccount = catalogManager.removeAccount(id);
      if (!removedAccount) {
        return interaction.reply({ embeds: [errorEmbed('Error', `No se encontro servicio ni cuenta con ID "${id}".\nUsa \`/list-services\` para ver los IDs.`)], ephemeral: true });
      }
      return interaction.reply({
        embeds: [successEmbed('Cuenta eliminada', `🎯 **${removedAccount.title}** (${removedAccount.rank}) ha sido eliminada del catalogo.`)],
      });
    }

    await interaction.reply({
      embeds: [successEmbed('Servicio eliminado', `${removed.emoji} **${removed.name}** (${removed.price}€) ha sido eliminado del catalogo.`)],
    });
  },
};
