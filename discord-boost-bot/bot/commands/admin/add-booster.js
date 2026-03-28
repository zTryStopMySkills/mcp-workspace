const { SlashCommandBuilder } = require('discord.js');
const boosterManager = require('../../handlers/boosterManager');
const { isAdmin } = require('../../utils/permissions');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-booster')
    .setDescription('Registrar un usuario como booster')
    .addUserOption(opt =>
      opt.setName('usuario')
        .setDescription('Usuario a registrar')
        .setRequired(true)),

  async execute(interaction) {
    if (!isAdmin(interaction.member)) {
      return interaction.reply({ embeds: [errorEmbed('Sin permisos', 'Solo admins.')], ephemeral: true });
    }

    const user = interaction.options.getUser('usuario');
    const booster = boosterManager.addBooster(user.id, user.username);

    if (!booster) {
      return interaction.reply({ embeds: [errorEmbed('Error', `${user} ya esta registrado como booster.`)], ephemeral: true });
    }

    // Assign booster role if configured
    if (config.roles.booster) {
      try {
        const member = await interaction.guild.members.fetch(user.id);
        await member.roles.add(config.roles.booster);
      } catch (e) {
        console.error('Error asignando rol booster:', e.message);
      }
    }

    await interaction.reply({
      embeds: [successEmbed('Booster registrado', `${user} ha sido registrado como booster.`)],
    });
  },
};
