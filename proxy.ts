import { NextRequest, NextResponse } from "next/server";
import { refreshAdminSession } from "./lib/admin/session";

const legacyHost = "manasse-mukendi.vercel.app";
const canonicalHost = "www.manasse-mukendi.com";

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase().split(":")[0];

  if (host === legacyHost) {
    const destination = request.nextUrl.clone();
    destination.protocol = "https:";
    destination.host = canonicalHost;
    return NextResponse.redirect(destination, 308);
  }

  if (request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin/')) {
    return refreshAdminSession(request);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
