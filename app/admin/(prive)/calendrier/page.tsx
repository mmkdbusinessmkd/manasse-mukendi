import Link from 'next/link';
import { loadData } from '../../../../lib/admin/data';
import { dateLabel, isDelivered, missionBalance, rowTitle, today } from '../../../../lib/admin/model';
import { Empty, PageHeading } from '../../Views';
import s from '../../admin.module.css';
export default async function Page({searchParams}:{searchParams:Promise<{mois?:string}>}){
 const query=await searchParams,month=typeof query.mois==='string'&&/^20\d{2}-(0[1-9]|1[0-2])$/.test(query.mois)?query.mois:today().slice(0,7),data=await loadData();
 const events=[...data.tasks.filter(t=>t.status!=='termine').map(t=>({date:t.due_date,title:rowTitle(t),type:'Tâche',href:`/admin/taches/${t.id}`})),...data.deliverables.filter(d=>!isDelivered(d)).map(d=>({date:d.planned_on,title:rowTitle(d),type:'Livrable',href:`/admin/livrables/${d.id}`})),...data.missions.filter(m=>m.status==='actif').map(m=>({date:m.end_date,title:rowTitle(m),type:'Fin de mission',href:`/admin/missions/${m.id}`})),...data.missions.filter(m=>missionBalance(m,data.payments).remaining>0).map(m=>({date:m.due_date,title:rowTitle(m),type:'Paiement attendu',href:`/admin/missions/${m.id}`}))].filter(e=>e.date&&String(e.date).startsWith(month)).sort((a,b)=>String(a.date).localeCompare(String(b.date)));
 return <><PageHeading title="Vos prochaines échéances" description="Tâches, livrables, fins de mission et paiements attendus. Les éléments sans date ne figurent pas ici."/><form className={s.filters}><label>Mois<input type="month" name="mois" defaultValue={month} min="2000-01" max="2099-12"/></label><button className={s.primary}>Afficher</button></form><section className={s.panel}>{events.length?<ul className={s.records}>{events.map((e,i)=><li key={`${e.href}-${i}`}><div><small>{dateLabel(e.date)} · {e.type}</small><Link className={s.recordTitle} href={e.href}>{e.title}</Link></div></li>)}</ul>:<Empty text="Aucune échéance prévue ce mois-ci."/>}</section></>;
}
