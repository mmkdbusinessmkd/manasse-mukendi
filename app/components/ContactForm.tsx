'use client';
import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { ContactRequest, requestLabels, requestSchema, requestServices } from '../../lib/contact-request';
import { PILOT_PROGRAM_OPTION, SHOW_PILOT_PROGRAM } from '../../lib/pilot-program';
import { trackConversion } from '../../lib/conversion-analytics';
import { PilotProgramFields } from './PilotProgram';
import s from './ContactForm.module.css';

export default function ContactForm({ service, onServiceChange, icon }: { service: string; onServiceChange: (value: string) => void; icon: ReactNode }) {
  const [draft, setDraft] = useState<ContactRequest | null>(null);
  const [receipt, setReceipt] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [id, setId] = useState('');
  const busy = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const pilot = SHOW_PILOT_PROGRAM && service === PILOT_PROGRAM_OPTION;
  useEffect(() => { if (draft) heading.current?.focus(); }, [draft, receipt]);
  // Service CTAs can change the selection while a recap is open.
  useEffect(() => { if (!busy.current) { setDraft(null); setReceipt(''); setMessage(''); } }, [service]);
  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = requestSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message === 'Indiquez votre numéro avec son indicatif pays, par exemple +243…' ? parsed.error.issues[0].message : 'Vérifiez les champs du formulaire avant de continuer.');
      return;
    }
    setMessage(''); setId(crypto.randomUUID()); setDraft(parsed.data);
  }
  async function send() {
    if (!draft || busy.current) return;
    busy.current = true; setSending(true); setMessage('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, data: draft, honey: String(new FormData(form.current!).get('_honey') || '') }),
        signal: AbortSignal.timeout(18000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error(result.error || 'Enregistrement non confirmé. Réessayez ou contactez-moi directement.');
      setReceipt(result.reference); trackConversion('Contact request accepted');
    } catch (error) {
      setMessage(error instanceof Error && error.name !== 'TimeoutError' && error.name !== 'TypeError' ? error.message : 'La confirmation n’a pas pu être reçue. Réessayez sans fermer cette page : la même demande ne sera pas enregistrée deux fois.');
    } finally { busy.current = false; setSending(false); }
  }
  return <div className={s.container}>
    <form ref={form} aria-label="Présenter mon projet" onSubmit={review} hidden={!!draft} className={draft ? s.hidden : undefined}>
      <input className="honeypot" type="text" name="_honey" aria-hidden="true" tabIndex={-1} autoComplete="off"/>
      <label><span>Nom</span><input name="name" autoComplete="name" placeholder="Votre nom" minLength={2} maxLength={160} required/></label>
      <label><span>E-mail</span><input name="email" type="email" autoComplete="email" placeholder="votre@email.com" maxLength={254} required/></label>
      <label><span>Téléphone / WhatsApp</span><input name="phone" type="tel" autoComplete="tel" placeholder="+243… ou votre indicatif pays" maxLength={40} required aria-describedby="phone-help"/><small id="phone-help">Avec l’indicatif pays. Indiquez votre numéro WhatsApp si vous l’utilisez.</small></label>
      <label><span>Votre besoin principal</span><select name="service" required value={service} onChange={e => onServiceChange(e.target.value)}><option disabled value="">Choisir un accompagnement</option>{requestServices.map(v => <option key={v}>{v}</option>)}{SHOW_PILOT_PROGRAM && <option value={PILOT_PROGRAM_OPTION}>{PILOT_PROGRAM_OPTION}</option>}</select></label>
      {pilot ? <PilotProgramFields/> : <label className="full"><span>Parlez-moi de votre projet</span><textarea name="message" required maxLength={5000} rows={5} placeholder="Votre entreprise, votre besoin et, si vous les connaissez, votre échéance et votre budget…"/></label>}
      <div className="form-end"><p>Vos coordonnées et votre message seront enregistrés dans mon espace privé pour traiter votre demande et vous recontacter. Ils ne sont pas affichés publiquement.</p><button className="button dark">Vérifier ma demande {icon}</button></div>
    </form>
    {draft && <div className={s.summary}>
      <p className={s.step}>{receipt ? 'DEMANDE REÇUE' : 'AVANT L’ENVOI'}</p>
      <h3 ref={heading} tabIndex={-1}>{receipt ? 'Merci pour votre confiance.' : 'Tout est correct ?'}</h3>
      <p>{receipt ? 'Votre demande a bien été enregistrée. Je vous recontacterai personnellement par e-mail ou sur WhatsApp pour échanger sur votre projet.' : 'Relisez votre demande et vos coordonnées. Vous pouvez encore les modifier avant de confirmer.'}</p>
      {receipt && <p className={s.reference}>Référence : {receipt}</p>}
      <dl>{(Object.entries(requestLabels) as [keyof ContactRequest, string][]).filter(([key]) => draft[key]).map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{draft[key]}</dd></div>)}</dl>
      {draft.service === PILOT_PROGRAM_OPTION && <p>Seules 2 entreprises seront sélectionnées. L’envoi d’une candidature ne garantit pas une place.</p>}
      {!receipt && <div className={s.actions}><button type="button" className={s.edit} disabled={sending} onClick={() => { setDraft(null); setMessage(''); window.requestAnimationFrame(() => form.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus()); }}>Modifier</button><button type="button" className="button dark" disabled={sending} onClick={send}>{sending ? 'Enregistrement…' : 'Confirmer l’envoi'} {icon}</button></div>}
      {receipt && <button className={s.edit} type="button" onClick={() => { form.current?.reset(); setDraft(null); setReceipt(''); setMessage(''); onServiceChange(''); }}>Faire une autre demande</button>}
    </div>}
    {message && <p className={s.error} role="alert">{message}</p>}
  </div>;
}
