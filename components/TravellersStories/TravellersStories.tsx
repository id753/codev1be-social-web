'use client';

import { useCallback } from 'react';
import styles from './TravellersStories.module.css';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';

import type { StoryCard, StoryCardUser } from '@/types/story';

type Props = {
  stories: StoryCard[];
  usersMap: Record<string, StoryCardUser>;
  categoryMap: Record<string, string>;
  mode?: 'default' | 'own';
  onUnsave?: (storyId: string) => void;
};

export default function TravellersStories({
  stories,
  usersMap,
  categoryMap,
  mode = 'default',
  onUnsave,
}: Props) {
  const handleUnsave = useCallback(
    (storyId: string) => {
      onUnsave?.(storyId);
    },
    [onUnsave],
  );

  return (
    <div className={styles.grid}>
      {stories.map((story, index) => (
        <TravellersStoriesItem
          key={story._id}
          story={story}
          user={story.ownerUser || usersMap[story.ownerId]}
          categoryName={categoryMap[story.category] || 'Категорія'}
          mode={mode}
          priority={index === 0}
          onUnsave={handleUnsave}
        />
      ))}
    </div>
  );
}
