// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import serverApi from '@/app/api/api';
// import axios from 'axios';

// export async function GET() {
//   const store = await cookies();
//   console.log('users/me');

//   const hasAuth =
//     store.get('accessToken') ||
//     store.get('refreshToken') ||
//     store.get('sessionId');

//   // If user is logged out, don't call backend at all
//   if (!hasAuth) {
//     return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const cookieHeader = store
//       .getAll()
//       .filter((c) =>
//         ['accessToken', 'refreshToken', 'sessionId'].includes(c.name),
//       )
//       .map((c) => `${c.name}=${c.value}`)
//       .join('; ');
//     console.log('serverApi baseURL =', (serverApi as any).defaults.baseURL);
//     const res = await serverApi.get('/users/me', {
//       headers: cookieHeader ? { cookie: cookieHeader } : {},
//     });

//     return NextResponse.json(res.data, { status: res.status });
//   } catch (err) {
//     if (axios.isAxiosError(err)) {
//       return NextResponse.json(
//         err.response?.data ?? { message: 'Unauthorized' },
//         { status: err.response?.status ?? 500 },
//       );
//     }

//     return NextResponse.json({ message: 'Unknown error' }, { status: 500 });
//   }
// }
import { NextResponse } from 'next/server';
import serverApi from '@/app/api/api';
import { isAxiosError } from 'axios';

export async function GET() {
  try {
    const res = await serverApi.get('/users/me');
    return NextResponse.json(res.data, { status: 200 });
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      // 🚀 ПЕРЕМОГА: повертаємо 200 OK і null, якщо токена немає
      // Це зупинить інтерцептор і React Query від повторних спроб
      return NextResponse.json(null, { status: 200 });
    }
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}
