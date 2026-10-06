import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminConfig } from './config';

export async function adminClient() {
  const config = adminConfig();
  if (!config) return null;
  const jar = await cookies();
  return createServerClient(config.url, config.key, {
    cookieOptions: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' },
    cookies: {
      getAll: () => jar.getAll(),
      setAll(values) {
        // Proxy refreshes cookies when rendering a read-only Server Component.
        try { values.forEach(({ name, value, options }) => jar.set(name, value, options)); } catch { /* Read-only render. */ }
      },
    },
  });
}

// Called by every data loader and mutation, not only the layout.
export async function requireAdmin() {
  const config = adminConfig();
  const db = await adminClient();
  if (!config || !db) redirect('/admin/connexion');
  const { data: { user }, error } = await db.auth.getUser();
  if (error || !user || user.id !== config.userId || user.email?.toLowerCase() !== config.email) redirect('/admin/connexion');
  const { data: allowed, error: policyError } = await db.rpc('is_admin');
  if (policyError || allowed !== true) redirect('/admin/connexion?erreur=acces');
  return { db, user };
}
