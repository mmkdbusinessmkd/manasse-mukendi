import { adminConfig } from '../../../lib/admin/config';
import LoginForm from './LoginForm';
import styles from '../admin.module.css';

export default function LoginPage() {
  const ready = Boolean(adminConfig());
  return <main className={styles.login}>
    <div className={styles.loginCard}>
      {/* Existing brand artwork, never replacement initials. */}
      <img src="/images/brand/favicon-mm.png" width="48" height="48" alt="Manassé Mukendi" />
      <p className={styles.eyebrow}>ESPACE PERSONNEL</p>
      <h1>Ton activité,<br />en toute clarté.</h1>
      <p>Clients, missions et paiements. Un espace réservé à la gestion de ton activité freelance.</p>
      {!ready && <p className={styles.notice} role="status">Espace en préparation. La connexion sera disponible après l’activation de la base de données sécurisée. Aucune donnée client n’est accessible ici.</p>}
      <LoginForm enabled={ready} />
      <a className={styles.backLink} href="/">Retour au site public</a>
    </div>
    <aside className={styles.loginAside}><span>01 / ORGANISER</span><h2>Moins de dispersion.<br />Plus de visibilité.</h2><p>Le bon suivi, pour te concentrer sur ce qui compte : tes projets.</p><small>Accès privé · Aucun compte public</small></aside>
  </main>;
}
