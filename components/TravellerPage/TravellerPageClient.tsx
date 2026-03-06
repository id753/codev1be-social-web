// 'use client';

// import { useState, useEffect, useCallback, useRef } from 'react';
// import Image from 'next/image';
// import TravellersStories from '../TravellersStories/TravellersStories';
// import { fetchStories } from '@/lib/api/clientApi';
// import { User } from '@/types/user';
// import { Story, StoryCard, StoryCardUser } from '@/types/story';
// import css from './TravellerPageClient.module.css';

// type Props = {
//   traveller: User;
//   allStories: Story[];
// };

// const getPerPage = () =>
//   typeof window !== 'undefined' && window.innerWidth >= 1440 ? 6 : 4;

// export default function TravellerPageClient({ traveller }: Props) {
//   const [stories, setStories] = useState<Story[]>([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [perPage, setPerPage] = useState(6);

//   const gridRef = useRef<HTMLDivElement | null>(null);
//   const prevLengthRef = useRef(0);

//   const updatePerPage = useCallback(() => {
//     const width = window.innerWidth;
//     setPerPage(width >= 1440 ? 6 : 4);
//   }, []);

//   useEffect(() => {
//     updatePerPage();
//     window.addEventListener('resize', updatePerPage);
//     return () => window.removeEventListener('resize', updatePerPage);
//   }, [updatePerPage]);

//   const loadStories = useCallback(
//     async (nextPage = 1) => {
//       setLoading(true);

//       try {
//         const data = await fetchStories({
//           ownerId: traveller._id,
//           page: nextPage,
//           perPage,
//         });

//         setStories((prev) =>
//           nextPage === 1 ? data.stories : [...prev, ...data.stories],
//         );

//         setPage(nextPage);
//         setTotalPages(data.totalPages);
//       } catch (err) {
//         console.error('Failed to load traveller stories', err);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [traveller._id, perPage],
//   );

//   useEffect(() => {
//     loadStories(1);
//   }, [loadStories]);

//   useEffect(() => {
//     const grid = gridRef.current;
//     if (!grid) return;

//     const prevLength = prevLengthRef.current;
//     const currentLength = stories.length;

//     if (currentLength <= prevLength) return;

//     const newCard = grid.children[prevLength];
//     if (newCard instanceof HTMLElement) {
//       newCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   }, [stories]);

//   const handleLoadMore = () => {
//     if (page < totalPages && !loading) {
//       prevLengthRef.current = stories.length;
//       loadStories(page + 1);
//     }
//   };

//   const storiesForCard: StoryCard[] = stories.map((story) => ({
//     ...story,
//     category:
//       typeof story.category === 'string'
//         ? story.category
//         : (story.category?._id ?? ''),
//     ownerId:
//       typeof story.ownerId === 'string'
//         ? story.ownerId
//         : (story.ownerId?._id ?? ''),
//     ownerUser: typeof story.ownerId === 'string' ? undefined : story.ownerId,
//   }));

//   const usersMap: Record<string, StoryCardUser> = {
//     [traveller._id]: {
//       _id: traveller._id,
//       name: traveller.name,
//       avatarUrl:
//         traveller.avatarUrl ??
//         'https://ac.goit.global/fullstack/react/default-avatar.jpg',
//     },
//   };

//   const hasMore = page < totalPages;

//   return (
//     <div className={css.inner}>
//       <div className={css.header}>
//         <div className={css.avatar}>
//           <Image
//             src={
//               traveller.avatarUrl ??
//               'https://ac.goit.global/fullstack/react/default-avatar.jpg'
//             }
//             alt={traveller.name}
//             width={199}
//             height={199}
//           />
//         </div>

//         <div className={css.info}>
//           <h2 className={css.name}>{traveller.name}</h2>
//           <p className={css.description}>{traveller.description}</p>
//         </div>
//       </div>

//       <h1 className={css.title}>Історії мандрівника</h1>

//       <div ref={gridRef}>
//         {storiesForCard.length > 0 && (
//           <>
//             <TravellersStories
//               stories={storiesForCard}
//               usersMap={usersMap}
//               categoryMap={{}}
//             />

//             {hasMore && (
//               <button
//                 type="button"
//                 className={`${css.buttonBase} ${css.viewAllBtn}`}
//                 onClick={handleLoadMore}
//                 disabled={loading}
//               >
//                 {loading ? 'Завантаження...' : 'Переглянути всі'}
//               </button>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TravellersStories from '../TravellersStories/TravellersStories';
import type { User } from '@/types/user';
import type { Story, StoryCard, StoryCardUser } from '@/types/story';
import css from './TravellerPageClient.module.css';

type Props = {
  traveller: User;
  allStories: Story[];
};

const getPerPage = () =>
  typeof window !== 'undefined' && window.innerWidth >= 1440 ? 6 : 4;

export default function TravellerPageClient({ traveller, allStories }: Props) {
  const [perPage, setPerPage] = useState(6);
  const [visibleCount, setVisibleCount] = useState(perPage);
  const prevLengthRef = useRef(0);
  const gridRef = useRef<HTMLDivElement>(null);

  // Визначаємо перPage адаптивно і початкове завантаження
  useEffect(() => {
    const update = () => setPerPage(getPerPage());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    setVisibleCount(perPage);
  }, [perPage]);

  // скрол до нових карток після підвантаження
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || visibleCount <= prevLengthRef.current) return;
    const newCard = grid.children[prevLengthRef.current];
    if (newCard instanceof HTMLElement) {
      newCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [visibleCount]);

  const handleLoadMore = () => {
    prevLengthRef.current = visibleCount;
    setVisibleCount((prev) => prev + perPage);
  };

  const storiesForCard: StoryCard[] = allStories
    .slice(0, visibleCount)
    .map((story) => ({
      ...story,
      category:
        typeof story.category === 'string'
          ? story.category
          : (story.category?._id ?? ''),
      ownerId:
        typeof story.ownerId === 'string'
          ? story.ownerId
          : (story.ownerId?._id ?? ''),
      ownerUser: typeof story.ownerId === 'string' ? undefined : story.ownerId,
    }));

  const usersMap: Record<string, StoryCardUser> = {
    [traveller._id]: {
      _id: traveller._id,
      name: traveller.name,
      avatarUrl:
        traveller.avatarUrl ??
        'https://ac.goit.global/fullstack/react/default-avatar.jpg',
    },
  };

  const hasMore = visibleCount < allStories.length;

  return (
    <div className={css.inner}>
      {/* Хедер */}
      <div className={css.header}>
        <div className={css.avatar}>
          <Image
            src={
              traveller.avatarUrl ??
              'https://ac.goit.global/fullstack/react/default-avatar.jpg'
            }
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

      {allStories.length === 0 ? (
        <div className={css.noStories}>
          <p>Цей користувач ще не публікував історій</p>
          <Link
            href="/travellers"
            className={`${css.buttonBase} ${css.backBtn}`}
          >
            Назад до історій
          </Link>
        </div>
      ) : (
        <div ref={gridRef}>
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
            >
              Показати ще
            </button>
          )}
        </div>
      )}
    </div>
  );
}
