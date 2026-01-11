import type { NextRequest } from "next/server";
import { handleProxyRequest } from "@/lib/i18n/proxy-handlers";

/**
 * i18n Proxy (Middleware)
 * Handles locale detection, redirection, and static file serving
 */
export function proxy(request: NextRequest) {
  return handleProxyRequest(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes (/api/*)
     * - Next.js internals (/_next/*)
     */
    "/((?!api|_next).*)",
  ],
};
