'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
  const getBaseDisplayCount = () => {
    if (typeof window === 'undefined') return 9;

    return window.matchMedia('(min-width:768px) and (max-width:1439px)').matches
      ? 8
      : 9;
  };

  const [baseDisplayCount, setBaseDisplayCount] = useState(getBaseDisplayCount);
  const [displayCount, setDisplayCount] = useState(getBaseDisplayCount);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const getCategoryId = (category: StoryCategory) =>
    typeof category === 'string' ? category : category?._id || '';

  const getOwnerId = (owner: StoryOwner) =>
    typeof owner === 'string' ? owner : owner?._id || '';

  const getOwnerUser = (owner: StoryOwner) =>
    typeof owner === 'string' ? undefined : owner;

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
            params: { page, perPage: 9 },
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
      category: getCategoryId(story.category),
      ownerId: getOwnerId(story.ownerId),
      ownerUser: getOwnerUser(story.ownerId),
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

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setDisplayCount(baseDisplayCount);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectedCategoryName =
    CATEGORIES.find((cat) => cat.id === selectedCategory)?.name ||
    'Всі історії';

  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.sectionTitle}>Історії Мандрівників</h1>

        <div className={styles.filterSection}>
          <p className={styles.filterHeading}>Категорії</p>

          <div
            className={`${styles.filterDropdown} ${
              isDropdownOpen ? styles.filterDropdownOpen : ''
            }`}
            ref={dropdownRef}
          >
            <button
              type="button"
              className={`${styles.filterSelectButton} ${
                isDropdownOpen ? styles.filterSelectButtonOpen : ''
              }`}
              onClick={toggleDropdown}
            >
              <span className={styles.filterSelectText}>
                {selectedCategoryName}
              </span>
            </button>

            {isDropdownOpen && (
              <ul className={styles.filterDropdownList}>
                {CATEGORIES.map((category) => (
                  <li key={category.id} className={styles.filterDropdownItem}>
                    <button
                      type="button"
                      className={`${styles.filterDropdownOption} ${
                        selectedCategory === category.id
                          ? styles.filterDropdownOptionActive
                          : ''
                      }`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.filterTabs}>
            {CATEGORIES.map((category) => (
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
            />

            {hasMoreStories && (
              <button
                type="button"
                className={styles.loadMoreBtn}
                onClick={handleLoadMore}
              >
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
