// src/api/passTradeTransactions.js
import api from './index';

export const getAllTransactions = (userId) =>
  api.get('/api/pass-trade-transactions', { params: { userId } });

export const getTransaction = (transactionId) =>
  api.get(`/api/pass-trade-transactions/${transactionId}`);

export const getSellTransactions = (userId) =>
  api.get('/api/pass-trade-transactions/sell', { params: { userId } });

export const getBuyTransactions = (userId) =>
  api.get('/api/pass-trade-transactions/buy', { params: { userId } });