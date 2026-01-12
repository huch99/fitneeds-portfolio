// src/api/passLogs.js
import api from './index';

export const getPassLogsByUser = (userId) =>
  api.get('/api/pass/pass-logs', { params: { userId } });

export const getPassLogsByUserPass = (userPassId) =>
  api.get(`/api/pass/pass-logs/${userPassId}`);