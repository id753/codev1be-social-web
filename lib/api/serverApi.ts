import { cookies } from 'next/headers';
import axios, { type AxiosResponse } from 'axios';
import serverApi from '@/lib/api/api';
import type { User } from '@/types/user';
import type { Story } from '@/types/story';

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
};

// ================= AUTH =================

export const getMeServer = async (): Promise<User | null> => {
  try {
    const { data } = await serverApi.get<User>('/users/me', {
      headers: await getCookieHeader(),
    });
    return data;
  } catch {
    return null;
  }
};

export const checkServerSession = async (): Promise<
  AxiosResponse<{ success: boolean }>
> => {
  const cookieStore = await cookies();
  const response = await serverApi.post<{ success: boolean }>(
    '/auth/refresh',
    null,
    {
      headers: { Cookie: cookieStore.toString() },
    },
  );
  return response;
};

export const logoutServer = async (): Promise<void> => {
  await serverApi.post('/auth/logout', null, {
    headers: await getCookieHeader(),
  });
};

// ================= USERS =================

export interface FetchUsersParams {
  page: number;
  perPage: number;
}

export interface UsersHttpResponse {
  page: number;
  perPage: number;
  totalAuthors: number;
  totalPages: number;
  users: User[];
}

export const fetchUsersServer = async (
  params: FetchUsersParams,
): Promise<UsersHttpResponse> => {
  const { data } = await serverApi.get('/users', { params });
  return data;
};

export const fetchUserByIdServer = async (
  id: string,
): Promise<{ user: User; stories: Story[] }> => {
  const { data } = await serverApi.get(`/users/${id}`);
  return data;
};

// ================= STORIES =================

export interface StoriesHttpResponse {
  stories: Story[];
  totalStories: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface FetchStoriesParams {
  page: number;
  perPage: number;
  category?: string;
}

export const fetchStoriesServer = async (
  params: FetchStoriesParams,
): Promise<StoriesHttpResponse> => {
  const { data } = await serverApi.get('/stories', { params });
  return data;
};

export const fetchPopularStoriesServer = async () => {
  const { data } = await serverApi.get('/stories/popular');
  return data;
};

export const fetchStoryByIdServer = async (
  id: string,
): Promise<Story | null> => {
  try {
    const { data } = await serverApi.get(`/stories/${id}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const fetchMyStoriesServer = async (
  params: FetchStoriesParams,
): Promise<StoriesHttpResponse> => {
  const { data } = await serverApi.get('/stories/me', {
    params,
    headers: await getCookieHeader(),
  });
  return data;
};

export const fetchFavouriteStoriesServer = async (
  params: FetchStoriesParams,
): Promise<StoriesHttpResponse> => {
  const { data } = await serverApi.get('/stories/saved', {
    params,
    headers: await getCookieHeader(),
  });
  return data;
};
