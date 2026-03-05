// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import serverApi from '@/app/api/api';

export async function POST() {
  const cookieHeader = (await cookies())
    .getAll()
    .filter((c) =>
      ['accessToken', 'refreshToken', 'sessionId'].includes(c.name),
    )
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  // даже если backend logout упадёт — мы всё равно чистим cookies на фронте
  try {
    await serverApi.post('/auth/logout', null, {
      headers: cookieHeader ? { cookie: cookieHeader } : {},
    });
  } catch (e) {
    if (!axios.isAxiosError(e)) {
      // ignore
    }
  }

  const secure = process.env.NODE_ENV === 'production';
  const res = new NextResponse(null, { status: 204 });

  // delete reliably (match path + sameSite + secure)
  res.cookies.set('accessToken', '', {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  res.cookies.set('refreshToken', '', {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  res.cookies.set('sessionId', '', {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return res;
}
