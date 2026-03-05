'use client';

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
};

const nextServer = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

let isRefreshing = false;
let refreshDenied = false;
let failedQueue: FailedRequest[] = [];

export function resetRefreshDenied() {
  refreshDenied = false;
}

const processQueue = (error?: unknown) => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) reject(error);
    else resolve(nextServer(config));
  });
  failedQueue = [];
};

nextServer.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;
    const url = originalRequest.url ?? '';

    // if refresh already denied, don't attempt refresh again (only matters for 401)
    if (refreshDenied && status === 401) return Promise.reject(error);

    // do not refresh for auth-check endpoint
    if (url.includes('/users/me')) return Promise.reject(error);

    // never refresh refresh/login/logout endpoints
    if (url.includes('/auth/refresh')) return Promise.reject(error);
    if (url.includes('/auth/login')) return Promise.reject(error);
    if (url.includes('/auth/logout')) return Promise.reject(error);

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await nextServer.post('/auth/refresh');

        processQueue();
        return nextServer(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        if (
          axios.isAxiosError(refreshError) &&
          refreshError.response?.status === 401
        ) {
          refreshDenied = true; // stop loops until next successful login
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default nextServer;
