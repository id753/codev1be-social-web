import { NextRequest, NextResponse } from 'next/server';
import serverApi from '@/app/api/api';
import axios from 'axios';
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ storyId: string }> },
) {
  const { storyId } = await context.params;

  const res = await serverApi.get(`/stories/${storyId}`);

  return NextResponse.json(res.data);
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ storyId: string }> },
) {
  const { storyId } = await ctx.params;

  const formData = await req.formData();
  const cookie = req.headers.get('cookie') ?? '';

  try {
    const res = await serverApi.patch(`/stories/${storyId}`, formData, {
      headers: {
        cookie,
        // НЕ ставим Content-Type — axios сам выставит boundary
      },
    });

    return NextResponse.json(res.data);
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return NextResponse.json(
        e.response?.data ?? { message: 'Request failed' },
        {
          status: e.response?.status ?? 500,
        },
      );
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
