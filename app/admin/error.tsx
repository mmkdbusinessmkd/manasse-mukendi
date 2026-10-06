'use client';
import s from './admin.module.css';
export default function ErrorPage({reset}:{reset:()=>void}){return <section className={s.panel} role="alert"><h1>Les données ne sont pas disponibles.</h1><p>Vérifiez la connexion et la configuration de l’espace privé. Vos informations n’ont pas été supprimées.</p><button className={s.primary} onClick={reset}>Réessayer</button><a className={s.backLink} href="/admin/connexion">Retour à la connexion</a></section>;}
