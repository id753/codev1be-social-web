import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { checkServerSession } from "./lib/api/serverApi";

const privateRoutes = ['/profile', '/stories/create'];
const publicRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPrivateRoute =
    privateRoutes.some((route) => pathname.startsWith(route)) ||
    /^\/stories\/[^/]+\/edit$/.test(pathname);

  // ACCESS TOKEN Є
  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  }

  // ACCESS TOKEN НЕМАЄ, АЛЕ Є REFRESH TOKEN
  if (!accessToken && refreshToken) {
    const data = await checkServerSession();
    const setCookies = data.headers.getSetCookie();

    if (setCookies.length > 0) {
      const response = NextResponse.next();

      for (const cookieStr of setCookies) {
        const parsed = parse(cookieStr);

        const options = {
          expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
          path: parsed.Path ?? '/',
          maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
          httpOnly: true,
        };

        if (parsed.accessToken) {
          response.cookies.set('accessToken', parsed.accessToken, options);
        }

        if (parsed.refreshToken) {
          response.cookies.set('refreshToken', parsed.refreshToken, options);
        }

        if (parsed.sessionId) {
          response.cookies.set('sessionId', parsed.sessionId, options);
        }
      }

      if (isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      return response;
    }
  }

  // НЕ АВТОРИЗОВАНИЙ
  if (isPrivateRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/stories/create',
    '/stories/:storyId/edit',
    '/login',
    '/register',
  ],
};
