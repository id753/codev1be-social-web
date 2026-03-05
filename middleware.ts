import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { checkServerSession } from "./lib/api/serverApi";

const privateRoutes = [
  "/profile",
  "/stories/create",
];

const publicRoutes = [
  "/login",
  "/register",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPrivateRoute =
    privateRoutes.some((route) => pathname.startsWith(route)) ||
    /^\/stories\/[^/]+\/edit$/.test(pathname);

  // ACCESS TOKEN Є
  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // ACCESS TOKEN НЕМАЄ, АЛЕ Є REFRESH
  if (!accessToken && refreshToken) {
    const data = await checkServerSession();
    const setCookie = data.headers["set-cookie"];

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie)
        ? setCookie
        : [setCookie];

      for (const cookieStr of cookieArray) {
        const parsed = parse(cookieStr);

        const options = {
          expires: parsed.Expires
            ? new Date(parsed.Expires)
            : undefined,
          path: parsed.Path,
          maxAge: Number(parsed["Max-Age"]),
        };

        if (parsed.accessToken) {
          cookieStore.set("accessToken", parsed.accessToken, options);
        }

        if (parsed.refreshToken) {
          cookieStore.set("refreshToken", parsed.refreshToken, options);
        }
      }

      if (isPublicRoute) {
        return NextResponse.redirect(new URL("/", request.url), {
          headers: { Cookie: cookieStore.toString() },
        });
      }

      return NextResponse.next({
        headers: { Cookie: cookieStore.toString() },
      });
    }
  }

  // НЕ АВТОРИЗОВАНИЙ
  if (isPrivateRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/stories/create",
    "/stories/:storyId/edit",
    "/login",
    "/register",
  ],
};
