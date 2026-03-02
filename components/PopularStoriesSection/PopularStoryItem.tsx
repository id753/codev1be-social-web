import css from './PopularStoriesSection.module.css';
import { Story } from '@/types/story';
import { useAuth } from '@/hooks/useAuth';
import { useAuthModalStore } from '@/lib/store/authModalStore';
import { useState, useEffect } from 'react';
import { removeFavouriteStory, addToFavouriteStory } from '@/lib/api/clientApi';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

type IconProps = {
  id: string;
  className?: string;
};

const SPRITE = '/svg/icons.svg';

function Icon({ id, className }: IconProps) {
  return (
    <svg className={className} aria-hidden="true">
      <use href={`${SPRITE}#${id}`} />
    </svg>
  );
}

export const StoryItem = ({ story }: { story: Story }) => {
  const { isAuthenticated, user } = useAuth();
  const { open } = useAuthModalStore();

  const initialFavoriteCount = story.favoriteCount ?? 0;

  const [favoritesCount, setFavoritesCount] = useState(initialFavoriteCount);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFavoritesCount(initialFavoriteCount);
  }, [initialFavoriteCount]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsSaved(false);
      return;
    }

    setIsSaved(user.favoriteStories?.includes(story._id));
  }, [user, isAuthenticated, story._id]);

  const onToggleSave = async () => {
    if (!isAuthenticated) {
      open();
      return;
    }

    if (isLoading) return;

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
        toast.error(
          typeof error.response?.data?.message === 'string'
            ? error.response.data.message
            : 'Помилка при оновленні збережених історій',
        );
      } else {
        toast.error('Помилка при оновленні збережених історій');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className={css.articleItem}>
      <article className={css.article}>
        <Image
          src={story.img}
          alt={story.title}
          width={335}
          height={223}
          className={css.articlePic}
        />

        <div className={css.articleContent}>
          <p className={css.articleCategory}>{story.category.name}</p>

          <h3 className={css.articleTitle}>{story.title}</h3>

          <p className={css.articleTxt}>{story.article}</p>

          <div className={css.articleMeta}>
            <Image
              src={story.ownerId.avatarUrl}
              alt="avatar"
              width={48}
              height={48}
              className={css.avatar}
            />

            <div className={css.info}>
              <p className={css.name}>{story.ownerId.name}</p>

              <p className={css.data}>
                {story.date}
                {' • '}
                {favoritesCount}
                <Icon id="savesmall" className={css.icon} />
              </p>
            </div>
          </div>

          <div className={css.buttons}>
            <Link href={`/stories/${story._id}`} className={css.link}>
              Переглянути статтю
            </Link>

            <button
              className={`${css.button} ${isSaved ? css.active : ''}`}
              onClick={onToggleSave}
              disabled={isLoading}
            >
              {isLoading ? '...' : <Icon id="save" className={css.bigIcon} />}
            </button>
          </div>
        </div>
      </article>
    </li>
  );
};
