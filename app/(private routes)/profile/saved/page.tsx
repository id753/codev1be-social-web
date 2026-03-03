import MessageNoStories from '@/components/Profile/MessageNoStories/MessageNoStories';
import TravellersStories from '@/components/TravellersStories/TravellersStories';
import { fetchFavouriteStoriesServer } from '@/lib/api/serverApi';
import type { Story } from '@/types/story';
import type { StoryCard } from '@/types/story';

function mapStoryToCard(story: Story): StoryCard {
  return {
    _id: story._id,
    title: story.title,
    article: story.article,
    img: story.img,
    ownerId: story.ownerId._id,
    category: story.category._id,
    date: story.date,
    favoriteCount: story.favoriteCount,
  };
}

export default async function SavedPage() {
  const data = await fetchFavouriteStoriesServer({
    page: 1,
    perPage: 9,
  });

  const stories = data.stories;

  if (!stories || stories.length === 0) {
    return (
      <MessageNoStories
        text="У вас ще немає збережених історій, мерщій збережіть вашу першу історію!"
        buttonText="До історій"
        href="/stories"
      />
    );
  }

  const storyCards = stories.map(mapStoryToCard);

  return (
    <TravellersStories
      stories={storyCards}
      usersMap={{}}
      categoryMap={{}}
      mode="default"
    />
  );
}
