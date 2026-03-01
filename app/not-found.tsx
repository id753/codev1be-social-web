import css from './not-found.module.css';
import LinkButton from '@/components/LinkButton/LinkButton';
import Logo from '@/components/Logo/Logo';
import { Metadata } from 'next';

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
    <div className={`container ${css.container}`}>
      <div className={css.messageContainer}>
        <div className={css.StatusCode}>
          <Logo />
          <h1 className={css.messageError}>404</h1>
        </div>
        <h2 className={css.messageTitle}>Сторінку не знайдено</h2>
      </div>
      <p>Вибачте, такої сторінки не існує</p>
      <LinkButton href="/" className={css.link} text="Повернутися на головну" />
    </div>
  );
}
