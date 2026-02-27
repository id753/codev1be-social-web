'use client';

import styles from './TravellersStories.module.css';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';

interface Story {
  _id: string;
  img: string;
  title: string;
  article?: string;
  description?: string;
  category: string;
  ownerId: string;
  ownerUser?: User;
  favoriteCount: number;
  date: string;
}

interface User {
  _id: string;
  name: string;
  avatarUrl: string;
  totalFavorites: number;
}

interface TravellersStoriesProps {
  stories: Story[];
  usersMap: Record<string, User>;
  categoryMap: Record<string, string>;
  favoriteStories: string[];
  loadingStoryId: string | null;
  onBookmarkClick: (storyId: string) => void;
}

export default function TravellersStories({
  stories,
  usersMap,
  categoryMap,
  favoriteStories,
  loadingStoryId,
  onBookmarkClick,
}: TravellersStoriesProps) {
  return (
    <div className={styles.grid}>
      {stories.map((story, index) => (
        <TravellersStoriesItem
          key={`${story._id}-${index}`}
          story={story}
          user={story.ownerUser || usersMap[story.ownerId]}
          categoryName={categoryMap[story.category] || 'Категорія'}
          priority={index === 0}
          isFavorite={favoriteStories.includes(story._id)}
          isLoading={loadingStoryId === story._id}
          onBookmarkClick={onBookmarkClick}
          isUserLoggedIn={false}
        />
      ))}
    </div>
  );
}
