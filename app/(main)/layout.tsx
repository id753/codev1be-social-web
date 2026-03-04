import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { getMeServer } from '@/lib/api/serverApi';
import { User } from '@/types/user';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: User | null = null;

  try {
    user = await getMeServer();
  } catch {
    user = null;
  }

  return (
    <>
      <Header />
      {/* <Header user={user} /> */}
      <main>{children}</main>
      {/* <Footer user={user} /> */}
      <Footer />
    </>
  );
}
