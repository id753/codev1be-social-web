import Image from "next/image";
import Link from "next/link";
import { User } from "@/types/user";
import css from "./OurTravellers.module.css";

interface Props {
  traveller: User;
}

export default function TravellerInfo({ traveller }: Props) {
  return (
    <div className={css.card}>
      <div className={css.avatar}>
        <Image
          src={traveller.avatarUrl ?? "/default-avatar.png"}
          alt={traveller.name}
          width={112}
          height={112}
        />
      </div>

      <h3 className={css.name}>{traveller.name}</h3>

      <p className={css.description}>
        {traveller.description ?? "Немає опису"}
      </p>

      <Link
        href={`/travellers/${traveller._id}`}
        className={`${css.buttonBase} ${css.profileButton}`}
      >
        Переглянути профіль
      </Link>
    </div>
  );
}