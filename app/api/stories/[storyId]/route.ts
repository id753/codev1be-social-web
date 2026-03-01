import { NextRequest, NextResponse } from 'next/server';
import serverApi from '@/app/api/api';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ storyId: string }> },
) {
  const { storyId } = await context.params;

  const res = await serverApi.get(`/stories/${storyId}`);

  return NextResponse.json(res.data);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ storyId: string }> },
) {
  const { storyId } = await context.params;

  const formData = await req.formData();

  const res = await serverApi.patch(`/stories/${storyId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return NextResponse.json(res.data);
}
