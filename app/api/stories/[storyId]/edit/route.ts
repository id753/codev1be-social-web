import { NextRequest, NextResponse } from 'next/server';

import serverApi, { ServerApiError } from '@/app/api/api';

import type { Story } from '@/types/story';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ storyId: string }> },
): Promise<NextResponse> {
  try {
    const { storyId } = await context.params;
    const formData = await req.formData();

    const res = await serverApi.patch<Story>(`/stories/${storyId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    const err = error as ServerApiError;

    return NextResponse.json(
      {
        message: err.response?.data?.message || 'Internal server error',
      },
      {
        status: err.response?.status || 500,
      },
    );
  }
}
