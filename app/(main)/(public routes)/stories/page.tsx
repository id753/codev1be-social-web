import StoriesPage from '@/components/StoriesPage/StoriesPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Історії'
}

export default function StoriesPageRoute() {
  return <StoriesPage />;
}
