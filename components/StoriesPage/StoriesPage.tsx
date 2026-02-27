'use client';

import { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import TravellersStories from '@/components/TravellersStories/TravellersStories';
import { nextServer as api } from '@/lib/api/api';
import styles from './StoriesPage.module.css';

interface User {
  _id: string;
  name: string;
  avatarUrl: string;
  totalFavorites: number;
}

type StoryCategory = string | { _id: string; name?: string };
type StoryOwner = string | User;

interface Story {
  _id: string;
  img: string;
  title: string;
  article?: string;
  description?: string;
  category: StoryCategory;
  ownerId: StoryOwner;
  favoriteCount: number;
  date: string;
}

type NormalizedStory = Omit<Story, 'category' | 'ownerId'> & {
  category: string;
  ownerId: string;
  ownerUser?: User;
};

interface ApiResponse {
  stories: Story[];
  totalStories: number;
  page: number;
  perPage: number;
  totalPages: number;
}

interface UsersResponse {
  users: User[];
  totalUsers: number;
  page: number;
  perPage: number;
  totalPages: number;
}

const CATEGORIES = [
  { id: 'all', name: 'Всі історії' },
  { id: '68fb50c80ae91338641121f2', name: 'Європа' },
  { id: '68fb50c80ae91338641121f0', name: 'Азія' },
  { id: '68fb50c80ae91338641121f6', name: 'Пустелі' },
  { id: '68fb50c80ae91338641121f4', name: 'Африка' },
];

const CATEGORY_MAP: Record<string, string> = {
  '68fb50c80ae91338641121f2': 'Європа',
  '68fb50c80ae91338641121f0': 'Азія',
  '68fb50c80ae91338641121f6': 'Пустелі',
  '68fb50c80ae91338641121f4': 'Африка',
  '68fb50c80ae91338641121f3': 'Америка',
  '68fb50c80ae91338641121f1': 'Кавказ',
  '68fb50c80ae91338641121f7': 'Кавказ',
  '68fb50c80ae91338641121f8': 'Океанія',
  '68fb50c80ae91338641121f9': 'Балкани',
};

export default function StoriesPage() {
  const [favoriteStories, setFavoriteStories] = useState<string[]>([]);
  const [loadingStoryId, setLoadingStoryId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Визначення кількості відображуваних історій залежно від розміру екрану
  const getBaseDisplayCount = () => {
    if (typeof window === 'undefined') return 9;
    return window.matchMedia('(min-width: 768px) and (max-width: 1439px)').matches ? 8 : 9;
  };

  const [baseDisplayCount, setBaseDisplayCount] = useState(getBaseDisplayCount);
  const [displayCount, setDisplayCount] = useState(getBaseDisplayCount);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px) and (max-width: 1439px)');
    const handleChange = () => {
      const nextBase = mediaQuery.matches ? 8 : 9;
      setBaseDisplayCount(nextBase);
      setDisplayCount(nextBase);
    };
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Колбек для оновлення списку улюблених
  const handleBookmarkClick = (storyId: string) => {
    setLoadingStoryId(storyId);
    setFavoriteStories(prev =>
      prev.includes(storyId) ? prev.filter(id => id !== storyId) : [...prev, storyId]
    );
    setLoadingStoryId(null);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setDisplayCount(baseDisplayCount);
  };

  const { data, isLoading, error, fetchNextPage, hasNextPage } = useInfiniteQuery<ApiResponse>({
    queryKey: ['stories', selectedCategory, baseDisplayCount],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get('/api/stories', {
        params: {
          page: pageParam,
          perPage: baseDisplayCount,
          ...(selectedCategory !== 'all' ? { category: selectedCategory } : {}),
        },
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
    staleTime: 0,
  });

  const { data: usersData } = useQuery<UsersResponse>({
    queryKey: ['users'],
    queryFn: async () => {
      const pages = await Promise.all(
        [1, 2, 3, 4, 5].map(page =>
          api.get('/api/users', { params: { page, perPage: 9 } })
        )
      );

      const allUsers = pages.flatMap((response: AxiosResponse<UsersResponse>) => response.data.users || []);

      return {
        users: allUsers,
        totalUsers: pages[0].data.totalUsers,
        page: 1,
        perPage: allUsers.length,
        totalPages: pages[0].data.totalPages,
      };
    },
  });

  const usersMap = useMemo(() => {
    const map: Record<string, User> = {};
    usersData?.users?.forEach(user => {
      map[user._id] = user;
    });
    return map;
  }, [usersData?.users]);

  const normalizedStories: NormalizedStory[] = useMemo(() => {
    const allStories = data?.pages.flatMap(page => page.stories) || [];
    return allStories.map(story => ({
      ...story,
      category: typeof story.category === 'string' ? story.category : story.category?._id || '',
      ownerId: typeof story.ownerId === 'string' ? story.ownerId : story.ownerId?._id || '',
      ownerUser: typeof story.ownerId === 'string' ? undefined : story.ownerId,
    }));
  }, [data?.pages]);

  const displayedStories = normalizedStories.slice(0, displayCount);
  const totalStories = data?.pages[0]?.totalStories || 0;
  const hasMoreStories = displayCount < totalStories;

  const handleLoadMore = () => {
    const nextDisplayCount = displayCount + 3;
    setDisplayCount(nextDisplayCount);
    if (nextDisplayCount > normalizedStories.length && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.sectionTitle}>Історії Мандрівників</h1>

        {/* Фільтр категорій */}
        <div className={styles.filterSection}>
          <p className={styles.filterHeading}>Категорії</p>

          <div className={styles.filterDropdown}>
            <select
              value={selectedCategory}
              onChange={e => handleCategoryChange(e.target.value)}
              className={styles.filterSelect}
            >
              {CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterTabs}>
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                type="button"
                className={`${styles.filterBtn} ${
                  selectedCategory === category.id ? styles.filterBtnActive : ''
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading && <p className={styles.loading}>Завантаження...</p>}
        {error && <p className={styles.error}>Помилка завантаження історій</p>}

        {normalizedStories.length > 0 && (
          <>
            <TravellersStories
              stories={displayedStories}
              usersMap={usersMap}
              categoryMap={CATEGORY_MAP}
              favoriteStories={favoriteStories}
              loadingStoryId={loadingStoryId}
              onBookmarkClick={handleBookmarkClick}
            />

            {hasMoreStories && (
              <button type="button" className={styles.loadMoreBtn} onClick={handleLoadMore}>
                Показати ще
              </button>
            )}
          </>
        )}

        {!isLoading && normalizedStories.length === 0 && (
          <p className={styles.noResults}>Немає історій в цій категорії</p>
        )}
      </div>
    </section>
  );
}
