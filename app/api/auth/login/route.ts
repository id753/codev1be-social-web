import { NextRequest, NextResponse } from 'next/server';
import serverApi from '@/app/api/api';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await serverApi.post('/auth/login', body);

  return NextResponse.json(res.data);
}
