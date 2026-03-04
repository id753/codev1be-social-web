import { fetchStoryById } from '@/lib/api/clientApi';
import AddStoryForm from '@/components/AddStoryForm/AddStoryForm';
import css from '@/app/(main)/(private routes)/stories/create/CreateStory.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit a new story',
  description: 'Edit a new story',
  openGraph: {
    title: 'Edit a new story',
    description: 'Edit a new story.',
    url: 'https://codev1be-social-api.onrender.com/stories/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Podorozhnyky',
      },
    ],
  },
};

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit a new story',
  description: 'Edit a new story',
  openGraph: {
    title: 'Edit a new story',
    description: 'Edit a new story.',
    url: 'https://codev1be-social-api.onrender.com/stories/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Podorozhnyky',
      },
    ],
  },
};

interface Props {
  params: Promise<{ id: string }>;
}

const EditStoryPage = async ({ params }: Props) => {
  const { id } = await params;

  const story = await fetchStoryById(id);

  const initialValues = {
    _id: story._id,
    img: story.img || null,
    title: story.title || '',
    category: story.category._id || '',
    article: story.article || '',
  };

  return (
    <section>
      <div className="container">
        <h1 className={css.createStoryTitle}>Редагувати історію</h1>
        <AddStoryForm initialValues={initialValues} />
      </div>
    </section>
  );
};

export default EditStoryPage;
