// import { NextRequest, NextResponse } from 'next/server';
// import serverApi from '@/app/api/api';

// export async function POST(req: NextRequest) {
//   const body = await req.json();

//   const res = await serverApi.post('/auth/login', body);

//   return NextResponse.json(res.data);
// }

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { isAxiosError } from 'axios';
import serverApi from '@/app/api/api';

function extractCookieValue(setCookie: string, name: string) {
  const match = setCookie.match(new RegExp(`${name}=([^;]+)`));
  return match?.[1];
}
// работает

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const upstream = await serverApi.post('/auth/login', body);

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

    const response = NextResponse.json(upstream.data, { status: 200 });

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
  } catch (error) {
    return NextResponse.json({ message: 'Login failed' }, { status: 500 });
  }
}
