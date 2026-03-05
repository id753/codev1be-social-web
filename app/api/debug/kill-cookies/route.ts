import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.json({ ok: true });

  // localhost => http => secure must be false
  const opts = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };

  res.cookies.set('accessToken', '', opts);
  res.cookies.set('refreshToken', '', opts);
  res.cookies.set('sessionId', '', opts);

  return res;
}
