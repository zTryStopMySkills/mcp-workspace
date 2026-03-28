const fs = require('fs');
const path = require('path');
const config = require('../config');

const contentPath = path.join(config.dataPath, 'content.json');

function loadContent() {
  return JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
}

function saveContent(data) {
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(contentPath, JSON.stringify(data, null, 2));
}

function loadServices() {
  const content = loadContent();
  return { ranked_boost: content.ranked_boost, accounts: content.accounts };
}

function getServices() {
  return loadServices();
}

function setPrice(serviceId, price) {
  const data = loadContent();
  const service = data.ranked_boost.find(s => s.id === serviceId);
  if (!service) return null;
  service.price = price;
  saveContent(data);
  return service;
}

function addService(id, name, emoji, price, description) {
  const data = loadContent();
  if (data.ranked_boost.find(s => s.id === id)) return null;
  const service = { id, name, emoji, price, description };
  data.ranked_boost.push(service);
  saveContent(data);
  return service;
}

function removeService(serviceId) {
  const data = loadContent();
  const idx = data.ranked_boost.findIndex(s => s.id === serviceId);
  if (idx === -1) return null;
  const removed = data.ranked_boost.splice(idx, 1)[0];
  saveContent(data);
  return removed;
}

function addAccount(title, rank, price, details) {
  const data = loadContent();
  const id = `acc_${Date.now()}`;
  const account = { id, title, rank, price, details };
  data.accounts.push(account);
  saveContent(data);
  return account;
}

function removeAccount(accountId) {
  const data = loadContent();
  const idx = data.accounts.findIndex(a => a.id === accountId);
  if (idx === -1) return null;
  const removed = data.accounts.splice(idx, 1)[0];
  saveContent(data);
  return removed;
}

function getServiceById(serviceId) {
  const data = loadContent();
  return data.ranked_boost.find(s => s.id === serviceId)
    || data.accounts.find(a => a.id === serviceId);
}

function getAllServiceChoices() {
  const data = loadContent();
  const choices = [];
  for (const s of data.ranked_boost) {
    choices.push({ name: `🏆 ${s.name} — ${s.price}€`, value: s.id });
  }
  for (const a of data.accounts) {
    choices.push({ name: `👤 ${a.title} (${a.rank}) — ${a.price}€`, value: a.id });
  }
  return choices;
}

module.exports = {
  getServices,
  setPrice,
  addService,
  removeService,
  addAccount,
  removeAccount,
  getServiceById,
  getAllServiceChoices,
};
