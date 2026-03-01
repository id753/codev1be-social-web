import { NextRequest, NextResponse } from 'next/server';
import serverApi from '@/app/api/api';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ storyId: string }> },
) {
  const { storyId } = await context.params;

  const res = await serverApi.post(`/stories/${storyId}/save`);

  return NextResponse.json(res.data);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ storyId: string }> },
) {
  const { storyId } = await context.params;

  await serverApi.delete(`/stories/${storyId}/save`);

  return new NextResponse(null, { status: 204 });
}
