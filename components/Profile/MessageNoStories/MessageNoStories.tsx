import Link from "next/link";
import styles from "./MessageNoStories.module.css";

type Props = {
  text: string;
  buttonText: string;
  href: string;
};

export default function MessageNoStories({ text, buttonText, href }: Props) {
  return (
    <div className={styles.box}>
      <p className={styles.text}>{text}</p>
      <Link className={styles.btn} href={href}>
        {buttonText}
      </Link>
    </div>
  );
}