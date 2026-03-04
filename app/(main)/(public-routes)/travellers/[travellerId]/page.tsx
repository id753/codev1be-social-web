import TravellerPageClient from '@/components/TravellerPage/TravellerPageClient';
import serverApi from '@/app/api/api';
import css from '@/components/TravellerPage/TravellerPageClient.module.css';

type Props = {
  params: Promise<{ travellerId: string }>;
};

export default async function TravellerPage({ params }: Props) {
  const { travellerId } = await params;

  const { data: traveller } = await serverApi.get(`/users/${travellerId}`);

  return (
    <main>
      <div className="container">
        <div className={`section ${css.section} ${css.sectionPadding}`}>
          <TravellerPageClient traveller={traveller} />
        </div>
      </div>
    </main>
  );
}