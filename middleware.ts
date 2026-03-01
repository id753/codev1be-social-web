import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  const { pathname } = req.nextUrl;

  // user is authenticated if at least one token exists
  const isAuthenticated = Boolean(accessToken || refreshToken);

  // PRIVATE ROUTES
  const isPrivateRoute =
    pathname.startsWith('/profile') ||
    pathname === '/stories/create' ||
    pathname === '/edit' ||
    (pathname.startsWith('/stories/') && pathname.endsWith('/edit'));

  // GUEST ONLY ROUTES
  const isGuestRoute =
    pathname === '/login' ||
    pathname === '/register';

  // guest → private → login
  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // auth → guest pages → home
  if (isAuthenticated && isGuestRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile',
    // '/stories/create',
    '/stories/:storyId/edit',
    '/edit',
    '/login',
    '/register',
  ],
};