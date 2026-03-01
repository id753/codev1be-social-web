import { NextRequest, NextResponse } from 'next/server';
import serverApi from '@/app/api/api';

export async function PATCH(req: NextRequest) {
  const formData = await req.formData();

  const res = await serverApi.patch('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return NextResponse.json(res.data);
}
