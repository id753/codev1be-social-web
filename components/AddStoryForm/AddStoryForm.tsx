'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';

import css from '@/components/AddStoryForm/AddStoryForm.module.css';
import StoryFormImage from '../StoryFormImage/StoryFormImage';
import FormSelect from '../FormSelect/FormSelect';

import { createStory, updateStory, fetchCategories } from '@/lib/api/clientApi';
import type { UpdateStoryData, Story } from '@/types/story';
import { useStoryStore } from '@/lib/store/storyStore';
import AuthNavModal from '../AuthNavModal/AuthNavModal';

const MAX_TITLE = 80;
const MAX_TEXT = 2500;
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const baseSchema = {
  title: Yup.string()
    .required('Заголовок є обовʼязковим')
    .min(5, 'Мінімум 5 символів')
    .max(MAX_TITLE, `Максимум ${MAX_TITLE} символів`),

  category: Yup.string().required('Оберіть категорію'),

  article: Yup.string()
    .required('Текст історії є обовʼязковим')
    .min(5, 'Мінімум 5 символів')
    .max(MAX_TEXT, `Максимум ${MAX_TEXT} символів`),
};

const createValidationSchema = Yup.object({
  img: Yup.mixed<File>()
    .nullable()
    .required('Обкладинка є обовʼязковою')
    .test('fileSize', 'Максимальний розмір зображення — 2MB', (value) => {
      if (!(value instanceof File)) return false;
      return value.size <= MAX_FILE_SIZE;
    }),
  ...baseSchema,
});

const editValidationSchema = Yup.object({
  img: Yup.mixed<File | string>()
    .required('Обкладинка є обовʼязковою')
    .test('fileSize', 'Максимальний розмір зображення — 2MB', (value) => {
      if (!value) return false;
      if (value instanceof File) return value.size <= MAX_FILE_SIZE;
      return typeof value === 'string' && value.length > 0;
    }),
  ...baseSchema,
});
type StoryFormValues = {
  img: File | string | null;
  title: string;
  category: string;
  article: string;
};

type AddStoryFormInitialValues = StoryFormValues & { _id?: string };

interface AddStoryFormProps {
  initialValues?: AddStoryFormInitialValues | null;
}

function normalizeCategory(cat: unknown): string {
  if (!cat) return '';
  if (typeof cat === 'string') return cat;

  if (typeof cat === 'object' && cat !== null && '_id' in cat) {
    const id = (cat as { _id: unknown })._id;
    return typeof id === 'string' ? id : '';
  }

  return '';
}

function DraftSync({ enabled }: { enabled: boolean }) {
  const { values } = useFormikContext<StoryFormValues>();
  const { setDraft } = useStoryStore();

  useEffect(() => {
    if (enabled) setDraft(values);
  }, [enabled, values, setDraft]);

  return null;
}

export default function AddStoryForm({ initialValues }: AddStoryFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, clearDraft } = useStoryStore();

  const [errorModal, setErrorModal] = useState(false);

  const isEditing = !!initialValues?._id;

  const { data: categories = [], isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const options = useMemo(
    () => categories.map((c) => ({ value: c._id, label: c.name })),
    [categories],
  );

  const defaultValues: StoryFormValues = useMemo(() => {
    if (isEditing) {
      return {
        img: initialValues?.img ?? null,
        title: initialValues?.title ?? '',
        category: normalizeCategory(initialValues?.category),
        article: initialValues?.article ?? '',
      };
    }

    return {
      img: draft.img ?? null,
      title: draft.title ?? '',
      category: draft.category ?? '',
      article: draft.article ?? '',
    };
  }, [isEditing, initialValues, draft]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: StoryFormValues) => {
      if (isEditing && initialValues?._id) {
        const payload: UpdateStoryData = {
          title: values.title,
          article: values.article,
          category: values.category,
          img: values.img,
        };
        return updateStory(payload, initialValues._id);
      }

      const payload = {
        title: values.title,
        article: values.article,
        category: values.category,
        img: values.img,
      };
      return createStory(payload);
    },
    onSuccess: (story: Story) => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      if (!isEditing) clearDraft();
      router.push(`/stories/${story._id}`);
    },
    onError: () => setErrorModal(true),
  });

  if (catLoading) {
    return <div className={css.formWrapper}>Loading...</div>;
  }

  return (
    <div className={css.formWrapper}>
      <Formik<StoryFormValues>
        initialValues={defaultValues}
        validationSchema={
          isEditing ? editValidationSchema : createValidationSchema
        }
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values: StoryFormValues) => mutate(values)}
      >
        {({
          values,
          setFieldValue,
          setFieldTouched,
          errors,
          submitCount,
          dirty,
        }) => {
          const titleOk = (values.title ?? '').trim().length >= 5;
          const articleOk = (values.article ?? '').trim().length >= 5;

          const isFilled =
            !!values.img && titleOk && articleOk && !!values.category;

          const canSubmit = isFilled && (isEditing ? dirty : true);

          return (
            <Form className={css.form}>
              <DraftSync enabled={!isEditing} />

              <div className={css.columLeft}>
                <p className={css.formLabel}>Обкладинка статті</p>

                <StoryFormImage
                  initialFile={values.img}
                  onFileSelect={async (file) => {
                    await setFieldValue('img', file);

                    if (file && file.size > MAX_FILE_SIZE) {
                      setFieldTouched('img', true, true);
                    } else {
                      setFieldTouched('img', true, false);
                    }
                  }}
                />
                <ErrorMessage name="img" component="p" className="error" />

                <label className={css.formLabel}>Загаловок</label>
                <Field
                  name="title"
                  type="text"
                  className={`${css.formInput} ${
                    submitCount > 0 && errors.title ? css.inputError : ''
                  }`}
                  placeholder="Введіть заголовок історії"
                />
                <ErrorMessage name="title" component="p" className="error" />

                <label className={css.formLabel}>Категорія</label>
                <FormSelect
                  options={options}
                  value={values.category || ''}
                  onChange={(val) => setFieldValue('category', val)}
                />
                <ErrorMessage name="category" component="p" className="error" />

                <label className={css.formLabel}>Текст історії</label>
                <Field
                  as="textarea"
                  name="article"
                  className={`${css.formTextarea} ${
                    submitCount > 0 && errors.article ? css.inputError : ''
                  }`}
                  placeholder="Ваша історія тут"
                />
                <ErrorMessage name="article" component="p" className="error" />
              </div>

              <div className={css.columRight}>
                <button
                  type="submit"
                  disabled={!canSubmit || isPending}
                  className={`${css.formButton} ${css.buttonSave} ${
                    !canSubmit || isPending ? css.buttonDisabled : ''
                  }`}
                >
                  {isPending
                    ? 'Збереження...'
                    : isEditing
                      ? 'Оновити'
                      : 'Зберегти'}
                </button>

                <button
                  type="button"
                  className={`${css.formButton} ${css.buttonCancel}`}
                  onClick={() => router.back()}
                >
                  Відмінити
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>

      {errorModal && (
        <div
          className={css.modalPlaceholder}
          onClick={() => setErrorModal(false)}
        >
          <AuthNavModal />
        </div>
      )}
    </div>
  );
}
