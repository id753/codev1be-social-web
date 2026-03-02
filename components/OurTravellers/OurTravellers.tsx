'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import TravellersList from './TravellersList';
import Skeleton from '../Skeleton/Skeleton';

import { fetchUsers } from '@/lib/api/clientApi';
import { User } from '@/types/user';

import css from './OurTravellers.module.css';

export default function OurTravellers() {
  const [travellers, setTravellers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTravellers() {
      try {
        const data = await fetchUsers({
          page: 1,
          perPage: 4,
        });

        setTravellers(data.users);
      } catch (error) {
        console.error('Failed to load travellers', error);
      } finally {
        setLoading(false);
      }
    }

    loadTravellers();
  }, []);

  return (
    <div className="container">
      <section className={`section ${css.section}`}>
        <div className={css.inner}>
          <h2 className={css.title}>Наші Мандрівники</h2>
         
          <div className={css.grid}>
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} height={384}/>
              ))
              : <TravellersList travellers={travellers} />
            }
          </div>

          <Link href="/travellers" className={`${css.buttonBase} ${css.viewAllBtn}`}>
            Переглянути всіх
          </Link>
        </div>
      </section>
    </div>
  );
}
