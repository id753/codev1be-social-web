import { NextResponse } from 'next/server';
import serverApi from '@/app/api/api';

export async function GET() {
  const res = await serverApi.get('/stories/popular');

  return NextResponse.json(res.data);
}
