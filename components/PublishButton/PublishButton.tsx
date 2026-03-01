import Link from 'next/link';
import css from './PublishButton.module.css';

interface PublishButtonProps {
  isDark?: boolean;
}

function PublishButton({ isDark }: PublishButtonProps) {
  return (
    <Link
      href="/stories/create"
      className={isDark ? css.publishBtnDark : css.publishBtnLight}
    >
      Опублікувати історію
    </Link>
  );
}

export default PublishButton;
