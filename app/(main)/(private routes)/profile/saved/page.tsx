import { redirect } from 'next/navigation';
import TravellersStories from '@/components/TravellersStories/TravellersStories';
import { getMeServer, fetchFavouriteStoriesServer } from '@/lib/api/serverApi';
import serverApi from '@/app/api/api';
import Link from 'next/link';
import css from './ProfileSavedStories.module.css';

import type { StoryCard, StoryCardUser, Category } from '@/types/story';

const PER_PAGE = 4;

function buildUsersMap(stories: StoryCard[]): Record<string, StoryCardUser> {
  const map: Record<string, StoryCardUser> = {};

  for (const story of stories) {
    if (story.ownerUser && story.ownerId) {
      map[story.ownerId] = story.ownerUser;
    }
  }

  return map;
}

async function buildCategoryMap(): Promise<Record<string, string>> {
  const { data } = await serverApi.get<Category[]>('/categories');

  return (data ?? []).reduce<Record<string, string>>((acc, c) => {
    acc[c._id] = c.name;
    return acc;
  }, {});
}

export default async function SavedStoriesPage() {
  // const user = await getMeServer();
  // if (!user) redirect('/login');

  const [{ stories }, categoryMap] = await Promise.all([
    fetchFavouriteStoriesServer({ page: 1, perPage: PER_PAGE }),
    buildCategoryMap(),
  ]);

  const storyCards = stories as unknown as StoryCard[];
  const usersMap = buildUsersMap(storyCards);
  if (storyCards.length === 0) {
    return (
      <div className={css.noStories}>
        <p>
          У вас ще немає збережених історій, мершій збережіть вашу першу
          історію!
        </p>
        <Link href="/stories" className={css.backBtn}>
          До історій
        </Link>
      </div>
    );
  }
  return (
    <TravellersStories
      stories={storyCards}
      usersMap={usersMap}
      categoryMap={categoryMap}
      mode="default"
    />
  );
}
