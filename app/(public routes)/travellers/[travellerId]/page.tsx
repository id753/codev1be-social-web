import TravellerPageClient from "@/components/TravellerPage/TravellerPageClient";
import { getTravellerById } from "@/lib/api/travellers-api";

type Props = { params: { travellerId: string } };

export default async function TravellerPage({ params }: Props) {
  const traveller = await getTravellerById(params.travellerId);

  return <TravellerPageClient traveller={traveller} />;
}