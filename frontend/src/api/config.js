// API Configuration for Shelter Match
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const endpoints = {
  health: '/api/health',
  shelters: '/api/shelters',
  jobs: '/api/jobs',
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    me: '/api/auth/me',
  },
  ratings: '/api/ratings/shelter',
  messages: '/api/messages',
};

export default apiConfig;
