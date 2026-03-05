'use client';

import { useAccumulatedStories } from '@/hooks/useAccumulatedStories';
import { fetchFavouriteStories } from '@/lib/api/clientApi';
import TravellersStories from '@/components/TravellersStories/TravellersStories';
import styles from '@/app/(main)/(private routes)/profile/saved/SavedStories.module.css';

export default function SavedStories() {
  const { accStories, isLoading, isError, isFetching, hasMore, loadMore } =
    useAccumulatedStories({
      queryKey: ['stories', 'saved'],
      queryFn: (page, perPage) => fetchFavouriteStories({ page, perPage }),
    });

  if (isLoading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className={styles.error}>Не вдалось завантажити збережені історії</p>
    );
  }

  if (!accStories.length) {
    return <p className={styles.empty}>Збережених історій поки немає</p>;
  }

  return (
    <div>
      <TravellersStories stories={accStories} usersMap={{}} categoryMap={{}} />
      {hasMore && (
        <button
          className={styles.loadMore}
          onClick={loadMore}
          disabled={isFetching}
        >
          {isFetching ? 'Завантаження...' : 'Показати ще'}
        </button>
      )}
    </div>
  );
}
