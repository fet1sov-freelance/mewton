import axios from 'axios';
import cookie from 'js-cookie';
import rest from '../services/rest';

export const login = async (data: { telegramId: number; username: string }) => {
  const res = await axios.post('/auth', data, {
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  cookie.set('token', res.data.access_token);

  return res.data.isFirstLogin;
};

export const getUser = async () => {
  const res = await rest.get('/users/me');

  return res.data;
};

export const syncPoints = async (points: number, energy: number) => {
  const res = await rest.post('/users/points', { points, energy });
  return res.data;
};

export const refill = async () => {
  const res = await rest.post('/users/refill');
  return res.data;
};
