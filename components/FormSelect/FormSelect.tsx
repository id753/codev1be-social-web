// components/FormSelect/FormSelect.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import css from './FormSelect.module.css';

const SPRITE = '/svg/icons.svg';

type IconProps = { id: string; className?: string };
function Icon({ id, className }: IconProps) {
  return (
    <svg className={className || css.socialIcon} aria-hidden="true">
      <use href={`${SPRITE}#${id}`} />
    </svg>
  );
}

export interface Option {
  value: string; // categoryId
  label: string; // categoryName
}

interface SelectProps {
  options: Option[];
  value: string; // categoryId
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function FormSelect({
  options,
  value,
  onChange,
  placeholder = 'Категорія',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedLabel = useMemo(() => {
    return options.find((o) => o.value === value)?.label ?? '';
  }, [options, value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={`${css.simpleSelect} ${isOpen ? css.active : ''}`}
    >
      <div className={css.header} onClick={() => setIsOpen((p) => !p)}>
        <span className={!value ? css.placeholder : ''}>
          {value ? selectedLabel : placeholder}
        </span>

        <span className={css.arrow}>
          <Icon id="down" />
        </span>
      </div>

      {isOpen && (
        <div className={css.options}>
          {options.map((opt) => (
            <div
              key={opt.value}
              className={css.option}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
