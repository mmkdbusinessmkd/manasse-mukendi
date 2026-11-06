import 'server-only';
import { ContactRequest, requestLabels } from './contact-request';

const site = 'https://www.manasse-mukendi.com';
const recipient = 'contact@manasse-mukendi.com';
type Result = { accepted: boolean; attempts: number; reason?: 'configuration' | 'activation_required' | 'rejected' | 'unavailable' };
type Transport = { fetch?: typeof fetch; wait?: (ms: number) => Promise<void> };

/** Server-only owner alerts. A saved request remains valid if the mail provider is unavailable. */
export async function notifyRequestOwner(id: string, data: ContactRequest, transport: Transport = {}): Promise<Result> {
  // Reuse the owner's private login setting; never publish the personal address in site code.
  const ownerEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!ownerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail)) return { accepted: false, attempts: 0, reason: 'configuration' };
  const send = transport.fetch || fetch;
  const wait = transport.wait || ((ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms)));
  const fields = Object.fromEntries(Object.entries(requestLabels).filter(([key]) => data[key as keyof ContactRequest]).map(([key, label]) => [label, data[key as keyof ContactRequest]]));
  const body = JSON.stringify({ ...fields, email: data.email, reference: id,
    espace_prive: `${site}/admin/demandes/${id}`,
    _subject: `Nouvelle demande — ${data.service}`, _template: 'table', _replyto: data.email,
    // FormSubmit requires the original form URL for server-side submissions without a browser referrer.
    _url: `${site}/`, ...(ownerEmail !== recipient ? { _cc: ownerEmail } : {}),
  });
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await send(`https://formsubmit.co/ajax/${recipient}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body, signal: AbortSignal.timeout(8000),
      });
      const answer = await response.json().catch(() => null);
      if (response.ok && (answer?.success === true || answer?.success === 'true')) return { accepted: true, attempts: attempt };
      if (typeof answer?.message === 'string' && /activat|confirm your email/i.test(answer.message)) return { accepted: false, attempts: attempt, reason: 'activation_required' };
      if (response.status < 500 && ![408, 429].includes(response.status)) return { accepted: false, attempts: attempt, reason: 'rejected' };
    } catch { /* Retry bounded network failures. Never log the visitor's personal details. */ }
    if (attempt < 3) await wait(attempt === 1 ? 250 : 1000);
  }
  return { accepted: false, attempts: 3, reason: 'unavailable' };
}
