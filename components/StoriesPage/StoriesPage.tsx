'use client';

import { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import TravellersStories from '@/components/TravellersStories/TravellersStories';
import nextServer from '@/lib/api/api';

import type {
  Category,
  Owner,
  StoriesResponse,
  StoryCard,
  StoryCardUser,
} from '@/types/story';

import styles from './StoriesPage.module.css';

type StoryCategory = string | Category;

type StoryOwner = string | Owner | StoryCardUser;

type ApiStory = Omit<StoryCard, 'category' | 'ownerId' | 'ownerUser'> & {
  category: StoryCategory;
  ownerId: StoryOwner;
};

type ApiResponse = Omit<StoriesResponse, 'stories'> & {
  stories: ApiStory[];
};

type NormalizedStory = StoryCard;

interface UsersResponse {
  users: StoryCardUser[];
  totalUsers: number;
  page: number;
  perPage: number;
  totalPages: number;
}

const CATEGORY_MAP: Record<string, string> = {
  '68fb50c80ae91338641121f2': 'Європа',
  '68fb50c80ae91338641121f0': 'Азія',
  '68fb50c80ae91338641121f6': 'Пустелі',
  '68fb50c80ae91338641121f4': 'Африка',
};

export default function StoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getBaseDisplayCount = () => {
    if (typeof window === 'undefined') return 9;

    return window.matchMedia('(min-width:768px) and (max-width:1439px)').matches
      ? 8
      : 9;
  };

  const [baseDisplayCount, setBaseDisplayCount] = useState(getBaseDisplayCount);

  const [displayCount, setDisplayCount] = useState(getBaseDisplayCount);

  const pageSize = baseDisplayCount;

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(min-width:768px) and (max-width:1439px)',
    );

    const handleChange = () => {
      const next = mediaQuery.matches ? 8 : 9;

      setBaseDisplayCount(next);
      setDisplayCount(next);
    };

    handleChange();

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const { data, isLoading, error, fetchNextPage, hasNextPage } =
    useInfiniteQuery<ApiResponse>({
      queryKey: ['stories', selectedCategory, pageSize],

      queryFn: async ({ pageParam = 1 }) => {
        const response = await nextServer.get('/stories', {
          params: {
            page: pageParam,
            perPage: pageSize,

            ...(selectedCategory !== 'all'
              ? { category: selectedCategory }
              : {}),
          },
        });

        return response.data;
      },

      initialPageParam: 1,

      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    });

  const { data: usersData } = useQuery<UsersResponse>({
    queryKey: ['users'],

    queryFn: async () => {
      const pages = await Promise.all(
        [1, 2, 3, 4, 5].map((page) =>
          nextServer.get('/users', {
            params: {
              page,
              perPage: 9,
            },
          }),
        ),
      );

      const allUsers = pages.flatMap(
        (response: AxiosResponse<UsersResponse>) => response.data.users || [],
      );

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
    const map: Record<string, StoryCardUser> = {};

    usersData?.users?.forEach((user) => {
      map[user._id] = user;
    });

    return map;
  }, [usersData?.users]);

  const normalizedStories: NormalizedStory[] = useMemo(() => {
    const allStories = data?.pages.flatMap((page) => page.stories) || [];

    return allStories.map((story) => ({
      ...story,

      category:
        typeof story.category === 'string'
          ? story.category
          : story.category?._id || '',

      ownerId:
        typeof story.ownerId === 'string'
          ? story.ownerId
          : story.ownerId?._id || '',

      ownerUser: typeof story.ownerId === 'string' ? undefined : story.ownerId,
    }));
  }, [data?.pages]);

  const displayedStories = normalizedStories.slice(0, displayCount);

  const totalStories = data?.pages[0]?.totalStories || 0;

  const hasMoreStories = displayCount < totalStories;

  const handleLoadMore = () => {
    const next = displayCount + 3;

    setDisplayCount(next);

    if (next > normalizedStories.length && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.sectionTitle}>Історії Мандрівників</h1>

        {isLoading && <p>Завантаження...</p>}

        {error && <p>Помилка</p>}

        <TravellersStories
          stories={displayedStories}
          usersMap={usersMap}
          categoryMap={CATEGORY_MAP}
        />

        {hasMoreStories && (
          <button className={styles.loadMoreBtn} onClick={handleLoadMore}>Показати ще</button>
        )}
      </div>
    </section>
  );
}
