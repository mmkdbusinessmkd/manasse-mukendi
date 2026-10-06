import { loadData } from '../../../../lib/admin/data';
import { entities, titles } from '../../../../lib/admin/model';
import { Empty, PageHeading, Records } from '../../Views';
import s from '../../admin.module.css';
export default async function Page({searchParams}:{searchParams:Promise<{q?:string}>}){
 const query=await searchParams,q=typeof query.q==='string'?query.q.trim().slice(0,160):'',data=await loadData();
 return <><PageHeading title="Recherche" description={q?`Résultats pour « ${q} »`:'Utilisez la recherche en haut de la page.'}/>{q?entities.map(e=>{const rows=data[e].filter(r=>Object.entries(r).some(([key,v])=>!['id','owner_id','created_at','updated_at','client_id','mission_id'].includes(key)&&typeof v==='string'&&v.toLocaleLowerCase('fr').includes(q.toLocaleLowerCase('fr'))));return <section className={s.panel} key={e}><h2>{titles[e]} · {rows.length}</h2><Records entity={e} rows={rows} data={data}/></section>;}):<Empty text="Saisissez un nom, un titre ou un mot-clé."/>}</>;
}
