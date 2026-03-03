import { NextResponse } from 'next/server';

import serverApi, { ServerApiError } from '@/app/api/api';

export async function GET(): Promise<NextResponse> {
  try {
    const res = await serverApi.get('/categories');

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
