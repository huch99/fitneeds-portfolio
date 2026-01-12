// src/api/passTradeFavorite.js
import api from './index';

export const addFavorite = (token, postId) =>
  api.post(
    '/api/pass-trade-favorite',
    { postId },
    { headers: { Authorization: token } }
  );

export const removeFavorite = (token, postId) =>
  api.delete(`/api/pass-trade-favorite/${postId}`, {
    headers: { Authorization: token }
  });

export const getFavorites = (token) =>
  api.get('/api/pass-trade-favorite', {
    headers: { Authorization: token }
  });

export const isFavorite = (token, postId) =>
  api.get(`/api/pass-trade-favorite/${postId}`, {
    headers: { Authorization: token }
  });