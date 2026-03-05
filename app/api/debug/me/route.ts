import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const upstream = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
    {
      headers: {
        cookie: req.headers.get('cookie') ?? '',
      },
      cache: 'no-store',
    },
  );

  const text = await upstream.text();

  return NextResponse.json(
    {
      upstreamStatus: upstream.status,
      upstreamBody: text.slice(0, 500),
      cookieSentLength: (req.headers.get('cookie') ?? '').length,
    },
    { status: 200 },
  );
}
