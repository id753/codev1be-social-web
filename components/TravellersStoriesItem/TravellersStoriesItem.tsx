'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAuthModalStore } from '@/lib/store/authModalStore';
import { addToFavouriteStory, removeFavouriteStory } from '@/lib/api/clientApi';
import type { StoryCardBase, StoryCardUser } from '@/types/story';
import styles from './TravellersStoriesItem.module.css';

interface TravellersStoriesItemProps {
  story: StoryCardBase;
  user?: StoryCardUser;
  categoryName: string;
  priority?: boolean;
}

export default function TravellersStoriesItem({
  story,
  user,
  categoryName,
  priority = false,
}: TravellersStoriesItemProps) {
  const { isAuthenticated, user: currentUser } = useAuth();
  const { open } = useAuthModalStore();

  const articleText = story.article || story.description || '';
  const formattedDate = new Date(story.date).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const initialFavoriteCount = useMemo(
    () => story.favouriteCount ?? story.favoriteCount ?? 0,
    [story.favouriteCount, story.favoriteCount],
  );

  const [favoritesCount, setFavoritesCount] = useState(initialFavoriteCount);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFavoritesCount(initialFavoriteCount);
  }, [initialFavoriteCount]);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      setIsSaved(false);
      return;
    }

    setIsSaved(currentUser.favoriteStories.includes(story._id));
  }, [currentUser, isAuthenticated, story._id]);

  const onToggleSave = async () => {
    if (!isAuthenticated) {
      open();
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      if (isSaved) {
        await removeFavouriteStory(story._id);
        setIsSaved(false);
        setFavoritesCount((prev) => Math.max(prev - 1, 0));
      } else {
        await addToFavouriteStory(story._id);
        setIsSaved(true);
        setFavoritesCount((prev) => prev + 1);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const message =
          typeof error.response?.data?.message === 'string'
            ? error.response.data.message
            : 'Помилка при оновленні збережених історій';

        toast.error(message);
      } else {
        toast.error('Помилка при оновленні збережених історій');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className={styles.blogCard}>
      <div className={styles.imageWrapper}>
        <Image
          src={story.img}
          alt={story.title}
          fill
          className={styles.image}
          sizes="(max-width: 767px) 100vw, (max-width: 1439px) 50vw, 33vw"
          priority={priority}
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.contentCard}>
          <span className={styles.tag}>{categoryName}</span>

          <h3 className={styles.title}>{story.title}</h3>

          <p className={styles.description}>
            {articleText.substring(0, 80) || 'Опис відсутній'}...
          </p>
        </div>

        <div className={styles.author}>
          <div className={styles.avatar}>
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                fill
                className={styles.avatarImage}
                sizes="48px"
              />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                  fill="#D1D5DB"
                />
              </svg>
            )}
          </div>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{user?.name || 'Автор'}</span>
            <div className={styles.time}>
              <span className={styles.date}>{formattedDate}</span>
              <span className={styles.divider}>•</span>
              <span className={styles.readTime}>
                {favoritesCount}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.00022 12.1121L4.82122 13.4721C4.44278 13.6353 4.08361 13.6046 3.74372 13.3803C3.40383 13.156 3.23389 12.8385 3.23389 12.428V2.95298C3.23389 2.6452 3.3465 2.37836 3.57172 2.15248C3.79683 1.92648 4.06272 1.81348 4.36939 1.81348H11.6311C11.9388 1.81348 12.2057 1.92648 12.4316 2.15248C12.6576 2.37836 12.7706 2.6452 12.7706 2.95298V12.428C12.7706 12.8385 12.5999 13.156 12.2587 13.3803C11.9175 13.6046 11.5577 13.6353 11.1792 13.4721L8.00022 12.1121ZM8.00022 10.8973L11.6311 12.428V2.95298H4.36939V12.428L8.00022 10.8973ZM8.00022 2.95298H4.36939H11.6311H8.00022Z"
                    fill="black"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href={`/stories/${story._id}`} className={styles.readBtn}>
            Переглянути статтю
          </Link>
          <button
            type="button"
            className={`${styles.bookmarkBtn} ${isSaved ? styles.bookmarkBtnActive : ''}`}
            onClick={onToggleSave}
            disabled={isLoading}
            aria-label={
              isSaved
                ? 'Видалити зі збережених історій'
                : 'Додати в збережені історії'
            }
            aria-pressed={isSaved}
          >
            {isLoading ? (
              <span className={styles.loader} aria-hidden="true" />
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.0001 18.1677L7.23159 20.2077C6.66392 20.4524 6.12517 20.4065 5.61534 20.07C5.1055 19.7335 4.85059 19.2573 4.85059 18.6415V4.42898C4.85059 3.96731 5.0195 3.56706 5.35734 3.22823C5.695 2.88923 6.09384 2.71973 6.55384 2.71973H17.4463C17.908 2.71973 18.3083 2.88923 18.6471 3.22823C18.9861 3.56706 19.1556 3.96731 19.1556 4.42898V18.6415C19.1556 19.2573 18.8997 19.7335 18.3878 20.07C17.876 20.4065 17.3363 20.4524 16.7686 20.2077L12.0001 18.1677ZM12.0001 16.3455L17.4463 18.6415V4.42898H6.55384V18.6415L12.0001 16.3455ZM12.0001 4.42898H6.55384H17.4463H12.0001Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
