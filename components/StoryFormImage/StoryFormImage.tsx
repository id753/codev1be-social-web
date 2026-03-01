'use client';

import css from './StoryFormImage.module.css';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Skeleton from '../Skeleton/Skeleton';

interface StoryFormImageProps {
  onFileSelect: (file: File | null) => void;
  initialFile?: File | string | null;
}

const StoryFormImage = ({ onFileSelect, initialFile }: StoryFormImageProps) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialFile instanceof File) {
      const url = URL.createObjectURL(initialFile);
      setPreviewUrl(url);
      setLoading(true);
      return () => URL.revokeObjectURL(url);
    }

    if (typeof initialFile === 'string') {
      setPreviewUrl(initialFile);
      setLoading(false);
      return;
    }

    setPreviewUrl('');
    setLoading(false);
  }, [initialFile]);

  return (
    <>
      <div className={css.imageCover}>
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            priority
            quality={90}
            onLoadingComplete={() => setLoading(false)}
            onError={() => setLoading(false)}
          />
        ) : (
          <Image
            src="/img/placeholder-image.jpg"
            alt="Preview"
            fill
            priority
            quality={90}
          />
        )}

        {loading && <Skeleton />}
      </div>

      <label className={css.labelBtn}>
        Завантажити фото
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;

            if (file && !file.type.startsWith('image/')) {
              alert('Завантажити можна лише зображення');
              onFileSelect(null);
              return;
            }

            onFileSelect(file);
          }}
          className={css.hiddenInput}
        />
      </label>
    </>
  );
};

export default StoryFormImage;
