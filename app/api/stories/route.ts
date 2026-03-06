import { NextRequest, NextResponse } from 'next/server';
import serverApi, { ServerApiError } from '@/app/api/api';
import { StoriesHttpResponse } from '@/lib/api/clientApi';
import { Story } from '@/types/story';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const page = req.nextUrl.searchParams.get('page');

    const perPage = req.nextUrl.searchParams.get('perPage');

    const category = req.nextUrl.searchParams.get('category');

    const res = await serverApi.get<StoriesHttpResponse>(
      '/stories',

      {
        params: {
          page,
          perPage,
          ...(category ? { category } : {}),
        },
      },
    );

    return NextResponse.json(res.data);
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

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // 1. Отримуємо FormData від фронтенду (картинка + текст)
    const formData = await req.formData();

    // 2. Пересилаємо ці дані на реальний бекенд Render
    // serverApi автоматично додасть куки через твій interceptor
    const res = await serverApi.post<Story>('/stories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Повертаємо створену історію
    return NextResponse.json(res.data, { status: 201 });
  } catch (error) {
    const err = error as ServerApiError;
    return NextResponse.json(
      { message: err.response?.data?.message || 'Failed to create story' },
      { status: err.response?.status || 500 },
    );
  }
}
