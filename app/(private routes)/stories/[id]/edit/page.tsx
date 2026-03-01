import { fetchStoryById } from '@/lib/api/clientApi';
import AddStoryForm from '@/components/AddStoryForm/AddStoryForm';
import css from '@/app/(private routes)/stories/create/CreateStory.module.css';

interface Props {
  params: { id: string };
}

const EditStoryPage = async ({ params }: Props) => {
  const { id } = params;

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
