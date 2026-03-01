// components/StoryPage/StoryPage.tsx
import React from 'react';
import css from './StoryPage.module.css';
import Image from 'next/image';
import { Story } from '@/types/story';
import StoryDetails from '../StoryDetails/StoryDetails';

type StoryPageProps = {
  story: Story;
};

const StoryPage = ({ story }: StoryPageProps) => {
  return (
    <article className={css.article}>
      <header className={css.header}>
        <h1 className={css.title}>{story.title}</h1>
        <div className={css.headerGroup}>
          <p className={css.text}>
            <strong className={css.accent}>Автор статті: </strong>
            {story.ownerId.name}
          </p>
          <p className={css.text}>
            <strong className={css.accent}>Опубліковано: </strong>
            {story.date}
          </p>
          <span className={css.category}>
            {story.category?.name || 'Без категорії'}
          </span>
        </div>
      </header>

      <Image
        src={story.img || '/img/placeholder.png'}
        alt={story.title}
        width={800}
        height={500}
        className={css.image}
      />

      <div className={css.textArticleGroup}>
        <p className={css.textArticle}>{story.article}</p>
        <StoryDetails storyId={story._id} />
      </div>
    </article>
  );
};

export default StoryPage;
