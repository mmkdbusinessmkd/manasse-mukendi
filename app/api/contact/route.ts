import { createHmac } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse, after } from 'next/server';
import { z } from 'zod';
import { requestSchema } from '../../../lib/contact-request';

export const runtime = 'nodejs';
const envelope = z.object({ id: z.string().uuid(), honey: z.string().max(200).default(''), data: requestSchema });
const reply = (message: string, status: number) => NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  // Next may use an internal hostname behind a proxy; compare with the incoming Host.
  let sameOrigin = false;
  try {
    const source = new URL(origin || '');
    sameOrigin = source.host === request.headers.get('host') &&
      (process.env.VERCEL ? source.protocol === 'https:' : ['http:', 'https:'].includes(source.protocol));
  } catch { /* Reject missing or malformed origins. */ }
  if (!sameOrigin) return reply('Origine non autorisée.', 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply('Format non accepté.', 415);
  // Bound streamed bodies, including requests without a Content-Length header.
  const reader = request.body?.getReader();
  if (!reader) return reply('Demande vide.', 400);
  let body = '', size = 0;
  const decoder = new TextDecoder();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 48000) { await reader.cancel(); return reply('Message trop long.', 413); }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
  } catch { return reply('Lecture impossible. Réessayez.', 400); }
  let payload: z.infer<typeof envelope>;
  try { payload = envelope.parse(JSON.parse(body)); } catch { return reply('Vérifiez les champs, notamment le numéro avec son indicatif pays.', 400); }
  if (payload.honey) return reply('Envoi refusé. Contactez-moi directement si le problème persiste.', 400);
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return reply('Le formulaire est momentanément indisponible. Contactez-moi par e-mail ou WhatsApp.', 503);
  const fingerprint = (value: string) => createHmac('sha256', key).update(value).digest('hex');
  // Vercel overwrites this header. Do not trust arbitrary client-supplied X-Forwarded-For.
  const ip = process.env.VERCEL ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() : 'local-preview';
  if (!ip) return reply('Envoi momentanément indisponible. Réessayez plus tard.', 503);
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(10000) }) } });
  try {
    const { data: created, error } = await db.rpc('receive_contact_request', {
      p_id: payload.id, p_hash: fingerprint(JSON.stringify(payload.data)), p_ip_hash: fingerprint(ip),
      p_email_hash: fingerprint(payload.data.email), p_data: payload.data,
    });
    if (error) {
      if (error.code === 'P0429') return reply('Plusieurs demandes ont déjà été envoyées. Réessayez dans une heure ou contactez-moi directement.', 429);
      if (error.code === '23505') return reply('Cette demande a changé. Revenez au formulaire avant de réessayer.', 409);
      return reply('Enregistrement non confirmé. Réessayez sans fermer cette page, ou contactez-moi directement.', 503);
    }
    // Keep the existing owner email alert as a best-effort supplement, not the source of truth.
    if (created === true) after(async () => {
      try {
        await fetch('https://formsubmit.co/ajax/contact@manasse-mukendi.com', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...payload.data, _subject: 'Nouvelle demande — site Manassé Mukendi', _template: 'table', reference: payload.id, espace_prive: `https://www.manasse-mukendi.com/admin/demandes/${payload.id}` }),
          signal: AbortSignal.timeout(8000),
        });
      } catch { /* The saved request remains available in the private inbox. */ }
    });
    return NextResponse.json({ success: true, reference: payload.id }, { status: created ? 201 : 200, headers: { 'Cache-Control': 'no-store' } });
  } catch { return reply('Enregistrement non confirmé. Réessayez sans fermer cette page, ou contactez-moi directement.', 503); }
}
