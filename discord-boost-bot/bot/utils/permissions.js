const config = require('../config');

function isAdmin(member) {
  if (!config.roles.admin) return member.permissions.has('Administrator');
  return member.roles.cache.has(config.roles.admin) || member.permissions.has('Administrator');
}

function isBooster(member) {
  if (!config.roles.booster) return false;
  return member.roles.cache.has(config.roles.booster);
}

module.exports = { isAdmin, isBooster };
