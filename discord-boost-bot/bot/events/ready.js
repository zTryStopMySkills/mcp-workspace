const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot conectado como ${client.user.tag}`);
    client.user.setActivity('CoD Boost Services', { type: ActivityType.Watching });
  },
};
