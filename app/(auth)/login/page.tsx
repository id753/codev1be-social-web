'use client';

import Link from 'next/link';
import styles from './login.module.css';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { api } from '@/lib/api/auth';

const LoginSchema = Yup.object({
  email: Yup.string().email('Невірний email').required("Обов'язково"),
  password: Yup.string().required("Обов'язково"),
});

type LoginValues = {
  email: string;
  password: string;
};

type ApiErrorData = {
  message?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.inner}>
          <div className={styles.content}>
            <div className={styles.tabs}>
              <Link href="/register" className={styles.tab}>
                Реєстрація
              </Link>
              <Link href="/login" className={`${styles.tab} ${styles.tabActive}`}>
                Вхід
              </Link>
            </div>

            <h1 className={styles.title}>Вхід</h1>
            <p className={styles.subtitle}>Раді бачити вас знову!</p>

            <Formik<LoginValues>
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={async (values, helpers) => {
                helpers.setStatus(null);

                try {
                  const response = await api.post('/auth/login', values);

                  if (response.status === 200 || response.status === 201) {
                    // Очисти кеш пользователя
                    await queryClient.invalidateQueries({ 
                      queryKey: ['currentUser'] 
                    });

                    router.push('/');
                    router.refresh();
                  }
                } catch (err: unknown) {
                  let msg = 'Invalid credentials';

                  if (axios.isAxiosError(err)) {
                    const data = err.response?.data as ApiErrorData | undefined;
                    msg = data?.message ?? err.message ?? msg;
                  } else if (err instanceof Error) {
                    msg = err.message;
                  }

                  helpers.setStatus(msg);
                } finally {
                  helpers.setSubmitting(false);
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                status,
              }) => (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <label className={styles.field}>
                    <span className={styles.label}>Пошта*</span>
                    <input
                      className={styles.input}
                      name="email"
                      type="email"
                      placeholder="hello@podorozhnyky.ua"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isSubmitting}
                    />
                    {touched.email && errors.email && (
                      <span style={{ color: 'crimson', fontSize: 12 }}>{errors.email}</span>
                    )}
                  </label>

                  <label className={styles.field}>
                    <span className={styles.label}>Пароль*</span>
                    <input
                      className={styles.input}
                      name="password"
                      type="password"
                      placeholder="********"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isSubmitting}
                    />
                    {touched.password && errors.password && (
                      <span style={{ color: 'crimson', fontSize: 12 }}>{errors.password}</span>
                    )}
                  </label>

                  {status && <div style={{ color: 'crimson', fontSize: 12 }}>{status}</div>}

                  <button className={styles.button} type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '...' : 'Увійти'}
                  </button>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}