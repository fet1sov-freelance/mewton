import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import cookies from 'js-cookie';

const rest = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

/**
 * Interceptors' handlers
 */
const setToken = async (config: InternalAxiosRequestConfig) => {
  if (!config?.headers?.authorization) {
    const token = cookies.get('token');

    if (token && config.headers) {
      config.headers.authorization = `Bearer ${token}`;
    }
  }

  return config;
};

const requestMapper = (config: InternalAxiosRequestConfig) => {
  return config;
};

const responseMapper = (response: AxiosResponse) => {
  return Promise.resolve(response);
};

const errorHandler = ({ response }: AxiosError) => {
  return Promise.reject(response?.data);
};
/**
 * Apply request interceptors
 */
rest.interceptors.request.use(setToken);
rest.interceptors.request.use(requestMapper);

/**
 * Apply response interceptors
 */
rest.interceptors.response.use(responseMapper, errorHandler);

export default rest;
