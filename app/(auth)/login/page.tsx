import { getMeServer } from '@/lib/api/serverApi';
import { redirect } from 'next/navigation';
import AuthForm from '@/components/AuthForm/AuthForm';

export default async function LoginPage() {
  const user = await getMeServer();
  if (user) redirect('/');

  return <AuthForm type="login" />;
}
