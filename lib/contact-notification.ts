import 'server-only';
import { ContactRequest, requestLabels } from './contact-request';

const site = 'https://www.manasse-mukendi.com';
const recipient = 'contact@manasse-mukendi.com';
type Result = { accepted: boolean; attempts: number; reason?: 'configuration' | 'activation_required' | 'rejected' | 'unavailable' };
type Transport = { fetch?: typeof fetch; wait?: (ms: number) => Promise<void>; idempotencyKey?: string };

/** Server-only owner alerts. A saved request remains valid if the mail provider is unavailable. */
export async function notifyRequestOwner(id: string, data: ContactRequest, transport: Transport = {}): Promise<Result> {
  // Reuse the owner's private login setting; never publish the personal address in site code.
  const ownerEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!ownerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail)) return { accepted: false, attempts: 0, reason: 'configuration' };
  const send = transport.fetch || fetch;
  const wait = transport.wait || ((ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms)));
  const fields = Object.fromEntries(Object.entries(requestLabels).filter(([key]) => data[key as keyof ContactRequest]).map(([key, label]) => [label, data[key as keyof ContactRequest]]));
  const requestUrl = `${site}/admin/demandes/${encodeURIComponent(id)}`;
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const sender = process.env.CONTACT_EMAIL_FROM?.trim();
  if (resendKey && (!sender || /[\r\n]/.test(sender))) return { accepted: false, attempts: 0, reason: 'configuration' };
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (resendKey) {
    headers.Authorization = `Bearer ${resendKey}`;
    headers['Idempotency-Key'] = transport.idempotencyKey || `contact-request/${id}`;
  }
  const body = JSON.stringify(resendKey ? {
    from: sender, to: [...new Set([recipient, ownerEmail])], reply_to: data.email,
    subject: `Nouvelle demande — ${data.service} — ${id.slice(0, 8)}`,
    text: `Nouvelle demande sur votre site\n\n${Object.entries(fields).map(([label, value]) => `${label} : ${value}`).join('\n\n')}\n\nRéférence : ${id}\n\nOuvrir la demande dans votre espace privé :\n${requestUrl}`,
  } : { ...fields, email: data.email, reference: id,
    espace_prive: requestUrl,
    _subject: `Nouvelle demande — ${data.service}`, _template: 'table', _replyto: data.email,
    // FormSubmit requires the original form URL for server-side submissions without a browser referrer.
    _url: `${site}/`, ...(ownerEmail !== recipient ? { _cc: ownerEmail } : {}),
  });
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await send(resendKey ? 'https://api.resend.com/emails' : `https://formsubmit.co/ajax/${recipient}`, {
        method: 'POST', headers,
        body, signal: AbortSignal.timeout(8000),
      });
      const answer = await response.json().catch(() => null);
      const accepted = resendKey ? typeof answer?.id === 'string' && Boolean(answer.id) : answer?.success === true || answer?.success === 'true';
      if (response.ok && accepted) return { accepted: true, attempts: attempt };
      if (resendKey && [401, 403].includes(response.status)) return { accepted: false, attempts: attempt, reason: 'configuration' };
      if (typeof answer?.message === 'string' && /activat|confirm your email/i.test(answer.message)) return { accepted: false, attempts: attempt, reason: 'activation_required' };
      const concurrent = resendKey && response.status === 409 && answer?.name === 'concurrent_idempotent_requests';
      if (response.status < 500 && ![408, 429].includes(response.status) && !concurrent) return { accepted: false, attempts: attempt, reason: 'rejected' };
    } catch { /* Retry bounded network failures. Never log the visitor's personal details. */ }
    if (attempt < 3) await wait(attempt === 1 ? 250 : 1000);
  }
  return { accepted: false, attempts: 3, reason: 'unavailable' };
}
