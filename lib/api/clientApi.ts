// --- Типи для запитів ---
import nextServer from '@/lib/api/api';

import type { User } from '@/types/user';
import type {
  Story,
  CreateStoryData,
  UpdateStoryData,
  Category,
} from '@/types/story';

/* ---------------- AUTH ---------------- */

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export async function register(data: RegisterRequest): Promise<User> {
  const response = await nextServer.post('/auth/register', data);

  return response.data;
}

export async function login(data: LoginRequest): Promise<User> {
  const response = await nextServer.post('/auth/login', data);

  return response.data;
}

export async function logout(): Promise<void> {
  await nextServer.post('/auth/logout');
}

export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get('/users/me'); // Або /auth/me залежно від бекенду
  return data;
};

/* ---------------- USERS ---------------- */

export interface FetchUsersProps {
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

export async function fetchUsers(
  params: FetchUsersProps,
): Promise<UsersHttpResponse> {
  const response = await nextServer.get('/users', {
    params,
  });
  return response.data;
}

interface UpdateMeProps {
  name: string;
  article: string;
}

export async function updateMe(data: UpdateMeProps): Promise<User> {
  const response = await nextServer.patch('/users/me', data);
  return response.data;
}

export async function updateAvatar(file: File): Promise<string> {
  const formData = new FormData();

  formData.append('avatar', file);

  const response = await nextServer.patch('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
}

/* ---------------- STORIES ---------------- */

export interface StoriesHttpResponse {
  stories: Story[];
  totalStories: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface FetchStoriesProps {
  page: number;
  perPage: number;
  category?: string;
}

export async function fetchStories(
  params: FetchStoriesProps,
): Promise<StoriesHttpResponse> {
  const response = await nextServer.get('/stories', {
    params,
  });

  return response.data;
}

export async function fetchPopularStories(): Promise<{
  stories: Story[];

  totalStories: number;
}> {
  const response = await nextServer.get('/stories/popular');
  return response.data;
}
export async function fetchCategories(): Promise<Category[]> {
  const { data } = await nextServer.get('/categories');
  return data;
}
export async function fetchStoryById(id: string): Promise<Story> {
  const response = await nextServer.get(`/stories/${id}`);
  return response.data;
}

export interface NewStory {
  title: string;
  description: string;
  category: string;
  img?: string;
}

export async function createStory(payload: CreateStoryData): Promise<Story> {
  const formData = new FormData();

  if (payload.img instanceof File) {
    formData.append('storyImage', payload.img);
  }

  formData.append('title', payload.title);
  formData.append('article', payload.article);
  formData.append('category', payload.category);

  const { data } = await nextServer.post<Story>('/stories', formData);
  return data;
}
export async function updateStory(
  payload: UpdateStoryData,
  storyId: string,
): Promise<Story> {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (key === 'img') {
      if (value instanceof File) {
        formData.append('storyImage', value);
      } else if (typeof value === 'string') {
        formData.append('storyImage', value);
      }
      return;
    }

    formData.append(key, String(value));
  });

  // If your backend uses `/stories/${storyId}/edit` — change this line only.
  const { data } = await nextServer.patch<Story>(
    `/stories/${storyId}`,
    formData,
  );
  return data;
}

/* ---------------- FAVORITES ---------------- */

export async function addToFavouriteStory(id: string): Promise<string[]> {
  const response = await nextServer.post<string[]>(`/stories/${id}/save`);

  return response.data;
}

export async function removeFavouriteStory(id: string): Promise<void> {
  const response = await nextServer.delete(`/stories/${id}/save`);

  return response.data;
}

export async function fetchMyStories(
  params: FetchUsersProps,
): Promise<StoriesHttpResponse> {
  const response = await nextServer.get('/stories/me', {
    params,
  });

  return response.data;
}

export async function fetchFavouriteStories(
  params: FetchUsersProps,
): Promise<StoriesHttpResponse> {
  const response = await nextServer.get('/stories/saved', {
    params,
  });

  return response.data;
}
