import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
};

const isBrowser = typeof window !== 'undefined';

const nextServer = axios.create({
  baseURL: isBrowser ? '/api' : process.env.NEXT_PUBLIC_API_URL + '/api',
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
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;
    const url = originalRequest.url || '';

    if (
      refreshDenied ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/login')
    ) {
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        processQueue();
        return nextServer(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        refreshDenied = true;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default nextServer;
