import { randomUUID } from 'node:crypto';
import { notFound } from 'next/navigation';
import { loadData } from '../../../../../lib/admin/data';
import { entities, routes, rowTitle, titles, uuid } from '../../../../../lib/admin/model';
import RecordForm, { DeleteForm } from '../../../RecordForm';
import { PageHeading, Related } from '../../../Views';
import s from '../../../admin.module.css';
export default async function Page({params,searchParams}:{params:Promise<{section:string;id:string}>;searchParams:Promise<{client?:string;mission?:string}>}){
 const {section,id}=await params,query=await searchParams;
 const entity=entities.find(e=>routes[e]===section);if(!entity)notFound();
 const data=await loadData();
 if(id!=='nouveau'&&!uuid.safeParse(id).success)notFound();
 const row=id==='nouveau'?undefined:data[entity].find(r=>r.id===id);if(id!=='nouveau'&&!row)notFound();
 const client=typeof query.client==='string'?data.clients.find(c=>c.id===query.client):undefined;
 const mission=typeof query.mission==='string'?data.missions.find(m=>m.id===query.mission&&m.client_id===client?.id):undefined;
 return <><PageHeading title={row?rowTitle(row):`Ajouter · ${titles[entity]}`} description={row?'Consultez la fiche et mettez à jour les informations.':'Les champs marqués d’un astérisque sont obligatoires.'}/><section className={s.panel}><RecordForm entity={entity} row={row} creationId={randomUUID()} clients={data.clients.map(c=>({id:c.id,label:rowTitle(c)}))} missions={data.missions.map(m=>({id:m.id,label:rowTitle(m),client_id:String(m.client_id),currency:String(m.currency)}))} initialClient={client?.id} initialMission={mission?.id}/></section>{row&&<><Related entity={entity} row={row} data={data}/><DeleteForm entity={entity} row={row}/></>}</>;
}
