'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import TravellersStories from '@/components/TravellersStories/TravellersStories';

let iziToast: typeof import('izitoast').default | null = null;
import nextServer from '@/lib/api/api';
import type {
  Category,
  Owner,
  StoriesResponse,
  StoryCard,
  StoryCardUser,
} from '@/types/story';

import styles from './StoriesPage.module.css';
import { CATEGORIES, CATEGORY_MAP } from './constants';

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

const getCategoryId = (category: StoryCategory) =>
  typeof category === 'string' ? category : category?._id || '';

const getOwnerId = (owner: StoryOwner) =>
  typeof owner === 'string' ? owner : owner?._id || '';

const getOwnerUser = (owner: StoryOwner) =>
  typeof owner === 'string' ? undefined : owner;

export default function StoriesPage() {
  const [allStories, setAllStories] = useState<NormalizedStory[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [perPage, setPerPage] = useState(9);
  const [isPerPageReady, setIsPerPageReady] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const prevLengthRef = useRef(0);
  const loadMoreBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    import('izitoast').then((mod) => {
      iziToast = mod.default;
    });
  }, []);

  // Визначення perPage по ширині екрана
  const updatePerPage = useCallback(() => {
    const isTablet = window.matchMedia(
      '(min-width:768px) and (max-width:1439px)',
    ).matches;
    setPerPage(isTablet ? 8 : 9);
    setIsPerPageReady(true);
  }, []);

  useEffect(() => {
    updatePerPage();
    window.addEventListener('resize', updatePerPage);
    return () => window.removeEventListener('resize', updatePerPage);
  }, [updatePerPage]);

  // Функція завантаження stories
  const loadStories = useCallback(
    async (nextPage = 1) => {
      if (!isPerPageReady) return;

      setLoading(true);
      try {
        const response = await nextServer.get<ApiResponse>('/stories', {
          params: {
            page: nextPage,
            perPage,
            ...(selectedCategory !== 'all'
              ? { category: selectedCategory }
              : {}),
          },
        });

        const normalizedData = response.data.stories.map((story) => ({
          ...story,
          category: getCategoryId(story.category),
          ownerId: getOwnerId(story.ownerId),
          ownerUser: getOwnerUser(story.ownerId),
        }));

        setAllStories((prev) =>
          nextPage === 1 ? normalizedData : [...prev, ...normalizedData],
        );

        setPage(nextPage);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        console.error('Failed to load stories', err);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory, perPage, isPerPageReady],
  );

  // Завантаження при монтуванні і зміні категорії
  useEffect(() => {
    loadStories(1);
  }, [loadStories]);

  // Auto-scroll до нової картки після завантаження
  useEffect(() => {
    const wrapper = gridRef.current;
    if (!wrapper) return;

    const prevLength = prevLengthRef.current;
    const currentLength = allStories.length;

    if (currentLength <= prevLength) return;

    // Знаходимо grid всередині wrapper
    const grid = wrapper.querySelector('[class*="grid"]');
    if (!grid) return;

    const newCard = grid.children[prevLength];

    if (newCard instanceof HTMLElement) {
      newCard.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [allStories]);

  // Dropdown outside click handler
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

  const hasMoreStories = page < totalPages;

  const handleLoadMore = async () => {
    if (page >= totalPages) {
      iziToast?.info({
        message: 'Це остання сторінка',
        position: 'topRight',
      });
      return;
    }

    prevLengthRef.current = allStories.length;

    if (!loading) {
      loadStories(page + 1);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
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

        {loading && allStories.length === 0 && (
          <p className={styles.loading}>Завантаження...</p>
        )}

        {allStories.length > 0 && (
          <>
            <div ref={gridRef}>
              <TravellersStories
                stories={allStories}
                usersMap={{}}
                categoryMap={CATEGORY_MAP}
              />
            </div>

            {hasMoreStories && (
              <button
                ref={loadMoreBtnRef}
                type="button"
                className={styles.loadMoreBtn}
                onClick={handleLoadMore}
                onMouseDown={handleMouseDown}
                disabled={loading}
              >
                {loading ? 'Завантаження...' : 'Показати ще'}
              </button>
            )}
          </>
        )}

        {!loading && allStories.length === 0 && (
          <p className={styles.noResults}>Немає історій в цій категорії</p>
        )}
      </div>
    </section>
  );
}
