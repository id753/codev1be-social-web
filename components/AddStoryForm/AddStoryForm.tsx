'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';

import css from '@/components/AddStoryForm/AddStoryForm.module.css';
import StoryFormImage from '../StoryFormImage/StoryFormImage';
import FormSelect from '../FormSelect/FormSelect';
import AuthNavModal from '../AuthNavModal/AuthNavModal';

import { createStory, updateStory, fetchCategories } from '@/lib/api/clientApi';
import type {
  UpdateStoryData,
  CreateStoryData,
  Story,
  Category,
} from '@/types/story';
import { useStoryStore } from '@/lib/store/storyStore';

const MAX_TITLE = 80;
const MAX_TEXT = 2500;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export type StoryFormValues = {
  img: File | string | null;
  title: string;
  category: string; // categoryId
  article: string;
};

type AddStoryFormInitialValues = StoryFormValues & { _id?: string };

interface AddStoryFormProps {
  initialValues?: AddStoryFormInitialValues | null;
}

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
      return value instanceof File && value.size <= MAX_FILE_SIZE;
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

  const serializableDraft = useMemo(
    () => ({
      title: values.title ?? '',
      category: values.category ?? '',
      article: values.article ?? '',
      img: typeof values.img === 'string' ? values.img : null,
    }),
    [values.title, values.category, values.article, values.img],
  );

  const prevJsonRef = useMemo(() => ({ current: '' as string }), []);
  // (useMemo to create stable ref-like object without importing useRef)

  useEffect(() => {
    if (!enabled) return;

    const nextJson = JSON.stringify(serializableDraft);
    if (prevJsonRef.current === nextJson) return;

    // Debounce writes to zustand/localStorage
    const t = window.setTimeout(() => {
      prevJsonRef.current = nextJson;
      setDraft(serializableDraft);
    }, 250);

    return () => window.clearTimeout(t);
  }, [enabled, serializableDraft, setDraft, prevJsonRef]);

  return null;
}

export default function AddStoryForm({ initialValues }: AddStoryFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, clearDraft } = useStoryStore();

  const [errorModal, setErrorModal] = useState(false);

  const isEditing = Boolean(initialValues?._id);

  const validationSchema = useMemo(
    () => (isEditing ? editValidationSchema : createValidationSchema),
    [isEditing],
  );

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });

  const categoryOptions = useMemo(
    () => (categories ?? []).map((c) => ({ value: c._id, label: c.name })),
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
      img: (draft.img as StoryFormValues['img']) ?? null,
      title: draft.title ?? '',
      category: draft.category ?? '',
      article: draft.article ?? '',
    };
  }, [isEditing, initialValues, draft]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: StoryFormValues) => {
      if (isEditing && initialValues?._id) {
        const updatePayload: UpdateStoryData = {
          title: values.title,
          article: values.article,
          category: values.category,
          img: values.img,
        };

        return updateStory(updatePayload, initialValues._id);
      }

      const createPayload: CreateStoryData = {
        title: values.title,
        article: values.article,
        category: values.category,
        img: values.img ?? undefined,
      };

      return createStory(createPayload);
    },

    onSuccess: (story: Story) => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      if (!isEditing) clearDraft();
      router.push(`/stories/${story._id}`);
    },

    onError: () => setErrorModal(true),
  });

  // if (!isMounted) {
  //   return <div className={css.formWrapper}>Loading...</div>;
  // }

  if (isCategoriesLoading) {
    return <div className={css.formWrapper}>Loading categories...</div>;
  }

  if (isCategoriesError) {
    return (
      <div className={css.formWrapper}>
        <p>Не вдалося завантажити категорії. Спробуйте оновити сторінку.</p>
      </div>
    );
  }

  return (
    <div className={css.formWrapper}>
      <Formik<StoryFormValues>
        initialValues={defaultValues}
        validationSchema={validationSchema}
        enableReinitialize={isEditing}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values) => mutate(values)}
      >
        {({
          values,
          setFieldValue,
          setFieldTouched,
          isValid,
          dirty,
          errors,
          submitCount,
        }) => {
          const canSubmit =
            isValid &&
            (isEditing ? dirty : true) &&
            Boolean(values.img) &&
            Boolean(values.title) &&
            Boolean(values.article) &&
            Boolean(values.category);

          return (
            <Form className={css.form}>
              {!isEditing && <DraftSync enabled />}

              <div className={css.columLeft}>
                <p className={css.formLabel}>Обкладинка статті</p>

                <StoryFormImage
                  initialFile={values.img}
                  onFileSelect={async (file) => {
                    await setFieldValue('img', file);

                    if (file && file.size > MAX_FILE_SIZE) {
                      setFieldTouched('img', true, true);
                    } else {
                      setFieldTouched('img', false, false);
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
                  options={categoryOptions}
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
