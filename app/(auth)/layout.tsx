import css from './AuthLayout.module.css';
import Logo from '@/components/Logo/Logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const year = new Date().getFullYear();

  return (
    <div className={css.layout}>
      <header className={css.header}>
        <div className="container">
          <Logo />
        </div>
      </header>
      <main className={css.main}>
        <div className="container">{children}</div>
      </main>
      <footer className={css.footer}>
        <div className="container">
          <p className={css.copyright}>© {year} Подорожники</p>
        </div>
      </footer>
    </div>
  );
}
