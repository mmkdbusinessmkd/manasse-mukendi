'use client';
import { useActionState } from 'react';
import { signIn } from '../auth-actions';
import styles from '../admin.module.css';

export default function LoginForm({ enabled }: { enabled: boolean }) {
  const [state, action, pending] = useActionState(signIn, { error: '' });
  return <form action={action} className={styles.form}>
    <label>Adresse e-mail<input name="email" type="email" autoComplete="username" required maxLength={254} disabled={!enabled || pending} /></label>
    <label>Mot de passe<input name="password" type="password" autoComplete="current-password" required maxLength={1024} disabled={!enabled || pending} /></label>
    {state.error && <p role="alert" className={styles.error}>{state.error}</p>}
    <button className={styles.primary} disabled={!enabled || pending}>{pending ? 'Connexion…' : 'Se connecter'}</button>
  </form>;
}
