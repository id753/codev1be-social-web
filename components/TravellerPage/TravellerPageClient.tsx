'use client';

import { useState, useEffect, useCallback } from "react";
import TravellerInfo from "../OurTravellers/TravellerInfo";
import TravellersStories from "../TravellersStories/TravellersStories";
import MessageNoStories from "../MessageNoStories/MessageNoStories";
import { getTravellersStories } from "@/lib/api/travellers-api";
import { User } from "@/types/user";
import { Story } from "@/types/story";

interface Props {
  traveller: User;
}

export default function TravellerPageClient({ traveller }: Props) {
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [perPage, setPerPage] = useState(6); // default для десктопа

  // Визначаємо кількість карточок на сторінку в залежності від ширини
  const updatePerPage = () => {
    const width = window.innerWidth;
    if (width >= 1440) {
      setPerPage(6);
    } else {
      setPerPage(4);
    }
  };

  useEffect(() => {
    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  const fetchStories = useCallback(async (nextPage = 1) => {
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
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}, [traveller._id, perPage]);

  // Перший запит після визначення perPage
  useEffect(() => {
  fetchStories(1);
}, [fetchStories]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      fetchStories(page + 1);
    }
  };

  return (
    <section>
      <TravellerInfo traveller={traveller} />

      <h2>Історії Мандрівника</h2>

      {stories.length === 0 && !loading ? (
        <MessageNoStories />
      ) : (
        <>
          <TravellersStories
            stories={stories}
            usersMap={{ [traveller._id]: traveller }}
            categoryMap={{}}
            favoriteStories={[]}
            loadingStoryId={null}
            onBookmarkClick={() => {}}
          />

          {page < totalPages && (
            <button onClick={handleLoadMore} disabled={loading}>
              {loading ? "Завантаження..." : "Показати ще"}
            </button>
          )}
        </>
      )}
    </section>
  );
}