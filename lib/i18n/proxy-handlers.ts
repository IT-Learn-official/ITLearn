import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Locale } from "./config";
import { getLocaleFromRequest, LOCALE_COOKIE_NAME } from "./locale-detection";
import {
  addLocalePrefix,
  getLocaleFromPathname,
  hasFileExtension,
  hasLocalePrefix,
  stripLocalePrefix,
} from "./pathname-utils";

export function handleStaticFile(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (!hasFileExtension(pathname)) {
    return null;
  }

  const locale = getLocaleFromPathname(pathname);
  if (locale) {
    const newPathname = stripLocalePrefix(pathname);
    request.nextUrl.pathname = newPathname;
    return NextResponse.rewrite(request.nextUrl);
  }

  return NextResponse.next();
}

export function handleLocaleRedirect(
  request: NextRequest
): NextResponse | null {
  const { pathname } = request.nextUrl;

  if (hasLocalePrefix(pathname)) {
    const locale = getLocaleFromPathname(pathname);
    if (locale) {
      const response = NextResponse.next();
      response.cookies.set(LOCALE_COOKIE_NAME, locale, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        sameSite: "lax",
      });
      return response;
    }
    return null;
  }

  const locale = getLocaleFromRequest(request);
  const newPathname = addLocalePrefix(pathname, locale as Locale);
  request.nextUrl.pathname = newPathname;

  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });
  return response;
}

export function handleProxyRequest(request: NextRequest): NextResponse {
  const staticResponse = handleStaticFile(request);
  if (staticResponse) {
    return staticResponse;
  }

  const localeResponse = handleLocaleRedirect(request);
  if (localeResponse) {
    return localeResponse;
  }

  return NextResponse.next();
}
