import { redirect } from 'next/navigation';
const ProfilePage = async () => {
  redirect('/profile/saved');
  return null;
};

export default ProfilePage;
