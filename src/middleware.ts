import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Check if the user is trying to access auth pages
  if (pathname.includes("/auth/")) {
    // If user has a token (authenticated), redirect to home page
    if (token) {
      const locale = pathname.split("/")[1] || routing.defaultLocale;
      const homeUrl = new URL(`/${locale}`, request.url);
      return NextResponse.redirect(homeUrl);
    }
  }

  // Protect payment pages
  if (pathname.includes("/payment/")) {
    if (!token) {
      const locale = pathname.split("/")[1] || routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/auth/login`, request.url);
      // Optional: Add redirect query param to return here after login
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Continue with next-intl middleware for all other cases
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
