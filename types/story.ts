export interface Category {
  _id: string;
  name: string;
}

export interface Owner {
  _id: string;
  name: string;
  avatarUrl: string;
}

export interface Story {
  _id: string;
  title: string;
  article: string;
  img: string;
  category: Category;
  ownerId: Owner;
  favoriteCount: number;
  date: string;
}

export interface StoriesResponse {
  stories: Story[];
  totalStories: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface PopularStoriesResponse {
  stories: Story[];
  totalStories: number;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
}

export interface GetStoriesParams extends PaginationParams {
  category?: string;
}

export interface CreateStoryParams {
  title: string;
  article: string;
  category: {
    _id: string;
    name: string;
  };
  ownerId: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };
  date: string;
  favoriteCount: number;
  img?: string;
}
export interface UpdateStoryParams {
  title?: string;
  article?: string;
  category?: string;
  img?: string;
}

export interface CreateStoryData {
  title: string;
  article: string;
  category: string;
  img?: File | string | null;
}
export interface UpdateStoryData {
  title: string;
  article: string;
  category: string;
  img?: File | string | null;
}

export interface StoryCardUser {
  _id: string;
  name: string;
  avatarUrl?: string;
  totalFavorites?: number;
}

export interface StoryCardBase {
  _id: string;
  img: string;
  title: string;
  article?: string;
  description?: string;
  category: string;
  ownerId: string;
  favoriteCount: number;
  favouriteCount?: number;
  date: string;
}

export interface StoryCard extends StoryCardBase {
  ownerUser?: StoryCardUser;
}
