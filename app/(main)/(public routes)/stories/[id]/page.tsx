import StoryPage from '@/components/StoryPage/StoryPage';
import { fetchStoryByIdServer } from '@/lib/api/serverApi';
import css from '@/components/StoryPage/StoryPage.module.css';
import PopularStoriesSection from '@/components/PopularStoriesSection/PopularStoriesSection';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = await fetchStoryByIdServer(id);

  if (!story) notFound();

  const title = `Iсторія: ${story.title}`;
  const descShort = story.article.slice(0, 30);
  const descLong = story.article.slice(0, 150);

  return {
    title: title,
    description: descShort,
    openGraph: {
      title: title,
      description: descLong,
      url: `https://codev1be-social-web.vercel.app/stories/${id}`,
      siteName: 'Подорожники',
      images: [
        {
          url: story.img,
          width: 1200,
          height: 630,
          alt: story.title,
        },
      ],
      type: 'article',
      authors: [story.ownerId.name],
      publishedTime: story.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: descShort,
      images: story.img,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const story = await fetchStoryByIdServer(id);

  if (!story) notFound();

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
