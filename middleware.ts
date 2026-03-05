import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  const isAuthenticated = Boolean(accessToken || refreshToken);

  const { pathname } = req.nextUrl;

  const isProtectedRoute =
    pathname.startsWith('/profile') ||
    pathname === '/stories/create' ||
    /^\/stories\/[^/]+\/edit$/.test(pathname);

  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/stories/create', '/stories/:storyId/edit'],
};
