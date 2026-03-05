import type { Story } from './story';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  articlesAmount: number;
  description?: string;
  savedArticles: string[];
}

export interface UserWithStories {
  user: User;
  stories: Story[];
}
