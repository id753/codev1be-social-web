'use client';

import React, { useState } from 'react';
import axios from 'axios';
import css from './StoryDetails.module.css';

type StoryDetailsProps = {
  storyId: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const StoryDetails = ({ storyId }: StoryDetailsProps) => {
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.post(
        `${BASE_URL}/api/stories/${storyId}/save`,
        {},
        {
          withCredentials: true,
        },
      );

      setSaved(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message;

        if (status === 401) {
          setError('Ваша сесія закінчилася або ви не авторизовані.');
        } else {
          setError(message || 'Помилка збереження');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={css.saveContainer}>
      <h2 className={css.titleSaveContainer}>Збережіть собі історію</h2>
      <p className={css.textSaveContainer}>
        Вона буде доступна у вашому профілі у розділі збережене
      </p>

      <button
        onClick={handleSave}
        disabled={isLoading || saved}
        className={`${css.buttonSaveContainer} ${saved ? css.buttonSaved : ''}`}
      >
        {isLoading ? 'Збереження...' : saved ? '✓ Збережено' : 'Зберегти'}
      </button>

      {error && (
        <p
          className={css.errorMessage}
          style={{ color: 'red', marginTop: '10px' }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default StoryDetails;
