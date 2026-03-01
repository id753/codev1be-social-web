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

<<<<<<< HEAD
interface User {
  _id: string;
  name: string;
  avatarUrl: string;
  totalFavorites: number;
}

type StoryCategory = string | { _id: string; name?: string };
type StoryOwner = string | User;
=======
type StoryCategory = string | Category;
type StoryOwner = string | Owner | StoryCardUser;
>>>>>>> origin/main

type ApiStory = Omit<StoryCard, 'category' | 'ownerId' | 'ownerUser'> & {
  category: StoryCategory;
  ownerId: StoryOwner;
};

<<<<<<< HEAD
interface ApiResponse {
  stories: Story[];
  totalStories: number;
  page: number;
  perPage: number;
  totalPages: number;
}
=======
type ApiResponse = Omit<StoriesResponse, 'stories'> & {
  stories: ApiStory[];
};

type NormalizedStory = StoryCard;
>>>>>>> origin/main

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
<<<<<<< HEAD
=======
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageSize = baseDisplayCount;
>>>>>>> origin/main

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

<<<<<<< HEAD
  // Колбек для оновлення списку улюблених
  const handleBookmarkClick = (storyId: string) => {
    setLoadingStoryId(storyId);
    setFavoriteStories(prev =>
      prev.includes(storyId) ? prev.filter(id => id !== storyId) : [...prev, storyId]
    );
    setLoadingStoryId(null);
  };
=======
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
>>>>>>> origin/main

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setDisplayCount(baseDisplayCount);
  };

<<<<<<< HEAD
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
=======
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
      staleTime: 0,
    });
>>>>>>> origin/main

  const { data: usersData } = useQuery<UsersResponse>({
    queryKey: ['users'],
    queryFn: async () => {
<<<<<<< HEAD
      const pages = await Promise.all(
        [1, 2, 3, 4, 5].map(page =>
          api.get('/api/users', { params: { page, perPage: 9 } })
        )
=======
      const pages = await Promise.all([
        nextServer.get('/users', { params: { page: 1, perPage: 9 } }),
        nextServer.get('/users', { params: { page: 2, perPage: 9 } }),
        nextServer.get('/users', { params: { page: 3, perPage: 9 } }),
        nextServer.get('/users', { params: { page: 4, perPage: 9 } }),
        nextServer.get('/users', { params: { page: 5, perPage: 9 } }),
      ]);

      const allUsers = pages.flatMap(
        (response: AxiosResponse<UsersResponse>) => response.data.users || [],
>>>>>>> origin/main
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
<<<<<<< HEAD
    const map: Record<string, User> = {};
    usersData?.users?.forEach(user => {
=======
    const map: Record<string, StoryCardUser> = {};
    usersData?.users?.forEach((user) => {
>>>>>>> origin/main
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

<<<<<<< HEAD
=======
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

>>>>>>> origin/main
  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.container}`}>
        <h1 className={styles.sectionTitle}>Історії Мандрівників</h1>

        {/* Фільтр категорій */}
        <div className={styles.filterSection}>
          <p className={styles.filterHeading}>Категорії</p>

<<<<<<< HEAD
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
=======
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
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
            >
              <span className={styles.filterSelectText}>
                {selectedCategoryName}
              </span>
              <svg
                className={`${styles.iconRight} ${isDropdownOpen ? styles.iconRotated : ''}`}
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.9998 15.2019C11.8878 15.2019 11.7822 15.1813 11.683 15.1399C11.5837 15.0986 11.4884 15.0323 11.397 14.9409L6.45305 9.99694C6.28305 9.82694 6.20221 9.62385 6.21055 9.38769C6.21888 9.15152 6.30805 8.94844 6.47805 8.77844C6.64805 8.60844 6.85113 8.52344 7.0873 8.52344C7.32346 8.52344 7.52655 8.60844 7.69655 8.77844L11.9998 13.1067L16.328 8.77844C16.498 8.60844 16.697 8.5276 16.9248 8.53594C17.1526 8.54427 17.3515 8.63344 17.5215 8.80344C17.6915 8.97344 17.7765 9.17652 17.7765 9.41269C17.7765 9.64885 17.6915 9.85194 17.5215 10.0219L12.6025 14.9409C12.5112 15.0323 12.4159 15.0986 12.3165 15.1399C12.2174 15.1813 12.1118 15.2019 11.9998 15.2019Z"
                  fill="black"
                  fillOpacity="0.6"
                />
              </svg>
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
>>>>>>> origin/main
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
