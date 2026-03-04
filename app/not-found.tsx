import css from './not-found.module.css';
import LinkButton from '@/components/LinkButton/LinkButton';
import Image from 'next/image';
import { Metadata } from 'next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),

  title: 'Сторінку не знайдено',
  description: 'Сторінка, яку ви шукаєте, не існує або була видалена.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <>
      <Header />
      <div className={`container ${css.container}`}>
        <div className={css.messageContainer}>
          <div className={css.StatusCode}>
            <Image
              src="/svg/logo.svg"
              alt="Лого 'Подорожники'"
              width={60}
              height={60}
              priority
              className={css.logoIcon}
            />
            <h1 className={css.messageError}>404</h1>
          </div>
          <h2 className={css.messageTitle}>Сторінку не знайдено</h2>
        </div>
        <p>Вибачте, такої сторінки не існує</p>
        <LinkButton
          href="/"
          className={css.link}
          text="Повернутися на головну"
        />
      </div>
      <Footer />
    </>
  );
}
