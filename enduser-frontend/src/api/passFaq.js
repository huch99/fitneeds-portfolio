// src/api/passFaq.js
import api from './index';

export const getFaqs = (category) =>
  api.get('/api/passfaq', {
    params: category ? { category } : {}
  });

export const getFaq = (faqId) =>
  api.get(`/api/passfaq/${faqId}`);