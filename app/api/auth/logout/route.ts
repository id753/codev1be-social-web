import { NextResponse } from 'next/server';
import serverApi from '@/app/api/api';

export async function POST() {
  await serverApi.post('/auth/logout');

  return new NextResponse(null, {
    status: 204,
  });
}
