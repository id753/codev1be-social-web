import css from './CreateStory.module.css';
import AddStoryForm from '@/components/AddStoryForm/AddStoryForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create a new story',
  description: 'Create a new story',
  openGraph: {
    title: 'Create a new story',
    description: 'Create a new story.',
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

const CreateStoryPage = () => {
  const initialValues = {
    img: null,
    title: '',
    category: '',
    article: '',
  };

  return (
    <section className={css.createStorySection}>
      <div className="container">
        <h1 className={css.createStoryTitle}>Створити нову історію</h1>
        <AddStoryForm initialValues={initialValues} />
      </div>
    </section>
  );
};

export default CreateStoryPage;
