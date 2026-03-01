import { NextRequest, NextResponse } from 'next/server';
// import serverApi from '@/app/api/api';
import { User } from '@/types/user';
import nextServer from '@/lib/api/api';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await nextServer.post<User>('api/auth/register', body);

  return NextResponse.json(res.data, { status: 201 });
}
