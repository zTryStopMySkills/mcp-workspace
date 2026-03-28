const fs = require('fs');
const path = require('path');
const config = require('../config');

const ordersPath = path.join(config.dataPath, 'orders.json');

function loadOrders() {
  return JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
}

function saveOrders(data) {
  fs.writeFileSync(ordersPath, JSON.stringify(data, null, 2));
}

function createOrder(clientId, serviceId, serviceName, price, notes = '') {
  const orders = loadOrders();
  const id = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
  const order = {
    id,
    clientId,
    serviceId,
    serviceName,
    price,
    notes,
    status: 'pendiente',
    boosterId: null,
    ticketChannelId: null,
    paymentConfirmed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.push(order);
  saveOrders(orders);
  return order;
}

function getOrder(orderId) {
  const orders = loadOrders();
  return orders.find(o => o.id === orderId);
}

function updateOrder(orderId, updates) {
  const orders = loadOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...updates, updatedAt: new Date().toISOString() };
  saveOrders(orders);
  return orders[idx];
}

function assignOrder(orderId, boosterId) {
  return updateOrder(orderId, { boosterId, status: 'asignado' });
}

function claimOrder(orderId, boosterId) {
  const order = getOrder(orderId);
  if (!order || order.status !== 'pendiente') return null;
  return updateOrder(orderId, { boosterId, status: 'asignado' });
}

function completeOrder(orderId) {
  return updateOrder(orderId, { status: 'completado' });
}

function cancelOrder(orderId) {
  return updateOrder(orderId, { status: 'cancelado' });
}

function confirmPayment(orderId) {
  return updateOrder(orderId, { paymentConfirmed: true, status: 'en_progreso' });
}

function getOrdersByClient(clientId) {
  return loadOrders().filter(o => o.clientId === clientId);
}

function getOrdersByBooster(boosterId) {
  return loadOrders().filter(o => o.boosterId === boosterId && o.status !== 'completado' && o.status !== 'cancelado');
}

function getPendingOrders() {
  return loadOrders().filter(o => o.status === 'pendiente');
}

function getStats() {
  const orders = loadOrders();
  return {
    totalOrders: orders.length,
    completedOrders: orders.filter(o => o.status === 'completado').length,
    pendingOrders: orders.filter(o => o.status === 'pendiente').length,
    inProgressOrders: orders.filter(o => o.status === 'en_progreso' || o.status === 'asignado').length,
    totalRevenue: orders.filter(o => o.status === 'completado').reduce((sum, o) => sum + o.price, 0),
  };
}

module.exports = {
  createOrder,
  getOrder,
  updateOrder,
  assignOrder,
  claimOrder,
  completeOrder,
  cancelOrder,
  confirmPayment,
  getOrdersByClient,
  getOrdersByBooster,
  getPendingOrders,
  getStats,
};
