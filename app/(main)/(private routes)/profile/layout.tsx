import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile Page',
  description: 'My profile',
  openGraph: {
    title: 'Profile Page',
    description: 'My profile',
    url: 'https://08-zustand-valeriia-makushchenko.vercel.app/',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Note Hub',
      },
    ],
  },
};
interface ProfileLayoutProps {
  children: React.ReactNode;
}
function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div>
      <div>{children}</div>
    </div>
  );
}
export default ProfileLayout;
