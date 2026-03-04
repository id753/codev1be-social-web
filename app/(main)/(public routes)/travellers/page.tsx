'use client';
import TravellersPageClient from "@/components/Travellers/TravellersPageClient";
import css from "@/components/OurTravellers/OurTravellers.module.css"

export default function TravellersPage() {
  return (
    <main>
      <div className="container">
        <div className={`section ${css.section} ${css.sectionPadding}`}>
          <h1 className={css.pageTitle}>Мандрівники</h1>
          <TravellersPageClient />
        </div>
      </div>
    </main>
  );
}