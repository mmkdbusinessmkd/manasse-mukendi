import 'server-only';

export function adminConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  const userId = process.env.ADMIN_USER_ID;
  const email = process.env.ADMIN_EMAIL;
  if (!url || !key || !userId || !email) return null;
  if (!/^https:\/\//.test(url) || !/^[0-9a-f-]{36}$/i.test(userId)) return null;
  return { url, key, userId, email: email.trim().toLowerCase() };
}
