'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/lib/store/authStore';
import nextServer from '@/lib/api/api';
import styles from './AuthForm.module.css';

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
  name: Yup.string()
    .trim()
    .max(32, 'Максимум 32 символи')
    .required("Обов'язково"),
  email: Yup.string()
    .email('Невірний email')
    .max(64, 'Максимум 64 символи')
    .required("Обов'язково"),
  password: Yup.string()
    .min(8, 'Мінімум 8 символів')
    .max(138, 'Максимум 138 символів')
    .required("Обов'язково"),
});

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Невірний email').required("Обов'язково"),
  password: Yup.string().required("Обов'язково"),
});

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const isRegister = type === 'register';

  const initialValues: AuthValues = {
    email: '',
    password: '',
    ...(isRegister ? { name: '' } : {}),
  };

  const handleSubmit = async (
    values: AuthValues,
    helpers: FormikHelpers<AuthValues>,
  ) => {
    helpers.setStatus(null);
    const endpoint = type === 'register' ? '/auth/register' : '/auth/login';

    try {
      const { data } = await nextServer.post(endpoint, values);
      setUser(data);

      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      let msg = 'Сталася помилка';
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || err.message;
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
                  ? 'Завантаження...'
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
