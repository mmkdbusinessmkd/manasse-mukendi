'use client';
import { useActionState } from 'react';
import { resendRequestNotification } from './request-actions';
import s from './admin.module.css';

export default function RequestNotification({ id }: { id: string }) {
  const [state, action, pending] = useActionState(resendRequestNotification.bind(null, id), { error: '', accepted: false });
  return <details className={s.notificationTools}>
    <summary>Recevoir cette demande par e-mail <span aria-hidden="true">+</span></summary>
    <p>Renvoyez l’alerte vers vos deux adresses. Elle contient le résumé et le lien vers cette fiche.</p>
    <form action={action}><button type="submit" className={s.secondary} disabled={pending}>{pending ? 'Envoi en cours…' : 'Renvoyer l’alerte'}</button></form>
    {state.error && <p role="alert" className={s.error}>{state.error}</p>}
    {state.accepted && <p role="status" className={s.notice}>Le service d’e-mail a accepté l’alerte pour vos deux adresses. Pensez à vérifier les courriers indésirables.</p>}
  </details>;
}
