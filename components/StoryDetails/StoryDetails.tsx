'use client';

import React, { useState, useEffect } from 'react';
import css from './StoryDetails.module.css';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';
import { useRouter } from 'next/navigation';
import { addToFavouriteStory, getMe } from '@/lib/api/clientApi';
import axios from 'axios';
import { toast } from 'react-hot-toast';

type StoryDetailsProps = {
  storyId: string;
};

const StoryDetails = ({ storyId }: StoryDetailsProps) => {
  const router = useRouter();

  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const checkSaved = async () => {
      try {
        const user = await getMe();

        const isAlreadySaved = user.savedArticles?.includes(storyId) ?? false;

        setSaved(isAlreadySaved);
      } catch {
        setSaved(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkSaved();
  }, [storyId]);

  const handleSave = async () => {
    if (saved || isLoading) return;

    setIsLoading(true);

    try {
      await addToFavouriteStory(storyId);

      setSaved(true);

      toast.success('Історію збережено');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 401) {
          setIsAuthModalOpen(true);
          return;
        }

        if (status === 409) {
          setSaved(true);
          return;
        }
      }

      toast.error('Не вдалося зберегти історію');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * щоб не мигала кнопка
   */
  if (isChecking) {
    return (
      <div className={css.saveContainer}>
        <button disabled className={css.buttonSaveContainer}>
          ...
        </button>
      </div>
    );
  }

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

      {isAuthModalOpen && (
        <ConfirmModal
          title="Потрібна авторизація"
          text="Щоб зберегти цю історію, вам необхідно увійти у свій акаунт."
          confirmButtonText="Увійти"
          cancelButtonText="Скасувати"
          onConfirm={() => router.push('/login')}
          onCancel={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
};

export default StoryDetails;
