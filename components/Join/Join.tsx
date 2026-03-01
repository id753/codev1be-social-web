import css from './Join.module.css';
import Link from 'next/link';

export default function Join() {
  return (
    <section id="join" className={css.section}>
      <div className={`container ${css.container}`}>
        <div className={css.contentContainer}>
          <h2 className={css.sectionHeading}>
            Приєднуйтесь до нашої спільноти
          </h2>
          <p className={css.sectionParagraph}>
            Долучайтеся до мандрівників, які діляться своїми історіями та
            надихають на нові пригоди.
          </p>
          <Link className={css.registerBtn} href="/register">
            Зареєструватися
          </Link>
        </div>
      </div>
    </section>
  );
}
