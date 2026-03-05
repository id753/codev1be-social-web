export type CategoryItem = {
  id: string;
  name: string;
};

export const CATEGORY_ITEMS: CategoryItem[] = [
  { id: '68fb50c80ae91338641121f2', name: 'Європа' },
  { id: '68fb50c80ae91338641121f0', name: 'Азія' },
  { id: '68fb50c80ae91338641121f6', name: 'Пустелі' },
  { id: '68fb50c80ae91338641121f4', name: 'Африка' },
  { id: '68fb50c80ae91338641121f3', name: 'Америка' },
  { id: '68fb50c80ae91338641121f1', name: 'Гори' },
  { id: '68fb50c80ae91338641121f7', name: 'Балкани' },
  { id: '68fb50c80ae91338641121f8', name: 'Кавказ' },
  { id: '68fb50c80ae91338641121f9', name: 'Океанія' },
];

export const CATEGORIES: CategoryItem[] = [
  { id: 'all', name: 'Всі історії' },
  ...CATEGORY_ITEMS,
];

export const CATEGORY_MAP: Record<string, string> = CATEGORY_ITEMS.reduce(
  (acc, { id, name }) => {
    acc[id] = name;
    return acc;
  },
  {} as Record<string, string>,
);
