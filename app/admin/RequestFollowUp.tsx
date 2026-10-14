'use client';
import { useActionState } from 'react';
import { requestStatuses, RequestStatus } from '../../lib/contact-request';
import { updateRequest } from './request-actions';
import s from './admin.module.css';
export default function RequestFollowUp({ id, status, notes, version }: { id: string; status: RequestStatus; notes: string; version: string }) {
  const [state, action, pending] = useActionState(updateRequest.bind(null, id), { error: '', saved: false, version });
  return <form action={action} className={s.form}><label>Statut<select name="status" defaultValue={status}>{Object.entries(requestStatuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>Notes privées<textarea name="notes" defaultValue={notes} maxLength={5000} rows={5} placeholder="Votre prochain échange, les points à préciser…"/></label><p role="status" className={state.error ? s.error : s.meta}>{state.error || (state.saved ? 'Suivi enregistré.' : 'Ces notes restent dans votre espace privé.')}</p><button disabled={pending} className={s.primary}>{pending ? 'Enregistrement…' : 'Enregistrer le suivi'}</button></form>;
}
