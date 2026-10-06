import { notFound } from 'next/navigation';
import { loadData } from '../../../../lib/admin/data';
import { entities, routes, titles, labels, today, weekEnd, missionBalance, isDelivered } from '../../../../lib/admin/model';
import { AddLink, Balances, PageHeading, Records } from '../../Views';
import s from '../../admin.module.css';
type Query=Record<string,string|string[]|undefined>;
export default async function Page({params,searchParams}:{params:Promise<{section:string}>;searchParams:Promise<Query>}){
 const {section}=await params,query=await searchParams;
 const entity=entities.find(e=>routes[e]===section);if(!entity)notFound();
 const data=await loadData(),day=today();
 const value=(key:string)=>typeof query[key]==='string'?query[key] as string:'';
 const q=value('q').slice(0,160),client=value('client'),status=value('statut'),view=value('vue'),priority=value('priorite');
 const statuses=[...new Set(data[entity].map(r=>r.status).filter(Boolean))] as string[];
 let rows=data[entity].filter(r=>(!client||r.client_id===client)&&(!status||r.status===status)&&(!q||Object.values(r).some(v=>typeof v==='string'&&v.toLocaleLowerCase('fr').includes(q.toLocaleLowerCase('fr')))));
 if(entity==='tasks')rows=rows.filter(r=>(!priority||r.priority===priority)&&(view==='actives'?r.status!=='termine':view==='terminees'?r.status==='termine':view==='retard'?r.status!=='termine'&&r.due_date&&String(r.due_date)<day:view==='jour'?r.status!=='termine'&&r.due_date===day:view==='semaine'?r.status!=='termine'&&r.due_date&&String(r.due_date)>=day&&String(r.due_date)<=weekEnd(day):true));
 if(entity==='deliverables')rows=rows.filter(r=>view==='restants'?!isDelivered(r):view==='livres'?isDelivered(r):true);
 if(entity==='payments'&&view==='mois')rows=rows.filter(r=>String(r.paid_on).startsWith(day.slice(0,7)));
 if(entity==='payments')rows.sort((a,b)=>String(b.paid_on).localeCompare(String(a.paid_on)));
 const balances=data.missions.filter(m=>(!client||m.client_id===client)&&(!q||String(m.title).toLowerCase().includes(q.toLowerCase()))&&missionBalance(m,data.payments).remaining>0&&(view!=='retard'||missionBalance(m,data.payments).status==='retard'));
 const views=entity==='tasks'?[['actives','Actives'],['jour',"Aujourd’hui"],['semaine','Cette semaine'],['retard','En retard'],['terminees','Terminées']]:entity==='payments'?[['mois','Reçus ce mois'],['solde','Soldes à recevoir'],['retard','Soldes en retard']]:entity==='deliverables'?[['restants','À produire'],['livres','Livrés']]:[];
 return <><PageHeading title={titles[entity]} description="Des informations à jour pour garder le cap." action={<AddLink entity={entity}/>}/><form className={s.filters} method="get"><label>Rechercher<input name="q" type="search" defaultValue={q} maxLength={160}/></label>{entity!=='clients'&&<label>Client<select name="client" defaultValue={client}><option value="">Tous les clients</option>{data.clients.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label>}{statuses.length>0&&<label>Statut<select name="statut" defaultValue={status}><option value="">Tous les statuts</option>{statuses.map(v=><option key={v} value={v}>{labels[v]||v}</option>)}</select></label>}{views.length>0&&<label>Vue<select name="vue" defaultValue={view}><option value="">Tous les éléments</option>{views.map(([v,label])=><option key={v} value={v}>{label}</option>)}</select></label>}{entity==='tasks'&&<label>Priorité<select name="priorite" defaultValue={priority}><option value="">Toutes</option>{['faible','normale','urgente'].map(v=><option key={v} value={v}>{labels[v]}</option>)}</select></label>}<button className={s.primary}>Filtrer</button><a className={s.textLink} href={`/admin/${section}`}>Réinitialiser</a></form><section className={s.panel}>{entity==='payments'&&['solde','retard'].includes(view)?<><h2>{balances.length} solde(s) à suivre</h2><Balances missions={balances} data={data}/></>:<><h2>{rows.length} élément(s)</h2>{entity==='deliverables'&&<p className={s.meta}>{rows.filter(r=>r.planned_on).length} planifié(s) · {rows.filter(isDelivered).length} livré(s) · {rows.filter(r=>!isDelivered(r)).length} à produire</p>}<Records entity={entity} rows={rows} data={data}/></>}</section></>;
}
