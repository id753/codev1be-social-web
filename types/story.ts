export interface Story {
  _id: string;
  img: string;
  title: string;
  article?: string;
  description?: string;
  category: string;
  ownerId: string;
  date: string;
  favoriteCount: number;
}

export interface CreateStoryData {
  title: string;
  description: string;
  category: string;
  img?: File | null;
}
