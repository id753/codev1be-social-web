'use client';

import styles from './TravellersStories.module.css';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';
import type { StoryCard, StoryCardUser } from '@/types/story';

interface TravellersStoriesProps {
  stories: StoryCard[];
  usersMap: Record<string, StoryCardUser>;
  categoryMap: Record<string, string>;
}

export default function TravellersStories({
  stories,
  usersMap,
  categoryMap,
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
        />
      ))}
    </div>
  );
}
