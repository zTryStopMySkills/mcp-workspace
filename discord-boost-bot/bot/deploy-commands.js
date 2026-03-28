const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const commands = [];

function loadCommands(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      loadCommands(fullPath);
    } else if (entry.name.endsWith('.js')) {
      const command = require(fullPath);
      if (command.data) {
        commands.push(command.data.toJSON());
      }
    }
  }
}

loadCommands(path.join(__dirname, 'commands'));

const rest = new REST().setToken(config.token);

(async () => {
  try {
    console.log(`🔄 Registrando ${commands.length} comandos...`);
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands },
    );
    console.log('✅ Comandos registrados correctamente!');
  } catch (error) {
    console.error('❌ Error registrando comandos:', error);
  }
})();
