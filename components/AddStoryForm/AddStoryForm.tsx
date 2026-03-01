'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import css from '@/components/AddStoryForm/AddStoryForm.module.css';
import StoryFormImage from '../StoryFormImage/StoryFormImage';
import FormSelect from '../FormSelect/FormSelect';
import { createStory, updateStory } from '@/lib/api/clientApi';
import { UpdateStoryData } from '@/types/story';
import { useStoryStore } from '@/lib/store/storyStore';

const MAX_TITLE = 80;
const MAX_TEXT = 2500;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const validationSchema = Yup.object({
  img: Yup.mixed()
    .notRequired()
    .test('img-validation', 'Validation Error', function (value) {
      if (!value) {
        return this.createError({ message: 'Обкладинка статті обовʼязкова' });
      }
      if (value instanceof File && value.size > MAX_FILE_SIZE) {
        return this.createError({ message: 'Максимальний розмір фото 2MB' });
      }
      return true;
    }),
  title: Yup.string()
    .required('Заголовок обовʼязковий')
    .max(MAX_TITLE, `Максимум ${MAX_TITLE} символів`),
  category: Yup.string().required('Оберіть категорію'),
  article: Yup.string()
    .required('Текст історії обовʼязковий')
    .max(MAX_TEXT, `Максимум ${MAX_TEXT} символів`),
});

interface AddStoryFormProps {
  initialValues?: UpdateStoryData & { _id?: string };
}

const AddStoryForm = ({ initialValues }: AddStoryFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorModal, setErrorModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { draft, setDraft, clearDraft } = useStoryStore();

  const isEditing = !!initialValues?._id;
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const { mutate, isPending } = useMutation({
    mutationFn: (values: UpdateStoryData) => {
      if (isEditing && initialValues?._id) {
        return updateStory(values, initialValues._id);
      }
      return createStory(values);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      if (!isEditing) clearDraft();
      const finalId = data._id || initialValues?._id;
      router.push(`/stories/${finalId}`);
    },
    onError: () => setErrorModal(true),
  });

  const defaultValues: UpdateStoryData = isEditing
    ? {
        img: initialValues?.img || null,
        title: initialValues?.title || '',
        category: initialValues?.category || '',
        article: initialValues?.article || '',
      }
    : draft;

  if (!isMounted) {
    return <div className={css.formWrapper}>Loading...</div>;
  }
  return (
    <div className={css.formWrapper}>
      <Formik
        initialValues={defaultValues}
        validationSchema={validationSchema}
        enableReinitialize
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
          useEffect(() => {
            if (!isEditing) {
              setDraft(values);
            }
          }, [values, isEditing, setDraft]);

          const canSubmit =
            isValid &&
            (isEditing ? dirty : true) &&
            !!values.img &&
            !!values.title &&
            !!values.article &&
            !!values.category;

          return (
            <Form className={css.form}>
              <div className={css.columLeft}>
                <p className={css.formLabel}>Обкладинка статті</p>

                <StoryFormImage
                  initialFile={values.img}
                  onFileSelect={async (file) => {
                    await setFieldValue('img', file);
                    if (file && file.size > MAX_FILE_SIZE) {
                      setFieldTouched('img', true, true);
                    } else {
                      setFieldTouched('img', false);
                    }
                  }}
                />
                <ErrorMessage name="img" component="p" className="error" />

                <label className={css.formLabel}>Заголовок</label>
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
                  options={[
                    { value: '68fb50c80ae91338641121f2', label: 'Європа' },
                    { value: '68fb50c80ae91338641121f0', label: 'Азія' },
                    { value: '68fb50c80ae91338641121f6', label: 'Пустелі' },
                    { value: '68fb50c80ae91338641121f4', label: 'Африка' },
                    { value: '68fb50c80ae91338641121f1', label: 'Гори' },
                    { value: '68fb50c80ae91338641121f3', label: 'Америка' },
                    { value: '68fb50c80ae91338641121f7', label: 'Балкани' },
                    { value: '68fb50c80ae91338641121f8', label: 'Кавказ' },
                    { value: '68fb50c80ae91338641121f9', label: 'Океанія' },
                  ]}
                  value={values.category}
                  onChange={(val) => {
                    setFieldValue('category', val);
                  }}
                />
                <ErrorMessage name="category" component="p" className="error" />

                <label className={css.formLabel}>Текст історії</label>
                <Field
                  as="textarea"
                  name="description"
                  className={`${css.formTextarea} ${
                    submitCount > 0 && errors.article ? css.inputError : ''
                  }`}
                  placeholder="Ваша історія тут"
                />
                <ErrorMessage
                  name="description"
                  component="p"
                  className="error"
                />
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
                      ? 'Редагувати'
                      : 'Створити'}
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
          <p>Помилка при збереженні. Спробуйте ще раз.</p>
        </div>
      )}
    </div>
  );
};

export default AddStoryForm;
