import { NextRequest, NextResponse } from 'next/server';
import serverApi from '@/app/api/api';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  const { userId } = await context.params;

  const res = await serverApi.get(`/users/${userId}`);

  return NextResponse.json(res.data);
}
