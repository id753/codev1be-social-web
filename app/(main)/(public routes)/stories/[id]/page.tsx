import StoryPage from '@/components/StoryPage/StoryPage';
import { fetchStoryByIdServer } from '@/lib/api/serverApi';
import css from '@/components/StoryPage/StoryPage.module.css';
import PopularStoriesSection from '@/components/PopularStoriesSection/PopularStoriesSection';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const story = await fetchStoryByIdServer(id);

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
