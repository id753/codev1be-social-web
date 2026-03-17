'use client';

import { useEffect, useState } from 'react';
import css from './PopularStoriesSection.module.css';
import Link from 'next/link';
import { fetchPopularStories, StoriesHttpResponse } from '@/lib/api/clientApi';
import { useQuery } from '@tanstack/react-query';
import Skeleton from '../Skeleton/Skeleton';
import { StoryItem } from './PopularStoryItem';

const getPopularLimit = () => {
  if (typeof window === 'undefined') return 3;

  const isTablet = window.matchMedia(
    '(min-width: 768px) and (max-width: 1439px)',
  ).matches;

  return isTablet ? 4 : 3;
};

export default function PopularStoriesSection() {
  const [limit, setLimit] = useState(3);

  useEffect(() => {
    const update = () => {
      setLimit(getPopularLimit());
    };

    update();
    window.addEventListener('resize', update);

    return () => window.removeEventListener('resize', update);
  }, []);

  const { data, isLoading, isError } = useQuery<StoriesHttpResponse>({
    queryKey: ['popular-stories', limit],
    queryFn: () =>
      fetchPopularStories(),
    placeholderData: (prev) => prev,
  });

  if (isError) {
    return <p className={css.msg}>Error</p>;
  }

  return (
    <section className="section">
      <div className="container">
        <h2 className={css.sectionTitle}>Популярні історії</h2>

        {isLoading && !data ? (
          <div className={css.loader}>
            {Array.from({ length: limit }).map((_, i) => (
              <Skeleton key={i} height={397} />
            ))}
          </div>
        ) : (
          <ul className={css.articleList}>
            {data?.stories?.length ? (
              data.stories.map((story) => (
                <StoryItem key={story._id} story={story} />
              ))
            ) : (
              <p className={css.msg}>Немає історій</p>
            )}
          </ul>
        )}

        <Link href="/stories" className={css.seeMore}>
          Переглянути всі
        </Link>
      </div>
    </section>
  );
}