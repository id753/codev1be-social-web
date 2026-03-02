// app/stories/[id]/page.tsx
import React from 'react';
import StoryPage from '@/components/StoryPage/StoryPage';
import { getSingleStory } from '@/lib/api/story';
import css from '../../../components/StoryPage/StoryPage.module.css';
import PopularStoriesSection from '@/components/PopularStoriesSection/PopularStoriesSection';

type Props = {
  params: { id: string };
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const story = await getSingleStory(id);
  console.log(story);

  return (
    <>
      <div className={css.wrapper}>
        <StoryPage story={story} />
      </div>
      <div className={css.popularWrapper}>
        <PopularStoriesSection />
      </div>
    </>
  );
}
