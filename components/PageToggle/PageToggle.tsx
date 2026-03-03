"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./PageToggle.module.css";

export default function PageToggle() {
  const pathname = usePathname();

  const isSaved = pathname === "/profile" || pathname.startsWith("/profile/saved");
  const isOwn = pathname.startsWith("/profile/own");

  return (
    <div className={css.wrap}>
      <Link
        href="/profile/saved"
        className={
          isSaved ? `${css.tab} ${css.active}` : css.tab
        }
      >
        Збережені історії
      </Link>

      <Link
        href="/profile/own"
        className={
          isOwn ? `${css.tab} ${css.active}` : css.tab
        }
      >
        Мої історії
      </Link>
    </div>
  );
}