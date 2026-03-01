import { NextRequest, NextResponse } from 'next/server';
import serverApi from '@/app/api/api';

export async function GET(req: NextRequest) {
  const res = await serverApi.get('/stories/me', {
    params: Object.fromEntries(req.nextUrl.searchParams),
  });

  return NextResponse.json(res.data);
}
