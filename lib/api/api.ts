import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
};

const nextServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
  withCredentials: true,
});

let isRefreshing = false;
let refreshFailed = false;

let failedQueue: FailedRequest[] = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      resolve(nextServer(config));
    }
  });

  failedQueue = [];
};

nextServer.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;
    const url = originalRequest.url || '';

    // якщо refresh вже падав — більше не пробуємо
    if (refreshFailed) {
      return Promise.reject(error);
    }

    // refresh робимо тільки для реальних protected запитів
    if (
      status === 401 &&
      !originalRequest._retry &&
      !url.includes('/auth/refresh') &&
      !url.includes('/users/me')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
            config: originalRequest,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );

        processQueue();

        return nextServer(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        refreshFailed = true;

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default nextServer;
