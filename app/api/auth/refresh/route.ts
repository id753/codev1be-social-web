import { NextResponse } from 'next/server';
import serverApi from '@/app/api/api';

export async function POST() {
  const res = await serverApi.post('/auth/refresh');

  return NextResponse.json(res.data);
}
