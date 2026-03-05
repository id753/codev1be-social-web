// import { NextResponse } from 'next/server';
// import serverApi from '@/app/api/api';

// export async function POST() {
//   const res = await serverApi.post('/auth/refresh');

//   return NextResponse.json(res.data);
// }
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { isAxiosError } from 'axios';
import serverApi from '@/app/api/api';
import { User } from '@/types/user';
import { logErrorResponse } from '../../_utils/utils';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json(null, { status: 200 });
  }

  try {
    const res = await serverApi.get<User>('/users/me');
    return NextResponse.json(res.data, { status: 200 });
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401 && refreshToken) {
      try {
        const refreshRes = await serverApi.post<User>('/auth/refresh', {});

        const setCookieHeader = refreshRes.headers['set-cookie'];
        if (setCookieHeader) {
          const cookieArray = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];
          for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);
            const allKeys = Object.keys(parsed);
            const cookieName = allKeys[0];
            const cookieValue = parsed[cookieName];

            if (!cookieName || !cookieValue) continue;

            cookieStore.set(cookieName, cookieValue, {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path || '/',
              maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax' as const,
            });
          }
        }

        return NextResponse.json(refreshRes.data, { status: 200 });
      } catch (refreshError) {
        if (isAxiosError(refreshError)) {
          logErrorResponse(refreshError.response?.data);
        }
        return NextResponse.json(null, { status: 200 });
      }
    }

    if (isAxiosError(error)) {
      if (error.response?.status !== 401) {
        logErrorResponse(error.response?.data);
      }
    } else {
      logErrorResponse({ message: (error as Error).message });
    }

    return NextResponse.json(null, { status: 200 });
  }
}
