import Link from 'next/link';
import { listRequests } from '../../../../lib/admin/requests';
import { requestStatuses } from '../../../../lib/contact-request';
import { dateLabel } from '../../../../lib/admin/model';
import { PageHeading, Empty } from '../../Views';
import s from '../../admin.module.css';

export default async function Page({ searchParams }: { searchParams: Promise<{ statut?: string; page?: string }> }) {
  const params = await searchParams;
  const status = Object.hasOwn(requestStatuses, params.statut || '') ? params.statut! : '';
  const page = Math.max(1, Math.min(10000, Number.parseInt(params.page || '1') || 1));
  const { rows, count } = await listRequests(status, page);
  const pageLink = (p: number) => `/admin/demandes?${new URLSearchParams({ statut: status, page: String(p) })}`;
  return <>
    <PageHeading title="Demandes reçues" description="Les demandes envoyées depuis votre site, à qualifier avant de démarrer une mission."/>
    <form className={s.filters}><label>Statut<select name="statut" defaultValue={status}><option value="">Toutes les demandes</option>{Object.entries(requestStatuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><button className={s.primary}>Filtrer</button></form>
    <section className={s.panel}><h2>{count} demande{count > 1 ? 's' : ''}</h2>{rows.length ? <ul className={s.records}>{rows.map(row => <li key={row.id}><div><Link href={`/admin/demandes/${row.id}`} className={s.recordTitle}>{row.name}</Link><p className={s.meta}>{row.service}</p><small>{dateLabel(row.created_at)}</small></div><div className={s.recordEnd}><span className={s.badge}>{requestStatuses[row.status]}</span><Link href={`/admin/demandes/${row.id}`} className={s.textLink}>Lire et répondre</Link></div></li>)}</ul> : <Empty text="Aucune demande dans cette vue. Les prochains envois du formulaire apparaîtront ici."/>}
      <div className={s.actions}>{page > 1 && <Link href={pageLink(page - 1)} className={s.secondary}>Page précédente</Link>}{page * 20 < count && <Link href={pageLink(page + 1)} className={s.secondary}>Page suivante</Link>}</div>
    </section>
  </>;
}
