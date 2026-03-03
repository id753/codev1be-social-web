import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CreateStoryData } from '@/types/story';

const initialDraft: CreateStoryData = {
  title: '',
  article: '',
  category: '',
  img: null,
};

interface StoryStore {
  draft: CreateStoryData;
  setDraft: (data: Partial<CreateStoryData>) => void;
  clearDraft: () => void;
}

export const useStoryStore = create<StoryStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (data) =>
        set((prev) => ({ draft: { ...prev.draft, ...data } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    { name: 'story-draft' },
  ),
);
