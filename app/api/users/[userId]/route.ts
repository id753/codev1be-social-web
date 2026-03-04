import { NextRequest, NextResponse } from 'next/server';
import serverApi from '@/app/api/api';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ travellerId: string }> },
) {
  const { travellerId } = await context.params;

  const res = await serverApi.get(`/users/${travellerId}`);

  return NextResponse.json(res.data);
}
