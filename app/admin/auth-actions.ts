'use server';
import { redirect } from 'next/navigation';
import { adminConfig } from '../../lib/admin/config';
import { adminClient } from '../../lib/admin/supabase';

export type AuthState = { error: string };
export async function signIn(_: AuthState, form: FormData): Promise<AuthState> {
  const config = adminConfig();
  const db = await adminClient();
  if (!config || !db) return { error: 'La connexion sécurisée n’est pas encore configurée.' };
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');
  if (email.length > 254 || password.length > 1024 || !email || !password) return { error: 'Vérifie tes identifiants.' };
  // Supabase enforces persistent authentication rate limits. No public sign-up.
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error || data.user?.id !== config.userId || email !== config.email) {
    if (data.session) await db.auth.signOut();
    return { error: 'Connexion impossible. Vérifie tes identifiants ou réessaie dans quelques minutes.' };
  }
  const { data: allowed, error: policyError } = await db.rpc('is_admin');
  if (policyError || allowed !== true) {
    await db.auth.signOut();
    return { error: 'L’accès privé n’est pas encore autorisé pour ce compte.' };
  }
  redirect('/admin');
}

export async function signOut() {
  const db = await adminClient();
  if (db) await db.auth.signOut();
  redirect('/admin/connexion');
}
