import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const h = await headers();

  return NextResponse.json({
    host: h.get('host'),
    cookieHeaderFromRequest: h.get('cookie') ?? null,
    cookiesParsedByNext: cookieStore.getAll().map((c) => ({
      name: c.name,
      // value не показываю целиком, чтобы не утекло — оставим длину
      valueLength: c.value.length,
    })),
  });
}
