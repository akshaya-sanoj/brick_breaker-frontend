import axios from 'axios';
import { API_URL } from '../config/gameConfig';

// Create an Axios instance using the URL from our .env config
const API = axios.create({
  baseURL: API_URL,
});

// Interceptor to automatically attach the JWT token to requests if the user is logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- Auth Endpoints ---
export const loginUser = (formData) => API.post('/auth/login', formData);
export const registerUser = (formData) => API.post('/auth/register', formData);

// --- Game Endpoints ---
export const startGameSession = () => API.post('/games/start');
export const completeGameSession = (gameData) => API.post('/games/complete', gameData);

// --- Leaderboard ---
export const getLeaderboard = () => API.get('/leaderboard');
export const buySkin = (skinData) => API.post('/games/buy-skin', skinData);
export default API;