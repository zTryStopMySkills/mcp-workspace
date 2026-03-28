const { SlashCommandBuilder } = require('discord.js');
const catalogManager = require('../../handlers/catalogManager');
const { isAdmin } = require('../../utils/permissions');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('edit-service')
    .setDescription('Editar un servicio existente (precio, nombre, emoji, descripcion)')
    .addStringOption(opt =>
      opt.setName('id')
        .setDescription('ID del servicio a editar')
        .setRequired(true))
    .addNumberOption(opt =>
      opt.setName('precio')
        .setDescription('Nuevo precio en euros')
        .setRequired(false)
        .setMinValue(1))
    .addStringOption(opt =>
      opt.setName('nombre')
        .setDescription('Nuevo nombre del servicio')
        .setRequired(false))
    .addStringOption(opt =>
      opt.setName('emoji')
        .setDescription('Nuevo emoji')
        .setRequired(false))
    .addStringOption(opt =>
      opt.setName('descripcion')
        .setDescription('Nueva descripcion')
        .setRequired(false)),

  async execute(interaction) {
    if (!isAdmin(interaction.member)) {
      return interaction.reply({ embeds: [errorEmbed('Sin permisos', 'Solo admins.')], ephemeral: true });
    }

    const id = interaction.options.getString('id');
    const price = interaction.options.getNumber('precio');
    const name = interaction.options.getString('nombre');
    const emoji = interaction.options.getString('emoji');
    const description = interaction.options.getString('descripcion');

    if (!price && !name && !emoji && !description) {
      return interaction.reply({ embeds: [errorEmbed('Error', 'Debes especificar al menos un campo a editar (precio, nombre, emoji o descripcion).')], ephemeral: true });
    }

    const services = catalogManager.getServices();
    let service = services.ranked_boost.find(s => s.id === id);
    let isAccount = false;

    if (!service) {
      service = services.accounts.find(a => a.id === id);
      isAccount = true;
    }

    if (!service) {
      return interaction.reply({ embeds: [errorEmbed('Error', `Servicio con ID "${id}" no encontrado.\nUsa \`/list-services\` para ver los IDs.`)], ephemeral: true });
    }

    // Apply changes
    const changes = [];
    if (price) { service.price = price; changes.push(`Precio: **${price}€**`); }
    if (name) {
      if (isAccount) { service.title = name; } else { service.name = name; }
      changes.push(`Nombre: **${name}**`);
    }
    if (emoji && !isAccount) { service.emoji = emoji; changes.push(`Emoji: ${emoji}`); }
    if (description) {
      if (isAccount) { service.details = description; } else { service.description = description; }
      changes.push(`Descripcion actualizada`);
    }

    // Save
    const fs = require('fs');
    const path = require('path');
    const config = require('../../config');
    fs.writeFileSync(
      path.join(config.dataPath, 'services.json'),
      JSON.stringify(services, null, 2)
    );

    const displayName = isAccount ? service.title : service.name;
    await interaction.reply({
      embeds: [successEmbed('Servicio editado', `**${displayName}** actualizado:\n${changes.join('\n')}`)],
    });
  },
};
