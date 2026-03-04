'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import styles from './AuthForm.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import nextServer from '@/lib/api/api';

// --- ТИПИ ---
interface AuthValues {
  name?: string;
  email: string;
  password: string;
}

interface ApiErrorData {
  message?: string;
}

interface AuthFormProps {
  type: 'login' | 'register';
}

// --- СХЕМИ ВАЛІДАЦІЇ ---
const RegisterSchema = Yup.object().shape({
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

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Невірний email')
    .max(64, 'Max 64')
    .required("Обов'язково"),
  password: Yup.string().required("Обов'язково"),
});

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const isRegister = type === 'register';
  const { setUser } = useAuthStore();

  const initialValues: AuthValues = {
    email: '',
    password: '',
    ...(isRegister ? { name: '' } : {}),
  };

  // const handleSubmit = async (
  //   values: AuthValues,
  //   helpers: FormikHelpers<AuthValues>,
  // ) => {
  //   helpers.setStatus(null);

  //   const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

  //   try {
  //     await axios.post(endpoint, values);

  //     router.push('/');
  //     router.refresh();
  //   } catch (err: unknown) {
  //     let msg = 'Server error';
  //     if (axios.isAxiosError(err)) {
  //       const data = err.response?.data as ApiErrorData | undefined;
  //       msg = data?.message ?? err.message ?? msg;
  //     }
  //     helpers.setStatus(msg);
  //   } finally {
  //     helpers.setSubmitting(false);
  //   }
  // };

  // Переконайся, що вгорі всередині компонента виклик стору виглядає так:
  // const { setUser } = useAuthStore();

  const handleSubmit = async (
    values: AuthValues,
    helpers: FormikHelpers<AuthValues>,
  ) => {
    helpers.setStatus(null);

    const endpoint = isRegister ? '/auth/register' : '/auth/login';

    try {
      // 1. Отримуємо дані користувача з відповіді бекенду
      const { data } = await nextServer.post(endpoint, values);

      //     І це саме те, що треба, бо nextServer має:
      // -	withCredentials: true
      // -	refresh interceptor
      // -	retry queue
      // тобто тепер кукі надсилаються

      // 2. ОЦЕЙ РЯДОК ВИПРАВЛЯЄ ТВОЮ ПРОБЛЕМУ:
      // Ми записуємо юзера в глобальний стан Zustand ПЕРЕД редиректом.
      // Тепер Header миттєво побачить, що isAuthenticated = true.
      setUser(data);

      // 3. Тепер переходимо
      router.push('/');

      // 4. Оновлюємо серверні компоненти (щоб layout побачив нові куки)
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
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.content}>
        <div className={styles.tabs}>
          <Link
            href="/register"
            className={`${styles.tab} ${isRegister ? styles.tabActive : ''}`}
          >
            Реєстрація
          </Link>
          <Link
            href="/login"
            className={`${styles.tab} ${!isRegister ? styles.tabActive : ''}`}
          >
            Вхід
          </Link>
        </div>

        <h1 className={styles.title}>{isRegister ? 'Реєстрація' : 'Вхід'}</h1>
        <p className={styles.subtitle}>
          {isRegister
            ? 'Раді вас бачити у спільноті мандрівників!'
            : 'Вітаємо знову у спільноті мандрівників!'}
        </p>

        <Formik<AuthValues>
          initialValues={initialValues}
          validationSchema={isRegister ? RegisterSchema : LoginSchema}
          onSubmit={handleSubmit}
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
              {isRegister && (
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
                    <span className={styles.errorText}>{errors.name}</span>
                  )}
                </label>
              )}

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
                  <span className={styles.errorText}>{errors.email}</span>
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
                  <span className={styles.errorText}>{errors.password}</span>
                )}
              </label>

              {status && <div className={styles.errorText}>{status}</div>}

              <button
                className={styles.button}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? '...'
                  : isRegister
                    ? 'Зареєструватись'
                    : 'Увійти'}
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
