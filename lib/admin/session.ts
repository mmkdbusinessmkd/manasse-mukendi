import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { adminConfig } from './config';

export async function refreshAdminSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const config = adminConfig();
  const login = request.nextUrl.pathname === '/admin/connexion';
  let allowed = false;
  if (config) {
    const db = createServerClient(config.url, config.key, {
      cookieOptions: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(values) {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    try {
      const { data: { user }, error } = await db.auth.getUser();
      allowed = !error && user?.id === config.userId && user?.email?.toLowerCase() === config.email;
    } catch { allowed = false; }
  }
  if (!login && !allowed) {
    const destination = request.nextUrl.clone();
    destination.pathname = '/admin/connexion';
    destination.search = '';
    const redirected = NextResponse.redirect(destination);
    response.cookies.getAll().forEach(cookie => redirected.cookies.set(cookie));
    response = redirected;
  }
  response.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  response.headers.set('Referrer-Policy', 'no-referrer');
  response.headers.set('X-Frame-Options', 'DENY');
  return response;
}
