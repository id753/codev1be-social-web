import serverApi from '@/app/api/api';

import { User } from '@/types/user';
import { Story } from '@/types/story';

// ================= AUTH =================

export async function getMeServer(): Promise<User> {
  const response = await serverApi.get<User>('/users/me');

  return response.data;
}

export async function logoutServer(): Promise<void> {
  await serverApi.post('/auth/logout');
}

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

export async function fetchUsersServer(
  params: FetchUsersParams,
): Promise<UsersHttpResponse> {
  const response = await serverApi.get('/users', {
    params,
  });

  return response.data;
}

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

export async function fetchStoriesServer(
  params: FetchStoriesParams,
): Promise<StoriesHttpResponse> {
  const response = await serverApi.get('/stories', {
    params,
  });

  return response.data;
}

export async function fetchPopularStoriesServer() {
  const response = await serverApi.get('/stories/popular');

  return response.data;
}

export async function fetchStoryByIdServer(id: string): Promise<Story> {
  const response = await serverApi.get(`/stories/${id}`);

  return response.data;
}

export async function fetchMyStoriesServer(
  params: FetchStoriesParams,
): Promise<StoriesHttpResponse> {
  const response = await serverApi.get('/stories/me', {
    params,
  });

  return response.data;
}

export async function fetchFavouriteStoriesServer(
  params: FetchStoriesParams,
): Promise<StoriesHttpResponse> {
  const response = await serverApi.get('/stories/saved', {
    params,
  });

  return response.data;
}
