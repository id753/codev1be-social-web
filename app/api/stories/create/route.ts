import { NextRequest, NextResponse } from 'next/server';

import serverApi, { ServerApiError } from '@/app/api/api';

import type { Story } from '@/types/story';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();

    const res = await serverApi.post<Story>('/stories', formData, {
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
