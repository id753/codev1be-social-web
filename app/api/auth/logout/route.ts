// import { NextResponse } from 'next/server';
// import serverApi from '@/app/api/api';

// export async function POST() {
//   await serverApi.post('/auth/logout');

//   return new NextResponse(null, {
//     status: 204,
//   });
// }
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import serverApi from '@/app/api/api';

export async function POST() {
  const cookieStore = await cookies();

  try {
    await serverApi.post('/auth/logout');
  } catch (error) {
    console.error('Logout error on backend', error);
  }

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('sessionId');

  return NextResponse.json({ message: 'Logged out' });
}
