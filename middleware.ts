import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;

  const { pathname } = req.nextUrl;

  const isAuthenticated = Boolean(accessToken || refreshToken);

  // GUEST ONLY ROUTES
  const isGuestRoute = pathname === '/login' || pathname === '/register';

  // Якщо авторизований — не пускати на login/register
  if (isAuthenticated && isGuestRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile',
    '/stories/create',
    '/stories/:storyId/edit',
    '/edit',
    '/login',
    '/register',
  ],
};
