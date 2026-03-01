'use client';

import Link from 'next/link';
import styles from './register.module.css';
import { useRouter } from 'next/navigation';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { api } from '@/lib/api/auth';

const RegisterSchema = Yup.object({
  name: Yup.string().trim().max(32, 'Max 32').required("Обов'язково"),
  email: Yup.string()
    .email('Невірний email')
    .max(64, 'Max 64')
    .required("Обов'язково"),
  password: Yup.string()
    .min(8, 'Min 8')
    .max(138, 'Max 138')
    .required("Обов'язково"),
});

type RegisterValues = {
  name: string;
  email: string;
  password: string;
};

type ApiErrorData = {
  message?: string;
};

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.inner}>
          <div className={styles.content}>
            <div className={styles.tabs}>
              <Link
                href="/register"
                className={`${styles.tab} ${styles.tabActive}`}
              >
                Реєстрація
              </Link>
              <Link href="/login" className={styles.tab}>
                Вхід
              </Link>
            </div>

            <h1 className={styles.title}>Реєстрація</h1>
            <p className={styles.subtitle}>
              Раді вас бачити у спільноті мандрівників!
            </p>

            <Formik<RegisterValues>
              initialValues={{ name: '', email: '', password: '' }}
              validationSchema={RegisterSchema}
              onSubmit={async (values, helpers) => {
                helpers.setStatus(null);

                try {
                  // ✅ напрямую на backend
                  await api.post('/api/auth/register', values);

                  router.push('/');
                  router.refresh();
                } catch (err: unknown) {
                  let msg = 'Server error';

                  if (axios.isAxiosError(err)) {
                    const data = err.response?.data as ApiErrorData | undefined;
                    msg = data?.message ?? err.message ?? msg;
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
                    <span className={styles.label}>Ім’я та Прізвище*</span>
                    <input
                      className={styles.input}
                      name="name"
                      type="text"
                      placeholder="Ваше ім'я та прізвище"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isSubmitting}
                    />
                    {touched.name && errors.name && (
                      <span style={{ color: 'crimson', fontSize: 12 }}>
                        {errors.name}
                      </span>
                    )}
                  </label>

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
                      <span style={{ color: 'crimson', fontSize: 12 }}>
                        {errors.email}
                      </span>
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
                      <span style={{ color: 'crimson', fontSize: 12 }}>
                        {errors.password}
                      </span>
                    )}
                  </label>

                  {status && (
                    <div style={{ color: 'crimson', fontSize: 12 }}>
                      {status}
                    </div>
                  )}

                  <button
                    className={styles.button}
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '...' : 'Зареєструватись'}
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
