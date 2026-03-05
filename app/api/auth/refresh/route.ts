import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import serverApi from '@/app/api/api';

function extractCookieValue(setCookie: string, name: string) {
  const match = setCookie.match(new RegExp(`${name}=([^;]+)`));
  return match?.[1];
}

export async function POST() {
  try {
    const cookieHeader = (await cookies())
      .getAll()
      // можно отфильтровать лишнее, чтобы не слать __next_hmr_refresh_hash__
      .filter((c) =>
        ['accessToken', 'refreshToken', 'sessionId'].includes(c.name),
      )
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

    const upstream = await serverApi.post(
      '/auth/refresh',
      {},
      { headers: cookieHeader ? { cookie: cookieHeader } : {} },
    );

    // забираем Set-Cookie от backend
    const setCookie = upstream.headers['set-cookie'] ?? [];
    const arr = Array.isArray(setCookie) ? setCookie : [setCookie];

    const accessRaw = arr
      .map((s) => extractCookieValue(s, 'accessToken'))
      .find(Boolean);
    const refreshRaw = arr
      .map((s) => extractCookieValue(s, 'refreshToken'))
      .find(Boolean);
    const sessionRaw = arr
      .map((s) => extractCookieValue(s, 'sessionId'))
      .find(Boolean);

    const access = accessRaw ? decodeURIComponent(accessRaw) : undefined;
    const refresh = refreshRaw ? decodeURIComponent(refreshRaw) : undefined;
    const session = sessionRaw ? decodeURIComponent(sessionRaw) : undefined;

    const secure = process.env.NODE_ENV === 'production';

    const response = NextResponse.json(upstream.data, {
      status: upstream.status,
    });

    // IMPORTANT: обновляем cookies на домене фронта
    if (access) {
      response.cookies.set('accessToken', access, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
      });
    }
    if (refresh) {
      response.cookies.set('refreshToken', refresh, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
      });
    }
    if (session) {
      response.cookies.set('sessionId', session, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
      });
    }

    return response;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        err.response?.data ?? { message: 'Unauthorized' },
        { status: err.response?.status ?? 401 },
      );
    }
    return NextResponse.json({ message: 'Refresh failed' }, { status: 500 });
  }
}
