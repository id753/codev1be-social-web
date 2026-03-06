import { NextRequest, NextResponse } from 'next/server';
import { checkServerSession } from './lib/api/serverApi';

const authRoutes = ['/login', '/register'];

function isPrivatePath(pathname: string) {
  if (pathname.startsWith('/profile')) return true;
  if (pathname === '/stories/create') return true;
  if (pathname.startsWith('/stories/') && pathname.endsWith('/edit'))
    return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrefetch =
    request.headers.get('next-router-prefetch') === '1' ||
    request.headers.get('purpose') === 'prefetch';

  if (isPrefetch) return NextResponse.next();

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = isPrivatePath(pathname);

  if (accessToken) {
    if (isAuthRoute) return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
  }

  if (refreshToken) {
    try {
      const responseFromApi = await checkServerSession();
      const newCookies = responseFromApi.headers['set-cookie'];

      if (newCookies) {
        const cookieArray = Array.isArray(newCookies)
          ? newCookies
          : [newCookies];

        const response = isAuthRoute
          ? NextResponse.redirect(new URL('/', request.url))
          : NextResponse.next();

        cookieArray.forEach((cookie) => {
          response.headers.append('set-cookie', cookie);
        });

        return response;
      }
    } catch {}
  }

  if (isPrivateRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/stories/create', '/stories/:storyId/edit'],
};
