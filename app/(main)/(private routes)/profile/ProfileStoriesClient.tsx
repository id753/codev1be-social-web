'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import TravellersStories from '@/components/TravellersStories/TravellersStories';
import {
  fetchCategories,
  fetchFavouriteStories,
  fetchMyStories,
} from '@/lib/api/clientApi';
import type { Story, StoryCard, StoryCardUser, Category } from '@/types/story';
import css from './ProfileStoriesClient.module.css';

type Variant = 'saved' | 'own';

interface Props {
  variant: Variant;
}

function normalizeStoryToCard(story: Story): StoryCard {
  return {
    ...story,
    category:
      typeof story.category === 'string'
        ? story.category
        : (story.category?._id ?? ''),
    ownerId:
      typeof story.ownerId === 'string'
        ? story.ownerId
        : (story.ownerId?._id ?? ''),
    ownerUser: typeof story.ownerId === 'string' ? undefined : story.ownerId,
  } as unknown as StoryCard;
}

function buildUsersMap(stories: StoryCard[]): Record<string, StoryCardUser> {
  const map: Record<string, StoryCardUser> = {};
  for (const s of stories) {
    if (s.ownerUser && s.ownerId) map[s.ownerId] = s.ownerUser;
  }
  return map;
}

function buildCategoryMap(categories: Category[]): Record<string, string> {
  return (categories ?? []).reduce<Record<string, string>>((acc, c) => {
    acc[c._id] = c.name;
    return acc;
  }, {});
}

export default function ProfileStoriesClient({ variant }: Props) {
  const [stories, setStories] = useState<Story[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [perPage, setPerPage] = useState(4);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const prevLengthRef = useRef(0);

  const updatePerPage = useCallback(() => {
    const width = window.innerWidth;
    setPerPage(width >= 1440 ? 6 : 4);
  }, []);

  useEffect(() => {
    updatePerPage();
    window.addEventListener('resize', updatePerPage);
    return () => window.removeEventListener('resize', updatePerPage);
  }, [updatePerPage]);

  const fetchPage = useCallback(
    async (nextPage: number) => {
      if (variant === 'saved') {
        return fetchFavouriteStories({ page: nextPage, perPage });
      }
      return fetchMyStories({ page: nextPage, perPage });
    },
    [variant, perPage],
  );

  const loadInitial = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [cats, data] = await Promise.all([fetchCategories(), fetchPage(1)]);
      setCategories(cats);
      setStories(data.stories);
      setPage(data.page ?? 1);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      setError('Не вдалося завантажити історії. Спробуйте оновити сторінку.');
    } finally {
      setLoading(false);
    }
  }, [fetchPage]);

  useEffect(() => {
    // when perPage changes OR variant changes => restart at page 1
    loadInitial();
  }, [loadInitial, perPage, variant]);

  const handleLoadMore = async () => {
    if (loading || loadingMore) return;
    if (page >= totalPages) return;

    setLoadingMore(true);
    setError(null);
    prevLengthRef.current = stories.length;

    try {
      const nextPage = page + 1;
      const data = await fetchPage(nextPage);

      setStories((prev) => [...prev, ...data.stories]);
      setPage(data.page ?? 1);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      setError('Не вдалося завантажити більше історій.');
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const prevLength = prevLengthRef.current;
    const currentLength = stories.length;
    if (currentLength <= prevLength) return;

    const newCard = grid.querySelector(`article:nth-child(${prevLength + 1})`);
    if (newCard instanceof HTMLElement) {
      newCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [stories]);

  const cards: StoryCard[] = useMemo(
    () => stories.map(normalizeStoryToCard),
    [stories],
  );

  const handleUnsave = useCallback((storyId: string) => {
    if (variant !== 'saved') return;
    setStories((prev) => prev.filter((story) => story._id !== storyId));
  }, [variant]);

  const usersMap = useMemo(() => buildUsersMap(cards), [cards]);
  const categoryMap = useMemo(() => buildCategoryMap(categories), [categories]);

  const hasMore = page < totalPages;

  if (loading) {
    return (
      <div className={css.wrapper}>
        <div className={css.skeletonGrid}>
          {Array.from({ length: perPage }).map((_, i) => (
            <div key={i} className={css.skeletonCard} />
          ))}
        </div>
        <p className={css.loadingText}>Завантаження...</p>
      </div>
    );
  }

  return (
    <div className={css.wrapper} ref={gridRef}>
      {error ? <p className={css.error}>{error}</p> : null}

      {cards.length ? (
        <>
          <TravellersStories
            stories={cards}
            usersMap={usersMap}
            categoryMap={categoryMap}
            mode={variant === 'own' ? 'own' : 'default'}
            onUnsave={handleUnsave}
          />

          {hasMore ? (
            <button
              type="button"
              className={css.loadMoreBtn}
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Завантаження...' : 'Завантажити більше'}
            </button>
          ) : (
            <p className={css.endText}>Це всі історії.</p>
          )}
        </>
      ) : (
        <p className={css.empty}>
          {variant === 'saved'
            ? 'У вас поки немає збережених історій.'
            : 'У вас поки немає власних історій.'}
        </p>
      )}
    </div>
  );
}