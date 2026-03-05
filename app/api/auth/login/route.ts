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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await serverApi.post('/auth/login', body);

    const cookieStore = await cookies();
    const setCookieHeader = apiRes.headers['set-cookie'];

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

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { message: error.response?.data?.message || 'Authentication failed' },
        { status: error.response?.status || 401 },
      );
    }
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
