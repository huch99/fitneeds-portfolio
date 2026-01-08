// src/api/userPasses.js
import api from './index';

export const createUserPass = (data) =>
  api.post('/api/pass/passes', data);

export const getUserPasses = (userId) =>
  api.get('/api/pass/passes', { params: { userId } });

export const getActiveUserPasses = (userId) =>
  api.get('/api/pass/passes/active', { params: { userId } });

export const getUserPass = (userPassId, userId) =>
  api.get(`/api/pass/passes/${userPassId}`, { params: { userId } });

export const useUserPass = (userPassId, userId) =>
  api.post(`/api/pass/passes/${userPassId}/use`, null, {
    params: { userId }
  });

export const getUserPassLogs = (userPassId) =>
  api.get(`/api/pass/passes/${userPassId}/logs`);