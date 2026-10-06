import { requireAdmin } from '../../../lib/admin/supabase';
import { signOut } from '../auth-actions';
import AdminNav from '../AdminNav';
import s from '../admin.module.css';
export default async function PrivateLayout({children}:{children:React.ReactNode}){
  await requireAdmin();
  return <div className={s.shell}><a className={s.skip} href="#gestion">Aller au contenu</a><aside className={s.sidebar}>
    <a href="/admin" className={s.brand}><img src="/images/brand/favicon-mm.png" width="36" height="36" alt=""/><span>Mon activité<small>Espace privé · Manassé Mukendi</small></span></a>
    <AdminNav/><div className={s.sidebarBottom}><a href="/">Voir le site public</a><form action={signOut}><button className={s.secondary}>Se déconnecter</button></form></div>
  </aside><div className={s.workspace}><header className={s.topbar}><span>Gestion freelance</span><form action="/admin/recherche" role="search"><label className={s.srOnly} htmlFor="admin-search">Rechercher</label><input id="admin-search" name="q" type="search" placeholder="Client, mission, tâche…" maxLength={160}/><button className={s.secondary}>Rechercher</button></form></header><main id="gestion" className={s.main}>{children}</main><footer className={s.footer}>Données privées · Dates affichées à l’heure de Kinshasa · Montants séparés par devise</footer></div></div>;
}
