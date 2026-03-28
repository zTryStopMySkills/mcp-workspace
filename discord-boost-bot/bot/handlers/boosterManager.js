const fs = require('fs');
const path = require('path');
const config = require('../config');

const boostersPath = path.join(config.dataPath, 'boosters.json');

function loadBoosters() {
  return JSON.parse(fs.readFileSync(boostersPath, 'utf-8'));
}

function saveBoosters(data) {
  fs.writeFileSync(boostersPath, JSON.stringify(data, null, 2));
}

function addBooster(userId, username) {
  const boosters = loadBoosters();
  if (boosters.find(b => b.userId === userId)) return null;
  const booster = {
    userId,
    username,
    ordersCompleted: 0,
    totalEarned: 0,
    addedAt: new Date().toISOString(),
  };
  boosters.push(booster);
  saveBoosters(boosters);
  return booster;
}

function removeBooster(userId) {
  const boosters = loadBoosters();
  const idx = boosters.findIndex(b => b.userId === userId);
  if (idx === -1) return null;
  const removed = boosters.splice(idx, 1)[0];
  saveBoosters(boosters);
  return removed;
}

function getBooster(userId) {
  return loadBoosters().find(b => b.userId === userId);
}

function getAllBoosters() {
  return loadBoosters();
}

function incrementBoosterStats(userId, amount) {
  const boosters = loadBoosters();
  const booster = boosters.find(b => b.userId === userId);
  if (!booster) return null;
  booster.ordersCompleted += 1;
  booster.totalEarned += amount;
  saveBoosters(boosters);
  return booster;
}

module.exports = {
  addBooster,
  removeBooster,
  getBooster,
  getAllBoosters,
  incrementBoosterStats,
};
