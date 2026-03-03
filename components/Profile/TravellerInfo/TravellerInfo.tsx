import Image from "next/image";

import { User } from "@/types/user";
import css from "./TravellerInfo.module.css";

type Props = {
  traveller: User;
};

export default function ProfileTravellerInfo({ traveller }: Props) {
  const avatarSrc =
    traveller.avatarUrl && traveller.avatarUrl.startsWith("http")
      ? traveller.avatarUrl
      : "/svg/avatar.svg";

  return (
    <div className={css.card}>
      <div className={css.top}>
        <div className={css.avatar}>
          <Image
            src={avatarSrc}
            alt={traveller.name}
            width={120}
            height={120}
            className={css.avatarImg}
          />
        </div>

        <div className={css.info}>
          <h2 className={css.name}>{traveller.name}</h2>
          <p className={css.description}>
            {traveller.description ?? "Немає опису"}
          </p>
        </div>
      </div>

      
    </div>
  );
}