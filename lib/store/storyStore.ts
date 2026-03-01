import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CreateStoryData } from '@/types/story';

const initialDraft: CreateStoryData = {
  title: '',
  article: '',
  category: '',
};
interface StoryStore {
  draft: CreateStoryData;
  setDraft: (story: Partial<CreateStoryData>) => void;
  clearDraft: () => void;
}

export const useStoryStore = create<StoryStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (story) =>
        set((prev) => ({ draft: { ...prev.draft, ...story } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    { name: 'story-draft' },
  ),
);
