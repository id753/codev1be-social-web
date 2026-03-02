export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  articlesAmount: number;
  description?: string;
  savedArticles: string[];
}
