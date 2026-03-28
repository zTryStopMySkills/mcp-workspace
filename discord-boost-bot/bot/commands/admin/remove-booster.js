const { SlashCommandBuilder } = require('discord.js');
const boosterManager = require('../../handlers/boosterManager');
const { isAdmin } = require('../../utils/permissions');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove-booster')
    .setDescription('Quitar a un usuario como booster')
    .addUserOption(opt =>
      opt.setName('usuario')
        .setDescription('Usuario a quitar')
        .setRequired(true)),

  async execute(interaction) {
    if (!isAdmin(interaction.member)) {
      return interaction.reply({ embeds: [errorEmbed('Sin permisos', 'Solo admins.')], ephemeral: true });
    }

    const user = interaction.options.getUser('usuario');
    const removed = boosterManager.removeBooster(user.id);

    if (!removed) {
      return interaction.reply({ embeds: [errorEmbed('Error', `${user} no esta registrado como booster.`)], ephemeral: true });
    }

    // Remove booster role
    if (config.roles.booster) {
      try {
        const member = await interaction.guild.members.fetch(user.id);
        await member.roles.remove(config.roles.booster);
      } catch (e) { /* user may have left */ }
    }

    await interaction.reply({
      embeds: [successEmbed('Booster eliminado', `${user} ya no es booster. (Pedidos completados: ${removed.ordersCompleted})`)],
    });
  },
};
