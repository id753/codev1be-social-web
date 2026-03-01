import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

import { cookies } from 'next/headers';

const serverApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  withCredentials: true,
});

serverApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; ');

    if (cookieHeader) {
      config.headers.set('Cookie', cookieHeader);
    }

    return config;
  },
);

export type ServerApiError = AxiosError<{
  message?: string;
}>;

export default serverApi;
