'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TravellersStories from '../TravellersStories/TravellersStories';
import Skeleton from '@/components/Skeleton/Skeleton';
import { fetchStories } from '@/lib/api/clientApi';
import { User } from '@/types/user';
import { Story, StoryCard, StoryCardUser } from '@/types/story';
import css from './TravellerPageClient.module.css';

type Props = { traveller: User };

export default function TravellerPageClient({ traveller }: Props) {
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [firstLoadFinished, setFirstLoadFinished] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const firstLoadCountRef = useRef<number>(0);

  // Визначаємо перPage адаптивно і початкове завантаження
  useEffect(() => {
    const updatePerPage = () => {
      const width = window.innerWidth;
      if (width < 768)
        setPerPage(4); // моб завантажуємо 4 картки
      else if (width < 1440)
        setPerPage(4); // таб 4 картки
      else setPerPage(6); // деск 6 карток
    };
    updatePerPage();
    window.addEventListener('resize', updatePerPage);
    return () => window.removeEventListener('resize', updatePerPage);
  }, []);

  const loadStories = async (nextPage: number) => {
    if (loading || perPage === null || !hasMore) return;
    setLoading(true);

    try {
      const data = await fetchStories({
        ownerId: traveller._id,
        page: nextPage,
        perPage,
      });

      if (!data.stories || data.stories.length === 0) {
        setHasMore(false);
        return;
      }

      if (nextPage === 1) firstLoadCountRef.current = data.stories.length;

      setStories((prev) => [...prev, ...data.stories]);
      if (data.stories.length < perPage) setHasMore(false);
      setPage(nextPage);

      // Скрол після підвантаження (не перший рендер)
      if (nextPage > 1) {
        const width = window.innerWidth;

        let scrollAmount = 0;
        if (width < 768)
          scrollAmount = 4 * 575 + 3 * 24; // моб: 4 рядки × 575 + 3 гепи
        else if (width < 1440)
          scrollAmount = 2 * 578 + 24; // таб: 2 рядки × 578 + 1 геп
        else scrollAmount = 2 * 677 + 24; // деск: 2 рядки × 677 + 1 геп

        window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Failed to load stories', err);
    } finally {
      setLoading(false);
      setFirstLoadFinished(true);
    }
  };

  useEffect(() => {
    if (perPage !== null) loadStories(1);
  }, [perPage]);

  const handleLoadMore = () => loadStories(page + 1);

  const storiesForCard: StoryCard[] = stories.map((story) => ({
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
  }));

  const usersMap: Record<string, StoryCardUser> = {
    [traveller._id]: {
      _id: traveller._id,
      name: traveller.name,
      avatarUrl:
        traveller.avatarUrl ??
        'https://ac.goit.global/fullstack/react/default-avatar.jpg',
    },
  };

  return (
    <div className={css.inner}>
      {/* Хедер */}
      <div className={css.header}>
        <div className={css.avatar}>
          <Image
            src={
              traveller.avatarUrl ??
              'https://ac.goit.global/fullstack/react/default-avatar.jpg'
            }
            alt={traveller.name}
            width={199}
            height={199}
          />
        </div>
        <div className={css.info}>
          <h2 className={css.name}>{traveller.name}</h2>
          <p className={css.description}>{traveller.description}</p>
        </div>
      </div>

      <h1 className={css.title}>Історії мандрівника</h1>

      {/* Skeleton */}
      {!firstLoadFinished && perPage && (
        <div className={css.skeletonGrid}>
          {Array.from({ length: perPage }).map((_, i) => (
            <Skeleton
              key={i}
              width={340}
              height={
                window.innerWidth < 768
                  ? 575
                  : window.innerWidth < 1440
                    ? 578
                    : 677
              }
            />
          ))}
        </div>
      )}

      {/* Якщо історій немає */}
      {firstLoadFinished && stories.length === 0 ? (
        <div className={css.noStories}>
          <p>Цей користувач ще не публікував історії</p>
          <Link href="/stories" className={`${css.buttonBase} ${css.backBtn}`}>
            Назад до історій
          </Link>
        </div>
      ) : (
        <>
          <TravellersStories
            stories={storiesForCard}
            usersMap={usersMap}
            categoryMap={{}}
          />

          {/* Кнопка “Показати ще” */}
          {hasMore && (
            <button
              type="button"
              className={`${css.buttonBase} ${css.viewAllBtn}`}
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? 'Завантаження...' : 'Показати ще'}
            </button>
          )}
        </>
      )}
    </div>
  );
}
