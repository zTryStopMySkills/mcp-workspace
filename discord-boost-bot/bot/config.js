const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
  token: process.env.BOT_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  channels: {
    orders: process.env.CHANNEL_ORDERS,
    logs: process.env.CHANNEL_LOGS,
    categoryTickets: process.env.CATEGORY_TICKETS,
  },
  roles: {
    admin: process.env.ROLE_ADMIN,
    booster: process.env.ROLE_BOOSTER,
  },
  payments: {
    paypal: process.env.PAYPAL_EMAIL,
    bizum: process.env.BIZUM_PHONE,
  },
  dataPath: path.join(__dirname, '..', 'web-next', 'data'),
};
