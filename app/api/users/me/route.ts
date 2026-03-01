import { NextRequest, NextResponse } from 'next/server';
import serverApi from '@/app/api/api';

export async function GET() {
  const res = await serverApi.get('/users/me');

  return NextResponse.json(res.data);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();

  const res = await serverApi.patch('/users/me', body);

  return NextResponse.json(res.data);
}
