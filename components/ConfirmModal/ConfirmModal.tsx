'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
  title: string;
  text?: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  text,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onCancel]);

  if (typeof window === 'undefined') return null;

  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  return createPortal(
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <button type="button" className={styles.close} onClick={onCancel}>
          ×
        </button>

        <h2 className={styles.title}>{title}</h2>

        {text && <p className={styles.text}>{text}</p>}

        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onCancel}>
            {cancelButtonText}
          </button>

          <button type="button" className={styles.confirm} onClick={onConfirm}>
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>,
    modalRoot,
  );
}
