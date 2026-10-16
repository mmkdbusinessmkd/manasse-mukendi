'use client';

import { useEffect, useId, useState } from 'react';
import s from './install-app.module.css';

type InstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

export default function InstallApp({ dark = false }: { dark?: boolean }) {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(false);
  const [help, setHelp] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const helpId = useId();

  useEffect(() => {
    const media = window.matchMedia('(display-mode: standalone)');
    const checkMode = () => setInstalled(media.matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    const available = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPrompt);
    };
    const complete = () => { setInstalled(true); setPrompt(null); };
    checkMode();
    media.addEventListener('change', checkMode);
    window.addEventListener('beforeinstallprompt', available);
    window.addEventListener('appinstalled', complete);
    return () => {
      media.removeEventListener('change', checkMode);
      window.removeEventListener('beforeinstallprompt', available);
      window.removeEventListener('appinstalled', complete);
    };
  }, []);

  async function install() {
    if (!prompt) { setHelp(value => !value); return; }
    setBusy(true);
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      setMessage(choice.outcome === 'accepted'
        ? 'Installation demandée. Suivez la confirmation de votre navigateur.'
        : 'Installation annulée. Vous pouvez continuer à utiliser cet espace dans votre navigateur.');
    } catch {
      setHelp(true);
      setMessage('Utilisez le menu de votre navigateur pour installer cet espace.');
    } finally { setPrompt(null); setBusy(false); }
  }

  if (installed) return null;
  return <section className={`${s.card} ${dark ? s.dark : ''}`} aria-label="Installation de l’application">
    <div className={s.identity}>
      <img src="/images/brand/app-192.png" width="40" height="40" alt="" />
      <div><strong>Mon activité</strong><span>Votre espace, dans sa propre fenêtre.</span></div>
    </div>
    <button type="button" className={s.install} onClick={install} disabled={busy}
      aria-expanded={!prompt ? help : undefined} aria-controls={!prompt ? helpId : undefined}>
      {busy ? 'Installation…' : 'Installer l’application'}
    </button>
    <p className={s.note}>Connexion Internet nécessaire. Votre accès reste privé.</p>
    {message && <p className={s.message} role="status">{message}</p>}
    <div id={helpId} hidden={!help} className={s.help}>
      <strong>Sur votre ordinateur</strong>
      <p>Ouvrez cet espace dans Chrome ou Edge, puis utilisez l’icône d’installation dans la barre d’adresse, si elle apparaît.</p>
      <p>Sinon, ouvrez le menu ⋯ d’Edge : <b>Autres outils → Applications → Installer ce site en tant qu’application</b>. Le nom des menus peut varier selon la version.</p>
      <p>Adresse à ouvrir : <a href="https://www.manasse-mukendi.com/admin">manasse-mukendi.com/admin</a></p>
      <p>Vous retrouverez « Mon activité » parmi vos applications. Vous pourrez l’épingler à la barre des tâches. La connexion habituelle reste nécessaire.</p>
      <p>Sur iPhone : ouvrez cette adresse dans Safari, puis <b>Partager → Sur l’écran d’accueil</b>.</p>
      <p>Déjà installée ? Ouvrez-la depuis le menu Démarrer de votre ordinateur.</p>
    </div>
  </section>;
}
