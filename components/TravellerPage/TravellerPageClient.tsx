'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import TravellersStories from "../TravellersStories/TravellersStories";
import { getTravellersStories } from "@/lib/api/travellers-api";
import { User } from "@/types/user";
import { Story, StoryCard, StoryCardUser } from "@/types/story";
import css from "./TravellerPageClient.module.css";

type Props = {
  traveller: User;
};

export default function TravellerPageClient({ traveller }: Props) {
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(6);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const prevLengthRef = useRef(0);

  // Визначаємо кількість карток по ширині
  const updatePerPage = useCallback(() => {
    const width = window.innerWidth;
    setPerPage(width >= 1440 ? 6 : 4);
  }, []);

  useEffect(() => {
    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, [updatePerPage]);

  // Фетч історій
  const fetchStories = useCallback(
    async (nextPage = 1) => {
      setLoading(true);
      try {
        const data = await getTravellersStories({
          travellerId: traveller._id,
          page: nextPage,
          perPage,
        });

        setStories(prev =>
          nextPage === 1 ? data.stories : [...prev, ...data.stories]
        );

        setPage(nextPage);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Failed to load traveller stories", err);
      } finally {
        setLoading(false);
      }
    },
    [traveller._id, perPage]
  );

  // Початкове завантаження
  useEffect(() => {
    fetchStories(1);
  }, [fetchStories]);

  // Скрол до нових карток
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const prevLength = prevLengthRef.current;
    const currentLength = stories.length;

    if (currentLength <= prevLength) return;

    const newCard = grid.children[prevLength];
    if (newCard instanceof HTMLElement) {
      newCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [stories]);

  // Обробка кнопки "Переглянути всі"
  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      prevLengthRef.current = stories.length;
      fetchStories(page + 1);
    }
  };

  // Підготовка даних для TravellersStories
  const storiesForCard: StoryCard[] = stories.map(story => ({
    ...story,
    category: typeof story.category === "string" ? story.category : story.category.name,
    ownerId: typeof story.ownerId === "string" ? story.ownerId : story.ownerId._id,
  }));

  const usersMap: Record<string, StoryCardUser> = {
    [traveller._id]: {
      _id: traveller._id,
      name: traveller.name,
      avatarUrl: traveller.avatarUrl ?? "/default-avatar.png",
    },
  };

  const hasMore = page < totalPages;

  return (
    <div className={css.inner} ref={gridRef}>
      <div className={css.header}>
        <div className={css.avatar}>
          <Image
            src={traveller.avatarUrl ?? "/default-avatar.png"}
            alt={traveller.name}
            width={199}
            height={199}
          />
        </div>
        <div className={css.info}>
          <h2 className={css.name}>{traveller.name}</h2>
          <p className={css.description}>{traveller.description}</p>
        </div>
      </div>

      <h1 className={css.title}>Історії мандрівника</h1>

      {storiesForCard.length > 0 && (
        <>
          <TravellersStories
            stories={storiesForCard}
            usersMap={usersMap}
            categoryMap={{}}
          />

          {hasMore && (
            <button
              type="button"
              className={`${css.buttonBase} ${css.viewAllBtn}`}
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? "Завантаження..." : "Переглянути всі"}
            </button>
          )}
        </>
      )}
    </div>
  );
}