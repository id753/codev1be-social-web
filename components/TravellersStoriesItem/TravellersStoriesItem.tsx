'use client';

import { useState } from 'react';
import Image from 'next/image';
import LinkButton from '@/components/LinkButton/LinkButton';
import { useRouter } from 'next/navigation';
import styles from './TravellersStoriesItem.module.css';

interface Story {
  _id: string;
  img: string;
  title: string;
  article?: string;
  description?: string;
  category: string;
  ownerId: string;
  ownerUser?: User;
  favoriteCount: number;
  date: string;
}

interface User {
  _id: string;
  name: string;
  avatarUrl: string;
  totalFavorites: number;
}

interface TravellersStoriesItemProps {
  story: Story;
  user?: User;
  categoryName: string;
  priority?: boolean;
  isFavorite: boolean;
  isLoading: boolean;
  onBookmarkClick: (storyId: string) => void;
  isUserLoggedIn: boolean;
}

export default function TravellersStoriesItem({
  story,
  user,
  categoryName,
  priority = false,
  isFavorite,
  isLoading,
  onBookmarkClick,
  isUserLoggedIn,
}: TravellersStoriesItemProps) {
  const router = useRouter();
  const [localLoading, setLocalLoading] = useState(false);

  const articleText = story.article || story.description || '';
  const formattedDate = new Date(story.date).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const readTime = Math.ceil(articleText.split(' ').length / 200);

  const handleBookmarkClick = () => {
    if (!isUserLoggedIn) {
      router.push('/auth'); // редірект на логін/реєстрацію
      return;
    }

    setLocalLoading(true);
    onBookmarkClick(story._id); // колбек з батьківського компонента
    setLocalLoading(false);
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
              <Image src={user.avatarUrl} alt={user.name} fill className={styles.avatarImage} sizes="48px" />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#D1D5DB" />
              </svg>
            )}
          </div>

          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{user?.name || 'Автор'}</span>
            <div className={styles.time}>
              <span className={styles.date}>{formattedDate}</span>
              <span className={styles.divider}>•</span>
              <span className={styles.readTime}>
                {readTime}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8.00022 12.1121L4.82122 13.4721C4.44278 13.6353 4.08361 13.6046 3.74372 13.3803C3.40383 13.156 3.23389 12.8385 3.23389 12.428V2.95298C3.23389 2.6452 3.3465 2.37836 3.57172 2.15248C3.79683 1.92648 4.06272 1.81348 4.36939 1.81348H11.6311C11.9388 1.81348 12.2057 1.92648 12.4316 2.15248C12.6576 2.37836 12.7706 2.6452 12.7706 2.95298V12.428C12.7706 12.8385 12.5999 13.156 12.2587 13.3803C11.9175 13.6046 11.5577 13.6353 11.1792 13.4721L8.00022 12.1121ZM8.00022 10.8973L11.6311 12.428V2.95298H4.36939V12.428L8.00022 10.8973ZM8.00022 2.95298H4.36939H11.6311H8.00022Z" fill="black" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <LinkButton href={`/stories/${story._id}`} text="Переглянути статтю" className={styles.readBtn} />

          <button
            type="button"
            className={`${styles.bookmarkBtn} ${isFavorite ? styles.active : ''}`}
            onClick={handleBookmarkClick}
            disabled={isLoading || localLoading}
          >
            {localLoading || isLoading ? (
              <span className={styles.spinner} />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'}>
                <path d="M12 18L7 20V4H17V20L12 18Z" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
